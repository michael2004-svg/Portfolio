"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ContactLink({
  label,
  href,
  index,
  icon,
}: {
  label: string;
  href: string;
  index: number;
  icon: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-2xl glass px-6 py-8 text-center"
      )}
    >
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/0 to-magenta-500/0 opacity-0 blur-md transition-opacity duration-500 group-hover:from-violet-500/30 group-hover:to-magenta-500/20 group-hover:opacity-100" />
      <motion.div
        className="relative z-10 text-violet-300"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3 + index * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {icon}
      </motion.div>
      <span className="relative z-10 font-mono text-xs uppercase tracking-[0.2em] text-ice">
        {label}
      </span>
    </motion.a>
  );
}
