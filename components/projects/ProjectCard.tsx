"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Project } from "./projects-data";
import { cn } from "@/lib/utils";

export default function ProjectCard({
  project,
  offset,
  isActive,
  onClick,
}: {
  project: Project;
  offset: number; // distance from active index, can be negative
  isActive: boolean;
  onClick: () => void;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const absOffset = Math.abs(offset);
  const translateX = offset * 240;
  const translateZ = -absOffset * 160;
  const rotateYBase = offset * -28;
  const scale = 1 - absOffset * 0.14;
  const opacity = absOffset > 3 ? 0 : 1 - absOffset * 0.22;
  const blur = absOffset * 1.4;

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      className="absolute left-1/2 top-1/2 h-[380px] w-[300px] cursor-pointer"
      style={{
        x: "-50%",
        y: "-50%",
        zIndex: 100 - Math.round(absOffset),
      }}
      animate={{
        x: `calc(-50% + ${translateX}px)`,
        z: translateZ,
        rotateY: rotateYBase,
        scale,
        opacity,
        filter: `blur(${blur}px)`,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 22 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <motion.div
        style={isActive ? { rotateX, rotateY } : undefined}
        className={cn(
          "group relative h-full w-full overflow-hidden rounded-3xl glass",
          "shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)]"
        )}
      >
        {/* animated gradient border glow */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br opacity-40 blur-[1px]",
            project.gradient
          )}
          style={{ mixBlendMode: "screen" }}
        />

        {/* thumbnail area */}
        <div className={cn("relative h-2/3 w-full bg-gradient-to-br", project.gradient)}>
          <div className="absolute inset-0 bg-bg/30" />
          {/* reflection sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* info area */}
        <div className="relative flex h-1/3 flex-col justify-center gap-1 px-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
            {project.year} · {project.role}
          </span>
          <h3 className="font-display text-xl text-ice">{project.title}</h3>
          <p className="font-body text-xs text-muted line-clamp-1">{project.tagline}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
