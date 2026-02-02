export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 py-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-aurora text-midnight shadow-glow">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <p className="wordmark-glow font-display text-lg font-extrabold uppercase tracking-[0.2em]">
                Peepers
              </p>
              <p className="text-xs text-haze">Curated cinema experience</p>
            </div>
          </div>
          <p className="text-sm text-haze">
            Original premieres, iconic classics, and community watch rooms in
            one cinematic universe.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="group flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white">
              <span className="h-2 w-2 rounded-full bg-aurora/70 shadow-glow"></span>
              App Store
            </button>
            <button className="group flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white">
              <span className="h-2 w-2 rounded-full bg-ember/70"></span>
              Google Play
            </button>
          </div>
        </div>

        <div className="space-y-3 text-sm text-haze">
          <p className="flex items-center gap-2 font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora/80"></span>
            Explore
          </p>
          <div className="space-y-2">
            <p className="cursor-pointer transition hover:text-white">Discover</p>
            <p className="cursor-pointer transition hover:text-white">Originals</p>
            <p className="cursor-pointer transition hover:text-white">Trending</p>
            <p className="cursor-pointer transition hover:text-white">Events</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-haze">
          <p className="flex items-center gap-2 font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-ember/80"></span>
            Company
          </p>
          <div className="space-y-2">
            <p className="cursor-pointer transition hover:text-white">About</p>
            <p className="cursor-pointer transition hover:text-white">Careers</p>
            <p className="cursor-pointer transition hover:text-white">Press</p>
            <p className="cursor-pointer transition hover:text-white">Contact</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-haze">
          <p className="flex items-center gap-2 font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white/70"></span>
            Support
          </p>
          <div className="space-y-2">
            <p className="cursor-pointer transition hover:text-white">
              Help Center
            </p>
            <p className="cursor-pointer transition hover:text-white">Safety</p>
            <p className="cursor-pointer transition hover:text-white">
              Accessibility
            </p>
            <p className="cursor-pointer transition hover:text-white">Legal</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-haze">
        <p>Peepers Studio, 2026</p>
        <div className="flex flex-wrap gap-4">
          <span className="cursor-pointer transition hover:text-white">
            Privacy
          </span>
          <span className="cursor-pointer transition hover:text-white">Terms</span>
          <span className="cursor-pointer transition hover:text-white">
            Cookies
          </span>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          <span className="flex cursor-pointer items-center gap-2 text-haze transition hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-aurora/70"></span>
            Instagram
          </span>
          <span className="flex cursor-pointer items-center gap-2 text-haze transition hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60"></span>X
          </span>
          <span className="flex cursor-pointer items-center gap-2 text-haze transition hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-ember/70"></span>
            YouTube
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-[11px] text-haze sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
          <img
            className="h-4 w-auto opacity-80 sm:h-5"
            src="/tmdb.svg"
            alt="TMDB"
          />
          <span className="max-w-xs leading-relaxed sm:max-w-none">
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </span>
        </div>
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="self-start transition hover:text-white sm:self-auto"
        >
          tmdb.org
        </a>
      </div>
    </footer>
  );
}
