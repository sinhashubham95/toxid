import { Genres, Genre } from '../types/genres';
import { Movie } from '../types/movies';
import genres from '../utils/genres';
import movies from '../utils/movies';
import Movies from './content/Movies';
import withList from './hoc/withList';
import withSlider from './hoc/withSlider';

const ContentMovies = withList<Genre, Genres>(
  withSlider<Genre, Movie>(
    Movies,
    (genre?: Genre) => genre?.title,
    (item: Movie) => item.id,
    movies.getAllMovies,
  ),
  genres.getMovieGenres,
);

export default ContentMovies;
