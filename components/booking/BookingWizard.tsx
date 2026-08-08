"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { BookingData, initialBookingData } from "./booking-types";
import { computeEstimate } from "./estimate";
import {
  StepProjectType,
  StepBudget,
  StepDeadline,
  StepFeatures,
  StepInspiration,
  StepUploads,
  StepSummary,
} from "./BookingSteps";

const STEPS = [
  "type",
  "budget",
  "deadline",
  "features",
  "inspiration",
  "uploads",
  "summary",
] as const;

// add near the top of BookingWizard.tsx
const WHATSAPP_NUMBER = "254700000000"; // ⚠️ same placeholder as ContactSection — keep in sync, or move to a shared config file

function buildWhatsAppMessage(data: BookingData, estimate: ReturnType<typeof computeEstimate>) {
  const lines = [
    `New project inquiry`,
    `Type: ${data.projectType ?? "—"}`,
    `Budget: ${data.budget ?? "—"}`,
    `Deadline: ${data.deadline ?? "—"}`,
    `Features: ${data.features.join(", ") || "none"}`,
    data.inspiration ? `Inspiration: ${data.inspiration}` : null,
    `Estimated complexity: ${estimate.complexity}`,
    `Estimated timeline: ${estimate.timeline}`,
    `Suggested budget: ${estimate.suggestedBudget}`,
  ].filter(Boolean);
  return encodeURIComponent(lines.join("\n"));
}

// replace the final "Send to Michael" button's onClick:
<MagneticButton
  variant="primary"
  onClick={() => {
    const msg = buildWhatsAppMessage(data, estimate);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    onClose();
  }}
>
  Send to Michael
</MagneticButton>
export default function BookingWizard({
  preselectTier,
  onClose,
}: {
  preselectTier: string | null;
  onClose: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<BookingData>({
    ...initialBookingData,
    tierPreselect: preselectTier,
  });
  const [submitted, setSubmitted] = useState(false);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 2; // uploads is last input step
  const estimate = useMemo(() => computeEstimate(data), [data]);

  const update = (patch: Partial<BookingData>) => setData((d) => ({ ...d, ...patch }));

  const canAdvance = () => {
    if (step === "type") return !!data.projectType;
    if (step === "budget") return !!data.budget;
    if (step === "deadline") return !!data.deadline;
    return true;
  };

  const next = () => {
    if (isLast) setSubmitted(true);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl glass p-8 md:p-10"
      >
        <button
          onClick={onClose}
          aria-label="Close booking wizard"
          className="absolute right-6 top-6 font-mono text-muted hover:text-violet-300"
        >
          ✕
        </button>

        {/* progress bar */}
        <div className="mb-8 flex gap-1.5">
          {STEPS.slice(0, -1).map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-colors",
                i <= stepIndex ? "bg-violet-300" : "bg-white/10"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
          >
            {step === "type" && <StepProjectType data={data} update={update} />}
            {step === "budget" && <StepBudget data={data} update={update} />}
            {step === "deadline" && <StepDeadline data={data} update={update} />}
            {step === "features" && <StepFeatures data={data} update={update} />}
            {step === "inspiration" && <StepInspiration data={data} update={update} />}
            {step === "uploads" && <StepUploads data={data} update={update} />}
            {step === "summary" && <StepSummary data={data} estimate={estimate} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between">
          {stepIndex > 0 && stepIndex < STEPS.length - 1 ? (
            <button
              onClick={back}
              className="font-mono text-xs text-muted hover:text-ice"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}

          {step !== "summary" ? (
            <MagneticButton
              variant="primary"
              onClick={next}
              className={cn(!canAdvance() && "pointer-events-none opacity-40")}
            >
              {isLast ? "Get Estimate" : "Continue"}
            </MagneticButton>
          ) : (
            <MagneticButton variant="primary" onClick={onClose}>
              Send to Michael
            </MagneticButton>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
