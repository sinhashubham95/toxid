import Home from "@material-ui/icons/Home";
import { ContentRoute } from "../types/common";

export const SIGN_IN = "/";

export const SIGN_UP = "/signUp";

export const FORGOT_PASSWORD = "/forgotPassword";

export const BASIC_INFO = "/basicInfo";

export const CONTENT = "/content"

export const HOME = `${CONTENT}/home`;

export const CONTENT_ROUTES: Array<ContentRoute> = [
  {
    title: "home",
    icon: Home,
    location: HOME,
  },
];
