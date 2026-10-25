"use client";

import { useEffect } from "react";
import { Site, track } from "@/lib/analytics-client";

// Records a pageview, plus a click for any element carrying data-track="<button-id>".
export default function Tracker({ site }: { site: Site }) {
  useEffect(() => {
    track(site, "pageview");

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-track]");
      if (el?.dataset.track) track(site, "click", el.dataset.track);
    };
    // Calendly embeds post a message when a meeting is actually booked.
    const onMessage = (e: MessageEvent) => {
      if (typeof e.origin === "string" && e.origin.includes("calendly.com") && e.data?.event === "calendly.event_scheduled") {
        track(site, "conversion", "calendly_booked");
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("message", onMessage);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("message", onMessage);
    };
  }, [site]);

  return null;
}
