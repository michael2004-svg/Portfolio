"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { projects } from "./projects-data";

export default function ProjectsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = projects.find((p) => p.id === selectedId) ?? null;

  return (
    <section id="projects" className="w-full bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Selected Work</span>
          <h2 className="mt-4 font-display text-3xl text-ice sm:text-4xl md:text-5xl">
            Six products. Six different problems.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onClick={() => setSelectedId(project.id)} />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelectedId(null)} />
    </section>
  );
}