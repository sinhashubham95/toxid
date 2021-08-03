import { Genres, Genre } from '../types/genres';
import { Movies } from '../types/movies';
import genres from '../utils/genres';
import movies from '../utils/movies';
import Home from './content/Home';
import withList from './hoc/withList';
import withPagination from './hoc/withPagination';

const ContentHome = withList<Genre, Genres>(
  withPagination<Genre, Movies>(Home, movies.getPopularMovies),
  genres.getGenres,
);

export default ContentHome;
