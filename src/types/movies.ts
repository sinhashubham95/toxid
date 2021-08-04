import { APIError, PageInfo } from "./common";

export interface Movie {
  id: number;
  adult: boolean;
  imageUrl: string;
  backdropImageUrl: string;
  genres: Array<number>;
  title: string;
  description: string;
  rating: number;
};

export interface Movies extends PageInfo {
  data: Array<Movie>;
};

export interface MoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    adult: boolean;
    id: number;
    vote_average: number;
    genre_ids: Array<number>;
    original_title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
  }>
};

export interface MovieAnchorInfo {
  anchor: HTMLElement;
  item: Movie;
};

export interface PaginatedMovies {
  data: Array<Movie>;
  pagesFetched: number;
  totalPages: number;
};
