import { useEffect, useState } from "react";
import { imageUrl, searchMovies } from "../lib/tmdb.js";

const stats = [
  {
    label: "Active viewers",
    value: "24.8k",
    note: "Watching tonight",
  },
  {
    label: "Curated lists",
    value: "340+",
    note: "Updated weekly",
  },
  {
    label: "Premium access",
    value: "4K HDR",
    note: "Dolby Atmos",
  },
];

export default function HeroSection({ curated, featured, trailerKey }) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const canPlay = Boolean(trailerKey);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await searchMovies(query.trim());
        setResults(response.results.slice(0, 6));
      } catch (error) {
        console.error("Hero search failed", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  return (
    <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-8 fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-aurora/30 bg-aurora/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-aurora">
          New release week
          <span className="h-1.5 w-1.5 rounded-full bg-aurora"></span>
        </div>
        <div className="space-y-4">
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Stream stories that keep your pulse on the edge.
          </h2>
          <p className="max-w-xl text-base text-haze">
            Peepers blends premium premieres, iconic classics, and a mood-first
            discovery engine that learns what makes you hit play.
          </p>
        </div>
        <div className="glass relative flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <input
              className="w-full bg-transparent text-sm text-white placeholder:text-haze focus:outline-none"
              placeholder="Search by title, director, or mood"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
          <button
            className="w-full rounded-full bg-ember px-5 py-2 text-sm font-semibold text-midnight transition hover:brightness-110 sm:w-auto"
            type="button"
            onClick={() => setIsSearchOpen(true)}
          >
            Search
          </button>
          {isSearchOpen && (
            <div className="absolute left-4 right-4 top-full z-20 mt-3 rounded-2xl border border-white/10 bg-midnight/95 p-4 text-sm text-haze shadow-lg backdrop-blur sm:left-0 sm:right-0">
              <div className="space-y-2">
                {isSearching && <p className="text-xs text-haze">Searching...</p>}
                {!isSearching && query && results.length === 0 && (
                  <p className="text-xs text-haze">Movie not found.</p>
                )}
                {results.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-3 py-2"
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-white/10">
                      {movie.poster_path ? (
                        <img
                          className="h-full w-full object-cover"
                          src={imageUrl(movie.poster_path, "w185")}
                          alt={movie.title}
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">{movie.title}</p>
                      <p className="text-xs text-haze">
                        {movie.release_date
                          ? movie.release_date.slice(0, 4)
                          : "N/A"}{" "}
                        · Rating {movie.vote_average?.toFixed(1) ?? "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          {stats.map((item) => (
            <div key={item.label} className="glass flex-1 rounded-2xl p-4">
              <p className="text-xs uppercase text-haze">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
              <p className="text-xs text-haze">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative fade-up fade-up-delay-2">
        <div className="absolute -right-6 top-6 h-40 w-40 rounded-3xl border border-white/10 bg-white/5 blur-2xl" />
        <div className="glass relative overflow-hidden rounded-3xl p-6">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl text-midnight">
            {featured.image ? (
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={featured.image}
                alt={featured.title}
              />
            ) : (
              <div className="poster absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white">
                <span>Featured</span>
                <span>Ultra HD</span>
              </div>
              <div className="space-y-2 text-white">
                <h3 className="text-2xl font-bold">{featured.title}</h3>
                <p className="text-sm">{featured.tagline}</p>
              </div>
            </div>
            <button
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-midnight shadow-glow transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => canPlay && setIsTrailerOpen(true)}
              disabled={!canPlay}
              aria-label="Play trailer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-haze">Next episode</p>
              <p className="text-sm font-semibold">{featured.time}</p>
            </div>
            <button
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-midnight transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={() => canPlay && setIsTrailerOpen(true)}
              disabled={!canPlay}
            >
              Watch trailer
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {curated.map((item) => (
            <div
              key={item.title}
              className="grid-glow rounded-2xl border border-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-haze">
                {item.tag}
              </p>
              <p className="mt-2 text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
      {isTrailerOpen && canPlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div
            className="aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <iframe
              title={`${featured.title} trailer`}
              src={`https://www.youtube-nocookie.com/embed/${trailerKey}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
