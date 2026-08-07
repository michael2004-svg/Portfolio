"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCarousel from "./ProjectCarousel";
import ProjectModal from "./ProjectModal";
import { projects } from "./projects-data";

export default function ProjectsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

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
            Selected Work
          </span>
          <h2 className="mt-4 font-display text-5xl text-ice md:text-6xl">
            Six products. Six different problems.
          </h2>
          <p className="mt-4 font-body text-muted">
            Click a card to open the full case study — architecture,
            challenges, and what shipped.
          </p>
        </motion.div>
      </div>

      <ProjectCarousel onSelect={setSelectedId} />
      <ProjectModal project={selected} onClose={() => setSelectedId(null)} />
    </section>
  );
}
