"use client";

const WHATSAPP_NUMBER = "254700000000"; // ⚠️ same placeholder — keep in sync with BookingWizard.tsx

export default function ContactFooter({ onBookProject }: { onBookProject: () => void }) {
  return (
    <footer className="w-full bg-bg-elevated py-16">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-12">
        <h2 className="font-display text-3xl text-ice sm:text-4xl">Let&apos;s Build Something Great</h2>
        <p className="mt-3 font-body text-muted">Ready to take your idea to the next level?</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button onClick={onBookProject} className="rounded-full bg-violet-500 px-6 py-3 font-mono text-xs uppercase tracking-wide text-bg hover:bg-violet-300">
            Schedule a Call
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full glass px-6 py-3 font-mono text-xs uppercase tracking-wide text-ice hover:text-violet-300"
          >
            WhatsApp Me
          </a>
          <a
            href="mailto:hello@example.com" /* ⚠️ placeholder */
            className="rounded-full glass px-6 py-3 font-mono text-xs uppercase tracking-wide text-ice hover:text-violet-300"
          >
            Email Me
          </a>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-muted sm:flex-row">
          <span className="font-display text-ice">
            M<span className="text-violet-300">.</span>
          </span>
          <span className="font-body">© {new Date().getFullYear()} Michael Musyoka. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
