import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  getMovieDetails,
  getMovieImages,
  getMovieSimilar,
  getMovieVideos,
  getSeriesDetails,
  getSeriesImages,
  getSeriesSimilar,
  getSeriesVideos,
  imageUrl,
} from "../lib/tmdb.js";

function mapImages(images = []) {
  return images
    .filter((item) => item.file_path)
    .slice(0, 6)
    .map((item) => imageUrl(item.file_path, "w1280"));
}

function pickTrailer(videos = []) {
  const youtube = videos.filter(
    (video) => video.site === "YouTube" && video.key
  );
  const trailer = youtube.find((video) => video.type === "Trailer");
  return trailer?.key || youtube[0]?.key || "";
}

export default function MediaDetail({ type }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [slides, setSlides] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [trailerKey, setTrailerKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const mediaId = useMemo(() => Number(id), [id]);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        setIsLoading(true);
        if (type === "movie") {
          const [details, images, similarRes, videosRes] = await Promise.all([
            getMovieDetails(mediaId),
            getMovieImages(mediaId),
            getMovieSimilar(mediaId),
            getMovieVideos(mediaId),
          ]);
          if (!isActive) return;
          setData(details);
          setSlides(mapImages(images.backdrops));
          setSimilar(similarRes.results.slice(0, 8));
          setTrailerKey(pickTrailer(videosRes.results));
        } else {
          const [details, images, similarRes, videosRes] = await Promise.all([
            getSeriesDetails(mediaId),
            getSeriesImages(mediaId),
            getSeriesSimilar(mediaId),
            getSeriesVideos(mediaId),
          ]);
          if (!isActive) return;
          setData(details);
          setSlides(mapImages(images.backdrops));
          setSimilar(similarRes.results.slice(0, 8));
          setTrailerKey(pickTrailer(videosRes.results));
        }
      } catch (error) {
        console.error("Detail fetch failed", error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    if (Number.isNaN(mediaId)) return;
    load();
    return () => {
      isActive = false;
    };
  }, [mediaId, type]);

  const title = type === "movie" ? data?.title : data?.name;
  const release =
    type === "movie" ? data?.release_date : data?.first_air_date;
  const year = release ? release.slice(0, 4) : "N/A";
  const rating = data?.vote_average?.toFixed(1) ?? "N/A";
  const runtime =
    type === "movie"
      ? data?.runtime
        ? `${data.runtime} min`
        : "N/A"
      : data?.number_of_seasons
        ? `${data.number_of_seasons} seasons`
        : "N/A";
  const genres = data?.genres?.map((genre) => genre.name).join(" · ") ?? "";
  const status = data?.status ?? "N/A";
  const language = data?.original_language
    ? data.original_language.toUpperCase()
    : "N/A";
  const overview = data?.overview || "No overview available.";

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
            <div className="space-y-3">
              <div className="h-4 w-24 rounded-full bg-white/10 animate-pulse" />
              <div className="flex gap-3">
                <div className="h-24 w-40 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-24 w-40 rounded-xl bg-white/10 animate-pulse" />
                <div className="h-24 w-40 rounded-xl bg-white/10 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        {!isLoading && data && (
          <div className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex justify-center lg:justify-start">
                <div className="relative w-56 max-w-full overflow-hidden rounded-2xl sm:w-64 md:w-72">
                  <div className="relative aspect-[2/3]">
                    {data.poster_path ? (
                      <img
                        className="absolute inset-0 h-full w-full object-cover object-top"
                        src={imageUrl(data.poster_path, "w780")}
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
                  {type === "movie" ? "Movie" : "Series"}
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
                    {runtime}
                  </span>
                </div>
                {genres && <p className="text-xs text-haze">{genres}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Overview</h3>
              {data.tagline && (
                <p className="text-sm text-white/90">{data.tagline}</p>
              )}
              <p className="text-sm text-haze">{overview}</p>
              <div className="grid gap-3 text-xs text-haze sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-full border border-white/10 px-3 py-2">
                  <span>Status</span>
                  <span className="text-white">{status}</span>
                </div>
                <div className="flex items-center justify-between rounded-full border border-white/10 px-3 py-2">
                  <span>Language</span>
                  <span className="text-white">{language}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Trailer</h3>
              {trailerKey ? (
                <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <iframe
                    title={`${title} trailer`}
                    src={`https://www.youtube-nocookie.com/embed/${trailerKey}`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-xs text-haze">Trailer not available.</p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-haze">
                Stills
              </p>
              <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                {slides.map((src) => (
                  <button
                    key={src}
                    className="h-24 w-40 flex-none overflow-hidden rounded-xl"
                    type="button"
                    onClick={() => setActiveImage(src)}
                  >
                    <img className="h-full w-full object-cover" src={src} alt={title} />
                  </button>
                ))}
                {!slides.length && (
                  <div className="text-xs text-haze">No images available.</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Similar titles</h3>
              <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
                {similar.map((item) => {
                  const id = item.id;
                  const name = type === "movie" ? item.title : item.name;
                  const href =
                    type === "movie" ? `/movie/${id}` : `/series/${id}`;
                  const poster = item.poster_path
                    ? imageUrl(item.poster_path, "w342")
                    : "";
                  return (
                    <Link
                      key={id}
                      to={href}
                      className="w-32 flex-none overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-white/30"
                    >
                      <div className="relative aspect-[2/3]">
                        {poster ? (
                          <img
                            className="absolute inset-0 h-full w-full object-cover object-top"
                            src={poster}
                            alt={name}
                          />
                        ) : (
                          <div className="hero-stripe absolute inset-0" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-white line-clamp-2">
                          {name}
                        </p>
                      </div>
                    </Link>
                  );
                })}
                {!similar.length && (
                  <div className="text-xs text-haze">No similar titles.</div>
                )}
              </div>
            </div>
          </div>
        )}
        {!isLoading && !data && (
          <p className="text-sm text-haze">Not found.</p>
        )}
      </div>
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveImage("")}
        >
          <img
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain"
            src={activeImage}
            alt={title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
