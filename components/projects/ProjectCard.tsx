"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Project } from "./projects-data";

export function StatusPill({ status }: { status: Project["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur",
        status === "Live" ? "bg-emerald-500/15 text-emerald-300" : "bg-white/10 text-muted"
      )}
    >
      {status === "Live" ? "● Live" : status}
    </span>
  );
}

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
      data-track={`project_${project.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group overflow-hidden rounded-2xl glass text-left transition-transform duration-200 hover:-translate-y-1"
    >
      <div className={cn("relative aspect-video w-full overflow-hidden bg-gradient-to-br", project.gradient)}>
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute right-3 top-3">
          <StatusPill status={project.status} />
        </div>
      </div>
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
