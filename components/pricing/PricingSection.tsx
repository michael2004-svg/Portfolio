"use client";

import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import { pricingTiers } from "./pricing-data";

export default function PricingSection({ onBook }: { onBook: (tierId: string) => void }) {
  return (
    <section id="pricing" className="w-full bg-bg-elevated py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Investment</span>
          <h2 className="mt-4 font-display text-3xl text-ice sm:text-4xl md:text-5xl">Pick your scope.</h2>
          <p className="mt-4 font-body text-muted">Every project starts with a scope call — these are starting points, not final quotes.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <PricingCard key={tier.id} tier={tier} index={i} onBook={() => onBook(tier.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
