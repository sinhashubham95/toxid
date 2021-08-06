import { EXPLORE_TV_SHOWS } from '../constants/routes';
import { Genres, Genre } from '../types/genres';
import { TvShow } from '../types/tvShows';
import genres from '../utils/genres';
import tvShows from '../utils/tvShows';
import TvShows from './content/TvShows';
import withList from './hoc/withList';
import withSlider from './hoc/withSlider';

const ContentTv = withList<Genre, Genres>(
  withSlider<Genre, TvShow>(
    TvShows,
    (genre?: Genre) => `${EXPLORE_TV_SHOWS}/${genre?.id}/${genre?.title}`,
    (genre?: Genre) => genre?.title,
    (item: TvShow) => item.id,
    tvShows.getAllTvShows,
  ),
  genres.getTVGenres,
);

export default ContentTv;
