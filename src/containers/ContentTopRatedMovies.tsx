import { Genre } from "../types/genres";
import { Movie } from "../types/movies";
import movies from "../utils/movies";
import Movies from "./content/Movies";
import withGrid from "./hoc/withGrid";

const ContentTopRatedMovies = withGrid<Genre, Movie>(
  Movies,
  "topRatedMovies",
  () => undefined,
  (movie: Movie) => movie.id,
  movies.getTopRatedMovies,
);

export default ContentTopRatedMovies;
