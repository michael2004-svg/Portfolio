"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Tracker from "@/components/analytics/Tracker";
import { CALENDLY_URL } from "@/lib/contact";
import type { Testimonial } from "@/lib/reviews";
import BookingModal from "./BookingModal";
import CalendlyInline from "./CalendlyInline";
import * as C from "./content";

const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "/";

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lp .reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="lime font-mono text-xs uppercase tracking-widest">{children}</span>;
}

function ProjectCard({ p }: { p: (typeof C.LIVE_PROJECTS)[number] }) {
  return (
    <div className={`project-card ${p.live ? "" : "opacity-60"}`}>
      <div className="project-card-img">
        <Image src={p.img} alt={p.name} fill sizes="280px" className="object-cover" />
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{p.name}</span>
          <span className={`status-pill ${p.live ? "status-live" : "status-discontinued"}`}>{p.live ? "● Live" : "Discontinued"}</span>
        </div>
        <p className="muted text-xs">{p.desc}</p>
      </div>
      <div className="project-card-bottom-bar" />
    </div>
  );
}

export default function BookingLanding({ testimonials }: { testimonials: Testimonial[] }) {
  const [modal, setModal] = useState<{ open: boolean; type: string | null }>({ open: false, type: null });
  const open = (type: string | null = null) => setModal({ open: true, type });
  const close = useCallback(() => setModal({ open: false, type: null }), []);
  useReveal();

  return (
    <div className="pb-20 md:pb-0">
      <Tracker site="booking" />

      {/* NAV */}
      <header className="border-b-hairline sticky top-0 z-40 bg-[#0A0A0D]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-display text-lg font-bold">
            Smart<span className="lime">System</span>
          </a>
          <nav className="muted hidden items-center gap-8 text-sm md:flex">
            <a href="#build" className="transition-colors hover:text-white">Services</a>
            <a href="#proof" className="transition-colors hover:text-white">Work</a>
            <a href="#process" className="transition-colors hover:text-white">Process</a>
            <a href="#why" className="transition-colors hover:text-white">Why Us</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </nav>
          <button onClick={() => open()} data-track="nav_book" className="btn-primary rounded-lg px-4 py-2 text-sm">Book Consultation</button>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#3B82F6]/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute right-0 top-40 h-72 w-72 rounded-full bg-[#C6FF3D]/5 blur-3xl" />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 pb-16 pt-16 md:pb-24 md:pt-24 lg:grid-cols-2">
            <div className="reveal">
              <h1 className="font-display text-4xl font-bold leading-[1.08] md:text-5xl">
                A Working Product In Front Of Real Users — <span className="blue">Without Hiring Or Guessing.</span>
              </h1>
              <p className="muted mt-5 max-w-lg text-lg leading-relaxed">
                You bring the idea or the business problem. We scope it, price it once, and build the website, app or system end-to-end — so
                you&apos;re not managing developers, chasing freelancers, or wondering if it&apos;ll actually ship.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => open()} data-track="hero_cta" className="btn-primary rounded-lg px-6 py-3.5 text-base">
                  Get My Free Scope &amp; Fixed Price →
                </button>
                <a href="#proof" data-track="hero_see_work" className="btn-secondary rounded-lg px-6 py-3.5 text-center text-base">See What We&apos;ve Built</a>
              </div>
              <p className="muted mt-4 font-mono text-xs">No obligation · Fixed price after scoping · Backed by our delivery guarantee</p>
            </div>

            <div className="reveal relative h-[380px] md:h-[440px]" aria-hidden>
              <div className="mock float-slow absolute left-0 top-0 w-[78%]">
                <div className="mock-bar">
                  <span className="mock-dot" style={{ background: "#FF5F56" }} />
                  <span className="mock-dot" style={{ background: "#FFBD2E" }} />
                  <span className="mock-dot" style={{ background: "#27C93F" }} />
                  <span className="muted ml-2 font-mono text-[10px]">dashboard — operations</span>
                </div>
                <div className="p-4">
                  <div className="mb-3 flex gap-3">
                    <div className="bg-surface-2 border-hairline flex-1 rounded-lg p-3">
                      <div className="muted font-mono text-[10px]">Active Orders</div>
                      <div className="font-display mt-1 text-lg font-bold">128</div>
                    </div>
                    <div className="bg-surface-2 border-hairline flex-1 rounded-lg p-3">
                      <div className="muted font-mono text-[10px]">Revenue Today</div>
                      <div className="font-display lime mt-1 text-lg font-bold">+12%</div>
                    </div>
                  </div>
                  <div className="mock-bars bg-surface-2 rounded-lg">
                    {[40, 65, 50, 80, 60, 90].map((h, i) => (
                      <div key={i} className="mock-bar-col" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mock float-slow d2 absolute bottom-0 right-0 w-[48%]">
                <div className="mock-bar"><span className="muted ml-1 font-mono text-[10px]">mobile — checkout</span></div>
                <div className="space-y-2 p-4">
                  <div className="bg-surface-2 h-3 w-3/4 rounded" />
                  <div className="bg-surface-2 h-3 w-1/2 rounded" />
                  <div className="mt-3 flex h-9 items-center justify-center rounded-lg bg-[#3B82F6]/80 text-xs font-semibold">Pay with M-Pesa</div>
                </div>
              </div>
              <div className="mock float-slow d3 absolute right-0 top-16 w-[42%]">
                <div className="mock-bar"><span className="muted ml-1 font-mono text-[10px]">API</span></div>
                <div className="muted p-3 font-mono text-[10px] leading-relaxed">
                  <div>POST /v1/orders</div>
                  <div className="lime">200 OK</div>
                  <div>{'{"status":"confirmed"}'}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t-hairline bg-surface-soft">
            <div className="muted mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-3 px-6 py-6 font-mono text-xs uppercase tracking-widest">
              {["Web", "App", "SaaS", "Business Systems", "E-Commerce", "API"].map((t) => <span key={t}>{t}</span>)}
            </div>
          </div>
        </section>

        {/* QUICK START */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <p className="reveal muted mb-5 text-center text-sm">Not ready for a call? Tell us what you&apos;re building — takes 10 seconds.</p>
            <div className="reveal flex flex-wrap justify-center gap-3">
              {C.QUICK_START.map((t) => (
                <button key={t} onClick={() => open(t)} data-track={`quickstart_${t.toLowerCase().replace(/\s+/g, "_")}`} className="qual-option border-hairline bg-surface rounded-full px-5 py-2.5 text-sm">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal max-w-2xl">
              <Eyebrow>The Real Challenge</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">You&apos;re Not Hiring Someone To Just Write Code.</h2>
              <p className="muted mt-4 leading-relaxed">
                A software project can fail even when the code works. The real challenge is understanding the business behind it — the users, the
                workflows, the integrations, the security, and what it takes to keep running after launch.
              </p>
            </div>
            <div className="reveal mt-12 flex flex-wrap items-center gap-3">
              {C.DELIVERY_FLOW.map((step, i) => (
                <span key={step} className="contents">
                  <span className={`border-hairline rounded-full px-4 py-2 text-sm ${i === C.DELIVERY_FLOW.length - 1 ? "border-[#3B82F6] bg-[#3B82F6]/15 font-semibold" : "bg-surface"}`}>{step}</span>
                  {i < C.DELIVERY_FLOW.length - 1 && <span className="muted">→</span>}
                </span>
              ))}
            </div>
            <div className="reveal mt-10">
              <button onClick={() => open()} data-track="challenge_cta" className="btn-primary rounded-lg px-6 py-3 text-sm">Book a Free Consultation →</button>
            </div>
          </div>
        </section>

        {/* LIVE PROJECTS */}
        <section id="proof" className="overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pb-10 pt-20">
            <div className="reveal">
              <Eyebrow>Live Projects</Eyebrow>
              <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold md:text-4xl">Real Products, Actually Live.</h2>
              <p className="muted mt-3 max-w-xl">
                Not mockups — real software running in production today.{" "}
                <a href={PORTFOLIO_URL} data-track="see_portfolio" className="lime underline-offset-4 hover:underline">See full case studies →</a>
              </p>
            </div>
          </div>
          <div className="reveal">
            <div className="project-track">
              {[...C.LIVE_PROJECTS, ...C.LIVE_PROJECTS].map((p, i) => <ProjectCard key={`${p.name}-${i}`} p={p} />)}
            </div>
          </div>
        </section>

        {/* REAL RESULTS */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>Proof We Can Build Things That Make Money</Eyebrow>
              <h2 className="font-display mt-3 max-w-2xl text-3xl font-bold md:text-4xl">Numbers From Products We&apos;ve Built And Operate Ourselves.</h2>
              <p className="muted mt-4 max-w-2xl">
                These are live revenue numbers from software we designed, built and still run in-house — not a client&apos;s figures. We&apos;re showing them so
                you can see what the team behind your build is actually capable of shipping.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {C.RESULTS.map((r) => (
                <div key={r.label} className="result-card reveal p-5">
                  <div className="result-shot"><Image src={r.img} alt={r.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div>
                  <div className="mt-4">
                    <span className="muted font-mono text-[10px] uppercase tracking-widest">{r.label}</span>
                    <div className={`font-display mt-1 text-2xl font-bold ${r.tone}`}>{r.value}</div>
                    <div className="muted mt-1 font-mono text-xs">{r.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TICKERS */}
        <section className="space-y-3 overflow-hidden py-8" aria-hidden>
          <div className="ticker-track">{[...C.TICKER_SERVICES, ...C.TICKER_SERVICES].map((t, i) => <span key={i} className="ticker-chip">{t}</span>)}</div>
          <div className="ticker-track-rev">{[...C.TICKER_TECH, ...C.TICKER_TECH].map((t, i) => <span key={i} className="ticker-chip">{t}</span>)}</div>
        </section>

        {/* WHAT CAN WE BUILD */}
        <section id="build">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>Capability</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">What Can We Build?</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {C.CAPABILITIES.map((c) => (
                <button key={c.title} onClick={() => open(c.type)} data-track={`capability_${c.type.toLowerCase().replace(/[^a-z]+/g, "_")}`} className="evidence-card reveal border-hairline bg-surface overflow-hidden rounded-2xl text-left">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={c.img} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                    <p className="muted mt-2 text-sm">{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="reveal mt-10">
              <button onClick={() => open()} data-track="build_cta" className="btn-primary rounded-lg px-6 py-3 text-sm">Book a Free Consultation →</button>
            </div>
          </div>
        </section>

        {/* FIT CHECK */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal max-w-2xl">
              <Eyebrow>Fit Check</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Is This A Fit?</h2>
              <p className="muted mt-4">We turn down projects that aren&apos;t a good fit rather than take on work we can&apos;t do well. Two minutes here saves both of us a call.</p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="reveal border-hairline bg-surface rounded-2xl p-6">
                <h3 className="lime font-display font-semibold">✓ Good Fit</h3>
                <ul className="mt-4 space-y-3 text-sm">{C.GOOD_FIT.map((g) => <li key={g} className="flex gap-2"><span className="lime">✓</span>{g}</li>)}</ul>
              </div>
              <div className="reveal border-hairline bg-surface rounded-2xl p-6">
                <h3 className="muted font-display font-semibold">✕ Not A Fit Right Now</h3>
                <ul className="muted mt-4 space-y-3 text-sm">{C.NOT_FIT.map((g) => <li key={g} className="flex gap-2"><span>✕</span>{g}</li>)}</ul>
              </div>
            </div>
          </div>
        </section>

        {/* OFFER */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>The Offer</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">What You Get When We Build Your Software</h2>
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {C.OFFER.map((o, i) => (
                <div key={o.title} className="reveal border-hairline bg-surface flex gap-4 rounded-xl p-4">
                  <span className="lime font-mono text-sm">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{o.title}</div>
                    <div className="muted text-sm">{o.desc}</div>
                  </div>
                  <span className="muted whitespace-nowrap font-mono text-xs">~KES {o.value}</span>
                </div>
              ))}
            </div>
            <div className="reveal border-hairline bg-surface mt-8 flex flex-col items-start justify-between gap-6 rounded-2xl p-6 md:flex-row md:items-center">
              <div>
                <div className="muted text-sm">If bought as separate services</div>
                <div className="font-display muted text-xl line-through">~KES 650,000 in standalone value</div>
              </div>
              <div>
                <div className="muted text-sm">Delivered together, starting from</div>
                <div className="font-display lime text-3xl font-bold">KES 250,000</div>
              </div>
              <button onClick={() => open()} data-track="offer_cta" className="btn-primary rounded-lg px-6 py-3 text-sm">Get My Fixed Price →</button>
            </div>
          </div>
        </section>

        {/* VALUE */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-16 text-center">
            <div className="reveal">
              <Eyebrow>The Value</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">You&apos;re Not Just Paying For Code.</h2>
              <p className="muted mx-auto mt-6 max-w-3xl font-mono text-sm leading-loose">
                Business Analysis + Product Planning + UI/UX + Architecture + Development + Testing + Deployment + Support
              </p>
              <p className="mt-4">Everything required to turn the idea into a working product.</p>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>Process</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">How A Project Actually Moves</h2>
            </div>
            <div className="reveal relative mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-7">
              <div className="step-line hidden lg:block" />
              {C.PROCESS.map((p, i) => (
                <div key={p.title} className="relative flex flex-col items-start lg:items-center lg:text-center">
                  <div className={`step-dot ${i === 0 ? "active" : ""}`}>{String(i + 1).padStart(2, "0")}</div>
                  <div className="font-display mt-3 font-semibold">{p.title}</div>
                  <div className="muted text-xs">{p.desc}</div>
                </div>
              ))}
            </div>
            <p className="reveal muted mt-10 text-sm">
              Every client gets a private portal to follow progress, approve milestones and download contracts and deliverables.
            </p>
          </div>
        </section>

        {/* NO RISK */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal max-w-2xl">
              <Eyebrow>No Risk</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Booking A Call Doesn&apos;t Commit You To A Project.</h2>
            </div>
            <ol className="mt-10 grid gap-4 md:grid-cols-3">
              {C.NO_RISK_STEPS.map((s, i) => (
                <li key={s} className="reveal border-hairline bg-surface rounded-xl p-5">
                  <div className="lime font-mono text-xs">STEP {i + 1}</div>
                  <div className="mt-2 text-sm">{s}</div>
                </li>
              ))}
            </ol>
            <p className="reveal lime mt-8 font-semibold">No pressure. No obligation.</p>
          </div>
        </section>

        {/* BOOK NOW */}
        <section id="book" className="bg-surface-soft">
          <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-20 lg:grid-cols-2">
            <div className="reveal">
              <Eyebrow>Book Now</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Let&apos;s Figure Out What It Will Take To Build It.</h2>
              <p className="muted mt-4">Whether you have a complete specification or just an idea, we&apos;ll help you determine the next step.</p>
              <p className="muted mt-4 text-sm">We take on a limited number of new builds each month to keep every project properly staffed.</p>
              <button onClick={() => open()} data-track="book_section_cta" className="btn-primary mt-6 inline-block rounded-lg px-6 py-3.5">Book My Free Consultation →</button>
              <div className="muted mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs">
                {["30 minutes", "Remote", "No obligation", "Technical discussion", "Clear next steps"].map((t) => <span key={t}>✓ {t}</span>)}
              </div>
            </div>
            <div className="reveal border-hairline bg-surface rounded-2xl p-2">
              <CalendlyInline url={`${CALENDLY_URL}?hide_event_type_details=1&hide_gdpr_banner=1`} height={520} />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS / PROOF */}
        <section>
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal max-w-2xl">
              <Eyebrow>{testimonials.length ? "Client Reviews" : "Proof Of Work"}</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">{testimonials.length ? "What Clients Say After Launch" : "What We've Actually Shipped"}</h2>
              {!testimonials.length && (
                <p className="muted mt-4">
                  We don&apos;t have client quotes published yet — so here&apos;s what&apos;s true and checkable right now: live products, in production, that real users open every day.
                </p>
              )}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.length
                ? testimonials.map((t) => (
                    <figure key={t.id} className="reveal evidence-card border-hairline bg-surface rounded-2xl p-6">
                      <div className="lime" aria-label={`${t.rating} out of 5 stars`}>{"★".repeat(t.rating)}<span className="opacity-20">{"★".repeat(5 - t.rating)}</span></div>
                      <blockquote className="mt-3 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                      <figcaption className="mt-4 text-sm">
                        <div className="font-semibold">{t.name}</div>
                        {t.role && <div className="muted text-xs">{t.role}</div>}
                      </figcaption>
                    </figure>
                  ))
                : C.PROOF_OF_WORK.map((p) => (
                    <div key={p.title} className="reveal evidence-card border-hairline bg-surface rounded-2xl p-6">
                      <span className="status-pill status-live">● Live</span>
                      <h3 className="font-display mt-3 text-lg font-semibold">{p.title}</h3>
                      <p className="muted mt-2 text-sm">{p.desc}</p>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* COMMON SITUATIONS */}
        <section className="bg-surface-soft">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>Common Situations</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Still Figuring Out What You Need?</h2>
            </div>
            <div className="mt-8 space-y-3">
              {C.SITUATIONS.map((s) => (
                <details key={s.q} className="reveal border-hairline bg-surface rounded-xl px-5 py-4">
                  <summary className="flex items-center justify-between gap-4 font-medium">
                    &ldquo;{s.q}&rdquo; <span className="plus-icon lime text-xl">+</span>
                  </summary>
                  <p className="muted mt-3 text-sm">{s.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal max-w-2xl">
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Every Project Is Scoped Before We Quote It.</h2>
              <p className="muted mt-4">
                Price depends on the number of features, complexity, integrations, platforms, design requirements, security, third-party services, timeline and ongoing support.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {C.PRICES.map((p) => (
                <div key={p.name} className="reveal border-hairline bg-surface rounded-2xl p-6">
                  <div className="font-semibold">{p.name}</div>
                  <div className="muted mt-3 text-xs">From</div>
                  <div className="font-display lime text-2xl font-bold">{p.price}</div>
                </div>
              ))}
            </div>
            <button onClick={() => open()} data-track="pricing_cta" className="reveal btn-primary mt-8 rounded-lg px-6 py-3 text-sm">Get An Accurate Quote →</button>
          </div>
        </section>

        {/* GUARANTEE */}
        <section id="why" className="bg-surface-soft">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="reveal">
              <Eyebrow>Risk Reversal</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Our Guarantee</h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {C.GUARANTEES.map((g, i) => (
                <div key={g.title} className="reveal border-hairline bg-surface rounded-2xl p-6">
                  <div className="lime font-display text-3xl font-bold">{i + 1}</div>
                  <h3 className="font-display mt-2 text-lg font-semibold">{g.title}</h3>
                  <p className="muted mt-2 text-sm">{g.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-surface-soft">
          <div className="mx-auto max-w-4xl px-6 pb-20">
            <div className="reveal">
              <Eyebrow>FAQ</Eyebrow>
              <h2 className="font-display mt-3 text-3xl font-bold md:text-4xl">Questions Before You Book</h2>
            </div>
            <div className="mt-8 space-y-3">
              {C.FAQ.map((f) => (
                <details key={f.q} className="border-hairline bg-surface rounded-xl px-5 py-4">
                  <summary className="flex items-center justify-between gap-4 font-medium">
                    {f.q} <span className="plus-icon lime text-xl">+</span>
                  </summary>
                  <p className="muted mt-3 text-sm">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section>
          <div className="reveal mx-auto max-w-3xl px-6 py-24 text-center">
            <h2 className="font-display text-3xl font-bold md:text-5xl">Your Idea Doesn&apos;t Need More Planning. It Needs A Next Step.</h2>
            <p className="muted mt-5">Book a consultation and let&apos;s determine what it will take to turn it into a working product.</p>
            <p className="lime mt-3 text-sm">Backed by our guarantee: a clear proposal within 5 days, or you owe us nothing to that point.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => open()} data-track="final_cta" className="btn-primary rounded-lg px-6 py-3.5">Book My Free Consultation →</button>
              <a href={PORTFOLIO_URL} data-track="final_view_work" className="btn-secondary rounded-lg px-6 py-3.5">View Our Work</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-hairline">
        <div className="muted mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm sm:flex-row">
          <span>Smart System Agency — Nairobi, Kenya</span>
          <div className="flex gap-5">
            <a href="tel:+254759309920" className="hover:text-white">0759 309 920</a>
            <a href="/portal/login" data-track="footer_client_portal" className="hover:text-white">Client Portal</a>
            <button onClick={() => open()} data-track="footer_book" className="hover:text-white">Book Consultation</button>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="border-t-hairline fixed bottom-0 left-0 right-0 z-40 flex bg-[#0A0A0D]/95 p-3 backdrop-blur md:hidden">
        <button onClick={() => open()} data-track="mobile_sticky_cta" className="btn-primary w-full rounded-lg py-3 text-sm">Book Consultation</button>
      </div>

      {modal.open && <BookingModal initialType={modal.type} onClose={close} />}
    </div>
  );
}
