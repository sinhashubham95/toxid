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
import { CommonProps } from '../../types/common';

const Home = ({
  showErrorMessage,
}: CommonProps) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const getTvShowKey = (item: TvShow) => item.id;

  const getMovieKey = (item: Movie) => item.id;

  return (
    <div className={classes.root}>
      <List>
        {withSlider<Genre, TvShow>(TvShows, () => t("topRatedTvShows"), getTvShowKey, tvShows.getTopRatedTvShows)({ showErrorMessage })}
        {withSlider<Genre, TvShow>(TvShows, () => t("popularTvShows"), getTvShowKey, tvShows.getPopularTvShows)({ showErrorMessage })}
        {withSlider<Genre, Movie>(Movies, () => t("topRatedMovies"), getMovieKey, movies.getTopRatedMovies)({ showErrorMessage })}
        {withSlider<Genre, Movie>(Movies, () => t("popularMovies"), getMovieKey, movies.getPopularMovies)({ showErrorMessage })}
        {withSlider<Genre, Movie>(Movies, () => t("upcomingMovies"), getMovieKey, movies.getUpcomingMovies)({ showErrorMessage })}
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
