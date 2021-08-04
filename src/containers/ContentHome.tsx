import { Genres, Genre } from '../types/genres';
import genres from '../utils/genres';
import Home from './content/Home';
import withList from './hoc/withList';

const ContentHome = withList<Genre, Genres>(
  Home,
  genres.getGenres,
);

export default ContentHome;
