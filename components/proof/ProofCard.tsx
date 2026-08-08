"use client";

import { motion } from "framer-motion";
import { ProofItem } from "./proof-data";
import { useCountUp } from "./useCountUp";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "w-48 h-32",
  md: "w-60 h-40",
  lg: "w-72 h-48",
};

export default function ProofCard({ item, index }: { item: ProofItem; index: number }) {
  const { ref, value } = useCountUp(item.numericValue ?? 0);

  return (
    <motion.div
      className={cn(
        "absolute overflow-hidden rounded-2xl glass p-5",
        sizeMap[item.size]
      )}
      style={{ top: item.position.top, left: item.position.left, zIndex: 10 }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      whileHover={{ scale: 1.06, zIndex: 40 }}
    >
      <motion.div
        className={cn("absolute inset-0 bg-gradient-to-br", item.gradient)}
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 5 + (index % 3),
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        {item.kind === "metric" ? (
          <>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
              {item.label}
            </span>
            <div className="font-display text-3xl text-ice md:text-4xl">
              {item.prefix}
              <span ref={ref}>
                {item.numericValue && item.numericValue % 1 !== 0
                  ? value.toFixed(1)
                  : Math.round(value).toLocaleString()}
              </span>
              {item.suffix}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
                {item.source}
              </span>
              <span className="h-2 w-2 rounded-full bg-violet-300/70" />
            </div>
            <div className="mt-2 h-full flex-1 rounded-lg border border-white/5 bg-bg-elevated/50" />
            <p className="mt-2 font-body text-xs text-muted line-clamp-1">
              {item.label}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
