import "server-only";
import { randomBytes } from "crypto";
import { db } from "./db";
import { sendMail, siteUrl } from "./mail";

export const newToken = () => randomBytes(24).toString("base64url");

export async function sendReviewRequest(name: string, email: string, reviewToken: string, projectTitle: string | null) {
  await sendMail({
    to: email,
    subject: "Could you share a quick review?",
    text: `Hi ${name.split(" ")[0]},\n\nThank you for working with me${projectTitle ? ` on ${projectTitle}` : ""}. If you have two minutes, a short review would mean a lot — it helps other businesses decide with confidence.`,
    link: { label: "Leave a review", url: siteUrl(`/review/${reviewToken}`) },
  });
}

// Creates (once) the review request attached to a project.
export async function ensureProjectReview(projectId: string) {
  const project = await db.project.findUniqueOrThrow({ where: { id: projectId }, include: { client: true, review: true } });
  if (project.review) return { project, review: project.review, created: false };
  const review = await db.review.create({
    data: {
      projectId,
      token: newToken(),
      email: project.client.email,
      name: project.client.name,
      role: project.client.company,
    },
  });
  return { project, review, created: true };
}
