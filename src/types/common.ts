import { ClassValue } from "clsx";

export enum SnackState {
  Success = "success",
  Error = "error",
};

export interface SnackInfo {
  state: SnackState;
  message: string;
};

export interface CommonProps {
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
};

export interface ContentRoute {
  title: string;
  location: string;
};

export interface ProfilePhotoProps {
  onFileChange?: (file: File) => void;
  onClick?: () => void;
  photoUrl: string | null | undefined;
  avatarStyle?: ClassValue;
};

export interface PaginatedResponse<T> extends ErrorResponse {
  data: Array<T>;
  pageNumber: number;
  totalPages: number;
  total: number;
};

export interface ErrorResponse {
  error?: APIError;
};

export interface ListInfo<T> extends ErrorResponse {
  data: Array<T>;
};

export interface APIError {
  message: string;
};

export interface PaginatedData<T> {
  data: Array<T>;
  pagesFetched: number;
  totalPages: number;
};
