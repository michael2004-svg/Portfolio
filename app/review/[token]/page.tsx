import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ReviewForm from "@/components/portal/ReviewForm";

export const metadata: Metadata = { title: "Leave a review — Michael Musyoka", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: { token: string } }) {
  const review = await db.review.findUnique({ where: { token: params.token }, include: { project: true } });
  if (!review) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-bg-elevated p-6 sm:p-8">
        <a href="/" className="font-display text-xl text-ice">
          M<span className="text-violet-300">.</span>
        </a>
        <h1 className="mt-6 font-display text-2xl text-ice">How was working together?</h1>
        <p className="mt-1 mb-6 font-body text-sm text-muted">
          {review.project ? `For ${review.project.title}. ` : ""}A couple of honest sentences is perfect — it helps other businesses decide.
        </p>
        {review.status === "approved" ? (
          <p className="font-body text-sm text-emerald-300">Your review is already published. Thank you!</p>
        ) : (
          <ReviewForm token={review.token} defaults={{ name: review.name, role: review.role, rating: review.rating, quote: review.quote }} />
        )}
      </div>
    </main>
  );
}
