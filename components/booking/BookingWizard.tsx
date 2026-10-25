"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/contact";
import { visitorId } from "@/lib/analytics-client";
import { BookingData, PROJECT_TYPES, initialBookingData } from "./booking-types";
import { computeEstimate } from "./estimate";
import {
  StepScope,
  StepDetails,
  StepSummary,
  BUDGET_OPTIONS,
  DEADLINE_OPTIONS,
} from "./BookingSteps";

const STEPS = ["scope", "details", "summary"] as const;

const label = <T extends { id: string; label: string }>(opts: T[], id: string | null) =>
  opts.find((o) => o.id === id)?.label ?? null;

export default function BookingWizard({ preselectTier, onClose }: { preselectTier: string | null; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<BookingData>({
    ...initialBookingData,
    tierPreselect: preselectTier,
    projectType: PROJECT_TYPES.find((t) => t.id === preselectTier)?.id ?? null,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 2;
  const estimate = useMemo(() => computeEstimate(data), [data]);
  const update = (patch: Partial<BookingData>) => setData((d) => ({ ...d, ...patch }));

  const canAdvance = () => {
    if (step === "scope") return !!data.projectType && !!data.budget && !!data.deadline;
    if (step === "details") return true;
    return !!data.name.trim() && /\S+@\S+\.\S+/.test(data.email);
  };

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSend = async () => {
    if (!canAdvance() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: "portfolio",
          name: data.name,
          email: data.email,
          phone: data.phone,
          projectType: label(PROJECT_TYPES, data.projectType),
          budget: label(BUDGET_OPTIONS, data.budget),
          deadline: label(DEADLINE_OPTIONS, data.deadline),
          features: data.features,
          details: [data.inspiration, data.fileNames.length ? `Files to share: ${data.fileNames.join(", ")}` : ""]
            .filter(Boolean)
            .join("\n\n"),
          estimate,
          visitorId: visitorId(),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Something went wrong.");
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl glass p-6 sm:p-10"
      >
        <button onClick={onClose} aria-label="Close booking wizard" className="absolute right-5 top-5 font-mono text-muted hover:text-violet-300">
          ✕
        </button>

        {sent ? (
          <div className="space-y-5 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-2xl text-violet-300">✓</div>
            <h3 className="font-display text-2xl text-ice">Got it, {data.name.split(" ")[0]}.</h3>
            <p className="font-body text-sm text-muted">
              Your project details are with Michael — expect a reply at {data.email} within one business day.
              Want to lock in a time now?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href={CALENDLY_URL} track="wizard_success_calendly">Pick a Call Time</Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s} className={cn("h-1 flex-1 rounded-full", i <= stepIndex ? "bg-violet-300" : "bg-white/10")} />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {step === "scope" && <StepScope data={data} update={update} />}
                {step === "details" && <StepDetails data={data} update={update} />}
                {step === "summary" && <StepSummary data={data} estimate={estimate} update={update} />}
              </motion.div>
            </AnimatePresence>

            {error && <p className="mt-4 font-body text-sm text-magenta-500">{error}</p>}

            <div className="mt-8 flex items-center justify-between">
              {stepIndex > 0 ? (
                <button onClick={back} className="font-mono text-xs text-muted hover:text-ice">← Back</button>
              ) : (
                <span />
              )}

              {step !== "summary" ? (
                <Button onClick={next} track={`wizard_step_${step}`} disabled={!canAdvance()}>
                  {isLast ? "Review Estimate" : "Continue"}
                </Button>
              ) : (
                <Button onClick={handleSend} track="wizard_submit" disabled={!canAdvance() || sending}>
                  {sending ? "Sending…" : "Send to Michael"}
                </Button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
