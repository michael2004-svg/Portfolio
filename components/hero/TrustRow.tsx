const SHIPPED = ["Kenya Literature Bureau", "NearbyRadar", "Bookverse", "Creator OS"];

export default function TrustRow() {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2 font-body text-sm text-ice">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/70" />
          8 products live in production
        </span>
        <span className="font-mono text-xs text-muted">Nairobi, Kenya · Remote worldwide</span>
      </div>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        Built &amp; shipped for
      </p>
      <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 opacity-60">
        {SHIPPED.map((label) => (
          <span key={label} className="font-body text-sm text-muted">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
