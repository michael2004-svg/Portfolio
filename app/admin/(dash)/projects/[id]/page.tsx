import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/mail";
import { Badge, Card, Empty, Field, inputCls, btnCls, ghostBtnCls, dangerBtnCls, fmtDate, fmtDateTime, fmtSize } from "@/components/admin/ui";
import UploadForm from "@/components/admin/UploadForm";
import {
  updateProject,
  deleteProject,
  addMilestone,
  setMilestoneStatus,
  deleteMilestone,
  postUpdate,
  deleteUpdate,
  deleteDocument,
  requestProjectReview,
} from "../../../actions";

const MILESTONE_STATUSES = ["pending", "in_progress", "awaiting_approval", "approved"];
const iso = (d: Date | null) => (d ? new Date(d.getTime() + 3 * 3600_000).toISOString().slice(0, 10) : "");

export default async function ProjectAdminPage({ params }: { params: { id: string } }) {
  const p = await db.project.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      milestones: { orderBy: { order: "asc" } },
      updates: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { createdAt: "desc" } },
      review: true,
    },
  });
  if (!p) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/clients" className="font-body text-sm text-muted hover:text-ice">← Clients</Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl text-ice">{p.title}</h1>
          <Badge status={p.status} />
        </div>
        <p className="mt-1 font-body text-sm text-muted">
          {p.client.name} · {p.client.email}
          {p.approvedAt && <> · <span className="text-emerald-300">Signed off by client {fmtDate(p.approvedAt)}</span></>}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Project details">
          <form action={updateProject} className="space-y-4">
            <input type="hidden" name="id" value={p.id} />
            <Field label="Title"><input name="title" defaultValue={p.title} className={inputCls} /></Field>
            <Field label="Description (visible to client)"><textarea name="description" rows={3} defaultValue={p.description ?? ""} className={inputCls} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status">
                <select name="status" defaultValue={p.status} className={inputCls}>
                  <option value="planning">Planning</option>
                  <option value="in_progress">In progress</option>
                  <option value="review">Ready for sign-off</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
              <Field label="Progress %"><input name="progress" type="number" min={0} max={100} defaultValue={p.progress} className={inputCls} /></Field>
              <Field label="Start date"><input name="startDate" type="date" defaultValue={iso(p.startDate)} className={inputCls} /></Field>
              <Field label="Due date"><input name="dueDate" type="date" defaultValue={iso(p.dueDate)} className={inputCls} /></Field>
            </div>
            <p className="font-body text-xs text-muted">Setting status to “Ready for sign-off” emails the client asking them to approve the project.</p>
            <button className={btnCls}>Save project</button>
          </form>
        </Card>

        <Card title="Milestones">
          {p.milestones.length === 0 ? (
            <Empty>No milestones yet.</Empty>
          ) : (
            <ul className="space-y-2">
              {p.milestones.map((m) => (
                <li key={m.id} className="rounded-xl border border-white/5 bg-bg p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-body text-sm text-ice">{m.title}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                        due {fmtDate(m.dueDate)}
                        {m.approvedAt && ` · approved ${fmtDate(m.approvedAt)}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <form action={setMilestoneStatus} className="flex gap-1.5">
                        <input type="hidden" name="id" value={m.id} />
                        <select name="status" defaultValue={m.status} className="rounded-full border border-white/10 bg-bg-elevated px-2.5 py-1.5 font-mono text-[11px] text-ice">
                          {MILESTONE_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                        </select>
                        <button className={ghostBtnCls}>Set</button>
                      </form>
                      <form action={deleteMilestone}>
                        <input type="hidden" name="id" value={m.id} />
                        <button className="px-2 text-muted hover:text-red-300" aria-label={`Delete ${m.title}`}>✕</button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form action={addMilestone} className="mt-4 grid gap-2 sm:grid-cols-[1fr_150px_auto]">
            <input type="hidden" name="projectId" value={p.id} />
            <input name="title" required placeholder="Milestone title" className={inputCls} />
            <input name="dueDate" type="date" className={inputCls} />
            <button className={btnCls}>Add</button>
          </form>
          <p className="mt-2 font-body text-xs text-muted">Set a milestone to “awaiting approval” and the client can approve it from their portal.</p>
        </Card>

        <Card title="Progress updates">
          <form action={postUpdate} className="space-y-3">
            <input type="hidden" name="projectId" value={p.id} />
            <textarea name="body" required rows={3} placeholder="What changed this week?" className={inputCls} />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-body text-sm text-muted">
                <input type="checkbox" name="notify" defaultChecked /> Email the client
              </label>
              <button className={btnCls}>Post update</button>
            </div>
          </form>
          <ul className="mt-5 space-y-3">
            {p.updates.map((u) => (
              <li key={u.id} className="rounded-xl border border-white/5 bg-bg p-3">
                <div className="flex justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{fmtDateTime(u.createdAt)}</span>
                  <form action={deleteUpdate}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="text-xs text-muted hover:text-red-300">Delete</button>
                  </form>
                </div>
                <p className="mt-1 whitespace-pre-wrap font-body text-sm text-ice/90">{u.body}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Documents">
          <UploadForm projectId={p.id} />
          <ul className="mt-5 space-y-2">
            {p.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-bg p-3">
                <a href={`/api/documents/${d.id}`} className="min-w-0">
                  <div className="truncate font-body text-sm text-ice hover:text-violet-300">{d.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{d.kind} · {fmtSize(d.size)} · {fmtDate(d.createdAt)}</div>
                </a>
                <form action={deleteDocument}>
                  <input type="hidden" name="id" value={d.id} />
                  <button className="text-xs text-muted hover:text-red-300">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Review">
          {p.review ? (
            <div className="space-y-2 font-body text-sm">
              <div className="flex items-center gap-2"><Badge status={p.review.status} /></div>
              {p.review.quote ? (
                <p className="text-ice/90">“{p.review.quote}” — {p.review.rating}★</p>
              ) : (
                <p className="text-muted">Requested, not submitted yet.</p>
              )}
              <p className="break-all font-mono text-[11px] text-muted">{siteUrl(`/review/${p.review.token}`)}</p>
            </div>
          ) : (
            <p className="font-body text-sm text-muted">
              When the client signs off in the portal they&apos;re asked for a review automatically. You can also ask now.
            </p>
          )}
          {p.review?.status !== "approved" && (
            <form action={requestProjectReview} className="mt-4">
              <input type="hidden" name="projectId" value={p.id} />
              <button className={ghostBtnCls}>{p.review ? "Resend review request" : "Request a review"}</button>
            </form>
          )}
        </Card>

        <Card title="Danger zone">
          <form action={deleteProject}>
            <input type="hidden" name="id" value={p.id} />
            <button className={dangerBtnCls}>Delete project</button>
          </form>
        </Card>
      </div>
    </div>
  );
}
