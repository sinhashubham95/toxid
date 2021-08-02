import { APIError } from "./common";

export interface Movie {
  id: number;
  adult: boolean;
  imageUrl: string;
  genres: Array<number>;
  title: string;
  rating: number;
};

export interface Movies {
  pageNumber: number;
  totalPages: number;
  total: number;
  data: Array<Movie>;
  error?: APIError;
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
  }>
};
