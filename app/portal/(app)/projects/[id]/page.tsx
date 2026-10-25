import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Card, Empty, btnCls, fmtDate, fmtDateTime, fmtSize } from "@/components/admin/ui";
import ReviewForm from "@/components/portal/ReviewForm";
import { approveMilestone, signOffProject } from "../../../actions";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = { contract: "Contract", invoice: "Invoice", deliverable: "Deliverable", other: "Document" };

export default async function PortalProject({ params }: { params: { id: string } }) {
  const clientId = await requireClient();
  const p = await db.project.findFirst({
    where: { id: params.id, clientId },
    include: {
      milestones: { orderBy: { order: "asc" } },
      updates: { orderBy: { createdAt: "desc" }, take: 30 },
      documents: { orderBy: { createdAt: "desc" } },
      review: true,
    },
  });
  if (!p) notFound();

  const done = p.milestones.filter((m) => m.status === "approved").length;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/portal" className="font-body text-sm text-muted hover:text-ice">← All projects</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl text-ice">{p.title}</h1>
          <Badge status={p.status} />
        </div>
        {p.description && <p className="mt-2 max-w-2xl whitespace-pre-wrap font-body text-sm text-muted">{p.description}</p>}
      </div>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Overall progress</div>
            <div className="mt-1 font-display text-4xl text-ice">{p.progress}%</div>
          </div>
          <div className="flex gap-8 font-body text-sm">
            <div><div className="font-mono text-[10px] uppercase tracking-widest text-muted">Started</div><div className="text-ice">{fmtDate(p.startDate)}</div></div>
            <div><div className="font-mono text-[10px] uppercase tracking-widest text-muted">Due</div><div className="text-ice">{fmtDate(p.dueDate)}</div></div>
            <div><div className="font-mono text-[10px] uppercase tracking-widest text-muted">Milestones</div><div className="text-ice">{done}/{p.milestones.length}</div></div>
          </div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/5" role="progressbar" aria-valuenow={p.progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${p.progress}%` }} />
        </div>
      </Card>

      {p.status === "review" && (
        <Card className="border-amber-300/30">
          <h2 className="font-display text-xl text-ice">Ready for your sign-off</h2>
          <p className="mt-1 font-body text-sm text-muted">
            Everything is delivered. Approve the project once you&apos;re happy — you can still reach out about anything afterwards.
          </p>
          <form action={signOffProject} className="mt-4">
            <input type="hidden" name="projectId" value={p.id} />
            <button className={btnCls}>Approve &amp; sign off project</button>
          </form>
        </Card>
      )}

      {p.review && p.review.status !== "approved" && (
        <Card title={p.review.status === "pending" ? "Your review" : "Leave a review"}>
          {p.review.status === "pending" ? (
            <p className="font-body text-sm text-muted">Thanks — your review was received and will be published shortly.</p>
          ) : (
            <>
              <p className="mb-5 font-body text-sm text-muted">Thank you for approving the project! A short review helps other businesses decide with confidence.</p>
              <ReviewForm token={p.review.token} defaults={{ name: p.review.name, role: p.review.role, rating: p.review.rating, quote: p.review.quote }} />
            </>
          )}
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Milestones">
          {p.milestones.length === 0 ? (
            <Empty>Milestones will appear here once the plan is set.</Empty>
          ) : (
            <ol className="space-y-3">
              {p.milestones.map((m, i) => (
                <li key={m.id} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px]",
                      m.status === "approved" ? "bg-emerald-400/20 text-emerald-300" : m.status === "awaiting_approval" ? "bg-amber-400/20 text-amber-300" : "bg-white/5 text-muted"
                    )}
                  >
                    {m.status === "approved" ? "✓" : i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-body text-sm text-ice">{m.title}</span>
                      <Badge status={m.status} />
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {m.approvedAt ? `approved ${fmtDate(m.approvedAt)}` : `due ${fmtDate(m.dueDate)}`}
                    </div>
                    {m.status === "awaiting_approval" && (
                      <form action={approveMilestone} className="mt-2">
                        <input type="hidden" name="id" value={m.id} />
                        <button className={btnCls}>Approve milestone</button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Documents">
          {p.documents.length === 0 ? (
            <Empty>Contracts, invoices and deliverables will appear here.</Empty>
          ) : (
            <ul className="space-y-2">
              {p.documents.map((d) => (
                <li key={d.id}>
                  <a href={`/api/documents/${d.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-bg p-3 hover:border-violet-300/40">
                    <span className="min-w-0">
                      <span className="block truncate font-body text-sm text-ice">{d.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{KIND_LABEL[d.kind] ?? "Document"} · {fmtSize(d.size)} · {fmtDate(d.createdAt)}</span>
                    </span>
                    <span className="font-mono text-xs text-violet-300">Download ↓</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Updates">
        {p.updates.length === 0 ? (
          <Empty>Progress updates will be posted here.</Empty>
        ) : (
          <ul className="space-y-4">
            {p.updates.map((u) => (
              <li key={u.id} className="border-l-2 border-violet-500/40 pl-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{fmtDateTime(u.createdAt)}</div>
                <p className="mt-1 whitespace-pre-wrap font-body text-sm text-ice/90">{u.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
