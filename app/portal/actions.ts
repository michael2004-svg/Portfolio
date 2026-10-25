"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireClient, startSession, endSession, loginThrottled, recordLoginFailure, clearLoginFailures } from "@/lib/auth";
import { notifyAdmin } from "@/lib/mail";
import { ensureProjectReview } from "@/lib/review-flow";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};

export async function clientLogin(_: unknown, fd: FormData) {
  const email = (s(fd, "email") ?? "").toLowerCase();
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `client:${ip}:${email}`;
  if (loginThrottled(key)) return { error: "Too many attempts. Try again in 15 minutes." };

  const client = await db.client.findUnique({ where: { email } });
  const ok = !!client?.passwordHash && (await bcrypt.compare((fd.get("password") as string) ?? "", client.passwordHash));
  if (!client || !ok) {
    recordLoginFailure(key);
    return { error: "Invalid email or password." };
  }
  clearLoginFailures(key);
  await db.client.update({ where: { id: client.id }, data: { lastLoginAt: new Date() } });
  await startSession({ role: "client", clientId: client.id });
  redirect("/portal");
}

export async function acceptInvite(_: unknown, fd: FormData) {
  const token = s(fd, "token");
  const password = (fd.get("password") as string) ?? "";
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== fd.get("confirm")) return { error: "Passwords don't match." };

  const client = token ? await db.client.findUnique({ where: { inviteToken: token } }) : null;
  if (!client || !client.inviteExpires || client.inviteExpires < new Date()) {
    return { error: "This invite link has expired. Ask Michael for a new one." };
  }
  await db.client.update({
    where: { id: client.id },
    data: { passwordHash: await bcrypt.hash(password, 12), inviteToken: null, inviteExpires: null, lastLoginAt: new Date() },
  });
  await startSession({ role: "client", clientId: client.id });
  redirect("/portal");
}

export async function clientLogout() {
  endSession();
  redirect("/portal/login");
}

async function ownedProject(projectId: string) {
  const clientId = await requireClient();
  const project = await db.project.findFirst({ where: { id: projectId, clientId }, include: { client: true } });
  if (!project) throw new Error("Not found");
  return project;
}

export async function approveMilestone(fd: FormData) {
  const milestone = await db.milestone.findUniqueOrThrow({ where: { id: s(fd, "id")! } });
  const project = await ownedProject(milestone.projectId);
  if (milestone.status !== "awaiting_approval") return;
  await db.milestone.update({ where: { id: milestone.id }, data: { status: "approved", approvedAt: new Date() } });
  await notifyAdmin(`${project.client.name} approved "${milestone.title}"`, `Milestone approved on ${project.title}.`, `/admin/projects/${project.id}`);
  revalidatePath(`/portal/projects/${project.id}`);
}

// Final sign-off: completes the project and opens the review request.
export async function signOffProject(fd: FormData) {
  const project = await ownedProject(s(fd, "projectId")!);
  if (project.status !== "review") return;
  await db.project.update({ where: { id: project.id }, data: { status: "completed", progress: 100, approvedAt: new Date() } });
  await ensureProjectReview(project.id);
  await notifyAdmin(`${project.client.name} signed off ${project.title}`, "The project is approved and a review request is now showing in their portal.", `/admin/projects/${project.id}`);
  revalidatePath(`/portal/projects/${project.id}`);
}
