"use client";

import { motion } from "framer-motion";
import { PricingTier } from "./pricing-data";
import Button from "@/components/ui/Button";
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.06 }}
      className={cn(
        "relative flex flex-col rounded-2xl glass p-7 transition-transform duration-200 hover:-translate-y-1",
        tier.featured && "ring-1 ring-violet-300/30"
      )}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-7 rounded-full bg-violet-500 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-bg">
          Most Popular
        </span>
      )}
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">{tier.name}</span>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-display text-3xl text-ice sm:text-4xl">{tier.price}</span>
        {tier.price !== "Custom" && <span className="font-body text-sm text-muted">starting</span>}
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

      <Button variant={tier.featured ? "primary" : "ghost"} onClick={onBook} className="mt-8 w-full">
        Book This Service
      </Button>
    </motion.div>
  );
}
