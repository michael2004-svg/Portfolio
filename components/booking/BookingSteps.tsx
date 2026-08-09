"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookingData, PROJECT_TYPES, FEATURE_OPTIONS, BudgetRange, Deadline } from "./booking-types";
import { Estimate } from "./estimate";

const fieldShell = "space-y-4";
const heading = "font-display text-xl text-ice sm:text-2xl";
const sub = "font-body text-sm text-muted";

function OptionCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-2xl glass px-4 py-3.5 text-left font-body text-sm transition-colors",
        selected ? "border-violet-300 bg-violet-500/10 text-ice ring-1 ring-violet-300/50" : "text-muted hover:text-ice"
      )}
    >
      {label}
    </button>
  );
}

export function StepProjectType({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  return (
    <div className={fieldShell}>
      <h3 className={heading}>What are we building?</h3>
      <p className={sub}>Pick the closest match — we&apos;ll refine scope on the call.</p>
      <div className="grid grid-cols-2 gap-3">
        {PROJECT_TYPES.map((t) => (
          <OptionCard key={t.id} label={t.label} selected={data.projectType === t.id} onClick={() => update({ projectType: t.id })} />
        ))}
      </div>
    </div>
  );
}

const BUDGET_OPTIONS: { id: BudgetRange; label: string }[] = [
  { id: "under-500", label: "Under $500" },
  { id: "500-2000", label: "$500 – $2,000" },
  { id: "2000-6000", label: "$2,000 – $6,000" },
  { id: "6000-plus", label: "$6,000+" },
  { id: "not-sure", label: "Not sure yet" },
];

export function StepBudget({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  return (
    <div className={fieldShell}>
      <h3 className={heading}>What&apos;s the budget range?</h3>
      <p className={sub}>Ballpark is fine — this just shapes the proposal.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BUDGET_OPTIONS.map((b) => (
          <OptionCard key={b.id} label={b.label} selected={data.budget === b.id} onClick={() => update({ budget: b.id })} />
        ))}
      </div>
    </div>
  );
}

const DEADLINE_OPTIONS: { id: Deadline; label: string }[] = [
  { id: "asap", label: "ASAP" },
  { id: "1-month", label: "Within a month" },
  { id: "1-3-months", label: "1–3 months" },
  { id: "flexible", label: "Flexible" },
];

export function StepDeadline({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  return (
    <div className={fieldShell}>
      <h3 className={heading}>When do you need this live?</h3>
      <div className="grid grid-cols-2 gap-3">
        {DEADLINE_OPTIONS.map((d) => (
          <OptionCard key={d.id} label={d.label} selected={data.deadline === d.id} onClick={() => update({ deadline: d.id })} />
        ))}
      </div>
    </div>
  );
}

export function StepFeatures({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  const toggle = (feature: string) => {
    const has = data.features.includes(feature);
    update({ features: has ? data.features.filter((f) => f !== feature) : [...data.features, feature] });
  };
  return (
    <div className={fieldShell}>
      <h3 className={heading}>Any of these needed?</h3>
      <p className={sub}>Select all that apply — skip if none.</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {FEATURE_OPTIONS.map((f) => (
          <OptionCard key={f} label={f} selected={data.features.includes(f)} onClick={() => toggle(f)} />
        ))}
      </div>
    </div>
  );
}

export function StepInspiration({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  return (
    <div className={fieldShell}>
      <h3 className={heading}>Any inspiration or references?</h3>
      <p className={sub}>Sites you like, competitors, a rough vision — optional.</p>
      <textarea
        value={data.inspiration}
        onChange={(e) => update({ inspiration: e.target.value })}
        rows={5}
        placeholder="e.g. something like Linear's landing page, but warmer..."
        className="w-full resize-none rounded-2xl glass px-4 py-3.5 font-body text-sm text-ice placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-violet-300/50"
      />
    </div>
  );
}

export function StepUploads({ data, update }: { data: BookingData; update: (p: Partial<BookingData>) => void }) {
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(e.target.files ?? []).map((f) => f.name);
    update({ fileNames: [...data.fileNames, ...names] });
  };
  return (
    <div className={fieldShell}>
      <h3 className={heading}>Anything to attach?</h3>
      <p className={sub}>Briefs, mockups, brand assets — optional.</p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl glass px-5 py-8 text-center hover:border-violet-300/50">
        <span className="font-mono text-xs uppercase tracking-wide text-violet-300">Click to upload</span>
        <input type="file" multiple className="hidden" onChange={handleFiles} />
      </label>
      {data.fileNames.length > 0 && (
        <ul className="space-y-1">
          {data.fileNames.map((name) => (
            <li key={name} className="font-mono text-xs text-muted">· {name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function StepSummary({ data, estimate }: { data: BookingData; estimate: Estimate }) {
  return (
    <div className={fieldShell}>
      <h3 className={heading}>Here&apos;s the estimate.</h3>
      <p className={sub}>This is a starting point — we&apos;ll firm it up on a call.</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl glass p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Complexity</span>
          <div className="mt-2 font-display text-xl text-ice sm:text-2xl">{estimate.complexity}</div>
        </div>
        <div className="rounded-2xl glass p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Timeline</span>
          <div className="mt-2 font-display text-xl text-ice sm:text-2xl">{estimate.timeline}</div>
        </div>
        <div className="col-span-2 rounded-2xl glass p-5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-violet-300">Suggested budget</span>
          <div className="mt-2 font-display text-xl text-ice sm:text-2xl">{estimate.suggestedBudget}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-bg-elevated/50 p-5">
        <p className="font-body text-sm text-muted">{estimate.summary}</p>
      </div>
    </div>
  );
}
