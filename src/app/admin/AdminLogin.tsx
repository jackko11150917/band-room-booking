"use client";

import { signIn } from "next-auth/react";

export function AdminLogin() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#24241e] p-8">
        <p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404</p>
        <h1 className="text-3xl font-black">Sign in first.</h1>
        <p className="mt-3 text-sm text-[#aaa69c]">All users sign in with Google. Admin access is decided by your account status.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/admin" })} className="mt-7 w-full rounded-full bg-[#f4ba3b] py-4 text-xs font-black tracking-[.15em] text-[#11110f]">CONTINUE WITH GOOGLE</button>
      </div>
    </main>
  );
}
