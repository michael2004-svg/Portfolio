import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./book.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-grotesk", display: "swap" });

export const metadata: Metadata = {
  title: "A Working Product In Front Of Real Users — Book a Free Consultation",
  description:
    "We scope, price and build websites, mobile apps, web applications and custom business software end-to-end — so you're not managing developers or guessing whether it'll ship. Book a free consultation.",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <div className={`lp ${inter.variable} ${grotesk.variable}`}>{children}</div>;
}
