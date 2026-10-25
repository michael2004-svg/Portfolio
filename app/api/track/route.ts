import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SITES = new Set(["portfolio", "booking"]);
const TYPES = new Set(["pageview", "click", "conversion"]);
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget/i;

const str = (v: unknown, max: number) => (typeof v === "string" && v.length > 0 ? v.slice(0, max) : null);

export async function POST(req: NextRequest) {
  if (BOT.test(req.headers.get("user-agent") ?? "")) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    // sendBeacon posts text/plain, so parse manually.
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const site = str(body.site, 20);
  const type = str(body.type, 20);
  const visitorId = str(body.visitorId, 64);
  const sessionId = str(body.sessionId, 64);
  if (!site || !SITES.has(site) || !type || !TYPES.has(type) || !visitorId || !sessionId) {
    return NextResponse.json({ error: "invalid event" }, { status: 400 });
  }

  await db.event.create({
    data: {
      site,
      type,
      name: str(body.name, 120),
      path: str(body.path, 300) ?? "/",
      visitorId,
      sessionId,
      referrer: str(body.referrer, 300),
    },
  });
  return new NextResponse(null, { status: 204 });
}
