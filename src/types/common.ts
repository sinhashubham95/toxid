import { SvgIconTypeMap } from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";

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
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  location: string;
};
