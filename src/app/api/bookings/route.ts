import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureSchema } from "@/lib/db";

const roomIds = new Set(["a", "b", "c"]);

export async function POST(request: Request) {
  const body = await request.json() as {
    roomId?: string;
    date?: string;
    slot?: string;
    duration?: string;
    email?: string;
  };
  const duration = Number(body.duration);
  if (!body.roomId || !roomIds.has(body.roomId) || !body.date || !body.slot || !Number.isInteger(duration) || duration < 1 || duration > 4 || !body.email?.includes("@")) {
    return NextResponse.json({ error: "Please provide valid booking details." }, { status: 400 });
  }

  await ensureSchema();
  const conflict = await sql`
    SELECT id FROM bookings
    WHERE room_id = ${body.roomId} AND booking_date = ${body.date}
      AND start_time = ${body.slot} AND status != 'CANCELLED'
    LIMIT 1
  `;
  if (conflict.rows.length > 0) {
    return NextResponse.json({ error: "That slot is no longer available." }, { status: 409 });
  }

  await sql`
    INSERT INTO bookings (room_id, booking_date, start_time, duration_hours, contact_email)
    VALUES (${body.roomId}, ${body.date}, ${body.slot}, ${duration}, ${body.email.toLowerCase()})
  `;
  return NextResponse.json({ ok: true });
}
