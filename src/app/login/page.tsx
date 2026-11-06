import Link from "next/link";
import { LoginButton } from "./LoginButton";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#24241e] p-8">
        <p className="mb-3 text-xs font-bold tracking-[.25em] text-[#f4ba3b]">ROOM 404</p>
        <h1 className="text-3xl font-black">Sign in.</h1>
        <p className="mt-3 text-sm leading-6 text-[#aaa69c]">Sign in with Google to manage your bookings. Admin access is enabled automatically for approved accounts.</p>
        <div className="mt-7"><LoginButton /></div>
        <Link href="/" className="mt-6 block text-center text-xs text-[#aaa69c] underline">Back to booking page</Link>
      </div>
    </main>
  );
}
