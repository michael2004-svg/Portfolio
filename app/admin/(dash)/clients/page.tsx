import Link from "next/link";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/mail";
import { Badge, Card, Empty, Field, inputCls, ghostBtnCls, dangerBtnCls, btnCls, fmtDate } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { createClient, createProject, resendInvite, deleteClient } from "../../actions";

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { projects: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-ice">Clients &amp; Projects</h1>
        {clients.length === 0 && <Empty>No clients yet. Add one on the right, or use “Make client” on a lead.</Empty>}
        {clients.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg text-ice">{c.name}</h2>
                <p className="font-body text-sm text-muted">
                  {c.email}
                  {c.company && ` · ${c.company}`}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {c.passwordHash ? `Portal active · last login ${fmtDate(c.lastLoginAt)}` : "Invite pending"}
                </p>
                {!c.passwordHash && c.inviteToken && (
                  <p className="mt-1 break-all font-mono text-[11px] text-muted/80">{siteUrl(`/portal/invite/${c.inviteToken}`)}</p>
                )}
              </div>
              <div className="flex gap-2">
                {!c.passwordHash && (
                  <form action={resendInvite}>
                    <input type="hidden" name="id" value={c.id} />
                    <button className={ghostBtnCls}>Resend invite</button>
                  </form>
                )}
                <form action={deleteClient}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className={dangerBtnCls} title="Deletes the client, their projects and documents">Delete</button>
                </form>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {c.projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projects/${p.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-bg px-4 py-3 hover:border-violet-300/40">
                    <span className="font-body text-sm text-ice">{p.title}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">{p.progress}%</span>
                      <Badge status={p.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <form action={createProject} className="mt-3 flex gap-2">
              <input type="hidden" name="clientId" value={c.id} />
              <input name="title" required placeholder="New project title" className={inputCls} />
              <button className={btnCls}>Add</button>
            </form>
          </Card>
        ))}
      </div>

      <div>
        <Card title="Add client" className="lg:sticky lg:top-24">
          <ActionForm action={createClient} submitLabel="Create & send invite" successText="Client created — invite emailed.">
            <Field label="Name"><input name="name" required className={inputCls} /></Field>
            <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
            <Field label="Company (optional)"><input name="company" className={inputCls} /></Field>
          </ActionForm>
          <p className="mt-4 font-body text-xs text-muted">The client gets an email link to set a password. If email isn&apos;t configured, copy the invite link shown on their card.</p>
        </Card>
      </div>
    </div>
  );
}
