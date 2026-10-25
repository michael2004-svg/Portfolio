"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    title: "Discovery",
    desc: "We jump on a quick call to understand your goals, audience, and constraints. No fluff — just a clear scope and timeline.",
  },
  {
    num: "02",
    title: "Build",
    desc: "Design and development in weekly sprints. You get a preview every few days so there are no surprises at the end.",
  },
  {
    num: "03",
    title: "Launch",
    desc: "We ship, test on real devices, fix edge cases, and hand over a polished product ready for users.",
  },
  {
    num: "04",
    title: "Support",
    desc: "Post-launch support and optional retainers to keep everything running smoothly as you grow.",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="w-full bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 max-w-xl"
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">Process</span>
          <h2 className="mt-4 font-display text-3xl text-ice sm:text-4xl md:text-5xl">
            How it works.
          </h2>
          <p className="mt-4 font-body text-muted">Four clear steps from idea to live product.</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-2xl glass p-6"
            >
              <span className="font-mono text-xs text-violet-300">{s.num}</span>
              <h3 className="mt-2 font-display text-lg text-ice">{s.title}</h3>
              <p className="mt-2 font-body text-sm text-muted">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
