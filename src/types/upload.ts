export interface UploadError {
  code: string;
  message: string;
};

export interface UploadResult {
  downloadUrl?: string;
  error?: UploadError;
};
