"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void };
  }
}

const SRC = "https://assets.calendly.com/assets/external/widget.js";

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!s) {
      s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      document.body.appendChild(s);
    }
    s.addEventListener("load", () => resolve());
    s.addEventListener("error", () => reject());
  });
}

export default function CalendlyInline({ url, height = 560 }: { url: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        if (cancelled || !ref.current || !window.Calendly) return;
        ref.current.innerHTML = "";
        window.Calendly.initInlineWidget({ url, parentElement: ref.current });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl" style={{ minWidth: 280, height }}>
      <a href={url} target="_blank" rel="noopener noreferrer" className="lime flex h-full items-center justify-center text-sm underline">
        Open the booking calendar →
      </a>
    </div>
  );
}
