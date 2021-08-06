import { Genre } from "../types/genres";
import { Movie } from "../types/movies";
import movies from "../utils/movies";
import Movies from "./content/Movies";
import withGrid from "./hoc/withGrid";

const ContentUpcomingMovies = withGrid<Genre, Movie>(
  Movies,
  "upcomingMovies",
  () => undefined,
  (movie: Movie) => movie.id,
  movies.getUpcomingMovies,
);

export default ContentUpcomingMovies;
