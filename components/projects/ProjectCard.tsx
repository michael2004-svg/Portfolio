"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project } from "./projects-data";

export default function ProjectCard({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group overflow-hidden rounded-2xl glass text-left transition-transform duration-200 hover:-translate-y-1"
    >
      <div className={cn("aspect-video w-full bg-gradient-to-br", project.gradient)} />
      <div className="p-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
          {project.year} · {project.role}
        </span>
        <h3 className="mt-2 font-display text-xl text-ice">{project.title}</h3>
        <p className="mt-1 font-body text-sm text-muted">{project.tagline}</p>
      </div>
    </motion.button>
  );
}