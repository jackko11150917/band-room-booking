"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoginStatus } from "./LoginStatus";

type Room = { id: string; name: string; description: string; price: number; accent: string; equipment: string[] };

const rooms: Room[] = [
  { id: "a", name: "ROOM A", description: "適合完整樂隊排練，空間夠大，聲音夠勁。", price: 180, accent: "#f4ba3b", equipment: ["鼓組", "Bass amp", "2 個結他 amp", "PA 音響"] },
  { id: "b", name: "ROOM B", description: "適合小組創作、錄 demo，同埋深夜靈感。", price: 140, accent: "#e56a45", equipment: ["電子鼓", "Bass amp", "結他 amp", "Keyboard"] },
  { id: "c", name: "ROOM C", description: "現場演出級空間，音量、空間感同設備都升級。", price: 240, accent: "#9db7a5", equipment: ["Premier 鼓組", "Ampeg stack", "3 個結他 amp", "PA + 4 支咪"] },
];
const slots = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];

function formatDate(date: string) {
  if (!date) return "請選擇日期";
  return new Intl.DateTimeFormat("zh-HK", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
}

export default function Home() {
  const [roomId, setRoomId] = useState("a");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("18:00");
  const [duration, setDuration] = useState("2");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
      const text = await response.text();
      const result = text ? JSON.parse(text) as { error?: string } : {};
      if (!response.ok) throw new Error(result.error ?? "預約未能完成，請稍後再試。");
      setSubmitted(true);
    } catch (bookingError) {
      setError(bookingError instanceof Error ? bookingError.message : "預約未能完成，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10"><a href="#" className="flex items-center gap-3 text-sm font-bold tracking-[.22em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4ba3b] text-lg text-[#11110f]">↗</span> ROOM 404</a><div className="hidden items-center gap-8 text-xs font-bold tracking-[.16em] text-[#aaa69c] md:flex"><a href="#rooms">房間</a><a href="#book">立即預約</a><a href="#contact">聯絡我們</a></div><div className="flex items-center gap-2"><LoginStatus /><a href="#book" className="rounded-full border border-[#f4ba3b] px-4 py-3 text-xs font-bold tracking-[.1em] text-[#f4ba3b]">預約房間</a></div></nav>
      <section className="mx-auto grid max-w-7xl items-end gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-32 lg:pt-28"><div><p className="mb-6 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">香港樂隊排練空間</p><h1 className="max-w-3xl text-6xl font-black uppercase leading-[.9] tracking-[-.065em] sm:text-8xl">大聲啲。<br /><span className="text-[#f4ba3b]">認真玩。</span></h1><p className="mt-8 max-w-md text-lg leading-7 text-[#aaa69c]">專業 band 房，俾認真對待下一場演出嘅你。按鐘預約，拎起樂器就可以開始。</p><a href="#book" className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#f4ba3b] px-7 py-4 text-sm font-black text-[#11110f]">揀你嘅房間 <span className="text-xl">→</span></a></div><div className="relative min-h-[310px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#24241e] p-8"><div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-[#e56a45]/30" /><div className="absolute bottom-8 right-8 text-right"><p className="text-7xl font-black tracking-[-.08em] text-[#f4ba3b]">24/7</p><p className="text-xs font-bold tracking-[.25em] text-[#aaa69c]">你需要嘅時間，我哋都有</p></div><div className="absolute left-8 top-8 text-5xl">◉</div><div className="absolute bottom-8 left-8 max-w-[130px] text-sm font-bold leading-5">你嘅音樂。<br />你嘅時間。<br />你嘅房間。</div></div></section>
      <section id="rooms" className="border-y border-white/10 bg-[#191914] px-6 py-20 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-12"><p className="mb-4 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">房間選擇</p><h2 className="text-4xl font-black tracking-[-.04em] sm:text-6xl">揀你嘅武器。</h2></div><div className="grid gap-5 lg:grid-cols-3">{rooms.map((item, index) => <article key={item.id} className="rounded-3xl border border-white/10 bg-[#24241e] p-7 transition hover:-translate-y-2 hover:border-white/25"><div className="mb-16 flex items-start justify-between"><span className="grid h-14 w-14 place-items-center rounded-2xl text-xl font-black text-[#11110f]" style={{ backgroundColor: item.accent }}>0{index + 1}</span><span className="text-xs font-bold tracking-[.15em] text-[#aaa69c">由 ${item.price}/小時</span></div><h3 className="text-3xl font-black">{item.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-[#aaa69c]">{item.description}</p><div className="mt-7 flex flex-wrap gap-2">{item.equipment.map((equipment) => <span key={equipment} className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-bold text-[#d3cec3]">{equipment}</span>)}</div></article>)}</div></div></section>
      <section id="book" className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[.8fr_1.2fr] lg:px-10"><div><p className="mb-4 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">預約時間</p><h2 className="text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-7xl">下一場<br /><span className="text-[#f4ba3b]">由呢度開始。</span></h2><p className="mt-7 max-w-sm text-base leading-7 text-[#aaa69c]">揀房間同時間，我哋會將預約資料寄到你嘅 email。</p></div><div className="rounded-[2rem] border border-white/10 bg-[#24241e] p-6 sm:p-9">{submitted ? <div className="flex min-h-[430px] flex-col items-center justify-center text-center"><div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#f4ba3b] text-4xl text-[#11110f]">✓</div><p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">預約已收到</p><h3 className="text-3xl font-black">等你嚟玩！</h3><p className="mt-4 max-w-sm text-sm leading-6 text-[#aaa69c]">預約資料會寄到 <span className="text-white">{email}</span>。</p><button onClick={() => setSubmitted(false)} className="mt-8 text-xs font-bold tracking-[.18em] text-[#f4ba3b] underline underline-offset-8">再預約一次</button></div> : <form onSubmit={handleSubmit} className="space-y-6"><div><label className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">選擇房間</label><div className="grid grid-cols-3 gap-2">{rooms.map((item) => <button type="button" key={item.id} onClick={() => setRoomId(item.id)} className={`rounded-xl border p-3 text-left ${roomId === item.id ? "border-[#f4ba3b] bg-[#f4ba3b]/10" : "border-white/10"}`}><span className="block text-xs font-black">{item.name}</span><span className="mt-1 block text-[10px] text-[#aaa69c]">${item.price}/小時</span></button>)}</div></div><div className="grid gap-5 sm:grid-cols-2"><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">日期</span><input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]" /></label><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">開始時間</span><select value={slot} onChange={(event) => setSlot(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]">{slots.map((time) => <option key={time}>{time}</option>)}</select></label></div><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">時數</span><div className="flex gap-2">{["1", "2", "3", "4"].map((hours) => <button type="button" key={hours} onClick={() => setDuration(hours)} className={`flex-1 rounded-xl border py-3 text-sm font-bold ${duration === hours ? "border-[#f4ba3b] bg-[#f4ba3b] text-[#11110f]" : "border-white/10 text-[#aaa69c]"}`}>{hours} 小時</button>)}</div></label><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">聯絡 email</span><input required type="email" placeholder="you@band.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none placeholder:text-[#66645d] focus:border-[#f4ba3b]" /></label><div className="flex items-end justify-between border-t border-white/10 pt-6"><div><p className="text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">{formatDate(date)} · {slot}</p><p className="mt-1 text-3xl font-black">${total}<span className="ml-1 text-sm font-normal text-[#aaa69c]">HKD</span></p></div><button disabled={submitting} className="rounded-full bg-[#f4ba3b] px-6 py-4 text-xs font-black text-[#11110f] disabled:opacity-60">{submitting ? "提交中..." : "提交預約 →"}</button></div>{error && <p className="text-sm text-[#e56a45]">{error}</p>}</form>}</div></section>
      <footer id="contact" className="border-t border-white/10 px-6 py-10 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs font-bold tracking-[.15em] text-[#aaa69c] sm:flex-row"><span>ROOM 404 / 香港</span><span>每日 · 10:00–02:00</span><span>hello@room404.hk</span></div></footer>
    </main>
  );
}
