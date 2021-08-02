class Env {
  getTMDBApiBaseUrl = (): string => {
    const url = process.env.TMDB_API_BASE_URL;
    if (typeof url === "string") {
      return url;
    }
    return "";
  };

  getTMDBImageApiBaseUrl = (): string => {
    const url = process.env.TMDB_IMAGE_API_BASE_URL;
    if (typeof url === "string") {
      return url;
    }
    return "";
  };

  getTMDBApiKey = (): string => {
    const key = process.env.TMDB_API_KEY;
    if (typeof key === "string") {
      return key;
    }
    return "";
  };
}

export default new Env();
