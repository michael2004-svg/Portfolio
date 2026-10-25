import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { adminLogout } from "../actions";

export const metadata: Metadata = { title: "Admin — Michael Musyoka", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const [newLeads, pendingReviews] = await Promise.all([
    db.lead.count({ where: { status: "new" } }),
    db.review.count({ where: { status: "pending" } }),
  ]);

  const nav = [
    { href: "/admin", label: "Analytics" },
    { href: "/admin/leads", label: "Leads", count: newLeads },
    { href: "/admin/clients", label: "Clients & Projects" },
    { href: "/admin/reviews", label: "Reviews", count: pendingReviews },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <Link href="/admin" className="font-display text-lg text-ice">
            M<span className="text-violet-300">.</span> <span className="font-mono text-xs uppercase tracking-widest text-muted">admin</span>
          </Link>
          <nav className="order-3 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 font-body text-sm text-muted hover:bg-white/5 hover:text-ice">
                {n.label}
                {!!n.count && <span className="rounded-full bg-violet-500 px-1.5 font-mono text-[10px] text-bg">{n.count}</span>}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <a href="/" target="_blank" className="font-body text-sm text-muted hover:text-ice">View site ↗</a>
            <form action={adminLogout}>
              <button className="font-body text-sm text-muted hover:text-ice">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
