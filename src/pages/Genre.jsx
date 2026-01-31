import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageShell from "../components/PageShell.jsx";
import { discoverByGenre, getGenres, imageUrl } from "../lib/tmdb.js";

function mapMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average?.toFixed(1) ?? "N/A",
    year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    image: imageUrl(movie.poster_path, "w780"),
  };
}

export default function Genre() {
  const { id } = useParams();
  const [genreName, setGenreName] = useState("Genre");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const genreId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    setPage(1);
  }, [genreId]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        const [genresRes, moviesRes] = await Promise.all([
          getGenres(),
          discoverByGenre(genreId),
        ]);

        if (!isActive) return;

        const current = genresRes.genres.find((genre) => genre.id === genreId);
        setGenreName(current?.name ?? "Genre");
        setMovies(moviesRes.results.map(mapMovie));
        setTotalPages(moviesRes.total_pages ?? 1);
      } catch (error) {
        console.error("Genre fetch failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, [genreId]);

  useEffect(() => {
    let isActive = true;

    async function loadMore() {
      try {
        setIsLoading(true);
        const moviesRes = await discoverByGenre(genreId, page);
        if (!isActive) return;
        setMovies(moviesRes.results.map(mapMovie));
        setTotalPages(moviesRes.total_pages ?? 1);
      } catch (error) {
        console.error("Genre pagination failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    if (page === 1) return;
    loadMore();
    return () => {
      isActive = false;
    };
  }, [genreId, page]);

  return (
    <PageShell
      eyebrow="Genre"
      title={`${genreName} picks`}
      description="Popular titles curated from TMDB for this genre."
    >
      {movies.map((movie) => (
        <Link
          key={movie.id}
          to={`/movie/${movie.id}`}
          className="glass overflow-hidden rounded-2xl transition hover:border-white/30"
        >
          <div className="relative aspect-[2/3]">
            {movie.image ? (
              <img
                className="absolute inset-0 h-full w-full object-cover object-top"
                src={movie.image}
                alt={movie.title}
              />
            ) : (
              <div className="hero-stripe absolute inset-0" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
          <div className="space-y-2 p-4">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <div className="flex items-center justify-between text-xs text-haze">
              <span>{movie.year}</span>
              <span>Rating {movie.rating}</span>
            </div>
          </div>
        </Link>
      ))}
      <div className="col-span-full flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-haze">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-3">
          <button
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1 || isLoading}
          >
            Prev
          </button>
          <button
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-haze transition hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page >= totalPages || isLoading}
          >
            Next
          </button>
        </div>
      </div>
    </PageShell>
  );
}
