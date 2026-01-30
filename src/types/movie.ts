// PhimAPI Movie types
export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  modified: {
    time: string;
  };
  tmdb?: {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
  };
  imdb?: {
    id: string | null;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Country {
  _id: string;
  name: string;
  slug: string;
}

export interface MovieDetail extends Movie {
  episodes: Episode[];
}

export interface Episode {
  server_name: string;
  server_data: EpisodeData[];
}

export interface EpisodeData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface MovieResponse {
  status: boolean;
  items: Movie[];
  pagination: Pagination;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

// API Parameters
export interface MovieListParams {
  page?: number;
  sort_field?: "modified.time" | "_id" | "year";
  sort_type?: "desc" | "asc";
  sort_lang?: "vietsub" | "thuyet-minh" | "long-tieng";
  category?: string;
  country?: string;
  year?: number;
  limit?: number;
}

export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: MovieDetail;
  episodes: Episode[]; // Episodes ở response top level
}

export interface SearchParams extends MovieListParams {
  keyword: string;
}

export interface SearchResponse {
  status: string;
  data: {
    items: Movie[];
    pagination: Pagination;
  };
}

export type MovieType = 'phim-le' | 'phim-bo' | 'tv-shows' | 'hoat-hinh' | 'phim-vietsub' | 'phim-thuyet-minh' | 'phim-long-tieng';

export type CategoriesResponse = Category[];
