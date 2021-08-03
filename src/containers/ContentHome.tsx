import { Movies } from '../types/movies';
import movies from '../utils/movies';
import Home from './content/Home';
import withPagination from './hoc/withPagination';

const ContentHome = withPagination<Movies>(Home, movies.getPopularMovies);

export default ContentHome;
