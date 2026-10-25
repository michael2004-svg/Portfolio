import { db } from "@/lib/db";
import { Badge, Card, Empty, fmtDateTime, ghostBtnCls, dangerBtnCls } from "@/components/admin/ui";
import { setLeadStatus, deleteLead, convertLead } from "../../actions";

const STATUSES = ["new", "contacted", "won", "lost"];

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = STATUSES.includes(searchParams.status ?? "") ? searchParams.status : undefined;
  const leads = await db.lead.findMany({ where: status ? { status } : {}, orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-3xl text-ice">Leads</h1>
        <div className="flex flex-wrap gap-2">
          {[undefined, ...STATUSES].map((st) => (
            <a key={st ?? "all"} href={st ? `/admin/leads?status=${st}` : "/admin/leads"} className={`${ghostBtnCls} ${st === status ? "border-violet-300/60 text-violet-300" : ""}`}>
              {st ?? "all"}
            </a>
          ))}
        </div>
      </div>

      {leads.length === 0 ? (
        <Empty>No leads yet. Submissions from the booking form on both sites land here.</Empty>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <Card key={l.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-display text-lg text-ice">{l.name}</h2>
                    <Badge status={l.status} />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{l.site} · {fmtDateTime(l.createdAt)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 font-body text-sm">
                    <a href={`mailto:${l.email}`} className="text-violet-300 hover:underline">{l.email}</a>
                    {l.phone && <a href={`tel:${l.phone}`} className="text-violet-300 hover:underline">{l.phone}</a>}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <form action={setLeadStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={l.id} />
                    <select name="status" defaultValue={l.status} className="rounded-full border border-white/10 bg-bg px-3 py-2 font-mono text-xs text-ice">
                      {STATUSES.map((st) => <option key={st}>{st}</option>)}
                    </select>
                    <button className={ghostBtnCls}>Save</button>
                  </form>
                  {!l.clientId && (
                    <form action={convertLead}>
                      <input type="hidden" name="id" value={l.id} />
                      <button className={ghostBtnCls} title="Creates a client portal account + project and emails the invite">Make client</button>
                    </form>
                  )}
                  <form action={deleteLead}>
                    <input type="hidden" name="id" value={l.id} />
                    <button className={dangerBtnCls}>Delete</button>
                  </form>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 font-body text-sm sm:grid-cols-4">
                {[
                  ["Type", l.projectType],
                  ["Budget", l.budget],
                  ["Timeline", l.deadline],
                  ["Stage", l.stage],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-muted">{k}</dt>
                    <dd className="text-ice/90">{v ?? "—"}</dd>
                  </div>
                ))}
              </dl>
              {l.features.length > 0 && <p className="mt-3 font-body text-sm text-muted">Features: {l.features.join(", ")}</p>}
              {l.details && <p className="mt-3 whitespace-pre-wrap rounded-xl bg-bg p-4 font-body text-sm text-ice/80">{l.details}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
