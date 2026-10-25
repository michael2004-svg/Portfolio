import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "./db";

export type SiteFilter = "all" | "portfolio" | "booking";

export type DailyPoint = { day: string; visitors: number; conversions: number };

export async function getAnalytics(days: number, site: SiteFilter) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const siteSql = site === "all" ? Prisma.empty : Prisma.sql`AND site = ${site}`;
  const siteWhere = site === "all" ? {} : { site };

  const [[totals], daily, clicks, pages, referrers, bySite] = await Promise.all([
    db.$queryRaw<{ visitors: bigint; sessions: bigint; pageviews: bigint; converters: bigint; conversions: bigint }[]>`
      SELECT
        COUNT(DISTINCT "visitorId") FILTER (WHERE type = 'pageview') AS visitors,
        COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview') AS sessions,
        COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews,
        COUNT(DISTINCT "visitorId") FILTER (WHERE type = 'conversion') AS converters,
        COUNT(*) FILTER (WHERE type = 'conversion') AS conversions
      FROM "Event" WHERE "createdAt" >= ${since} ${siteSql}`,
    db.$queryRaw<{ day: Date; visitors: bigint; conversions: bigint }[]>`
      SELECT date_trunc('day', "createdAt" AT TIME ZONE 'Africa/Nairobi') AS day,
        COUNT(DISTINCT "visitorId") FILTER (WHERE type = 'pageview') AS visitors,
        COUNT(*) FILTER (WHERE type = 'conversion') AS conversions
      FROM "Event" WHERE "createdAt" >= ${since} ${siteSql}
      GROUP BY 1 ORDER BY 1`,
    db.$queryRaw<{ name: string; site: string; clicks: bigint; visitors: bigint }[]>`
      SELECT name, site, COUNT(*) AS clicks, COUNT(DISTINCT "visitorId") AS visitors
      FROM "Event" WHERE type = 'click' AND name IS NOT NULL AND "createdAt" >= ${since} ${siteSql}
      GROUP BY name, site ORDER BY clicks DESC LIMIT 40`,
    db.event.groupBy({
      by: ["site", "path"],
      where: { type: "pageview", createdAt: { gte: since }, ...siteWhere },
      _count: { _all: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    db.event.groupBy({
      by: ["referrer"],
      where: { type: "pageview", createdAt: { gte: since }, referrer: { not: null }, ...siteWhere },
      _count: { _all: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 10,
    }),
    db.$queryRaw<{ site: string; visitors: bigint; converters: bigint }[]>`
      SELECT site,
        COUNT(DISTINCT "visitorId") FILTER (WHERE type = 'pageview') AS visitors,
        COUNT(DISTINCT "visitorId") FILTER (WHERE type = 'conversion') AS converters
      FROM "Event" WHERE "createdAt" >= ${since} GROUP BY site`,
  ]);

  const visitors = Number(totals?.visitors ?? 0);
  const converters = Number(totals?.converters ?? 0);

  // Fill missing days so the chart has one bar per day.
  const byDay = new Map(daily.map((d) => [d.day.toISOString().slice(0, 10), d]));
  const series: DailyPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(Date.now() + 3 * 3600_000 - i * 86400_000).toISOString().slice(0, 10);
    const row = byDay.get(key);
    series.push({ day: key, visitors: Number(row?.visitors ?? 0), conversions: Number(row?.conversions ?? 0) });
  }

  return {
    visitors,
    sessions: Number(totals?.sessions ?? 0),
    pageviews: Number(totals?.pageviews ?? 0),
    conversions: Number(totals?.conversions ?? 0),
    conversionRate: visitors ? converters / visitors : 0,
    series,
    clicks: clicks.map((c) => ({
      name: c.name,
      site: c.site,
      clicks: Number(c.clicks),
      ctr: visitors ? Number(c.visitors) / visitors : 0,
    })),
    pages: pages.map((p) => ({ site: p.site, path: p.path, views: p._count._all })),
    referrers: referrers.map((r) => ({ referrer: r.referrer ?? "", views: r._count._all })),
    bySite: bySite.map((s) => ({
      site: s.site,
      visitors: Number(s.visitors),
      rate: Number(s.visitors) ? Number(s.converters) / Number(s.visitors) : 0,
    })),
  };
}

export const pct = (n: number) => `${(n * 100).toFixed(n > 0 && n < 0.1 ? 1 : 0)}%`;
