class Env {
  getTMDBApiBaseUrl = (): string => this.get("REACT_APP_TMDB_API_BASE_URL");

  getTMDBImageApiBaseUrl = (): string => this.get("REACT_APP_TMDB_IMAGE_API_BASE_URL");

  getTMDBApiKey = (): string => this.get("REACT_APP_TMDB_API_KEY");

  getYouTubeBaseUrl = (): string => this.get("REACT_APP_YOUTUBE_BASE_URL");

  getVimeoBaseUrl = (): string => this.get("REACT_APP_VIMEO_BASE_URL");

  private get = (key: string): string => {
    const value = process.env[key];
    if (typeof value === "string") {
      return value;
    }
    return "";
  };
}

export default new Env();
