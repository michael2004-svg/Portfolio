"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "./projects-data";
import { cn } from "@/lib/utils";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[200] overflow-y-auto bg-bg/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            layoutId={`card-${project.id}`}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto my-16 w-[92%] max-w-4xl overflow-hidden rounded-3xl glass"
          >
            {/* hero image */}
            <div className={cn("relative h-72 w-full bg-gradient-to-br", project.gradient)}>
              <div className="absolute inset-0 bg-bg/20" />
              <button
                onClick={onClose}
                aria-label="Close case study"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full glass font-mono text-ice hover:text-violet-300"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
                  {project.year} · {project.role}
                </span>
                <h2 className="mt-2 font-display text-4xl text-ice">{project.title}</h2>
              </div>
            </div>

            <div className="space-y-10 px-8 py-10">
              <p className="max-w-2xl font-body text-lg text-muted">{project.description}</p>

              {/* metrics */}
              <div className="flex flex-wrap gap-8">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-3xl text-ice">{m.value}</div>
                    <div className="font-mono text-[11px] uppercase tracking-wide text-muted">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* tech tags */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full glass px-3 py-1 font-mono text-xs text-violet-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* case study */}
              <div className="grid gap-8 md:grid-cols-3">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
                    Overview
                  </h4>
                  <p className="mt-3 font-body text-sm text-muted">
                    {project.caseStudy.overview}
                  </p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
                    Architecture
                  </h4>
                  <p className="mt-3 font-body text-sm text-muted">
                    {project.caseStudy.architecture}
                  </p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
                    Challenge
                  </h4>
                  <p className="mt-3 font-body text-sm text-muted">
                    {project.caseStudy.challenge}
                  </p>
                </div>
              </div>

              {/* screenshot placeholder gallery */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={cn(
                      "aspect-video rounded-xl bg-gradient-to-br opacity-40",
                      project.gradient
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
