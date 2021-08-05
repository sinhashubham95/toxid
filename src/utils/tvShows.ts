import Axios from "axios";
import Env from "./env";
import { GET_ALL_TV_SHOWS_PATH, GET_POPULAR_TV_SHOWS_PATH, GET_TOP_RATED_TV_SHOWS_PATH } from "../constants/api";
import { Genre } from "../types/genres";
import { PaginatedResponse } from "../types/common";
import { TvShowsResponse, TvShow } from "../types/tvShows";

class TvShows {
  private readonly axios = Axios.create({
    baseURL: Env.getTMDBApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Env.getTMDBApiKey()}`,
    },
  });

  getAllTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_ALL_TV_SHOWS_PATH}&page=${pageNumber}&with_genres=${genre?.id}`);

  getTopRatedTvShows = async (pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_TOP_RATED_TV_SHOWS_PATH}&page=${pageNumber}`);

  getPopularTvShows = async (pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_POPULAR_TV_SHOWS_PATH}&page=${pageNumber}`);

  private getTvShowsResponse = (tvShows: TvShowsResponse): PaginatedResponse<TvShow> => ({
    pageNumber: tvShows.page,
    totalPages: tvShows.total_pages,
    total: tvShows.total_results,
    data: tvShows.results.map(({
      id,
      poster_path,
      backdrop_path,
      genre_ids,
      name,
      vote_average,
      overview,
    }) => ({
      id,
      imageUrl: `${Env.getTMDBImageApiBaseUrl()}${poster_path}`,
      backdropImageUrl: `${Env.getTMDBImageApiBaseUrl()}${backdrop_path}`,
      genres: genre_ids,
      title: name,
      description: overview,
      rating: vote_average,
    })),
  });

  private getError = (message: string): PaginatedResponse<TvShow> => ({
    pageNumber: 0,
    totalPages: 0,
    total: 0,
    data: [],
    error: {
      message,
    },
  });

  private getTvShows = async (url: string): Promise<PaginatedResponse<TvShow>> => {
    try {
      const { status, data } = await this.axios.get(url);
      if (status === 200) {
        return this.getTvShowsResponse(data as TvShowsResponse);

      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  }
}

export default new TvShows();
