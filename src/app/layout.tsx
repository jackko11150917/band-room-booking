import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROOM 404 — Band Room Booking",
  description: "Book your next rehearsal at ROOM 404.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
