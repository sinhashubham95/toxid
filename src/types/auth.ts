export type ErrorInfo = {
  code: string;
  message: string;
};

export enum AuthState {
  SignedIn,
  SignedOut
};

export type AuthDetails = {
  userId: string;
  displayName: string;
  email: string;
};

export type AuthInfo = {
  state: AuthState;
  details?: AuthDetails;
  error?: ErrorInfo;
};

export type AuthExtra = {
  title: string;
  link: string;
};