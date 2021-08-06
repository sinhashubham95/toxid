import { ContentRoute } from "../types/common";

export const SIGN_IN = "/";

export const SIGN_UP = "/signUp";

export const FORGOT_PASSWORD = "/forgotPassword";

export const BASIC_INFO = "/basicInfo";

export const CONTENT = "/content"

export const EXPLORE = "/explore";

export const HOME = `${CONTENT}/home`;

export const TV = `${CONTENT}/tv`;

export const EXPLORE_TOP_RATED_TV_SHOWS = `${EXPLORE}/tv/top-rated`;

export const EXPLORE_POPULAR_TV_SHOWS = `${EXPLORE}/tv/popular`;

export const EXPLORE_TV_SHOWS = `${EXPLORE}/tv/all`;

export const MOVIES = `${CONTENT}/movies`;

export const EXPLORE_TOP_RATED_MOVIES = `${EXPLORE}/movies/top-rated`;

export const EXPLORE_POPULAR_MOVIES = `${EXPLORE}/movies/popular`;

export const EXPLORE_UPCOMING_MOVIES = `${EXPLORE}/movies/upcoming`;

export const EXPLORE_MOVIES = `${EXPLORE}/movies/all`;

export const CONTENT_ROUTES: Array<ContentRoute> = [
  {
    title: "home",
    location: HOME,
  },
  {
    title: "tv",
    location: TV,
  },
  {
    title: "movies",
    location: MOVIES,
  },
];
