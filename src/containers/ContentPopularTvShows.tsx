import { Genre } from "../types/genres";
import { TvShow } from "../types/tvShows";
import tvShows from "../utils/tvShows";
import TvShows from "./content/TvShows";
import withGrid from "./hoc/withGrid";

const ContentPopularTvShows = withGrid<Genre, TvShow>(
  TvShows,
  "popularTvShows",
  () => undefined,
  (tvShow: TvShow) => tvShow.id,
  tvShows.getPopularTvShows
);

export default ContentPopularTvShows;
