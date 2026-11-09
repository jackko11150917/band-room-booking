import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import Stripe from "stripe";
import { Resend } from "resend";
import { ensureSchema } from "@/lib/db";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!process.env.STRIPE_SECRET_KEY || !secret) return NextResponse.json({ error: "Stripe webhook is not configured." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  const payload = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature." }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await ensureSchema();
      const result = await sql<{ contact_email: string; room_id: string; booking_date: string; start_time: string; duration_hours: number }>`
        UPDATE bookings SET status = 'CONFIRMED', confirmed_at = NOW()
        WHERE id = ${Number(bookingId)} AND status = 'AWAITING_PAYMENT'
        RETURNING contact_email, room_id, booking_date::text, start_time, duration_hours
      `;
      const booking = result.rows[0];
      if (booking && process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Tiny Band Room <onboarding@resend.dev>",
          to: booking.contact_email,
          subject: "Tiny Band Room 預約已確認",
          html: `<p>你嘅 Tiny Band Room 預約已確認。</p><p>日期：${booking.booking_date}<br>時間：${booking.start_time}<br>時數：${booking.duration_hours} 小時</p>`,
        });
      }
    }
  }
  return NextResponse.json({ received: true });
}
