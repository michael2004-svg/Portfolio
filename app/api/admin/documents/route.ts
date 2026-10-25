import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendMail, siteUrl } from "@/lib/mail";
import { MAX_UPLOAD_BYTES, uploadDir } from "@/lib/uploads";

const KINDS = new Set(["contract", "invoice", "deliverable", "other"]);

export async function POST(req: NextRequest) {
  if ((await getSession())?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fd = await req.formData();
  const projectId = fd.get("projectId");
  const file = fd.get("file");
  if (typeof projectId !== "string" || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "Files must be under 25 MB." }, { status: 400 });

  const project = await db.project.findUnique({ where: { id: projectId }, include: { client: true } });
  if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });

  const kindRaw = fd.get("kind");
  const kind = typeof kindRaw === "string" && KINDS.has(kindRaw) ? kindRaw : "other";
  const nameRaw = fd.get("name");
  const name = typeof nameRaw === "string" && nameRaw.trim() ? nameRaw.trim().slice(0, 150) : file.name;

  const storedName = `${randomBytes(16).toString("hex")}${path.extname(file.name).slice(0, 10).replace(/[^.\w]/g, "")}`;
  await mkdir(uploadDir(), { recursive: true });
  await writeFile(path.join(uploadDir(), storedName), Buffer.from(await file.arrayBuffer()));

  await db.document.create({
    data: {
      projectId,
      name,
      kind,
      fileName: file.name.slice(0, 200),
      storedName,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
    },
  });

  if (fd.get("notify") === "on") {
    await sendMail({
      to: project.client.email,
      subject: `New ${kind === "other" ? "document" : kind} for ${project.title}`,
      text: `"${name}" has been added to your project portal.`,
      link: { label: "View documents", url: siteUrl(`/portal/projects/${projectId}`) },
    });
  }

  return NextResponse.json({ ok: true });
}
