"use client";

import { motion } from "framer-motion";
import { stats, reviews } from "./reviews-data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-violet-300" : "text-white/10"}>★</span>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section id="reviews" className="w-full bg-bg-elevated py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Track Record</span>
          <h2 className="mt-4 font-display text-3xl text-ice sm:text-4xl md:text-5xl">
            Not claims. Results.
          </h2>
        </motion.div>

        <div className="mb-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl glass p-5 text-center"
            >
              <div className="font-display text-2xl text-ice sm:text-3xl">{s.value}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
              className="rounded-2xl glass p-6"
            >
              <Stars rating={r.rating} />
              <p className="mt-4 font-body text-base text-ice/90">"{r.quote}"</p>
              <div className="mt-4">
                <div className="font-body text-sm font-medium text-ice">{r.name}</div>
                <div className="font-mono text-xs text-muted">{r.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}