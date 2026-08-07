"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";
import { projects } from "./projects-data";

export default function ProjectCarousel({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = projects.length;

  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);
  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4200);
    return () => clearInterval(id);
  }, [paused, next]);

  // circular offset so cards wrap around shortest path
  const getOffset = (index: number) => {
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <div
      className="relative h-[480px] w-full"
      style={{ perspective: "1400px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            offset={getOffset(i)}
            isActive={i === active}
            onClick={() => (i === active ? onSelect(project.id) : setActive(i))}
          />
        ))}
      </div>

      {/* controls */}
      <div className="absolute bottom-0 left-1/2 z-50 flex -translate-x-1/2 items-center gap-6">
        <button
          onClick={prev}
          aria-label="Previous project"
          className="font-mono text-xs text-muted transition-colors hover:text-violet-300"
        >
          ← PREV
        </button>
        <div className="flex gap-2">
          {projects.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to project ${i + 1}`}
              className="h-1.5 rounded-full bg-violet-300/30"
              animate={{
                width: i === active ? 24 : 8,
                backgroundColor: i === active ? "#C4B5FD" : "rgba(196,181,253,0.3)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next project"
          className="font-mono text-xs text-muted transition-colors hover:text-violet-300"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
