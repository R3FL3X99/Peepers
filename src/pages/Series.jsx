import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import {
  discoverSeries,
  discoverSeriesByGenre,
  getPopularSeries,
  getTvGenres,
  imageUrl,
  searchSeries,
} from "../lib/tmdb.js";

function mapSeries(series) {
  return {
    id: series.id,
    title: series.name,
    rating: series.vote_average?.toFixed(1) ?? "N/A",
    year: series.first_air_date ? series.first_air_date.slice(0, 4) : "N/A",
    image: imageUrl(series.poster_path, "w780"),
  };
}

export default function Series() {
  const [shows, setShows] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreOpen, setGenreOpen] = useState(false);
  const [genreId, setGenreId] = useState(null);
  const [genreLabel, setGenreLabel] = useState("Genre");

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    setPage(1);
    setShows([]);
  }, [trimmedQuery, genreId]);

  useEffect(() => {
    if (!genres.length || genreId === null) return;
    const current = genres.find((genre) => genre.id === genreId);
    if (current) setGenreLabel(current.name);
  }, [genres, genreId]);

  useEffect(() => {
    let isActive = true;

    async function loadGenres() {
      try {
        const response = await getTvGenres();
        if (!isActive) return;
        const sorted = [
          { id: "kdrama", name: "K-Drama" },
          ...response.genres,
        ].sort((a, b) => a.name.localeCompare(b.name));
        setGenres(sorted);
      } catch (error) {
        console.error("TV genres fetch failed", error);
      }
    }

    loadGenres();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    function handleClick(event) {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("[data-series-genre-menu]")) return;
      setGenreOpen(false);
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = trimmedQuery
          ? await searchSeries(trimmedQuery, page)
          : genreId === "kdrama"
            ? await discoverSeries({ with_original_language: "ko" }, page)
            : genreId
              ? await discoverSeriesByGenre(genreId, page)
              : await getPopularSeries(page);
        if (!isActive) return;
        setShows(response.results.slice(0, 8).map(mapSeries));
        setTotalPages(response.total_pages ?? 1);
      } catch (error) {
        console.error("Series fetch failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    const handle = setTimeout(load, trimmedQuery ? 350 : 0);
    return () => {
      clearTimeout(handle);
      isActive = false;
    };
  }, [trimmedQuery, page, genreId]);

  return (
    <PageShell
      eyebrow="Series"
      title="Binge-worthy storytelling, season by season."
      description="Popular and searchable TV series pulled live from TMDB."
    >
      <div className="col-span-full flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-haze">
          <span className="text-xs">⌕</span>
          <input
            className="w-full bg-transparent text-sm text-white placeholder:text-haze focus:outline-none"
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="relative" data-series-genre-menu>
          <button
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white"
            type="button"
            onClick={() => setGenreOpen((prev) => !prev)}
          >
            {genreLabel}
            <span className="text-[10px]">{genreOpen ? "▲" : "▼"}</span>
          </button>
          {genreOpen && (
            <div className="absolute right-0 top-full z-10 mt-2 w-48 max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-midnight/95 p-2 text-xs text-haze shadow-lg backdrop-blur">
              <button
                className="w-full rounded-xl px-3 py-2 text-left transition hover:text-white"
                type="button"
                onClick={() => {
                  setGenreId(null);
                  setGenreLabel("Genre");
                  setGenreOpen(false);
                }}
              >
                All genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  className="w-full rounded-xl px-3 py-2 text-left transition hover:text-white"
                  type="button"
                  onClick={() => {
                    setGenreId(genre.id);
                    setGenreLabel(genre.name);
                    setGenreOpen(false);
                  }}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="text-xs text-haze">
          {isLoading ? "Loading..." : `Page ${page} of ${totalPages}`}
        </div>
      </div>

      {isLoading && !shows.length
        ? Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`series-skeleton-${index}`}
              className="glass overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[2/3] animate-pulse bg-white/10" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded-full bg-white/10" />
                <div className="h-3 w-1/2 rounded-full bg-white/10" />
              </div>
            </div>
          ))
        : shows.map((show) => (
            <Link
              key={show.id}
              to={`/series/${show.id}`}
              className="glass overflow-hidden rounded-2xl transition hover:border-white/30"
            >
              <div className="relative aspect-[2/3]">
                {show.image ? (
                  <img
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    src={show.image}
                    alt={show.title}
                  />
                ) : (
                  <div className="hero-stripe absolute inset-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold">{show.title}</h3>
                <div className="flex items-center justify-between text-xs text-haze">
                  <span>{show.year}</span>
                  <span>Rating {show.rating}</span>
                </div>
              </div>
            </Link>
          ))}

      <div className="col-span-full flex items-center justify-between gap-4">
        <button
          className="rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1 || isLoading}
          type="button"
        >
          Prev
        </button>
        <button
          className="rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || isLoading}
          type="button"
        >
          Next
        </button>
      </div>
    </PageShell>
  );
}
