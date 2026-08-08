"use client";

import { motion } from "framer-motion";
import { PricingTier } from "./pricing-data";
import MagneticButton from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

export default function PricingCard({
  tier,
  index,
  onBook,
}: {
  tier: PricingTier;
  index: number;
  onBook: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      whileHover={{ y: -10 }}
      className={cn(
        "group relative flex flex-col rounded-3xl glass p-8",
        tier.featured && "border-violet-300/40 ring-1 ring-violet-300/20"
      )}
    >
      {/* hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-violet-500/25 via-transparent to-magenta-500/20 blur-md" />

      {tier.featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-violet-500 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-bg">
          Most Popular
        </span>
      )}

      <div className="relative z-10">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
          {tier.name}
        </span>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-4xl text-ice">{tier.price}</span>
          {tier.price !== "Custom" && (
            <span className="font-body text-sm text-muted">starting</span>
          )}
        </div>
        <p className="mt-1 font-mono text-xs text-muted">{tier.timeline}</p>
        <p className="mt-4 font-body text-sm text-muted">{tier.description}</p>

        <ul className="mt-6 flex-1 space-y-3">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2 font-body text-sm text-ice/80">
              <span className="mt-1 text-violet-300">◆</span>
              {f}
            </li>
          ))}
        </ul>

        <MagneticButton
          variant={tier.featured ? "primary" : "ghost"}
          onClick={onBook}
          className="mt-8 w-full text-center"
        >
          Book This Service
        </MagneticButton>
      </div>
    </motion.div>
  );
}
