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

export interface Username {
  firstName: string | null;
  lastName: string | null;
};

export interface UserInfo extends Username {
  email: string | null;
  emailVerified: boolean;
  countryCode: string | null;
  phoneNumber: string | null;
  phoneNumberVerified: boolean;
  dob: Date | null;
};

export interface AuthDetails extends UserInfo {
  userId: string;
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
