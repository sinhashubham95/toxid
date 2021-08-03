import { ErrorResponse, ListInfo } from "./common";

export interface Genre {
  id: number;
  title: string;
};

export interface Genres extends ListInfo<Genre> { };

export interface GenresResponse {
  genres: Array<{
    id: number;
    name: string;
  }>;
};
