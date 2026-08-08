"use client";

import { motion } from "framer-motion";
import { ProofItem, connections } from "./proof-data";

export default function ConnectorLines({ items }: { items: ProofItem[] }) {
  const getCenter = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return { x: 0, y: 0 };
    return {
      x: parseFloat(item.position.left),
      y: parseFloat(item.position.top),
    };
  };

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C026D3" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      {connections.map(([fromId, toId], i) => {
        const from = getCenter(fromId);
        const to = getCenter(toId);
        return (
          <motion.line
            key={`${fromId}-${toId}`}
            x1={`${from.x}%`}
            y1={`${from.y}%`}
            x2={`${to.x}%`}
            y2={`${to.y}%`}
            stroke="url(#lineGradient)"
            strokeWidth={1}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: i * 0.08, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}
