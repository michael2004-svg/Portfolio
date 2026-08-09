"use client";

import { motion } from "framer-motion";
import { guarantees } from "./guarantees-data";

export default function GuaranteesSection() {
  return (
    <section id="guarantees" className="w-full bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Why Work With Me</span>
          <h2 className="mt-4 font-display text-3xl text-ice sm:text-4xl md:text-5xl">
            What you can count on.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl glass p-6"
            >
              <h3 className="font-display text-lg text-ice">{g.title}</h3>
              <p className="mt-2 font-body text-sm text-muted">{g.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
