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
