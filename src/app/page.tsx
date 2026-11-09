"use client";

import { FormEvent, useEffect, useState } from "react";
import { LoginStatus } from "./LoginStatus";

const slots = Array.from({ length: 15 }, (_, index) => `${String(index + 10).padStart(2, "0")}:00`);
const hourlyPrice = 180;
type Availability = { room_id: string; start_time: string; duration_hours: number };

function formatDate(date: string) {
  if (!date) return "請選擇日期";
  return new Intl.DateTimeFormat("zh-HK", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`));
}

function minutes(time: string) {
  return Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
}

export default function Home() {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("18:00");
  const [duration, setDuration] = useState("2");
  const [email, setEmail] = useState("");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [availabilityError, setAvailabilityError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!date) return;
    let active = true;
    fetch(`/api/bookings?date=${encodeURIComponent(date)}`)
      .then(async (response) => {
        const result = await response.json() as { bookings?: Availability[]; error?: string };
        if (!response.ok) throw new Error(result.error ?? "暫時未能讀取時段。");
        if (active) setAvailability(result.bookings ?? []);
      })
      .catch((requestError) => {
        if (active) setAvailabilityError(requestError instanceof Error ? requestError.message : "暫時未能讀取時段。");
      });
    return () => { active = false; };
  }, [date]);

  function isAvailable(start: string) {
    const startAt = minutes(start);
    return !availability.some((booking) =>
      startAt < minutes(booking.start_time) + booking.duration_hours * 60 &&
      minutes(booking.start_time) < startAt + Number(duration) * 60
    );
  }

  function selectDate(nextDate: string) {
    setDate(nextDate);
    setAvailability([]);
    setAvailabilityError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!date || !email) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot, duration, email }),
      });
      const text = await response.text();
      const result = text ? JSON.parse(text) as { error?: string; checkoutUrl?: string } : {};
      if (!response.ok) throw new Error(result.error ?? "預約未能完成，請稍後再試。");
      if (!result.checkoutUrl) throw new Error("付款頁面未能建立，請稍後再試。");
      window.location.href = result.checkoutUrl;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "預約未能完成，請稍後再試。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
        <a href="#" className="flex items-center gap-3 text-sm font-bold tracking-[.22em]"><span className="grid h-9 w-9 place-items-center rounded-full bg-[#f4ba3b] text-lg text-[#11110f]">↗</span> TINY BAND ROOM</a>
        <div className="hidden items-center gap-8 text-xs font-bold tracking-[.16em] text-[#aaa69c] md:flex"><a href="#book">立即預約</a><a href="#contact">聯絡我們</a></div>
        <div className="flex items-center gap-2"><LoginStatus /><a href="#book" className="rounded-full border border-[#f4ba3b] px-4 py-3 text-xs font-bold tracking-[.1em] text-[#f4ba3b]">預約房間</a></div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-end gap-12 px-6 pb-24 pt-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:pb-32 lg:pt-28">
        <div><p className="mb-6 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">香港樂隊排練空間</p><h1 className="max-w-3xl text-6xl font-black uppercase leading-[.9] tracking-[-.065em] sm:text-8xl">大聲啲。<br /><span className="text-[#f4ba3b]">認真玩。</span></h1><p className="mt-8 max-w-md text-lg leading-7 text-[#aaa69c]">一間專為樂隊而設嘅排練房。每小時 $180，揀時間就可以開始。</p><a href="#book" className="mt-10 inline-flex items-center gap-4 rounded-full bg-[#f4ba3b] px-7 py-4 text-sm font-black text-[#11110f]">查看可用時間 <span className="text-xl">→</span></a></div>
        <div className="relative min-h-[310px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#24241e] p-8"><div className="absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-[#e56a45]/30" /><div className="absolute bottom-8 right-8 text-right"><p className="text-7xl font-black tracking-[-.08em] text-[#f4ba3b]">24/7</p><p className="text-xs font-bold tracking-[.25em] text-[#aaa69c]">你需要嘅時間，我哋都有</p></div><div className="absolute left-8 top-8 text-5xl">◉</div><div className="absolute bottom-8 left-8 max-w-[130px] text-sm font-bold leading-5">一間房。<br />一隊人。<br />一場好 show。</div></div>
      </section>

      <section id="book" className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-4 text-xs font-bold tracking-[.3em] text-[#f4ba3b]">預約時間</p><h2 className="text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-7xl">一眼睇晒。<br /><span className="text-[#f4ba3b]">揀個靚時段。</span></h2></div><p className="max-w-sm text-sm leading-6 text-[#aaa69c]">我哋只有一間 Tiny Band Room。揀日期後，時間表會顯示每個鐘嘅即時狀態。</p></div>
        <div className="rounded-[2rem] border border-white/10 bg-[#24241e] p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <label className="block max-w-sm"><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">選擇日期</span><input required type="date" value={date} onChange={(event) => selectDate(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-4 text-sm outline-none focus:border-[#f4ba3b]" /></label>
            <div className="rounded-2xl border border-white/10 bg-[#191914] p-4 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-lg font-black">{date ? formatDate(date) : "請先選擇日期"}</p><p className="mt-1 text-xs text-[#aaa69c]">每小時一格，撳綠色時段選擇</p></div><div className="flex gap-4 text-xs text-[#aaa69c]"><span><i className="mr-1 inline-block h-3 w-3 rounded bg-[#9db7a5]" />可預約</span><span><i className="mr-1 inline-block h-3 w-3 rounded bg-[#e56a45]/60" />已預約</span></div></div>
              {availabilityError && <p className="mb-4 rounded-lg bg-[#e56a45]/10 p-3 text-sm text-[#e56a45]">{availabilityError}</p>}
              <div className="overflow-x-auto"><div className="grid min-w-[840px] grid-cols-[90px_repeat(15,minmax(62px,1fr))] gap-1.5 border-b border-white/10 pb-3 text-center text-[10px] font-bold tracking-[.08em] text-[#aaa69c]"><span className="text-left">時間</span>{slots.map((time) => <span key={time}>{time}</span>)}</div><div className="mt-3 grid min-w-[840px] grid-cols-[90px_repeat(15,minmax(62px,1fr))] items-center gap-1.5"><span className="text-sm font-black">Tiny Room</span>{slots.map((time) => { const available = Boolean(date) && isAvailable(time); const selected = slot === time; return <button type="button" key={time} disabled={!available} onClick={() => setSlot(time)} className={`h-16 rounded-lg border text-[10px] font-bold transition ${selected ? "border-[#f4ba3b] bg-[#f4ba3b] text-[#11110f] shadow-[0_0_18px_rgba(244,186,59,.25)]" : available ? "border-[#9db7a5]/40 bg-[#9db7a5]/10 text-[#c8dfd0] hover:border-[#9db7a5]" : "cursor-not-allowed border-white/5 bg-white/[.02] text-[#625f56]"}`}>{date ? available ? "可預約" : "已預約" : "—"}</button>; })}</div></div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_1.2fr]"><div><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">預約時數</span><div className="flex gap-2">{["1", "2", "3", "4"].map((hours) => <button type="button" key={hours} onClick={() => setDuration(hours)} className={`flex-1 rounded-xl border py-3 text-sm font-bold ${duration === hours ? "border-[#f4ba3b] bg-[#f4ba3b] text-[#11110f]" : "border-white/10 text-[#aaa69c]"}`}>{hours} 小時</button>)}</div></div><label><span className="mb-3 block text-[10px] font-bold tracking-[.2em] text-[#aaa69c]">聯絡 email</span><input required type="email" placeholder="you@band.com" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-white/10 bg-[#191914] px-4 py-3.5 text-sm outline-none placeholder:text-[#66645d] focus:border-[#f4ba3b]" /></label><div className="flex items-end justify-between gap-4 border-t border-white/10 pt-5 lg:border-t-0 lg:pt-0"><div><p className="text-[10px] font-bold tracking-[.12em] text-[#aaa69c]">{date ? formatDate(date) : "未選日期"} · {slot}</p><p className="mt-1 text-2xl font-black">${hourlyPrice * Number(duration)}<span className="ml-1 text-sm font-normal text-[#aaa69c]">HKD</span></p></div><button disabled={submitting || !date || !isAvailable(slot)} className="rounded-full bg-[#f4ba3b] px-5 py-3.5 text-xs font-black text-[#11110f] disabled:opacity-40">{submitting ? "提交中..." : "去付款 →"}</button></div></div>{error && <p className="text-sm text-[#e56a45]">{error}</p>}
          </form>
        </div>
      </section>

      <footer id="contact" className="border-t border-white/10 px-6 py-10 lg:px-10"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-xs font-bold tracking-[.15em] text-[#aaa69c] sm:flex-row"><span>TINY BAND ROOM / 香港</span><span>每日 · 10:00–02:00</span><span>hello@tinybandroom.hk</span></div></footer>
    </main>
  );
}
