import { useTranslation } from 'react-i18next';
import { List, makeStyles } from '@material-ui/core';
import withSlider from '../hoc/withSlider';
import { Genre } from '../../types/genres';
import { Movie } from '../../types/movies';
import { TvShow } from '../../types/tvShows';
import TvShows from './TvShows';
import Movies from './Movies';
import tvShows from '../../utils/tvShows';
import movies from '../../utils/movies';
import { CommonProps, PaginatedResponse } from '../../types/common';
import {
  EXPLORE_POPULAR_MOVIES,
  EXPLORE_POPULAR_TV_SHOWS,
  EXPLORE_TOP_RATED_MOVIES,
  EXPLORE_TOP_RATED_TV_SHOWS,
  EXPLORE_UPCOMING_MOVIES,
} from '../../constants/routes';

const Home = ({
  showErrorMessage,
}: CommonProps) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const getTvShowKey = (item: TvShow) => item.id;

  const getMovieKey = (item: Movie) => item.id;

  const renderSliderForTvShows = (
    title: string,
    location: string,
    fetcher: (genre?: Genre, pageNumber?: number) => Promise<PaginatedResponse<TvShow>>,
  ) => withSlider<Genre, TvShow>(
    TvShows,
    location,
    () => title,
    getTvShowKey,
    fetcher,
  )({ showErrorMessage });

  const renderSliderForMovies = (
    title: string,
    location: string,
    fetcher: (genre?: Genre, pageNumber?: number) => Promise<PaginatedResponse<Movie>>,
  ) => withSlider<Genre, Movie>(
    Movies,
    location,
    () => title,
    getMovieKey,
    fetcher,
  )({ showErrorMessage });

  return (
    <div className={classes.root}>
      <List>
        {renderSliderForTvShows(t("topRatedTvShows"), EXPLORE_TOP_RATED_TV_SHOWS, tvShows.getTopRatedTvShows)}
        {renderSliderForTvShows(t("popularTvShows"), EXPLORE_POPULAR_TV_SHOWS, tvShows.getPopularTvShows)}
        {renderSliderForMovies(t("topRatedMovies"), EXPLORE_TOP_RATED_MOVIES, movies.getTopRatedMovies)}
        {renderSliderForMovies(t("popularMovies"), EXPLORE_POPULAR_MOVIES, movies.getPopularMovies)}
        {renderSliderForMovies(t("upcomingMovies"), EXPLORE_UPCOMING_MOVIES, movies.getUpcomingMovies)}
      </List>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

export default Home;
