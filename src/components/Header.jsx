import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { imageUrl, searchMovies } from "../lib/tmdb.js";

const linkBase = "transition hover:text-white";
const activeLink = "text-white";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await searchMovies(query.trim());
        setResults(response.results.slice(0, 6));
      } catch (error) {
        console.error("Search failed", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    function handleClick(event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("[data-header-search]")) return;
      setIsSearchOpen(false);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-6">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aurora text-midnight shadow-glow">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div>
          <h1 className="wordmark-glow font-display text-2xl font-extrabold uppercase tracking-[0.2em]">
            Peepers
          </h1>
          <p className="text-xs text-haze">Curated cinema experience</p>
        </div>
      </Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm text-haze">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : ""}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/series"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : ""}`
          }
        >
          Series
        </NavLink>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : ""}`
          }
        >
          Movies
        </NavLink>
        <NavLink
          to="/anime"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeLink : ""}`
          }
        >
          Anime
        </NavLink>
      </nav>
      <div
        className="relative flex w-full items-center justify-end gap-3 sm:w-auto"
        data-header-search
      >
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-haze transition hover:border-white/30 hover:text-white"
          type="button"
          onClick={() => setIsSearchOpen((prev) => !prev)}
          aria-label="Search movies"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-haze transition hover:border-white/30 hover:text-white"
          type="button"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀︎" : "☾"}
        </button>

        {isSearchOpen && (
          <div className="absolute left-0 right-0 z-20 mt-3 w-full max-w-sm rounded-2xl border border-white/10 bg-midnight/90 p-4 text-sm text-haze shadow-lg backdrop-blur sm:left-auto sm:right-0 sm:w-80">
            <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2">
              <span className="text-xs">⌕</span>
                <input
                  className="w-full bg-transparent text-sm text-white placeholder:text-haze focus:outline-none"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
            </div>
            <div className="mt-3 space-y-2">
              {isLoading && <p className="text-xs text-haze">Searching...</p>}
              {!isLoading && query && results.length === 0 && (
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
    </header>
  );
}
