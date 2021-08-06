import { Genre } from "../types/genres";
import { TvShow } from "../types/tvShows";
import tvShows from "../utils/tvShows";
import TvShows from "./content/TvShows";
import withGrid from "./hoc/withGrid";

const ContentExploreTvShows = withGrid<Genre, TvShow>(
  TvShows,
  null,
  (id?: number, title?: string) => id && title ? { id, title } : undefined,
  (tvShow: TvShow) => tvShow.id,
  tvShows.getAllTvShows,
);

export default ContentExploreTvShows;
