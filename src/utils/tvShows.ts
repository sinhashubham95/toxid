import Axios from "axios";
import Env from "./env";
import { GET_ALL_TV_SHOWS_PATH, GET_POPULAR_TV_SHOWS_PATH, GET_TOP_RATED_TV_SHOWS_PATH, GET_TV_SHOW_DETAIL_PATH } from "../constants/api";
import { Genre } from "../types/genres";
import { PaginatedResponse } from "../types/common";
import { TvShowsResponse, TvShow, TvShowDetails, TvShowDetailsResponse, VideoDetail, VideoSite } from "../types/tvShows";

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

  getTopRatedTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_TOP_RATED_TV_SHOWS_PATH}?page=${pageNumber}`);

  getPopularTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_POPULAR_TV_SHOWS_PATH}?page=${pageNumber}`);

  getTvhowDetails = async (id: number): Promise<TvShowDetails> => {
    try {
      const { status, data } = await this.axios.get(`${GET_TV_SHOW_DETAIL_PATH}/${id}?append_to_response=credits,videos`);
      if (status === 200) {
        const response = data as TvShowDetailsResponse;
        return {
          data: {
            id: response.id,
            title: response.name,
            description: response.overview,
            backdropImageUrl: this.getBackdropImageUrl(null, response.backdrop_path),
            releaseDate: response.first_air_date,
            genres: response.genres.map<Genre>(({ id, name }) => ({ id, title: name })),
            videos: response.videos.results.map<VideoDetail>(({
              id, name, site, type, key
            }) => ({
              id,
              name,
              url: this.getVideoUrl(site, key),
            })),

          },
        };
      }
    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  };

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

  private getVideoUrl = (site: VideoSite, key: string): string => key;

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
      imageUrl: this.getImageUrl(poster_path, backdrop_path),
      backdropImageUrl: this.getBackdropImageUrl(poster_path, backdrop_path),
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
