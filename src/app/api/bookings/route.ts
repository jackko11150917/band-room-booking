import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";
import Stripe from "stripe";

const roomIds = new Set(["a", "b", "c"]);
const slots = new Set(["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]);
const prices: Record<string, number> = { a: 180, b: 140, c: 240 };

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get("date");
  if (!date) return NextResponse.json({ error: "請提供日期。" }, { status: 400 });
  try {
    await ensureSchema();
    const result = await sql<{ room_id: string; start_time: string; duration_hours: number }>`
      SELECT room_id, start_time, duration_hours
      FROM bookings
      WHERE booking_date = ${date} AND status != 'CANCELLED'
    `;
    return NextResponse.json({ bookings: result.rows });
  } catch (error) {
    console.error("Availability request failed:", error);
    return NextResponse.json({ error: "暫時未能讀取時段，請稍後再試。" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      roomId?: string;
      date?: string;
      slot?: string;
      duration?: string;
      email?: string;
    };
    const duration = Number(body.duration);
    if (!body.roomId || !roomIds.has(body.roomId) || !body.date || !body.slot || !slots.has(body.slot) || !Number.isInteger(duration) || duration < 1 || duration > 4 || !body.email?.includes("@")) {
      return NextResponse.json({ error: "Please provide valid booking details." }, { status: 400 });
    }

    await ensureSchema();
    const existing = await sql<{ start_time: string; duration_hours: number }>`
      SELECT start_time, duration_hours FROM bookings
      WHERE room_id = ${body.roomId} AND booking_date = ${body.date}
        AND status != 'CANCELLED'
    `;
    const startMinutes = Number(body.slot.slice(0, 2)) * 60 + Number(body.slot.slice(3));
    const overlaps = existing.rows.some((booking) => {
      const bookingStart = Number(booking.start_time.slice(0, 2)) * 60 + Number(booking.start_time.slice(3));
      return startMinutes < bookingStart + booking.duration_hours * 60 && bookingStart < startMinutes + duration * 60;
    });
    if (overlaps) {
      return NextResponse.json({ error: "That slot is no longer available." }, { status: 409 });
    }

    const booking = await sql<{ id: number }>`
      INSERT INTO bookings (room_id, booking_date, start_time, duration_hours, contact_email)
      VALUES (${body.roomId}, ${body.date}, ${body.slot}, ${duration}, ${body.email.toLowerCase()})
      RETURNING id
    `;
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "付款服務尚未設定，請稍後再試。" }, { status: 503 });
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = new URL(request.url).origin;
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email.toLowerCase(),
      line_items: [{
        quantity: duration,
        price_data: {
          currency: "hkd",
          unit_amount: prices[body.roomId] * 100,
          product_data: { name: `ROOM ${body.roomId.toUpperCase()} 排練室` },
        },
      }],
      metadata: { bookingId: String(booking.rows[0].id) },
      success_url: `${origin}/?payment=success#book`,
      cancel_url: `${origin}/?payment=cancelled#book`,
    });
    await sql`UPDATE bookings SET stripe_session_id = ${checkout.id}, status = 'AWAITING_PAYMENT' WHERE id = ${booking.rows[0].id}`;
    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error("Booking request failed:", error);
    return NextResponse.json({ error: "Booking service is not configured or is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
