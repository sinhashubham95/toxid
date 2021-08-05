import Axios from "axios";
import Env from "./env";
import { Movie as MoviesType, MoviesResponse } from "../types/movies";
import { GET_ALL_MOVIES_PATH, GET_POPULAR_MOVIES_PATH, GET_TOP_RATED_MOVIES_PATH, GET_UPCOMING_MOVIES_PATH } from "../constants/api";
import { Genre } from "../types/genres";
import { PaginatedResponse } from "../types/common";

class Movies {
  private readonly axios = Axios.create({
    baseURL: Env.getTMDBApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Env.getTMDBApiKey()}`,
    },
  });

  getAllMovies = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<MoviesType>> =>
    this.getMovies(`${GET_ALL_MOVIES_PATH}&page=${pageNumber}&with_genres=${genre?.id}`);

  getTopRatedMovies = async (_genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<MoviesType>> =>
    this.getMovies(`${GET_TOP_RATED_MOVIES_PATH}?page=${pageNumber}`);

  getPopularMovies = async (_genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<MoviesType>> =>
    this.getMovies(`${GET_POPULAR_MOVIES_PATH}?page=${pageNumber}`);

  getUpcomingMovies = async (_genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<MoviesType>> =>
    this.getMovies(`${GET_UPCOMING_MOVIES_PATH}?page=${pageNumber}`);

  private getImageUrl = (posterPath: string | null, backdropPath: string | null): string => {
    if (posterPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${posterPath}`;
    }
    if (backdropPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${backdropPath}`
    }
    return '';
  };

  private getBackdropImageUrl = (posterPath: string | null, backdropPath: string | null): string => {
    if (backdropPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${backdropPath}`
    }
    if (posterPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${posterPath}`;
    }
    return '';
  };

  private getMoviesResponse = (movies: MoviesResponse): PaginatedResponse<MoviesType> => ({
    pageNumber: movies.page,
    totalPages: movies.total_pages,
    total: movies.total_results,
    data: movies.results.map(({
      id,
      adult,
      poster_path,
      backdrop_path,
      genre_ids,
      title,
      vote_average,
      overview,
    }) => ({
      id,
      adult,
      imageUrl: this.getImageUrl(poster_path, backdrop_path),
      backdropImageUrl: this.getBackdropImageUrl(poster_path, backdrop_path),
      genres: genre_ids,
      title,
      description: overview,
      rating: vote_average,
    })),
  });

  private getError = (message: string): PaginatedResponse<MoviesType> => ({
    pageNumber: 0,
    totalPages: 0,
    total: 0,
    data: [],
    error: {
      message,
    },
  });

  private getMovies = async (url: string): Promise<PaginatedResponse<MoviesType>> => {
    try {
      const { status, data } = await this.axios.get(url);
      if (status === 200) {
        return this.getMoviesResponse(data as MoviesResponse);
      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  };
}

export default new Movies();
