"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { BookingData, initialBookingData } from "./booking-types";
import { computeEstimate, Estimate } from "./estimate";
import {
  StepProjectType,
  StepBudget,
  StepDeadline,
  StepFeatures,
  StepInspiration,
  StepUploads,
  StepSummary,
} from "./BookingSteps";

const STEPS = ["type", "budget", "deadline", "features", "inspiration", "uploads", "summary"] as const;
const WHATSAPP_NUMBER = "254700000000"; // ⚠️ placeholder — replace with your real number

function buildWhatsAppMessage(data: BookingData, estimate: Estimate) {
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

export default function BookingWizard({ preselectTier, onClose }: { preselectTier: string | null; onClose: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<BookingData>({ ...initialBookingData, tierPreselect: preselectTier });

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 2;
  const estimate = useMemo(() => computeEstimate(data), [data]);
  const update = (patch: Partial<BookingData>) => setData((d) => ({ ...d, ...patch }));

  const canAdvance = () => {
    if (step === "type") return !!data.projectType;
    if (step === "budget") return !!data.budget;
    if (step === "deadline") return !!data.deadline;
    return true;
  };

  const next = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSend = () => {
    const msg = buildWhatsAppMessage(data, estimate);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    onClose();
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

        <div className="mb-8 flex gap-1.5">
          {STEPS.slice(0, -1).map((s, i) => (
            <div key={s} className={cn("h-1 flex-1 rounded-full", i <= stepIndex ? "bg-violet-300" : "bg-white/10")} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
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
            <button onClick={back} className="font-mono text-xs text-muted hover:text-ice">← Back</button>
          ) : (
            <span />
          )}

          {step !== "summary" ? (
            <Button onClick={next} className={cn(!canAdvance() && "pointer-events-none opacity-40")}>
              {isLast ? "Get Estimate" : "Continue"}
            </Button>
          ) : (
            <Button onClick={handleSend}>Send to Michael</Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
