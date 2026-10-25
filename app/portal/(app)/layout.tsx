import type { Metadata } from "next";
import Link from "next/link";
import { requireClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientLogout } from "../actions";

export const metadata: Metadata = { title: "Client Portal — Michael Musyoka", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const clientId = await requireClient();
  const client = await db.client.findUnique({ where: { id: clientId } });
  if (!client) {
    // Session points at a deleted client.
    return (
      <form action={clientLogout} className="flex min-h-screen items-center justify-center bg-bg">
        <button className="font-body text-sm text-violet-300">Your account no longer exists — sign out</button>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/portal" className="font-display text-lg text-ice">
            M<span className="text-violet-300">.</span> <span className="font-mono text-xs uppercase tracking-widest text-muted">client portal</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-body text-sm text-muted sm:inline">{client.name}</span>
            <form action={clientLogout}>
              <button className="font-body text-sm text-muted hover:text-ice">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
