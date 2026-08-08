"use client";

import { motion } from "framer-motion";
import PricingCard from "./PricingCard";
import { pricingTiers } from "./pricing-data";

export default function PricingSection({
  onBook,
}: {
  onBook: (tierId: string) => void;
}) {
  return (
    <section className="relative w-full bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
            Investment
          </span>
          <h2 className="mt-4 font-display text-5xl text-ice md:text-6xl">
            Pick your scope.
          </h2>
          <p className="mt-4 font-body text-muted">
            Every project starts with a scope call — these are starting
            points, not final quotes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pricingTiers.map((tier, i) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              index={i}
              onBook={() => onBook(tier.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
