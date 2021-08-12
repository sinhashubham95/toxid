import { ErrorResponse } from "./common";
import { Genre } from "./genres";

export interface TvShow {
  id: number;
  imageUrl: string;
  backdropImageUrl: string;
  genres: Array<number>;
  title: string;
  description: string;
  rating: number;
};

export interface TvShowsResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Array<{
    id: number;
    vote_average: number;
    genre_ids: Array<number>;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
  }>
};

export enum VideoSite {
  YouTube = "YouTube",
  Vimeo = "Vimeo",
};

export enum VideoType {
  Clip = "Clip",
  Featurette = "Featurette",
  Teaser = "Teaser",
  Trailer = "Trailer",
};

export interface VideoDetail {
  id: string;
  name: string;
  url: string;
};

export interface SeasonDetail {
  id: number;
  seasonNumber: number;
  name: string;
  description: string;
  episodeCount: number;
  imageUrl: string;
};

export interface CastDetail {
  id: number;
  name: string;
  character: string;
  imageUrl: string;
  knownFor: string;
};

export interface TvShowDetailsData {
  id: number;
  title: string;
  description: string;
  backdropImageUrl: string | null;
  releaseDate: string;
  genres: Array<Genre>;
  videos: Array<VideoDetail>;
  rating: number;
  seasons: Array<SeasonDetail>;
  cast: Array<CastDetail>;
  contentRating: string;
  logo: string;
};

export interface TvShowDetails extends ErrorResponse {
  data?: TvShowDetailsData,
};

export interface TvShowDetailsResponse {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  first_air_date: string;
  genres: Array<{
    id: number;
    name: string;
  }>;
  videos: {
    results: Array<{
      id: string;
      name: string;
      site: VideoSite;
      type: string;
      key: string;
    }>;
  };
  number_of_seasons: number;
  seasons: Array<{
    id: number;
    season_number: number;
    name: string;
    overview: string;
    episode_count: number;
    poster_path: string;
  }>;
  vote_average: number;
  aggregate_credits: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string;
      known_for_department: string;
    }>;
  };
  content_ratings: {
    results: Array<{
      iso_3166_1: string;
      rating: string;
    }>;
  };
  images: {
    logos: Array<{
      iso_639_1: string;
      file_path: string;
    }>;
  };
};
