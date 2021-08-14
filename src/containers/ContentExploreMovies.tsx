import { Genre } from "../types/genres";
import { Movie } from "../types/movies";
import movies from "../utils/movies";
import Movies from "./content/Movies";
import withGrid from "./hoc/withGrid";

const ContentExploreMovies = withGrid<Genre, Movie>(
  Movies,
  null,
  (id?: number, title?: string) => (id && title ? { id, title } : undefined),
  (movie: Movie) => movie.id,
  movies.getAllMovies
);

export default ContentExploreMovies;
