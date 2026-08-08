"use client";

import { motion } from "framer-motion";
import ProofCard from "./ProofCard";
import ConnectorLines from "./ConnectorLines";
import { proofItems } from "./proof-data";

export default function ProofSection() {
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
            The Evidence
          </span>
          <h2 className="mt-4 font-display text-5xl text-ice md:text-6xl">
            Not claims. Receipts.
          </h2>
          <p className="mt-4 font-body text-muted">
            Real payments, real dashboards, real numbers — from projects that
            shipped and got paid for.
          </p>
        </motion.div>
      </div>

      <div className="relative mx-auto h-[900px] w-full max-w-7xl px-6 md:h-[700px] md:px-12">
        <ConnectorLines items={proofItems} />
        {proofItems.map((item, i) => (
          <ProofCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
