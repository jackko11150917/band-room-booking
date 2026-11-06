"use client";

import { signIn } from "next-auth/react";

export function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#24241e] p-8">
        <p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404</p>
        <h1 className="text-3xl font-black">請先登入</h1>
        <p className="mt-3 text-sm text-[#aaa69c]">所有用戶都使用 Google 登入；登入後會按帳戶權限顯示功能。</p>
        <button onClick={() => signIn("google", { callbackUrl: "/admin" })} className="mt-7 w-full rounded-full bg-[#f4ba3b] py-4 text-xs font-black tracking-[.15em] text-[#11110f]">使用 Google 登入</button>
      </div>
    </main>
  );
}
