import Link from "next/link";
import { LoginButton } from "./LoginButton";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#24241e] p-8">
        <p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404</p>
        <h1 className="text-3xl font-black">登入帳戶</h1>
        <p className="mt-3 text-sm leading-6 text-[#aaa69c]">使用 Google 登入，即可管理你嘅 booking。獲授權嘅管理員會自動開通後台功能。</p>
        <div className="mt-7"><LoginButton /></div>
        <Link href="/" className="mt-6 block text-center text-xs text-[#aaa69c] underline">返回 booking 頁面</Link>
      </div>
    </main>
  );
}
