"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import CalendlyInline from "./CalendlyInline";
import { CALENDLY_URL } from "@/lib/contact";
import { track, visitorId } from "@/lib/analytics-client";
import { BUILD_TYPES, STAGES, TIMELINES, BUDGETS } from "./content";

type Form = { type: string; details: string; stage: string; timeline: string; budget: string; name: string; email: string; phone: string; company_website: string };

const TOTAL = 4;

function Options({ options, value, onPick, cols = 2 }: { options: string[]; value: string; onPick: (v: string) => void; cols?: number }) {
  return (
    <div className={cn("grid gap-2.5", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onPick(o)} className={cn("qual-option border-hairline bg-surface-2 rounded-lg px-4 py-3 text-left text-sm", value === o && "selected")}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function BookingModal({ initialType, onClose }: { initialType: string | null; onClose: () => void }) {
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [f, setF] = useState<Form>({ type: initialType ?? "", details: "", stage: "", timeline: "", budget: "", name: "", email: "", phone: "", company_website: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (patch: Partial<Form>) => setF((x) => ({ ...x, ...patch }));

  useEffect(() => {
    track("booking", "click", `modal_step_${step}`);
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const valid =
    (step === 1 && !!f.type) ||
    step === 2 ||
    (step === 3 && !!f.timeline && !!f.budget) ||
    (step === 4 && !!f.name.trim() && /^\S+@\S+\.\S+$/.test(f.email));

  async function submit() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: "booking",
          name: f.name,
          email: f.email,
          phone: f.phone,
          projectType: f.type,
          stage: f.stage,
          deadline: f.timeline,
          budget: f.budget,
          details: f.details,
          company_website: f.company_website,
          visitorId: visitorId(),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Something went wrong — please try again.");
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const next = () => (step === 4 ? submit() : setStep((s) => s + 1));
  const calendly = `${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1&name=${encodeURIComponent(f.name)}&email=${encodeURIComponent(f.email)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Book a consultation"
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-hairline relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl p-6"
      >
        <button onClick={onClose} aria-label="Close" className="muted absolute right-4 top-4 text-xl leading-none hover:text-white">×</button>

        {step <= TOTAL && (
          <>
            <div className="font-mono muted text-xs">Step {step} of {TOTAL}</div>
            <div className="mt-2 mb-6 flex gap-1.5">
              {Array.from({ length: TOTAL }).map((_, i) => (
                <div key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-[var(--lime)]" : "bg-[var(--border)]")} />
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="font-display mb-5 text-xl font-bold">What are you looking to build?</h3>
            <Options options={BUILD_TYPES} value={f.type} onPick={(type) => { set({ type }); setStep(2); }} />
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="font-display text-xl font-bold">Tell us about the project.</h3>
            <p className="muted mt-1 mb-4 text-sm">A sentence or two is plenty — we&apos;ll go deeper on the call.</p>
            <textarea
              value={f.details}
              onChange={(e) => set({ details: e.target.value })}
              rows={4}
              placeholder="What should it do, and who is it for?"
              className="lp-input resize-none"
            />
            <div className="font-mono muted mt-5 mb-2 text-[11px] uppercase tracking-widest">Current stage</div>
            <Options options={STAGES} value={f.stage} onPick={(stage) => set({ stage })} />
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="font-display mb-4 text-xl font-bold">Timeline &amp; budget</h3>
            <div className="font-mono muted mb-2 text-[11px] uppercase tracking-widest">Expected timeline</div>
            <Options options={TIMELINES} value={f.timeline} onPick={(timeline) => set({ timeline })} />
            <div className="font-mono muted mt-5 mb-2 text-[11px] uppercase tracking-widest">Approximate budget</div>
            <Options options={BUDGETS} value={f.budget} onPick={(budget) => set({ budget })} cols={1} />
          </>
        )}

        {step === 4 && (
          <>
            <h3 className="font-display text-xl font-bold">Where should we send next steps?</h3>
            <p className="muted mt-1 mb-4 text-sm">You&apos;ll pick a call time right after this.</p>
            <div className="space-y-3">
              <input value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Full name" autoComplete="name" className="lp-input" />
              <input value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="Email" type="email" autoComplete="email" className="lp-input" />
              <input value={f.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="Phone / WhatsApp (optional)" type="tel" autoComplete="tel" className="lp-input" />
              {/* Honeypot: hidden from people, filled by bots. */}
              <input value={f.company_website} onChange={(e) => set({ company_website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            </div>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          </>
        )}

        {step === 5 && (
          <>
            <h3 className="font-display text-xl font-bold">
              Thanks, {f.name.split(" ")[0]}. <span className="lime">Now pick a time.</span>
            </h3>
            <p className="muted mt-1 mb-4 text-sm">Your details are saved — choose a 30-minute slot below.</p>
            <CalendlyInline url={calendly} />
          </>
        )}

        {step >= 2 && step <= TOTAL && (
          <div className="mt-6 flex items-center justify-between">
            <button type="button" onClick={() => setStep((s) => s - 1)} className="muted text-sm hover:text-white">← Back</button>
            <button type="button" onClick={next} disabled={!valid || sending} data-track={step === 4 ? "modal_submit" : undefined} className="btn-primary rounded-lg px-5 py-2.5 text-sm">
              {step === 4 ? (sending ? "Saving…" : "Continue to booking →") : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
