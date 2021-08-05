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

export interface MoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    adult: boolean;
    id: number;
    vote_average: number;
    genre_ids: Array<number>;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
  }>
};
