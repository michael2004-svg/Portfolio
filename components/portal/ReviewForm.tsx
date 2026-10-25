"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { submitReview } from "@/app/review/actions";
import { inputCls, btnCls, Field } from "@/components/admin/ui";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={btnCls}>
      {pending ? "Sending…" : "Submit review"}
    </button>
  );
}

export default function ReviewForm({
  token,
  defaults,
}: {
  token: string;
  defaults: { name: string; role: string | null; rating: number | null; quote: string | null };
}) {
  const [state, action] = useFormState(submitReview, undefined);
  const [rating, setRating] = useState(defaults.rating ?? 0);

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6 text-center">
        <p className="font-display text-xl text-ice">Thank you!</p>
        <p className="mt-1 font-body text-sm text-muted">Your review has been received and will appear on the site once it&apos;s published.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="rating" value={rating} />
      <div>
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">Rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              onClick={() => setRating(n)}
              className={`text-3xl transition-colors ${n <= rating ? "text-violet-300" : "text-white/15 hover:text-white/40"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Field label="Your review">
        <textarea
          name="quote"
          rows={5}
          required
          defaultValue={defaults.quote ?? ""}
          placeholder="What problem did we solve, and what changed for your business afterwards?"
          className={inputCls}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name to display"><input name="name" required defaultValue={defaults.name} className={inputCls} /></Field>
        <Field label="Role & company"><input name="role" defaultValue={defaults.role ?? ""} placeholder="Founder, Acme Ltd" className={inputCls} /></Field>
      </div>
      {state?.error && <p className="font-body text-sm text-red-300">{state.error}</p>}
      <Submit />
    </form>
  );
}
