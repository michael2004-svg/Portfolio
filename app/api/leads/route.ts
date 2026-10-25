import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyAdmin } from "@/lib/mail";

const str = (v: unknown, max = 200) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

// Simple per-IP limiter to keep the form from being spammed.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many submissions — try again shortly." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot field: real users never fill it.
  if (str(body.company_website)) return NextResponse.json({ ok: true });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const site = body.site === "booking" ? "booking" : "portfolio";
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  const features = Array.isArray(body.features) ? body.features.filter((f): f is string => typeof f === "string").slice(0, 20) : [];
  const visitorId = str(body.visitorId, 64);

  const lead = await db.lead.create({
    data: {
      site,
      name,
      email,
      phone: str(body.phone, 40),
      projectType: str(body.projectType, 80),
      budget: str(body.budget, 80),
      deadline: str(body.deadline, 80),
      stage: str(body.stage, 80),
      features,
      details: str(body.details, 4000),
      estimate: typeof body.estimate === "object" && body.estimate ? (body.estimate as object) : undefined,
      visitorId,
    },
  });

  if (visitorId) {
    await db.event.create({
      data: { site, type: "conversion", name: "lead_submitted", path: site === "booking" ? "/book" : "/", visitorId, sessionId: visitorId },
    });
  }

  await notifyAdmin(
    `New lead: ${name} (${lead.projectType ?? "project"})`,
    [
      `Name: ${name}`,
      `Email: ${email}`,
      lead.phone && `Phone: ${lead.phone}`,
      lead.projectType && `Type: ${lead.projectType}`,
      lead.budget && `Budget: ${lead.budget}`,
      lead.deadline && `Timeline: ${lead.deadline}`,
      lead.stage && `Stage: ${lead.stage}`,
      features.length ? `Features: ${features.join(", ")}` : null,
      lead.details && `\n${lead.details}`,
      `\nSource: ${site}`,
    ]
      .filter(Boolean)
      .join("\n"),
    "/admin/leads"
  );

  return NextResponse.json({ ok: true });
}
