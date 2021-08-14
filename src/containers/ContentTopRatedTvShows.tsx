import { Genre } from "../types/genres";
import { TvShow } from "../types/tvShows";
import tvShows from "../utils/tvShows";
import TvShows from "./content/TvShows";
import withGrid from "./hoc/withGrid";

const ContentTopRatedTvShows = withGrid<Genre, TvShow>(
  TvShows,
  "topRatedTvShows",
  () => undefined,
  (tvShow: TvShow) => tvShow.id,
  tvShows.getTopRatedTvShows
);

export default ContentTopRatedTvShows;
