import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const clash = localFont({
  src: [{ path: "../public/fonts/ClashDisplay-Variable.woff2", style: "normal" }],
  variable: "--font-clash",
  display: "swap",
});

const general = localFont({
  src: [{ path: "../public/fonts/GeneralSans-Variable.woff2", style: "normal" }],
  variable: "--font-general",
  display: "swap",
});

const jetbrains = localFont({
  src: [{ path: "../public/fonts/JetBrainsMono-Variable.woff2", style: "normal" }],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michael Musyoka — Software Engineer",
  description:
    "Full-stack engineer building premium web, mobile, and systems products.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${clash.variable} ${general.variable} ${jetbrains.variable}`}>
      <body className="noise antialiased">{children}</body>
    </html>
  );
}
