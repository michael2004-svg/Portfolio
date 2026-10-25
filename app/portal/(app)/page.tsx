import Link from "next/link";
import { redirect } from "next/navigation";
import { requireClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge, Empty, fmtDate } from "@/components/admin/ui";

export default async function PortalHome() {
  const clientId = await requireClient();
  const projects = await db.project.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    include: { milestones: { where: { status: "awaiting_approval" }, select: { id: true } } },
  });
  if (projects.length === 1) redirect(`/portal/projects/${projects[0].id}`);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ice">Your projects</h1>
      {projects.length === 0 && <Empty>Your project will appear here as soon as it&apos;s set up.</Empty>}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link key={p.id} href={`/portal/projects/${p.id}`} className="rounded-2xl border border-white/5 bg-bg-elevated p-6 transition-colors hover:border-violet-300/40">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg text-ice">{p.title}</h2>
              <Badge status={p.status} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full rounded-full bg-violet-500" style={{ width: `${p.progress}%` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>{p.progress}% complete</span>
              <span>due {fmtDate(p.dueDate)}</span>
            </div>
            {p.milestones.length > 0 && (
              <p className="mt-3 font-body text-sm text-amber-300">{p.milestones.length} milestone{p.milestones.length > 1 ? "s" : ""} waiting for your approval</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
