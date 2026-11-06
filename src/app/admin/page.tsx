import Link from "next/link";
import { getServerSession } from "next-auth";
import { sql } from "@vercel/postgres";
import { authOptions } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";
import { AdminLogin } from "./AdminLogin";

export const instant = false;

type Booking = {
  id: number;
  booking_date: string;
  start_time: string;
  duration_hours: number;
  room_id: string;
  contact_email: string;
  status: string;
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) return <AdminLogin />;
  if (!session.user.isAdmin) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#24241e] p-8 text-center">
          <p className="text-xs font-bold tracking-[.25em] text-[#e56a45]">權限受限</p>
          <h1 className="mt-3 text-3xl font-black">你暫時未有後台權限</h1>
          <p className="mt-3 text-sm leading-6 text-[#aaa69c]">你已使用 {session.user.email} 登入。請管理員將你嘅帳戶設定為 admin。</p>
          <Link href="/" className="mt-7 inline-block rounded-full bg-[#f4ba3b] px-6 py-4 text-xs font-black tracking-[.15em] text-[#11110f]">返回預約頁面</Link>
        </div>
      </main>
    );
  }

  let bookings: Booking[] = [];
  let databaseError = "";
  try {
    await ensureSchema();
    const result = await sql<Booking>`SELECT id, booking_date::text, start_time, duration_hours, room_id, contact_email, status FROM bookings ORDER BY booking_date DESC, start_time DESC LIMIT 100`;
    bookings = result.rows;
  } catch (error) {
    console.error("Admin dashboard failed to load bookings:", error);
    databaseError = "無法連接 booking database。請確認 Vercel 已加入 POSTGRES_URL，然後重新部署。";
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 lg:px-10">
      <header className="flex items-center justify-between border-b border-white/10 pb-8"><div><p className="text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404 / 後台</p><h1 className="mt-3 text-4xl font-black">Booking 管理</h1><p className="mt-2 text-sm text-[#aaa69c]">已登入：{session.user.email}</p></div><Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold tracking-[.12em] text-[#aaa69c]">返回網站</Link></header>
      {databaseError ? <div className="mt-8 rounded-2xl border border-[#e56a45]/40 bg-[#e56a45]/10 p-6 text-sm text-[#f2b09a]">{databaseError}</div> : <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#24241e]"><div className="grid grid-cols-[1fr_1fr_2fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-bold tracking-[.15em] text-[#aaa69c]"><span>日期 / 時間</span><span>房間</span><span>客戶電郵</span><span>狀態</span></div>{bookings.length === 0 ? <p className="px-6 py-12 text-center text-sm text-[#aaa69c]">暫時未有 booking。</p> : bookings.map((booking) => <div key={booking.id} className="grid grid-cols-[1fr_1fr_2fr_1fr] items-center gap-4 border-b border-white/5 px-6 py-5 text-sm last:border-0"><span className="font-bold">{booking.booking_date}<br /><span className="text-[#aaa69c]">{booking.start_time} · {booking.duration_hours} 小時</span></span><span className="text-[#aaa69c]">ROOM {booking.room_id.toUpperCase()}</span><span className="text-[#aaa69c]">{booking.contact_email}</span><span className="text-[#f4ba3b]">{booking.status === "PENDING" ? "待確認" : booking.status === "CONFIRMED" ? "已確認" : booking.status}</span></div>)}</div>}
    </main>
  );
}
