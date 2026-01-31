const API_URL = "https://graphql.anilist.co";

const ANIME_QUERY = `
  query ($page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
      }
      media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        startDate {
          year
        }
        averageScore
        genres
        coverImage {
          extraLarge
          large
        }
        bannerImage
      }
    }
  }
`;

const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title {
        romaji
        english
        native
      }
      description(asHtml: false)
      startDate {
        year
      }
      averageScore
      genres
      episodes
      duration
      status
      trailer {
        id
        site
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
    }
  }
`;

export async function fetchAnime({ page = 1, perPage = 8, search = "" } = {}) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ANIME_QUERY,
      variables: { page, perPage, search: search || null },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error("AniList request failed");
  }
  return data.data.Page;
}

export async function fetchAnimeDetail(id) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: ANIME_DETAIL_QUERY,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error("AniList request failed");
  }
  return data.data.Media;
}
