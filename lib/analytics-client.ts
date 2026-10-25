"use client";

export type Site = "portfolio" | "booking";

function id(store: Storage | null, key: string) {
  try {
    let v = store?.getItem(key);
    if (!v) {
      v = crypto.randomUUID();
      store?.setItem(key, v);
    }
    return v;
  } catch {
    return "anon";
  }
}

export function visitorId() {
  return id(typeof window === "undefined" ? null : window.localStorage, "mm_vid");
}

function sessionId() {
  return id(typeof window === "undefined" ? null : window.sessionStorage, "mm_sid");
}

export function track(site: Site, type: "pageview" | "click" | "conversion", name?: string) {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({
    site,
    type,
    name,
    path: window.location.pathname,
    visitorId: visitorId(),
    sessionId: sessionId(),
    referrer: document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : undefined,
  });
  if (navigator.sendBeacon?.("/api/track", payload)) return;
  fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
}
