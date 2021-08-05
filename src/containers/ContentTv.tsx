import { Genres, Genre } from '../types/genres';
import { Tv as TvType } from '../types/tv';
import genres from '../utils/genres';
import tv from '../utils/tv';
import Tv from './content/Tv';
import withList from './hoc/withList';
import withSlider from './hoc/withSlider';

const ContentTv = withList<Genre, Genres>(
  withSlider<Genre, TvType>(
    Tv,
    (genre: Genre) => genre.title,
    tv.getPopularTVShows,
  ),
  genres.getTVGenres,
);

export default ContentTv;
