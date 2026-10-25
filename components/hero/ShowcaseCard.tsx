import Image from "next/image";

const SHOTS = [
  { src: "/images/projects/nearbyradar.png", label: "NearbyRadar", className: "left-0 top-0 w-[72%] rotate-[-3deg]" },
  { src: "/images/projects/bookverse.png", label: "Bookverse", className: "right-0 top-[22%] w-[58%] rotate-[3deg]" },
  { src: "/images/projects/cardycash.jpeg", label: "Cardy Cash", className: "bottom-0 left-[10%] w-[62%] rotate-[-1deg]" },
];

export default function ShowcaseCard() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl glass sm:aspect-video md:aspect-square">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700/60 to-bg-elevated" />
      <div className="absolute inset-6">
        {SHOTS.map((s) => (
          <div
            key={s.label}
            className={`absolute aspect-video overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50 ${s.className}`}
          >
            <Image src={s.src} alt={s.label} fill sizes="(min-width: 768px) 30vw, 70vw" className="object-cover object-top" priority />
            <span className="absolute bottom-2 left-2 rounded-full bg-bg/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ice backdrop-blur">
              ● {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
