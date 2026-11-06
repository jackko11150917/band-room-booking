"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoginStatus } from "./LoginStatus";

type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  accent: string;
  equipment: string[];
};

const rooms: Room[] = [
  { id: "a", name: "ROOM A", description: "The all-rounder. Big enough for a full band, tight enough to sound loud.", price: 180, accent: "#f4ba3b", equipment: ["Drums", "Bass amp", "2x guitar amp", "PA system"] },
  { id: "b", name: "ROOM B", description: "A focused writing room for small groups, demos and late-night ideas.", price: 140, accent: "#e56a45", equipment: ["Electronic drums", "Bass amp", "Guitar amp", "Keyboard"] },
  { id: "c", name: "ROOM C", description: "The live room. Extra headroom, extra volume, zero apologies.", price: 240, accent: "#9db7a5", equipment: ["Premier drums", "Ampeg stack", "3x guitar amp", "PA + 4 mics"] },
];

const slots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

function formatDate(date: string) {
  if (!date) return "Choose a date";
  return new Intl.DateTimeFormat("en-HK", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
}

export default function Home() {
  const [roomId, setRoomId] = useState("a");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("18:00");
  const [duration, setDuration] = useState("2");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const room = useMemo(() => rooms.find((item) => item.id === roomId) ?? rooms[0], [roomId]);
  const total = room.price * Number(duration);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !email) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ roomId, date, slot, duration, email }) });
      const responseText = await response.text();
      let result: { error?: string } = {};
      if (responseText) {
        try {
          result = JSON.parse(responseText) as { error?: string };
        } catch {
          result = { error: "The booking service returned an invalid response. Please try again." };
        }
      }
      if (!response.ok) throw new Error(result.error ?? "Booking could not be completed.");
      setSubmitted(true);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "Booking could not be completed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-sm font-bold tracking-[.22em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4ba3b] text-lg text-[#11110f]">↗</span> ROOM 404</a>
        <div className="hidden items-center gap-8 text-xs font-bold tracking-[.16em] text-[#aaa69c] md:flex"><a href="#rooms" className="transition hover:text-white">ROOMS</a><a href="#how" className="transition hover:text-white">HOW IT WORKS</a><a href="#contact" className="transition hover:text-white">CONTACT</a></div>
        <div className="flex items-center gap-2"><LoginStatus /><a href="#book" className="rounded-full border border-[#f4ba3b] px-5 py-3 text-xs font-bold tracking-[.16em] text-[#f4ba3b] transition hover:bg-[#f4ba3b] hover:text-[#11110f]">BOOK A ROOM</a></div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-end gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-32 lg:pt-28">
        <div><p className="mb-6 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">REHEARSAL SPACE / HONG KONG</p><h1 className="max-w-3xl text-6xl font-black uppercase leading-[.9] tracking-[-.065em] sm:text-8xl">Make noise.<br /><span className="text-[#f4ba3b]">Make it count.</span></h1><p className="mt-8 max-w-md text-lg leading-7 text-[#aaa69c]">Professional rehearsal rooms for bands who take their next show seriously. Book by the hour, show up, plug in.</p><a href="#book" className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#f4ba3b] px-7 py-4 text-sm font-black tracking-[.12em] text-[#11110f] transition hover:-translate-y-1">FIND YOUR ROOM <span className="text-xl">→</span></a></div>
        <div className="relative min-h-[310px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#24241e] p-8"><div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-[#e56a45]/30" /><div className="absolute bottom-8 right-8 text-right"><p className="text-7xl font-black tracking-[-.08em] text-[#f4ba3b]">24/7</p><p className="text-xs font-bold tracking-[.25em] text-[#aaa69c]">ACCESS WHEN YOU NEED IT</p></div><div className="absolute left-8 top-8 text-5xl">◉</div><div className="absolute bottom-8 left-8 max-w-[130px] text-sm font-bold leading-5">Your sound.<br />Your hours.<br />Your room.</div></div>
      </section>

      <section id="rooms" className="border-y border-white/10 bg-[#191914] px-6 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-12 flex items-end justify-between"><div><p className="mb-4 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">THE ROOMS</p><h2 className="text-4xl font-black uppercase tracking-[-.04em] sm:text-6xl">Pick your weapon.</h2></div><p className="hidden max-w-xs text-right text-sm leading-6 text-[#aaa69c] md:block">Every room is set up, mic&apos;d up and ready to make your band sound bigger.</p></div><div className="grid gap-5 lg:grid-cols-3">{rooms.map((item, index) => <article key={item.id} className="group rounded-3xl border border-white/10 bg-[#24241e] p-7 transition hover:-translate-y-2 hover:border-white/25"><div className="mb-16 flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-[#11110f]" style={{ backgroundColor: item.accent }}>0{index + 1}</span><span className="text-xs font-bold tracking-[.15em] text-[#aaa69c]">FROM ${item.price}/HR</span></div><h3 className="text-3xl font-black tracking-[-.04em]">{item.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-[#aaa69c]">{item.description}</p><div className="mt-7 flex flex-wrap gap-2">{item.equipment.map((equipment) => <span key={equipment} className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#d3cec3]">{equipment}</span>)}</div></article>)}</div></div></section>

      <section id="book" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><div><p className="mb-4 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">RESERVE YOUR TIME</p><h2 className="text-5xl font-black uppercase leading-[.95] tracking-[-.05em] sm:text-7xl">Your next<br /><span className="text-[#f4ba3b]">session starts here.</span></h2><p className="mt-7 max-w-sm text-base leading-7 text-[#aaa69c]">Choose a room and slot. We&apos;ll send a confirmation to your inbox with everything you need to know.</p><div className="mt-10 flex gap-8 text-xs font-bold tracking-[.14em] text-[#aaa69c]"><div><strong className="block text-2xl text-white">01</strong>CHOOSE</div><div><strong className="block text-2xl text-white">02</strong>BOOK</div><div><strong className="block text-2xl text-white">03</strong>PLAY</div></div></div>
        <div className="rounded-[2rem] border border-white/10 bg-[#24241e] p-6 sm:p-9">{submitted ? <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#f4ba3b] text-4xl text-[#11110f]">✓</div><p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">REQUEST RECEIVED</p><h3 className="text-3xl font-black">You&apos;re on the list.</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#aaa69c]">We&apos;ll send your booking confirmation to <span className="text-white">{email}</span>. See you in {room.name}.</p><button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-bold tracking-[.18em] text-[#f4ba3b] underline underline-offset-8">MAKE ANOTHER BOOKING</button></div> : <form onSubmit={handleSubmit} className="space-y-6"><div><label className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">SELECT ROOM</label><div className="grid grid-cols-3 gap-2">{rooms.map((item) => <button type="button" key={item.id} onClick={() => setRoomId(item.id)} className={`rounded-xl border p-3 text-left transition ${roomId === item.id ? "border-[#f4ba3b] bg-[#f4ba3b]/10" : "border-white/10 hover:border-white/30"}`}><span className="block text-xs font-black">{item.name}</span><span className="mt-1 block text-[10px] text-[#aaa69c]">${item.price}/hr</span></button>)}</div></div><div className="grid gap-5 sm:grid-cols-2"><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">DATE</span>        <input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]" /></label><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">START TIME</span><select value={slot} onChange={(event) => setSlot(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]">{slots.map((time) => <option key={time}>{time}</option>)}</select></label></div><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">DURATION</span><div className="flex gap-2">{["1", "2", "3", "4"].map((hours) => <button type="button" key={hours} onClick={() => setDuration(hours)} className={`flex-1 rounded-xl border py-3 text-sm font-bold ${duration === hours ? "border-[#f4ba3b] bg-[#f4ba3b] text-[#11110f]" : "border-white/10 text-[#aaa69c]"}`}>{hours} hr</button>)}</div></label><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">YOUR EMAIL</span><input required type="email" placeholder="you@band.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none placeholder:text-[#66645d] focus:border-[#f4ba3b]" /></label>        <div className="flex items-end justify-between border-t border-white/10 pt-6"><div><p className="text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">{formatDate(date)} · {slot}</p><p className="mt-1 text-3xl font-black">${total}<span className="ml-1 text-sm font-normal text-[#aaa69c]">HKD</span></p></div><button disabled={submitting} className="rounded-full bg-[#f4ba3b] px-6 py-4 text-xs font-black tracking-[.12em] text-[#11110f] transition hover:scale-105 disabled:cursor-wait disabled:opacity-60">{submitting ? "SENDING..." : "REQUEST BOOKING →"}</button></div>{error && <p className="mt-4 text-sm text-[#e56a45]">{error}</p>}</form>}</div>
      </section>

      <footer id="contact" className="border-t border-white/10 px-6 py-10 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs font-bold tracking-[.15em] text-[#aaa69c] sm:flex-row"><span>ROOM 404 / HONG KONG</span><span>MON–SUN · 10:00–02:00</span><span>hello@room404.hk</span></div></footer>
    </main>
  );
}
