"use client";

import { motion } from "framer-motion";
import VideoCard from "./VideoCard";
import TrustRow from "./TrustRow";
import Button from "@/components/ui/Button";

export default function Hero({ onBookProject }: { onBookProject: () => void }) {
  return (
    <section id="home" className="relative w-full bg-bg pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-[55%_45%] md:gap-12 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block rounded-full glass px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-violet-300">
            I Build Digital Solutions
          </span>

          <h1 className="mt-6 font-display text-4xl leading-tight text-ice sm:text-5xl md:text-5xl">
            Websites, Apps &amp; Systems That Drive{" "}
            <span className="text-violet-300">Real Results.</span>
          </h1>

          <p className="mt-5 max-w-md font-body text-base text-muted sm:text-lg">
            High-performance digital products built to scale your business —
            not just look good in a portfolio.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button onClick={onBookProject}>Book the Service</Button>
            <a
              href="#projects"
              className="font-body text-sm text-ice underline decoration-violet-300/40 underline-offset-4 hover:text-violet-300"
            >
              View My Work
            </a>
          </div>

          <TrustRow />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <VideoCard />
        </motion.div>
      </div>
    </section>
  );
}