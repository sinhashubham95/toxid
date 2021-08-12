import Axios from "axios";
import Env from "./env";
import {
  GET_ALL_TV_SHOWS_PATH,
  GET_POPULAR_TV_SHOWS_PATH,
  GET_TOP_RATED_TV_SHOWS_PATH,
  GET_TV_SHOW_DETAIL_PATH,
} from "../constants/api";
import { Genre } from "../types/genres";
import { PaginatedResponse } from "../types/common";
import {
  TvShowsResponse,
  TvShow,
  TvShowDetails,
  TvShowDetailsResponse,
  VideoDetail,
  VideoSite,
  SeasonDetail,
  CastDetail,
  CreatorDetail,
  VideoType,
} from "../types/tvShows";
import { EN, GB, IN } from "../constants/constants";

class TvShows {
  private readonly axios = Axios.create({
    baseURL: Env.getTMDBApiBaseUrl(),
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Env.getTMDBApiKey()}`,
    },
  });

  getAllTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_ALL_TV_SHOWS_PATH}&page=${pageNumber}&with_genres=${genre?.id}`);

  getTopRatedTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_TOP_RATED_TV_SHOWS_PATH}?page=${pageNumber}`);

  getPopularTvShows = async (genre?: Genre, pageNumber?: number): Promise<PaginatedResponse<TvShow>> =>
    this.getTvShows(`${GET_POPULAR_TV_SHOWS_PATH}?page=${pageNumber}`);

  getTvhowDetails = async (id: number): Promise<TvShowDetails> => {
    try {
      const { status, data } = await this.axios.get(
        `${GET_TV_SHOW_DETAIL_PATH}/${id}?append_to_response=aggregate_credits,videos,content_ratings,images`,
      );
      if (status === 200) {
        return this.getTvShowDetailsResponse(data as TvShowDetailsResponse);
      }
      return {
        error: {
          message: data.status_message,
        },
      };
    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  };

  private getImageUrl = (posterPath: string | null, backdropPath: string | null): string => {
    if (posterPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${posterPath}`;
    }
    if (backdropPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${backdropPath}`
    }
    return '';
  };

  private getBackdropImageUrl = (posterPath: string | null, backdropPath: string | null): string => {
    if (backdropPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${backdropPath}`
    }
    if (posterPath) {
      return `${Env.getTMDBImageApiBaseUrl()}${posterPath}`;
    }
    return '';
  };

  private getVideoUrl = (site: VideoSite, key: string): string => {
    switch(site) {
      case VideoSite.YouTube:
        return `${Env.getYouTubeBaseUrl()}/watch?v=${key}`;
      case VideoSite.Vimeo:
        return `${Env.getVimeoBaseUrl()}/${key}`;
    }
  };

  private getTvShowsResponse = (tvShows: TvShowsResponse): PaginatedResponse<TvShow> => ({
    pageNumber: tvShows.page,
    totalPages: tvShows.total_pages,
    total: tvShows.total_results,
    data: tvShows.results.map(({
      id,
      poster_path,
      backdrop_path,
      genre_ids,
      name,
      vote_average,
      overview,
    }) => ({
      id,
      imageUrl: this.getImageUrl(poster_path, backdrop_path),
      backdropImageUrl: this.getBackdropImageUrl(poster_path, backdrop_path),
      genres: genre_ids,
      title: name,
      description: overview,
      rating: vote_average,
    })),
  });

  private getError = (message: string): PaginatedResponse<TvShow> => ({
    pageNumber: 0,
    totalPages: 0,
    total: 0,
    data: [],
    error: {
      message,
    },
  });

  private getTvShows = async (url: string): Promise<PaginatedResponse<TvShow>> => {
    try {
      const { status, data } = await this.axios.get(url);
      if (status === 200) {
        return this.getTvShowsResponse(data as TvShowsResponse);
      }
      return this.getError(data.status_message);
    } catch (e) {
      return this.getError(e.message);
    }
  }

  private getCast = (tvShowDetails: TvShowDetailsResponse): Array<CastDetail> =>
    tvShowDetails.aggregate_credits.cast.map<CastDetail>(({
      id,
      name,
      character,
      profile_path,
      known_for_department,
    }) => ({
      id,
      name,
      character,
      imageUrl: this.getImageUrl(profile_path, null),
      knownFor: known_for_department,
    }));

  private getSeasonDetails = (tvShowDetails: TvShowDetailsResponse): Array<SeasonDetail> =>
    tvShowDetails.seasons.map<SeasonDetail>(({
      id,
      season_number,
      name,
      overview,
      episode_count,
      poster_path,
    }) => ({
      id,
      seasonNumber: season_number,
      name,
      description: overview,
      episodeCount: episode_count,
      imageUrl: this.getImageUrl(poster_path, null),
    }));

  private getVideoDetails = (tvShowDetails: TvShowDetailsResponse): Array<VideoDetail> => {
    const videoDetails = tvShowDetails.videos.results.map<VideoDetail>(({
      id, name, type, site, key
    }) => ({
      id,
      name,
      type,
      url: this.getVideoUrl(site, key),
    }));
    const trailer = videoDetails.find((video) => video.type === VideoType.Trailer);
    if (trailer) {
      // move trailer to the top
      return [trailer, ...videoDetails.filter((video) => video.type !== VideoType.Trailer)];
    }
    // otherwise don't have to do anything
    return videoDetails;
  };

  private getTypedRating = (value: string): any => {
    try {
      return JSON.parse(value);
    } catch (e) {}
    return value;
  };

  private getContentRating = (tvShowDetails: TvShowDetailsResponse): string => {
    const rating = tvShowDetails.content_ratings.results.find((rating) =>
      rating.iso_3166_1 === GB || rating.iso_3166_1 === IN);
    if (rating) {
      // found the required one
      return `${rating.rating}+`;
    }
    // otherwise just get the first one which is a age
    const filtered = tvShowDetails.content_ratings.results.filter((rating) =>
      typeof this.getTypedRating(rating.rating) === 'number');
    if (filtered.length > 0) {
      // then it means we have at least 1 entry
      return `${filtered[0].rating}+`;
    }
    if (tvShowDetails.content_ratings.results.length > 0) {
      return tvShowDetails.content_ratings.results[0].rating;
    }
    return "";
  };

  private getLogo = (tvShowDetails: TvShowDetailsResponse): string => {
    const logo = tvShowDetails.images.logos.find((image) => image.iso_639_1 === EN);
    if (logo) {
      // found the one
      return this.getImageUrl(logo.file_path, null);
    }
    // otherwise just use the first one, if available
    if (tvShowDetails.images.logos.length > 0) {
      return this.getImageUrl(tvShowDetails.images.logos[0].file_path, null);
    }
    return "";
  };

  private getTvShowDetailsResponse = (tvShowDetails: TvShowDetailsResponse): TvShowDetails => ({
    data: {
      id: tvShowDetails.id,
      title: tvShowDetails.name,
      description: tvShowDetails.overview,
      imageUrl: this.getImageUrl(tvShowDetails.poster_path, tvShowDetails.backdrop_path),
      backdropImageUrl: this.getBackdropImageUrl(tvShowDetails.poster_path, tvShowDetails.backdrop_path),
      releaseDate: tvShowDetails.first_air_date,
      creators: tvShowDetails.created_by.map<CreatorDetail>(({ id, name, profile_path }) =>
        ({ id, name, imageUrl: this.getImageUrl(profile_path, null)})),
      genres: tvShowDetails.genres.map<Genre>(({ id, name }) => ({ id, title: name })),
      videos: this.getVideoDetails(tvShowDetails),
      rating: tvShowDetails.vote_average,
      seasons: this.getSeasonDetails(tvShowDetails),
      cast: this.getCast(tvShowDetails),
      contentRating: this.getContentRating(tvShowDetails),
      logo: this.getLogo(tvShowDetails),
    },
  });
}

export default new TvShows();
