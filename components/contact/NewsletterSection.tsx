"use client";

import { useState } from "react";
import { motion } from "framer-motion";

function Envelope({ opened }: { opened: boolean }) {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none">
      <motion.rect
        x="4"
        y="14"
        width="112"
        height="72"
        rx="10"
        fill="#0D0B14"
        stroke="#8B5CF6"
        strokeWidth="1.5"
      />
      <motion.path
        d="M8 20 L60 56 L112 20"
        stroke="#C4B5FD"
        strokeWidth="1.5"
        fill="none"
        animate={{ d: opened ? "M8 20 L60 10 L112 20" : "M8 20 L60 56 L112 20" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <motion.circle
        cx="60"
        cy="8"
        r="4"
        fill="#C026D3"
        animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 10 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
    </svg>
  );
}

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    // TODO: wire to real newsletter provider (Mailchimp/Resend/etc.)
  };

  return (
    <section className="relative w-full overflow-hidden bg-bg-elevated py-28">
      <div className="absolute inset-0 bg-aurora-1 opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-violet-300/60"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -12, 0] }}
            transition={{
              duration: 4 + (i % 5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <Envelope opened={submitted} />
        <h2 className="mt-6 font-display text-4xl text-ice md:text-5xl">
          {submitted ? "You're in." : "Get notified on new work."}
        </h2>
        <p className="mt-3 font-body text-muted">
          {submitted
            ? "No spam — just new projects and the occasional build breakdown."
            : "Occasional emails when something worth sharing ships."}
        </p>

        {!submitted && (
          <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-sm gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="flex-1 rounded-full glass px-5 py-3 font-body text-sm text-ice placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-violet-300/50"
            />
            <button
              type="submit"
              className="rounded-full bg-violet-500 px-6 py-3 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-violet-300"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
