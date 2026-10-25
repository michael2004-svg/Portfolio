"use server";

import { unlink } from "fs/promises";
import path from "path";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  requireAdmin,
  startSession,
  endSession,
  checkAdminCredentials,
  loginThrottled,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/auth";
import { sendMail, siteUrl } from "@/lib/mail";
import { uploadDir } from "@/lib/uploads";
import { ensureProjectReview, newToken as token, sendReviewRequest } from "@/lib/review-flow";

const s = (fd: FormData, k: string) => {
  const v = fd.get(k);
  return typeof v === "string" && v.trim() ? v.trim() : null;
};
const date = (v: string | null) => (v ? new Date(`${v}T00:00:00+03:00`) : null);

// ---------- auth ----------

export async function adminLogin(_: unknown, fd: FormData) {
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `admin:${ip}`;
  if (loginThrottled(key)) return { error: "Too many attempts. Try again in 15 minutes." };
  if (!checkAdminCredentials(s(fd, "email") ?? "", (fd.get("password") as string) ?? "")) {
    recordLoginFailure(key);
    return { error: "Invalid email or password." };
  }
  clearLoginFailures(key);
  await startSession({ role: "admin" });
  redirect("/admin");
}

export async function adminLogout() {
  endSession();
  redirect("/admin/login");
}

// ---------- leads ----------

export async function setLeadStatus(fd: FormData) {
  await requireAdmin();
  const status = s(fd, "status");
  if (!status || !["new", "contacted", "won", "lost"].includes(status)) return;
  await db.lead.update({ where: { id: s(fd, "id")! }, data: { status } });
  revalidatePath("/admin/leads");
}

export async function deleteLead(fd: FormData) {
  await requireAdmin();
  await db.lead.delete({ where: { id: s(fd, "id")! } });
  revalidatePath("/admin/leads");
}

// Turns a lead into a portal client + first project, and emails the invite.
export async function convertLead(fd: FormData) {
  await requireAdmin();
  const lead = await db.lead.findUniqueOrThrow({ where: { id: s(fd, "id")! } });
  const client = await upsertClient(lead.name, lead.email, null);
  const project = await db.project.create({
    data: {
      clientId: client.id,
      title: lead.projectType ? `${lead.projectType} for ${lead.name}` : `Project for ${lead.name}`,
      description: lead.details,
    },
  });
  await db.lead.update({ where: { id: lead.id }, data: { status: "won", clientId: client.id } });
  redirect(`/admin/projects/${project.id}`);
}

// ---------- clients ----------

async function upsertClient(name: string, email: string, company: string | null) {
  const normalized = email.toLowerCase();
  const existing = await db.client.findUnique({ where: { email: normalized } });
  if (existing) return existing;
  const inviteToken = token();
  const client = await db.client.create({
    data: { name, email: normalized, company, inviteToken, inviteExpires: new Date(Date.now() + 14 * 86400_000) },
  });
  await sendInviteEmail(client.name, client.email, inviteToken);
  return client;
}

async function sendInviteEmail(name: string, email: string, inviteToken: string) {
  await sendMail({
    to: email,
    subject: "Your project portal is ready",
    text: `Hi ${name.split(" ")[0]},\n\nI've set up a private portal where you can follow your project's progress, approve milestones, and download contracts and deliverables.\n\nSet your password to get started (link valid for 14 days).`,
    link: { label: "Open your portal", url: siteUrl(`/portal/invite/${inviteToken}`) },
  });
}

export async function createClient(_: unknown, fd: FormData) {
  await requireAdmin();
  const name = s(fd, "name");
  const email = s(fd, "email");
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Name and a valid email are required." };
  if (await db.client.findUnique({ where: { email: email.toLowerCase() } })) return { error: "A client with that email already exists." };
  await upsertClient(name, email, s(fd, "company"));
  revalidatePath("/admin/clients");
  return { ok: true };
}

export async function resendInvite(fd: FormData) {
  await requireAdmin();
  const inviteToken = token();
  const client = await db.client.update({
    where: { id: s(fd, "id")! },
    data: { inviteToken, inviteExpires: new Date(Date.now() + 14 * 86400_000) },
  });
  await sendInviteEmail(client.name, client.email, inviteToken);
  revalidatePath("/admin/clients");
}

export async function deleteClient(fd: FormData) {
  await requireAdmin();
  const client = await db.client.findUniqueOrThrow({
    where: { id: s(fd, "id")! },
    include: { projects: { include: { documents: true } } },
  });
  for (const doc of client.projects.flatMap((p) => p.documents)) {
    await unlink(path.join(uploadDir(), doc.storedName)).catch(() => {});
  }
  await db.client.delete({ where: { id: client.id } });
  revalidatePath("/admin/clients");
}

// ---------- projects ----------

export async function createProject(fd: FormData) {
  await requireAdmin();
  const title = s(fd, "title");
  const clientId = s(fd, "clientId");
  if (!title || !clientId) return;
  const project = await db.project.create({ data: { title, clientId, description: s(fd, "description") } });
  redirect(`/admin/projects/${project.id}`);
}

