"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import AuroraBackground from "./AuroraBackground";
import MagneticButton from "@/components/ui/MagneticButton";

const SignalRingScene = dynamic(() => import("./SignalRingScene"), {
  ssr: false,
});

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero({
  onBookProject,
}: {
  onBookProject: () => void;
}) {
  return (
    <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-bg">
      <AuroraBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-32 md:grid-cols-[55%_45%] md:px-12">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-block font-mono text-xs uppercase tracking-[0.25em] text-violet-300"
          >
            Software Engineer — Nairobi
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[13vw] leading-[0.95] text-ice md:text-[5.5vw]"
          >
            I build products
            <br />
            people <span className="text-violet-300">trust</span>.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-md font-body text-lg text-muted"
          >
            Full-stack engineer crafting web apps, mobile apps, and systems
            with the same care I bring to producing a track — every detail
            considered, nothing left generic.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <MagneticButton variant="primary" onClick={onBookProject}>
              Book Your Project
            </MagneticButton>
            <MagneticButton variant="ghost">View My Work</MagneticButton>
          </motion.div>
        </motion.div>

        <div className="relative h-[420px] w-full md:h-[560px]">
          <SignalRingScene />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted"
      >
        Scroll
      </motion.div>
    </section>
  );
}
