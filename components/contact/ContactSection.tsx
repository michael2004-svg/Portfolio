"use client";

import { motion } from "framer-motion";
import ContactLink from "./ContactLink";

const WHATSAPP_NUMBER = "254700000000"; // ⚠️ placeholder — replace with your real number

const icons = {
  whatsapp: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.08L2 22l5.08-1.33A9.94 9.94 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.64 0-3.16-.47-4.45-1.28l-.32-.19-3.02.79.8-2.94-.21-.33A7.94 7.94 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
    </svg>
  ),
  email: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  linkedin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
    </svg>
  ),
  github: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.5v-1.75c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.11-1.52-1.11-1.52-.91-.64.07-.63.07-.63 1 .07 1.53 1.05 1.53 1.05.9 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.3 9.3 0 015 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.03 10.03 0 0022 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  ),
  calendar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
};

const links = [
  { label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: icons.whatsapp },
  { label: "Email", href: "mailto:hello@example.com", icon: icons.email }, // ⚠️ placeholder
  { label: "LinkedIn", href: "https://linkedin.com/in/yourhandle", icon: icons.linkedin }, // ⚠️ placeholder
  { label: "GitHub", href: "https://github.com/yourhandle", icon: icons.github }, // ⚠️ placeholder
  { label: "Schedule Call", href: "https://cal.com/yourhandle", icon: icons.calendar }, // ⚠️ placeholder
];

export default function ContactSection() {
  return (
    <section className="relative w-full bg-bg py-32">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-violet-300">
            Let&apos;s Talk
          </span>
          <h2 className="mt-4 font-display text-5xl text-ice md:text-6xl">
            Ready to build something people trust?
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-5">
          {links.map((link, i) => (
            <ContactLink key={link.label} {...link} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
