"use client";

import { useState } from "react";
import Link from "next/link";

const demoBookings = [
  { time: "18:00–20:00", room: "ROOM A", name: "Midnight Taxi", email: "hello@midnighttaxi.com", status: "CONFIRMED" },
  { time: "20:00–22:00", room: "ROOM C", name: "Paper Planes", email: "bookings@paperplanes.hk", status: "PENDING" },
  { time: "22:00–00:00", room: "ROOM B", name: "Solo session", email: "alex@example.com", status: "CONFIRMED" },
];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <form onSubmit={(event) => { event.preventDefault(); setAuthenticated(password.length > 0); }} className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#24241e] p-8">
          <p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404 / ADMIN</p>
          <h1 className="text-3xl font-black">Welcome back.</h1>
          <p className="mt-3 text-sm text-[#aaa69c]">Enter your admin password to view today&apos;s bookings.</p>
          <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="mt-7 w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]" />
          <button className="mt-4 w-full rounded-full bg-[#f4ba3b] py-4 text-xs font-black tracking-[.15em] text-[#11110f]">SIGN IN</button>
          <Link href="/" className="mt-6 block text-center text-xs text-[#aaa69c] underline">Back to booking page</Link>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-6 py-10 lg:px-10">
      <header className="flex items-center justify-between border-b border-white/10 pb-8"><div><p className="text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404 / ADMIN</p><h1 className="mt-3 text-4xl font-black">Today&apos;s bookings.</h1></div><Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold tracking-[.12em] text-[#aaa69c]">VIEW SITE ↗</Link></header>
      <section className="grid gap-4 py-8 sm:grid-cols-3">{[["03", "BOOKINGS"], ["05", "HOURS BOOKED"], ["$1,080", "TODAY'S REVENUE"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/10 bg-[#24241e] p-6"><p className="text-3xl font-black text-[#f4ba3b]">{value}</p><p className="mt-2 text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">{label}</p></div>)}</section>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#24241e]"><div className="grid grid-cols-[1fr_1fr_1.5fr_1fr] gap-4 border-b border-white/10 px-6 py-4 text-[10px] font-bold tracking-[.15em] text-[#aaa69c]"><span>TIME</span><span>ROOM</span><span>CUSTOMER</span><span>STATUS</span></div>{demoBookings.map((booking) => <div key={booking.email} className="grid grid-cols-[1fr_1fr_1.5fr_1fr] items-center gap-4 border-b border-white/5 px-6 py-5 text-sm last:border-0"><span className="font-bold">{booking.time}</span><span className="text-[#aaa69c]">{booking.room}</span><span><span className="block font-bold">{booking.name}</span><span className="text-xs text-[#aaa69c]">{booking.email}</span></span><span className={booking.status === "PENDING" ? "text-[#e56a45]" : "text-[#9db7a5]"}>{booking.status}</span></div>)}</div>
    </main>
  );
}
