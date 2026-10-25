import Link from "next/link";
import { getAnalytics, pct, SiteFilter } from "@/lib/analytics";
import { Card, Stat, Empty } from "@/components/admin/ui";
import VisitorsChart from "@/components/admin/VisitorsChart";
import { cn } from "@/lib/utils";

const RANGES = [7, 30, 90];
const SITES: { id: SiteFilter; label: string }[] = [
  { id: "all", label: "All sites" },
  { id: "portfolio", label: "Portfolio" },
  { id: "booking", label: "Booking" },
];

export default async function AnalyticsPage({ searchParams }: { searchParams: { days?: string; site?: string } }) {
  const days = RANGES.includes(Number(searchParams.days)) ? Number(searchParams.days) : 30;
  const site = (SITES.find((s) => s.id === searchParams.site)?.id ?? "all") as SiteFilter;
  const a = await getAnalytics(days, site);
  const href = (p: { days?: number; site?: string }) => `/admin?days=${p.days ?? days}&site=${p.site ?? site}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-ice">Analytics</h1>
          <p className="mt-1 font-body text-sm text-muted">Last {days} days · {SITES.find((s) => s.id === site)?.label}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-full border border-white/10 p-1">
            {SITES.map((s) => (
              <Link key={s.id} href={href({ site: s.id })} className={cn("rounded-full px-3 py-1.5 font-body text-xs", s.id === site ? "bg-white/10 text-ice" : "text-muted hover:text-ice")}>
                {s.label}
              </Link>
            ))}
          </div>
          <div className="flex rounded-full border border-white/10 p-1">
            {RANGES.map((r) => (
              <Link key={r} href={href({ days: r })} className={cn("rounded-full px-3 py-1.5 font-body text-xs", r === days ? "bg-white/10 text-ice" : "text-muted hover:text-ice")}>
                {r}d
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Stat label="Unique visitors" value={a.visitors.toLocaleString()} />
        <Stat label="Sessions" value={a.sessions.toLocaleString()} />
        <Stat label="Page views" value={a.pageviews.toLocaleString()} />
        <Stat label="Conversions" value={a.conversions.toLocaleString()} hint="Leads + Calendly bookings" />
        <Stat label="Conversion rate" value={pct(a.conversionRate)} hint="Converting visitors ÷ visitors" />
      </div>

      <Card title="Unique visitors per day">
        <VisitorsChart series={a.series} />
      </Card>

      {site === "all" && a.bySite.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {a.bySite.map((s) => (
            <Stat key={s.site} label={`${s.site} site`} value={pct(s.rate)} hint={`${s.visitors.toLocaleString()} visitors converted at this rate`} />
          ))}
        </div>
      )}

      <Card title="Button clicks">
        {a.clicks.length === 0 ? (
          <Empty>No clicks recorded yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] font-body text-sm">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">
                  <th className="pb-2">Button</th>
                  <th className="pb-2">Site</th>
                  <th className="pb-2 text-right">Clicks</th>
                  <th className="pb-2 text-right">Click-through</th>
                </tr>
              </thead>
              <tbody>
                {a.clicks.map((c) => (
                  <tr key={`${c.site}-${c.name}`} className="border-t border-white/5 text-ice/90">
                    <td className="py-2 font-mono text-xs">{c.name}</td>
                    <td className="py-2 text-muted">{c.site}</td>
                    <td className="py-2 text-right tabular-nums">{c.clicks}</td>
                    <td className="py-2 text-right tabular-nums">{pct(c.ctr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Top pages">
          {a.pages.length === 0 ? (
            <Empty>No page views yet.</Empty>
          ) : (
            <ul className="space-y-2 font-body text-sm">
              {a.pages.map((p) => (
                <li key={`${p.site}${p.path}`} className="flex justify-between gap-4 text-ice/90">
                  <span className="truncate"><span className="text-muted">{p.site}</span> {p.path}</span>
                  <span className="tabular-nums">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="Top referrers">
          {a.referrers.length === 0 ? (
            <Empty>No external referrers yet.</Empty>
          ) : (
            <ul className="space-y-2 font-body text-sm">
              {a.referrers.map((r) => (
                <li key={r.referrer} className="flex justify-between gap-4 text-ice/90">
                  <span className="truncate">{r.referrer.replace(/^https?:\/\//, "")}</span>
                  <span className="tabular-nums">{r.views}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
