// ⚠️ Placeholder — only use real company names if they're genuine clients.
const TRUST_LABELS = ["Company One", "Company Two", "Company Three"];

export default function TrustRow() {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full border-2 border-bg bg-gradient-to-br from-violet-500 to-magenta-500"
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-display text-sm text-ice">5.0</span>
          <span className="text-violet-300">★★★★★</span>
        </div>
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        Trusted by businesses worldwide
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 opacity-50">
        {TRUST_LABELS.map((label) => (
          <span key={label} className="font-body text-sm text-muted">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}