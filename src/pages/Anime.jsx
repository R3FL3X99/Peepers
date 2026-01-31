import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { fetchAnime } from "../lib/anilist.js";

function mapAnime(item) {
  return {
    id: item.id,
    title: item.title.english || item.title.romaji || item.title.native,
    year: item.startDate?.year ?? "N/A",
    rating: item.averageScore ? (item.averageScore / 10).toFixed(1) : "N/A",
    genres: item.genres?.slice(0, 2).join(" / ") ?? "",
    image:
      item.coverImage?.extraLarge ||
      item.coverImage?.large ||
      item.bannerImage ||
      "",
  };
}

export default function Anime() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [trimmedQuery]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        const pageData = await fetchAnime({
          page,
          perPage: 8,
          search: trimmedQuery,
        });
        if (!isActive) return;
        setItems(pageData.media.map(mapAnime));
        setTotalPages(pageData.pageInfo.lastPage ?? 1);
      } catch (error) {
        console.error("Anime fetch failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    const handle = setTimeout(load, trimmedQuery ? 350 : 0);
    return () => {
      clearTimeout(handle);
      isActive = false;
    };
  }, [trimmedQuery, page]);

  return (
    <PageShell
      eyebrow="Anime"
      title="Top anime, live from AniList."
      description="Search or browse popular anime with real-time data."
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
        <div className="text-xs text-haze">
          {isLoading ? "Loading..." : `Page ${page} of ${totalPages}`}
        </div>
      </div>

      {isLoading && !items.length
        ? Array.from({ length: 8 }).map((_, index) => (
            <div
              key={`anime-skeleton-${index}`}
              className="glass overflow-hidden rounded-2xl"
            >
              <div className="relative aspect-[2/3] animate-pulse bg-white/10" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded-full bg-white/10" />
                <div className="h-3 w-1/2 rounded-full bg-white/10" />
              </div>
            </div>
          ))
        : items.map((item) => (
            <Link
              key={item.id}
              to={`/anime/${item.id}`}
              className="glass overflow-hidden rounded-2xl transition hover:border-white/30"
            >
              <div className="relative aspect-[2/3]">
                {item.image ? (
                  <img
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    src={item.image}
                    alt={item.title}
                  />
                ) : (
                  <div className="hero-stripe absolute inset-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              </div>
              <div className="space-y-2 p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.genres && (
                  <p className="text-xs text-haze">{item.genres}</p>
                )}
                <div className="flex items-center justify-between text-xs text-haze">
                  <span>{item.year}</span>
                  <span>Rating {item.rating}</span>
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
