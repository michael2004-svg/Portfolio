"use client";

import { useState } from "react";
import type { DailyPoint } from "@/lib/analytics";

const H = 160;

// Single-series bar chart: unique visitors per day. Each column is its own hover/focus target.
export default function VisitorsChart({ series }: { series: DailyPoint[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((d) => d.visitors));
  const ticks = [max, Math.round(max / 2), 0];
  const label = (day: string) => new Date(`${day}T00:00:00`).toLocaleDateString("en-KE", { day: "numeric", month: "short" });
  const shown = active ?? series.length - 1;
  const point = series[shown];

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-body text-sm">
        <span className="text-muted">{point ? label(point.day) : ""}</span>
        <span className="text-ice">
          {point?.visitors ?? 0} visitors · {point?.conversions ?? 0} conversions
        </span>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between pb-5 text-right font-mono text-[10px] text-muted" style={{ height: H + 20 }}>
          {ticks.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-white/5" />
          <div className="pointer-events-none absolute inset-x-0 border-t border-white/5" style={{ top: H / 2 }} />
          <div className="flex items-end gap-[2px]" style={{ height: H }} onMouseLeave={() => setActive(null)}>
            {series.map((d, i) => (
              <button
                key={d.day}
                type="button"
                aria-label={`${label(d.day)}: ${d.visitors} visitors, ${d.conversions} conversions`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group flex h-full flex-1 items-end focus:outline-none"
              >
                <span
                  className={`block w-full rounded-t-[4px] transition-colors ${i === shown ? "bg-violet-300" : "bg-violet-500 group-hover:bg-violet-300"}`}
                  style={{ height: d.visitors ? Math.max(3, (d.visitors / max) * H) : 1, opacity: d.visitors ? 1 : 0.3 }}
                />
              </button>
            ))}
          </div>
          <div className="mt-1.5 flex justify-between border-t border-white/10 pt-1.5 font-mono text-[10px] text-muted">
            <span>{series[0] && label(series[0].day)}</span>
            <span>{series.at(-1) && label(series.at(-1)!.day)}</span>
          </div>
        </div>
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-muted hover:text-ice">View as table</summary>
        <table className="mt-3 w-full font-body text-sm">
          <thead>
            <tr className="text-left font-mono text-[10px] uppercase tracking-widest text-muted">
              <th className="py-1.5">Day</th>
              <th className="py-1.5 text-right">Visitors</th>
              <th className="py-1.5 text-right">Conversions</th>
            </tr>
          </thead>
          <tbody>
            {[...series].reverse().map((d) => (
              <tr key={d.day} className="border-t border-white/5 text-ice/90">
                <td className="py-1.5">{label(d.day)}</td>
                <td className="py-1.5 text-right tabular-nums">{d.visitors}</td>
                <td className="py-1.5 text-right tabular-nums">{d.conversions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
