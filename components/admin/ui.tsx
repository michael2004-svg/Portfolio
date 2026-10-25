import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-xl border border-white/10 bg-bg px-3.5 py-2.5 font-body text-sm text-ice placeholder:text-muted/60 focus:border-violet-300/60 focus:outline-none";
export const btnCls =
  "inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-2.5 font-mono text-xs uppercase tracking-wide text-bg transition-colors hover:bg-violet-300 disabled:opacity-40";
export const ghostBtnCls =
  "inline-flex items-center justify-center rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-wide text-ice transition-colors hover:border-violet-300/50 hover:text-violet-300";
export const dangerBtnCls =
  "inline-flex items-center justify-center rounded-full border border-red-400/30 px-4 py-2 font-mono text-xs uppercase tracking-wide text-red-300 transition-colors hover:bg-red-400/10";

export function Card({ title, action, children, className }: { title?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-white/5 bg-bg-elevated p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-violet-300">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-bg-elevated p-5">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</div>
      <div className="mt-2 font-display text-3xl text-ice">{value}</div>
      {hint && <div className="mt-1 font-body text-xs text-muted">{hint}</div>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-muted">{label}</span>
      {children}
    </label>
  );
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-violet-500/15 text-violet-300",
  contacted: "bg-sky-500/15 text-sky-300",
  won: "bg-emerald-500/15 text-emerald-300",
  lost: "bg-white/5 text-muted",
  planning: "bg-white/5 text-muted",
  in_progress: "bg-sky-500/15 text-sky-300",
  review: "bg-amber-500/15 text-amber-300",
  completed: "bg-emerald-500/15 text-emerald-300",
  pending: "bg-white/5 text-muted",
  awaiting_approval: "bg-amber-500/15 text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-300",
  requested: "bg-white/5 text-muted",
  rejected: "bg-red-500/10 text-red-300",
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={cn("inline-block rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest", STATUS_STYLES[status] ?? "bg-white/5 text-muted")}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-white/10 p-6 text-center font-body text-sm text-muted">{children}</p>;
}

export const fmtDate = (d: Date | null | undefined) =>
  d ? new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" }).format(d) : "—";

export const fmtDateTime = (d: Date) =>
  new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Nairobi" }).format(d);

export const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);
