const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const readToken = import.meta.env.VITE_TMDB_READ_TOKEN;
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

async function tmdbFetch(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  const searchParams = new URLSearchParams(params);

  if (!readToken && apiKey) {
    searchParams.set("api_key", apiKey);
  }

  url.search = searchParams.toString();

  const headers = readToken
    ? { Authorization: `Bearer ${readToken}` }
    : undefined;

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }
  return response.json();
}

export function imageUrl(path, size = "w780") {
  if (!path) return "";
  return `${IMAGE_BASE}/${size}${path}`;
}

export async function getTrending() {
  return tmdbFetch("/trending/movie/week");
}

export async function getPopularMovies(page = 1) {
  return tmdbFetch("/movie/popular", { page });
}

export async function getUpcoming() {
  return tmdbFetch("/movie/upcoming");
}

export async function getTopRated() {
  return tmdbFetch("/movie/top_rated");
}

export async function getNowPlaying() {
  return tmdbFetch("/movie/now_playing");
}

export async function getGenres() {
  return tmdbFetch("/genre/movie/list");
}

export async function getTvGenres() {
  return tmdbFetch("/genre/tv/list");
}

export async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}

export async function getMovieImages(id) {
  return tmdbFetch(`/movie/${id}/images`);
}

export async function getMovieSimilar(id) {
  return tmdbFetch(`/movie/${id}/similar`);
}

export async function getMovieVideos(id) {
  return tmdbFetch(`/movie/${id}/videos`);
}

export async function getSeriesDetails(id) {
  return tmdbFetch(`/tv/${id}`);
}

export async function getSeriesImages(id) {
  return tmdbFetch(`/tv/${id}/images`);
}

export async function getSeriesSimilar(id) {
  return tmdbFetch(`/tv/${id}/similar`);
}

export async function getSeriesVideos(id) {
  return tmdbFetch(`/tv/${id}/videos`);
}

export async function discoverByGenre(genreId, page = 1) {
  return tmdbFetch("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  });
}

export async function discoverSeriesByGenre(genreId, page = 1) {
  return tmdbFetch("/discover/tv", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  });
}

export async function discoverSeries(filters = {}, page = 1) {
  return tmdbFetch("/discover/tv", {
    sort_by: "popularity.desc",
    page,
    ...filters,
  });
}

export async function searchMovies(query, page = 1) {
  return tmdbFetch("/search/movie", {
    query,
    page,
    include_adult: false,
  });
}

export async function getTrendingSeries() {
  return tmdbFetch("/trending/tv/week");
}

export async function getPopularSeries(page = 1) {
  return tmdbFetch("/tv/popular", { page });
}

export async function getTopRatedSeries(page = 1) {
  return tmdbFetch("/tv/top_rated", { page });
}

export async function searchSeries(query, page = 1) {
  return tmdbFetch("/search/tv", {
    query,
    page,
    include_adult: false,
  });
}
