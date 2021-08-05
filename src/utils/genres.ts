import Axios from "axios";
import Env from "./env";
import { Genres as GenresType, GenresResponse } from "../types/genres";
import { GET_MOVIE_GENRES_PATH, GET_TV_GENRES_PATH } from "../constants/api";

class Genres {
  private readonly axios = Axios.create({
    baseURL: Env.getTMDBApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Env.getTMDBApiKey()}`,
    },
  });

  getMovieGenres = async (): Promise<GenresType> => {
    try {
      const { status, data } = await this.axios.get(`${GET_MOVIE_GENRES_PATH}`);
      if (status === 200) {
        const genres = data as GenresResponse;
        return {
          data: genres.genres.map(({
            id,
            name,
          }) => ({
            id,
            title: name,
          })),
        };
      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  };

  getTVGenres = async (): Promise<GenresType> => {
    try {
      const { status, data } = await this.axios.get(`${GET_TV_GENRES_PATH}`);
      if (status === 200) {
        const genres = data as GenresResponse;
        return {
          data: genres.genres.map(({
            id,
            name,
          }) => ({
            id,
            title: name,
          })),
        };
      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  };

  private getError = (message: string): GenresType => ({
    data: [],
    error: {
      message,
    },
  });
}

export default new Genres();