export async function updateProject(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id")!;
  const status = s(fd, "status") ?? "planning";
  const before = await db.project.findUniqueOrThrow({ where: { id }, include: { client: true } });
  await db.project.update({
    where: { id },
    data: {
      title: s(fd, "title") ?? before.title,
      description: s(fd, "description"),
      status,
      progress: Math.min(100, Math.max(0, Number(s(fd, "progress") ?? 0))),
      startDate: date(s(fd, "startDate")),
      dueDate: date(s(fd, "dueDate")),
    },
  });
  if (status === "review" && before.status !== "review") {
    await sendMail({
      to: before.client.email,
      subject: `${before.title} is ready for your sign-off`,
      text: `Hi ${before.client.name.split(" ")[0]},\n\n${before.title} is ready for your final review. Take a look in your portal and approve it when you're happy.`,
      link: { label: "Review & approve", url: siteUrl(`/portal/projects/${id}`) },
    });
  }
  revalidatePath(`/admin/projects/${id}`);
}

export async function deleteProject(fd: FormData) {
  await requireAdmin();
  const project = await db.project.findUniqueOrThrow({ where: { id: s(fd, "id")! }, include: { documents: true } });
  for (const doc of project.documents) await unlink(path.join(uploadDir(), doc.storedName)).catch(() => {});
  await db.project.delete({ where: { id: project.id } });
  redirect("/admin/clients");
}

export async function addMilestone(fd: FormData) {
  await requireAdmin();
  const projectId = s(fd, "projectId")!;
  const title = s(fd, "title");
  if (!title) return;
  const count = await db.milestone.count({ where: { projectId } });
  await db.milestone.create({
    data: { projectId, title, description: s(fd, "description"), dueDate: date(s(fd, "dueDate")), order: count },
  });
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function setMilestoneStatus(fd: FormData) {
  await requireAdmin();
  const status = s(fd, "status")!;
  const m = await db.milestone.update({
    where: { id: s(fd, "id")! },
    data: { status, approvedAt: status === "approved" ? new Date() : null },
    include: { project: { include: { client: true } } },
  });
  if (status === "awaiting_approval") {
    await sendMail({
      to: m.project.client.email,
      subject: `Milestone ready for approval: ${m.title}`,
      text: `"${m.title}" on ${m.project.title} is complete and waiting for your approval.`,
      link: { label: "Review milestone", url: siteUrl(`/portal/projects/${m.projectId}`) },
    });
  }
  revalidatePath(`/admin/projects/${m.projectId}`);
}

export async function deleteMilestone(fd: FormData) {
  await requireAdmin();
  const m = await db.milestone.delete({ where: { id: s(fd, "id")! } });
  revalidatePath(`/admin/projects/${m.projectId}`);
}

export async function postUpdate(fd: FormData) {
  await requireAdmin();
  const projectId = s(fd, "projectId")!;
  const body = s(fd, "body");
  if (!body) return;
  const update = await db.projectUpdate.create({ data: { projectId, body }, include: { project: { include: { client: true } } } });
  if (fd.get("notify") === "on") {
    await sendMail({
      to: update.project.client.email,
      subject: `Update on ${update.project.title}`,
      text: body,
      link: { label: "Open your portal", url: siteUrl(`/portal/projects/${projectId}`) },
    });
  }
  revalidatePath(`/admin/projects/${projectId}`);
}

export async function deleteUpdate(fd: FormData) {
  await requireAdmin();
  const u = await db.projectUpdate.delete({ where: { id: s(fd, "id")! } });
  revalidatePath(`/admin/projects/${u.projectId}`);
}

export async function deleteDocument(fd: FormData) {
  await requireAdmin();
  const doc = await db.document.delete({ where: { id: s(fd, "id")! } });
  await unlink(path.join(uploadDir(), doc.storedName)).catch(() => {});
  revalidatePath(`/admin/projects/${doc.projectId}`);
}

// ---------- reviews ----------

export async function requestProjectReview(fd: FormData) {
  await requireAdmin();
  const { project, review } = await ensureProjectReview(s(fd, "projectId")!);
  await sendReviewRequest(review.name, review.email ?? project.client.email, review.token, project.title);
  revalidatePath(`/admin/projects/${project.id}`);
}

export async function requestReviewByEmail(_: unknown, fd: FormData) {
  await requireAdmin();
  const name = s(fd, "name");
  const email = s(fd, "email");
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return { error: "Name and a valid email are required." };
  const review = await db.review.create({ data: { token: token(), name, email, role: s(fd, "role") } });
  await sendReviewRequest(name, email, review.token, null);
  revalidatePath("/admin/reviews");
  return { ok: true, link: siteUrl(`/review/${review.token}`) };
}

export async function moderateReview(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id")!;
  const action = s(fd, "action");
  if (action === "approve") await db.review.update({ where: { id }, data: { status: "approved", approvedAt: new Date() } });
  if (action === "reject") await db.review.update({ where: { id }, data: { status: "rejected", approvedAt: null } });
  if (action === "delete") await db.review.delete({ where: { id } });
  if (action === "placement") {
    await db.review.update({
      where: { id },
      data: { showOnPortfolio: fd.get("showOnPortfolio") === "on", showOnBooking: fd.get("showOnBooking") === "on" },
    });
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/book");
}
