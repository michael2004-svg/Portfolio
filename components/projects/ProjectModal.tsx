"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project } from "./projects-data";

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
          className="fixed inset-0 z-[200] overflow-y-auto bg-bg/90 p-4 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto my-10 w-full max-w-3xl overflow-hidden rounded-2xl glass"
          >
            <div className={cn("relative h-48 w-full bg-gradient-to-br sm:h-64", project.gradient)}>
              <button
                onClick={onClose}
                aria-label="Close case study"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full glass text-ice hover:text-violet-300"
              >
                ✕
              </button>
              <div className="absolute bottom-5 left-5 right-5">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">
                  {project.year} · {project.role}
                </span>
                <h2 className="mt-2 font-display text-2xl text-ice sm:text-3xl">{project.title}</h2>
              </div>
            </div>

            <div className="space-y-8 px-6 py-8 sm:px-8">
              <p className="font-body text-base text-muted sm:text-lg">{project.description}</p>

              <div className="flex flex-wrap gap-6">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-2xl text-ice">{m.value}</div>
                    <div className="font-mono text-[11px] uppercase tracking-wide text-muted">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-full glass px-3 py-1 font-mono text-xs text-violet-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">Overview</h4>
                  <p className="mt-3 font-body text-sm text-muted">{project.caseStudy.overview}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">Architecture</h4>
                  <p className="mt-3 font-body text-sm text-muted">{project.caseStudy.architecture}</p>
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">Challenge</h4>
                  <p className="mt-3 font-body text-sm text-muted">{project.caseStudy.challenge}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}