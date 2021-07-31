import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { CommonProps } from "./common";

export type AuthErrorInfo = {
  code: string;
  message: string;
};

export enum AuthState {
  SignedIn,
  SignedOut
};

export interface AuthDetails {
  userId: string;
  displayName: string | null;
  email: string | null;
};

export interface AuthInfo {
  state: AuthState;
  details?: AuthDetails;
  error?: AuthErrorInfo;
};

export interface AuthExtra {
  title: string;
  link: string;
};

export interface SignInExtra {
  title: string;
  color: { [key: string]: string };
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  handler: Function;
};

export interface AuthProps extends CommonProps {
  title: string;
  method: Function;
  extras: Array<AuthExtra>;
  signInExtras: Array<SignInExtra>;
};
