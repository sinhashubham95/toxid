import Axios from "axios";
import Env from "./env";
import { Movie as MoviesType, MoviesResponse } from "../types/movies";
import { GET_ALL_MOVIES_PATH } from "../constants/api";
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

  getPopularMovies = async (genre: Genre, pageNumber?: number): Promise<PaginatedResponse<MoviesType>> => {
    try {
      const { status, data } = await this.axios.get(`${GET_ALL_MOVIES_PATH}&` +
        `page=${pageNumber}&with_genres=${genre.id}`);
      if (status === 200) {
        const movies = data as MoviesResponse;
        return {
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
            imageUrl: `${Env.getTMDBImageApiBaseUrl()}${poster_path}`,
            backdropImageUrl: `${Env.getTMDBImageApiBaseUrl()}${backdrop_path}`,
            genres: genre_ids,
            title,
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

  private getError = (message: string): PaginatedResponse<MoviesType> => ({
    pageNumber: 0,
    totalPages: 0,
    total: 0,
    data: [],
    error: {
      message,
    },
  });
}

export default new Movies();
