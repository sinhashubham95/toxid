import Axios from "axios";
import Env from "./env";
import { GET_ALL_TV_SHOWS_PATH } from "../constants/api";
import { Genre } from "../types/genres";
import { PaginatedResponse } from "../types/common";
import { TvResponse, Tv as TvType } from "../types/tv";

class Tv {
  private readonly axios = Axios.create({
    baseURL: Env.getTMDBApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Env.getTMDBApiKey()}`,
    },
  });

  getPopularTVShows = async (genre: Genre, pageNumber?: number): Promise<PaginatedResponse<TvType>> => {
    try {
      const { status, data } = await this.axios.get(`${GET_ALL_TV_SHOWS_PATH}&` +
        `page=${pageNumber}&with_genres=${genre.id}`);
      if (status === 200) {
        const movies = data as TvResponse;
        return {
          pageNumber: movies.page,
          totalPages: movies.total_pages,
          total: movies.total_results,
          data: movies.results.map(({
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
        };
      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  };

  private getError = (message: string): PaginatedResponse<TvType> => ({
    pageNumber: 0,
    totalPages: 0,
    total: 0,
    data: [],
    error: {
      message,
    },
  });
}

export default new Tv();
