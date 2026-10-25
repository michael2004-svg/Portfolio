"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { notifyAdmin } from "@/lib/mail";

export async function submitReview(_: unknown, fd: FormData) {
  const token = fd.get("token");
  const quote = String(fd.get("quote") ?? "").trim();
  const rating = Number(fd.get("rating"));
  const name = String(fd.get("name") ?? "").trim();
  const role = String(fd.get("role") ?? "").trim();

  if (typeof token !== "string") return { error: "Invalid link." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Pick a star rating." };
  if (quote.length < 10) return { error: "Please write at least a sentence." };
  if (!name) return { error: "Add the name to show with your review." };

  const review = await db.review.findUnique({ where: { token } });
  if (!review) return { error: "This review link is no longer valid." };
  if (review.status === "approved") return { error: "This review has already been published — thank you!" };

  await db.review.update({
    where: { id: review.id },
    data: {
      quote: quote.slice(0, 1200),
      rating,
      name: name.slice(0, 100),
      role: role.slice(0, 120) || null,
      status: "pending",
      submittedAt: new Date(),
    },
  });
  await notifyAdmin(`New ${rating}★ review from ${name}`, `"${quote}"\n\nApprove it to publish on the portfolio and booking page.`, "/admin/reviews");
  if (review.projectId) revalidatePath(`/portal/projects/${review.projectId}`);
  return { ok: true };
}
