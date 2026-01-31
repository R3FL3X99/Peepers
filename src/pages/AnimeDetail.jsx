import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAnimeDetail } from "../lib/anilist.js";

function cleanDescription(text = "") {
  return text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function pickTrailer(trailer) {
  if (!trailer?.id || !trailer?.site) return "";
  if (trailer.site === "youtube" || trailer.site === "YouTube") {
    return `https://www.youtube-nocookie.com/embed/${trailer.id}`;
  }
  return "";
}

export default function AnimeDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mediaId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        const details = await fetchAnimeDetail(mediaId);
        if (!isActive) return;
        setData(details);
      } catch (error) {
        console.error("Anime detail fetch failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    if (Number.isNaN(mediaId)) return;
    load();
    return () => {
      isActive = false;
    };
  }, [mediaId]);

  const title =
    data?.title?.english || data?.title?.romaji || data?.title?.native || "Anime";
  const overview = cleanDescription(data?.description || "");
  const year = data?.startDate?.year ?? "N/A";
  const rating = data?.averageScore ? (data.averageScore / 10).toFixed(1) : "N/A";
  const episodes = data?.episodes ? `${data.episodes} eps` : "N/A";
  const duration = data?.duration ? `${data.duration} min` : "N/A";
  const status = data?.status ?? "N/A";
  const genres = data?.genres?.join(" · ") ?? "";
  const trailerUrl = pickTrailer(data?.trailer);

  return (
    <section className="mt-12">
      <div className="glass rounded-3xl p-8">
        {isLoading && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex justify-center lg:justify-start">
                <div className="h-80 w-56 rounded-2xl bg-white/10 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="h-3 w-24 rounded-full bg-white/10 animate-pulse" />
                <div className="h-8 w-3/4 rounded-full bg-white/10 animate-pulse" />
                <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" />
                <div className="flex flex-wrap gap-3">
                  <div className="h-7 w-20 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
                  <div className="h-7 w-24 rounded-full bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-32 rounded-full bg-white/10 animate-pulse" />
              <div className="h-3 w-full rounded-full bg-white/10 animate-pulse" />
              <div className="h-3 w-5/6 rounded-full bg-white/10 animate-pulse" />
            </div>
          </div>
        )}

        {!isLoading && data && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-56 max-w-full overflow-hidden rounded-2xl sm:w-64 md:w-72">
                  <div className="relative aspect-[2/3]">
                    {data.coverImage?.extraLarge || data.coverImage?.large ? (
                      <img
                        className="absolute inset-0 h-full w-full object-cover object-top"
                        src={data.coverImage?.extraLarge || data.coverImage?.large}
                        alt={title}
                      />
                    ) : (
                      <div className="hero-stripe absolute inset-0" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-aurora">
                  Anime
                </p>
                <h2 className="font-display text-3xl font-semibold md:text-4xl">
                  {title}
                </h2>
                <div className="flex flex-wrap gap-3 text-xs text-haze">
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {year}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Rating {rating}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {episodes}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {duration}
                  </span>
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {status}
                  </span>
                </div>
                {genres && <p className="text-xs text-haze">{genres}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Overview</h3>
              <p className="text-sm text-haze">
                {overview || "No overview available."}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Trailer</h3>
              {trailerUrl ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
                    title={`${title} trailer`}
                    src={trailerUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-xs text-haze">Trailer not available.</p>
              )}
            </div>
          </div>
        )}

        {!isLoading && !data && (
          <p className="text-sm text-haze">Not found.</p>
        )}
      </div>
    </section>
  );
}
