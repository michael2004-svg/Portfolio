export default function VideoCard() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl glass sm:aspect-video md:aspect-square">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700 to-bg-elevated" />
      <button
        aria-label="Play intro video"
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ice/90 text-bg transition-transform hover:scale-105 sm:h-16 sm:w-16"
      >
        ▶
      </button>
      <div className="absolute bottom-5 left-5 right-5">
        <p className="font-body text-sm text-ice/90">
          A 60-second intro — who I am and how I work.
        </p>
      </div>
    </div>
  );
}