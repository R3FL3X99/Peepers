import { useEffect, useState } from "react";
import ExperienceSection from "../components/ExperienceSection.jsx";
import HeroSection from "../components/HeroSection.jsx";
import TrendingSection from "../components/TrendingSection.jsx";
import {
  curated as curatedFallback,
  featured as featuredFallback,
  trending as trendingFallback,
  upcoming as upcomingFallback,
} from "../data/homeData.js";
import {
  getGenres,
  getMovieDetails,
  getMovieVideos,
  getNowPlaying,
  getTrending,
  getUpcoming,
  imageUrl,
} from "../lib/tmdb.js";

function mapMovieCard(movie, genreMap) {
  const names =
    movie.genre_ids?.map((id) => genreMap[id]).filter(Boolean) ?? [];
  const genreLabel = names.length ? names.slice(0, 2).join(" / ") : "Feature";

  return {
    id: movie.id,
    title: movie.title,
    genre: genreLabel,
    rating: movie.vote_average?.toFixed(1) ?? "N/A",
    year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
    image: imageUrl(movie.poster_path, "w780"),
  };
}

function formatDate(value) {
  if (!value) return "TBA";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function pickTrailer(videos = []) {
  const youtube = videos.filter(
    (video) => video.site === "YouTube" && video.key
  );
  const trailer = youtube.find((video) => video.type === "Trailer");
  return trailer?.key || youtube[0]?.key || "";
}

export default function Home() {
  const [featured, setFeatured] = useState(featuredFallback);
  const [featuredTrailer, setFeaturedTrailer] = useState("");
  const [featuredPool, setFeaturedPool] = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [trending, setTrending] = useState(trendingFallback);
  const [upcoming, setUpcoming] = useState(upcomingFallback);
  const [curated, setCurated] = useState(curatedFallback);

  useEffect(() => {
    let isActive = true;

    async function load() {
      try {
        const [trendingRes, upcomingRes, nowPlayingRes, genresRes] =
          await Promise.all([
            getTrending(),
            getUpcoming(),
            getNowPlaying(),
            getGenres(),
          ]);

        if (!isActive) return;

        const genreMap = Object.fromEntries(
          genresRes.genres.map((genre) => [genre.id, genre.name])
        );
        const trendingMovies = trendingRes.results.slice(0, 6);
        const curatedMovies = nowPlayingRes.results.slice(0, 4);

        setFeaturedPool(trendingMovies);
        setFeaturedIndex(0);
        setTrending(
          trendingMovies.map((movie) => mapMovieCard(movie, genreMap))
        );
        setCurated(
          curatedMovies.map((movie) => ({
            title: movie.title,
            tag: movie.genre_ids?.[0]
              ? genreMap[movie.genre_ids[0]]
              : "Now playing",
          }))
        );
        setUpcoming(
          upcomingRes.results.slice(0, 3).map((movie) => ({
            title: movie.title,
            note: "Upcoming release",
            date: formatDate(movie.release_date),
          }))
        );

        const featuredMovie = trendingMovies[0];
        if (featuredMovie) {
          const [details, videos] = await Promise.all([
            getMovieDetails(featuredMovie.id),
            getMovieVideos(featuredMovie.id),
          ]);
          if (!isActive) return;
          setFeatured({
            title: details.title,
            tagline: details.tagline || details.overview,
            time: "Tonight, 9:30 PM",
            image: imageUrl(details.backdrop_path, "w1280"),
          });
          setFeaturedTrailer(pickTrailer(videos.results));
        }
      } catch (error) {
        console.error("TMDB fetch failed", error);
      }
    }

    load();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!featuredPool.length) return;
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredPool.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [featuredPool]);

  useEffect(() => {
    let isActive = true;

    async function loadFeatured() {
      const current = featuredPool[featuredIndex];
      if (!current) return;
      try {
        const [details, videos] = await Promise.all([
          getMovieDetails(current.id),
          getMovieVideos(current.id),
        ]);
        if (!isActive) return;
        setFeatured({
          title: details.title,
          tagline: details.tagline || details.overview,
          time: "Tonight, 9:30 PM",
          image: imageUrl(details.backdrop_path, "w1280"),
        });
        setFeaturedTrailer(pickTrailer(videos.results));
      } catch (error) {
        console.error("Featured update failed", error);
      }
    }

    loadFeatured();
    return () => {
      isActive = false;
    };
  }, [featuredIndex, featuredPool]);

  return (
    <>
      <HeroSection
        curated={curated}
        featured={featured}
        trailerKey={featuredTrailer}
      />
      <TrendingSection trending={trending} upcoming={upcoming} />
      <ExperienceSection />
    </>
  );
}
