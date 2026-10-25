import type { Metadata } from "next";
import { db } from "@/lib/db";
import InviteForm from "@/components/portal/InviteForm";

export const metadata: Metadata = { title: "Set up your portal", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function InvitePage({ params }: { params: { token: string } }) {
  const client = await db.client.findUnique({ where: { inviteToken: params.token } });
  const valid = !!client?.inviteExpires && client.inviteExpires > new Date();

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/5 bg-bg-elevated p-8">
        <a href="/" className="font-display text-xl text-ice">
          M<span className="text-violet-300">.</span>
        </a>
        {valid ? (
          <>
            <h1 className="mt-6 font-display text-2xl text-ice">Welcome, {client!.name.split(" ")[0]}</h1>
            <p className="mt-1 mb-6 font-body text-sm text-muted">Choose a password for your client portal ({client!.email}).</p>
            <InviteForm token={params.token} />
          </>
        ) : (
          <>
            <h1 className="mt-6 font-display text-2xl text-ice">Link expired</h1>
            <p className="mt-2 font-body text-sm text-muted">
              This invite link is no longer valid. If you&apos;ve already set a password, <a href="/portal/login" className="text-violet-300 hover:underline">sign in here</a>; otherwise ask Michael to resend your invite.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
