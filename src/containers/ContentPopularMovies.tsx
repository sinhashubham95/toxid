import { Genre } from "../types/genres";
import { Movie } from "../types/movies";
import movies from "../utils/movies";
import Movies from "./content/Movies";
import withGrid from "./hoc/withGrid";

const ContentPopularMovies = withGrid<Genre, Movie>(
  Movies,
  "popularMovies",
  () => undefined,
  (movie: Movie) => movie.id,
  movies.getPopularMovies,
);

export default ContentPopularMovies;
