"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function LoginStatus() {
  const { data: session, status } = useSession();
  if (status === "loading") return null;
  if (!session) return <Link href="/login" className="rounded-full border border-white/15 px-3 py-3 text-[10px] font-bold tracking-[.1em] text-[#aaa69c] transition hover:border-[#f4ba3b] hover:text-[#f4ba3b] sm:px-4 sm:text-xs sm:tracking-[.12em]">登入</Link>;

  return (
    <div className="flex items-center gap-2">
      {session.user.isAdmin && <Link href="/admin" className="rounded-full border border-[#f4ba3b] px-3 py-3 text-[10px] font-bold tracking-[.1em] text-[#f4ba3b] sm:px-4 sm:text-xs sm:tracking-[.12em]">管理後台</Link>}
      <button onClick={() => signOut({ callbackUrl: "/" })} className="rounded-full border border-white/15 px-3 py-3 text-[10px] font-bold tracking-[.1em] text-[#aaa69c] sm:px-4 sm:text-xs sm:tracking-[.12em]">登出</button>
    </div>
  );
}
