"use client";

import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <button onClick={() => signIn("google", { callbackUrl: "/" })} className="w-full rounded-full bg-[#f4ba3b] py-4 text-xs font-black tracking-[.15em] text-[#11110f] transition hover:scale-[1.02]">
      CONTINUE WITH GOOGLE
    </button>
  );
}
