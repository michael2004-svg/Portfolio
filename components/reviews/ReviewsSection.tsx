"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { stats, proofs, GITHUB_URL } from "./reviews-data";
import type { Testimonial } from "@/lib/reviews";

export default function ReviewsSection({ testimonials }: { testimonials: Testimonial[] }) {
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
          <p className="mt-4 font-body text-muted">
            Everything here is checkable — live products, real orders, and the commit history behind them.
          </p>
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

        <motion.a
          href={GITHUB_URL}
          data-track="github_graph"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="group mb-14 block rounded-2xl glass p-6 transition-colors hover:border-violet-300/40 sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-violet-300">Shipping Every Week</span>
              <h3 className="mt-2 font-display text-2xl text-ice sm:text-3xl">516 contributions in the last year</h3>
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-muted group-hover:text-violet-300">
              View on GitHub →
            </span>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl bg-white p-2 sm:p-3">
            <Image
              src="/images/github-contributions.png"
              alt="GitHub contribution graph showing 516 contributions in the last year"
              width={950}
              height={330}
              sizes="(min-width: 1280px) 1150px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </motion.a>

        <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Proof of Work</span>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {proofs.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl glass p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">● Live</span>
              <h3 className="mt-3 font-display text-lg text-ice">{p.title}</h3>
              <p className="mt-2 font-body text-sm text-muted">{p.detail}</p>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 0 && (
          <>
            <span className="mt-14 block font-mono text-xs uppercase tracking-[0.25em] text-violet-300">What Clients Say</span>
            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {testimonials.map((t, i) => (
                <motion.figure
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (i % 2) * 0.08 }}
                  className="rounded-2xl glass p-6"
                >
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className={s < t.rating ? "text-violet-300" : "text-white/10"}>★</span>
                    ))}
                  </div>
                  <blockquote className="mt-4 font-body text-base text-ice/90">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-4">
                    <div className="font-body text-sm font-medium text-ice">{t.name}</div>
                    {t.role && <div className="font-mono text-xs text-muted">{t.role}</div>}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
