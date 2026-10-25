import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { uploadDir } from "@/lib/uploads";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await db.document.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.role === "client" && doc.project.clientId !== session.clientId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let data: Buffer;
  try {
    data = await readFile(path.join(uploadDir(), doc.storedName));
  } catch {
    return NextResponse.json({ error: "File missing on server" }, { status: 410 });
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(data.length),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(doc.fileName)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
