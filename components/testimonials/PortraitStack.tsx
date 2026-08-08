"use client";

import { motion } from "framer-motion";
import { Testimonial } from "./testimonials-data";
import { cn } from "@/lib/utils";

export default function PortraitStack({
  testimonials,
  activeId,
  onHover,
}: {
  testimonials: Testimonial[];
  activeId: string;
  onHover: (id: string) => void;
}) {
  return (
    <div className="relative h-[420px] w-full max-w-sm">
      {testimonials.map((t, i) => {
        const isActive = t.id === activeId;
        const activeIndex = testimonials.findIndex((x) => x.id === activeId);
        const relIndex = i - activeIndex;

        return (
          <motion.div
            key={t.id}
            layout
            onMouseEnter={() => onHover(t.id)}
            className="absolute left-1/2 top-1/2 cursor-pointer"
            style={{ zIndex: isActive ? 50 : 30 - Math.abs(relIndex) }}
            animate={{
              x: `calc(-50% + ${relIndex * 46}px)`,
              y: `calc(-50% + ${relIndex * 18}px)`,
              scale: isActive ? 1 : 0.82,
              filter: isActive ? "grayscale(0)" : "grayscale(0.4) brightness(0.6)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            <div
              className={cn(
                "relative h-40 w-40 overflow-hidden rounded-full border-4 bg-gradient-to-br shadow-2xl md:h-48 md:w-48",
                t.gradient,
                isActive ? "border-violet-300" : "border-bg-elevated"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center font-display text-5xl text-bg/40">
                {t.logoInitial}
              </div>
              {isActive && (
                <motion.div
                  layoutId="portrait-ring"
                  className="absolute -inset-1 rounded-full border-2 border-violet-300/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
