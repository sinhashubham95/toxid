export interface Tv {
  id: number;
  imageUrl: string;
  backdropImageUrl: string;
  genres: Array<number>;
  title: string;
  description: string;
  rating: number;
};

export interface TvResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    id: number;
    vote_average: number;
    genre_ids: Array<number>;
    name: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
  }>
};
