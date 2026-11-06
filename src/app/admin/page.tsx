import Link from "next/link";
import { getServerSession } from "next-auth";
import { sql } from "@vercel/postgres";
import { authOptions } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";
import { AdminLogin } from "./AdminLogin";

export const instant = false;

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <AdminLogin />;
  if (!session.user.isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#24241e] p-8 text-center">
          <p className="text-xs font-bold tracking-[.25em] text-[#e56a45]">ACCESS RESTRICTED</p>
          <h1 className="mt-3 text-3xl font-black">No admin access yet.</h1>
          <p className="mt-3 text-sm leading-6 text-[#aaa69c]">You are signed in as {session.user.email}. An administrator must mark this account as admin before you can view bookings.</p>
          <Link href="/" className="mt-7 inline-block rounded-full bg-[#f4ba3b] px-6 py-4 text-xs font-black tracking-[.15em] text-[#11110f]">BACK TO BOOKING</Link>
        </div>
      </main>
    );
  }

  await ensureSchema();
  const result = await sql<{
    booking_date: string;
    start_time: string;
    duration_hours: number;
    room_id: string;
    contact_email: string;
    status: string;
  }>`SELECT booking_date::text, start_time, duration_hours, room_id, contact_email, status FROM bookings ORDER BY booking_date DESC, start_time DESC LIMIT 100`;

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 lg:px-10">
      <header className="flex items-center justify-between border-b border-white/10 pb-8"><div><p className="text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404 / ADMIN</p><h1 className="mt-3 text-4xl font-black">Bookings.</h1><p className="mt-2 text-sm text-[#aaa69c]">Signed in as {session.user.email}</p></div><Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold tracking-[.12em] text-[#aaa69c]">VIEW SITE ↗</Link></header>
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#24241e]"><div className="grid grid-cols-[1fr_1fr_2fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-bold tracking-[.15em] text-[#aaa69c]"><span>DATE / TIME</span><span>ROOM</span><span>CUSTOMER</span><span>STATUS</span></div>{result.rows.length === 0 ? <p className="px-6 py-12 text-center text-sm text-[#aaa69c]">No bookings yet.</p> : result.rows.map((booking) => <div key={`${booking.booking_date}-${booking.start_time}-${booking.contact_email}`} className="grid grid-cols-[1fr_1fr_2fr_1fr] items-center gap-4 border-b border-white/5 px-6 py-5 text-sm last:border-0"><span className="font-bold">{booking.booking_date}<br /><span className="text-[#aaa69c]">{booking.start_time} · {booking.duration_hours} hr</span></span><span className="text-[#aaa69c]">ROOM {booking.room_id.toUpperCase()}</span><span className="text-[#aaa69c]">{booking.contact_email}</span><span className="text-[#f4ba3b]">{booking.status}</span></div>)}</div>
    </main>
  );
}
