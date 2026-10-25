"use client";

import { CALENDLY_URL } from "@/lib/contact";
import { GITHUB_URL } from "@/components/reviews/reviews-data";

export default function ContactFooter({ onBookProject }: { onBookProject: () => void }) {
  return (
    <footer className="w-full bg-bg-elevated py-16">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
        <h2 className="font-display text-3xl text-ice sm:text-4xl">Your Idea Needs A Next Step.</h2>
        <p className="mt-3 font-body text-muted">
          Book a free 30-minute consultation and let&apos;s work out what it will take to turn it into a working product.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-track="footer_calendly"
            className="rounded-full bg-violet-500 px-6 py-3 font-mono text-xs uppercase tracking-wide text-bg hover:bg-violet-300"
          >
            Schedule a Call
          </a>
          <button
            onClick={onBookProject}
            data-track="footer_estimate"
            className="rounded-full glass px-6 py-3 font-mono text-xs uppercase tracking-wide text-ice hover:text-violet-300"
          >
            Get an Estimate
          </button>
          <a
            href="/portal/login"
            data-track="footer_client_portal"
            className="rounded-full glass px-6 py-3 font-mono text-xs uppercase tracking-wide text-ice hover:text-violet-300"
          >
            Client Portal
          </a>
        </div>
        <p className="mt-4 font-mono text-xs text-muted">
          30 minutes · Remote · No obligation · Clear proposal within 5 business days
        </p>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-muted sm:flex-row">
          <span className="font-display text-ice">
            M<span className="text-violet-300">.</span>
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-body">
            <span>Nairobi, Kenya</span>
            <a href="tel:+254759309920" className="hover:text-ice">
              0759 309 920
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-ice">
              GitHub
            </a>
          </div>
          <span className="font-body">© {new Date().getFullYear()} Michael Musyoka</span>
        </div>
      </div>
    </footer>
  );
}
