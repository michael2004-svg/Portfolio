"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortraitStack from "./PortraitStack";
import { testimonials } from "./testimonials-data";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? "text-violet-300" : "text-white/10"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [activeId, setActiveId] = useState(testimonials[0].id);
  const active = testimonials.find((t) => t.id === activeId)!;

  return (
    <section className="relative w-full overflow-hidden bg-bg-elevated py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
            What Clients Say
          </span>
          <h2 className="mt-4 font-display text-5xl text-ice md:text-6xl">
            Hover a face, read the story.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="flex justify-center">
            <PortraitStack
              testimonials={testimonials}
              activeId={activeId}
              onHover={setActiveId}
            />
          </div>

          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Stars rating={active.rating} />
                <blockquote className="mt-5 font-display text-2xl leading-snug text-ice md:text-3xl">
                  &quot;{active.quote}&quot;
                </blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <div>
                    <div className="font-body text-sm font-medium text-ice">
                      {active.name}
                    </div>
                    <div className="font-mono text-xs text-muted">
                      {active.role} · {active.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* logo strip */}
            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/5 pt-8 opacity-60">
              {testimonials.map((t) => (
                <span
                  key={t.id}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
                >
                  {t.company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
