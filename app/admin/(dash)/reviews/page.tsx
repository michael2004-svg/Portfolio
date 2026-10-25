import { db } from "@/lib/db";
import { Badge, Card, Empty, Field, inputCls, btnCls, ghostBtnCls, dangerBtnCls, fmtDate } from "@/components/admin/ui";
import ActionForm from "@/components/admin/ActionForm";
import { moderateReview, requestReviewByEmail } from "../../actions";

const ORDER = ["pending", "approved", "requested", "rejected"];

export default async function ReviewsAdminPage() {
  const reviews = await db.review.findMany({ orderBy: { createdAt: "desc" }, include: { project: true } });
  reviews.sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-4">
        <h1 className="font-display text-3xl text-ice">Reviews</h1>
        <p className="font-body text-sm text-muted">
          Approved reviews appear in the portfolio&apos;s Track Record section and on the booking page&apos;s testimonials.
        </p>
        {reviews.length === 0 && <Empty>No reviews yet. Request one on the right or from a project.</Empty>}
        {reviews.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display text-lg text-ice">{r.name}</h2>
                  <Badge status={r.status} />
                </div>
                <p className="font-body text-sm text-muted">
                  {r.role ?? "—"}
                  {r.project && ` · ${r.project.title}`}
                  {r.submittedAt && ` · submitted ${fmtDate(r.submittedAt)}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.quote && r.status !== "approved" && (
                  <form action={moderateReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="action" value="approve" />
                    <button className={btnCls}>Approve</button>
                  </form>
                )}
                {r.quote && r.status !== "rejected" && (
                  <form action={moderateReview}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="action" value="reject" />
                    <button className={ghostBtnCls}>{r.status === "approved" ? "Unpublish" : "Reject"}</button>
                  </form>
                )}
                <form action={moderateReview}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="action" value="delete" />
                  <button className={dangerBtnCls}>Delete</button>
                </form>
              </div>
            </div>

            {r.quote ? (
              <blockquote className="mt-4 rounded-xl bg-bg p-4 font-body text-sm text-ice/90">
                <span className="text-violet-300">{"★".repeat(r.rating ?? 0)}</span>
                <span className="text-white/10">{"★".repeat(5 - (r.rating ?? 0))}</span>
                <p className="mt-2">“{r.quote}”</p>
              </blockquote>
            ) : (
              <p className="mt-3 font-body text-sm text-muted">Waiting for {r.email ?? "the client"} to respond.</p>
            )}

            {r.quote && (
              <form action={moderateReview} className="mt-4 flex flex-wrap items-center gap-4 font-body text-sm text-muted">
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="action" value="placement" />
                <label className="flex items-center gap-2"><input type="checkbox" name="showOnPortfolio" defaultChecked={r.showOnPortfolio} /> Portfolio</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="showOnBooking" defaultChecked={r.showOnBooking} /> Booking page</label>
                <button className={ghostBtnCls}>Save placement</button>
              </form>
            )}
          </Card>
        ))}
      </div>

      <div>
        <Card title="Request a review" className="lg:sticky lg:top-24">
          <p className="mb-4 font-body text-sm text-muted">For past clients who aren&apos;t in the portal — they get an email with a one-click review link.</p>
          <ActionForm action={requestReviewByEmail} submitLabel="Send request" successText="Request sent. Link:">
            <Field label="Name"><input name="name" required className={inputCls} /></Field>
            <Field label="Email"><input name="email" type="email" required className={inputCls} /></Field>
            <Field label="Role / company (optional)"><input name="role" placeholder="Founder, Acme Ltd" className={inputCls} /></Field>
          </ActionForm>
        </Card>
      </div>
    </div>
  );
}
