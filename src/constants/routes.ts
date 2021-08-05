import { ContentRoute } from "../types/common";

export const SIGN_IN = "/";

export const SIGN_UP = "/signUp";

export const FORGOT_PASSWORD = "/forgotPassword";

export const BASIC_INFO = "/basicInfo";

export const CONTENT = "/content"

export const HOME = `${CONTENT}/home`;

export const MOVIES = `${CONTENT}/movies`;

export const TV = `${CONTENT}/tv`;

export const CONTENT_ROUTES: Array<ContentRoute> = [
  {
    title: "home",
    location: HOME,
  },
  {
    title: "movies",
    location: MOVIES,
  },
  {
    title: "tv",
    location: TV,
  },
];
