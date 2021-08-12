import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Player from "react-player";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Grid,
  makeStyles,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { CommonProps } from "../../types/common";
import tvShows from "../../utils/tvShows";
import { TvShowDetailsData, VideoDetail } from "../../types/tvShows";

const TvShowDetails = ({ showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const { t } = useTranslation();

  // handling media
  const theme = useTheme();
  const belowMd = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<TvShowDetailsData | null>(null);

  useEffect(() => {
    (async () => {
      const result = await tvShows.getTvhowDetails(JSON.parse(id) as number);
      if (result.error) {
        // some error occurred
        showErrorMessage(result.error.message);
        return;
      }
      if (result.data) {
        // we got data
        setData(result.data);
      }
    })();
  }, [id, showErrorMessage]);

  const renderTrailer = (video: VideoDetail) => (
    <div className={classes.trailer}>
      <Player url={video.url} loop playing width="100%" height="100%" />
    </div>
  );

  const renderLogo = (logo: string) => (
    <Box
      className={classes.logo}
      component="div"
      style={{ backgroundImage: `url(${logo})` }}
      display={{ xs: "none", sm: "none", md: "block" }}
    />
  );

  const renderTitle = (title: string) => (
    <Box
      className={classes.title}
      component="div"
      display={{ xs: "block", sm: "block", md: "none" }}
    >
      <Typography variant="h5" component="h4">
        {title}
      </Typography>
    </Box>
  );

  const renderLeftDetailsHeading = (tvShow: TvShowDetailsData) => (
    <Grid item>
      <Grid container direction="row" spacing={3} alignItems="center">
        <Grid item>
          <Rating
            name="rating"
            value={tvShow.rating / 2}
            precision={0.1}
            size={belowMd ? "small" : undefined}
          />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h6">
            {moment(tvShow.releaseDate).year()}
          </Typography>
        </Grid>
        <Grid item className={classes.contentRating}>
          <Typography className={classes.contentRatingText}>
            {tvShow.contentRating}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h6">
            {`${tvShow.seasons.length} ${
              tvShow.seasons.length === 1 ? t("season") : t("seasons")
            }`}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderLeftDetails = (tvShow: TvShowDetailsData) => (
    <Grid item xs={11} sm={11} md={8}>
      <Grid container direction="column" spacing={2}>
        {renderLeftDetailsHeading(tvShow)}
        <Grid item>
          <Typography variant="body1" component="p">
            {tvShow.description}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderCastNames = (tvShow: TvShowDetailsData) => (
    <Typography variant="body2">
      <Typography variant="caption">{t("cast")}: </Typography>
      {tvShow.cast.reduce<string>((current, { name }, index) => {
        if (index === 0) {
          return name;
        }
        if (index <= 3) {
          return current + ", " + name;
        }
        if (index === 4) {
          return current + ", ...";
        }
        return current;
      }, "")}
    </Typography>
  );

  const renderGenreNames = (tvShow: TvShowDetailsData) => (
    <Typography variant="body2">
      <Typography variant="caption">{t("genres")}: </Typography>
      {tvShow.genres.reduce<string>((current, { title }, index) => {
        if (index === 0) {
          return title;
        }
        if (index <= 3) {
          return current + ", " + title;
        }
        if (index === 4) {
          return current + ", ...";
        }
        return current;
      }, "")}
    </Typography>
  );

  const renderRightDetailsCast = (tvShow: TvShowDetailsData) => (
    <Grid item>{renderCastNames(tvShow)}</Grid>
  );

  const renderRightDetailsGenres = (tvShow: TvShowDetailsData) => (
    <Grid item>{renderGenreNames(tvShow)}</Grid>
  );

  const renderRightDetails = (tvShow: TvShowDetailsData) => (
    <Grid item xs={10} sm={11} md={4}>
      <Grid container direction="column" spacing={1}>
        {renderRightDetailsCast(tvShow)}
        {renderRightDetailsGenres(tvShow)}
      </Grid>
    </Grid>
  );

  const renderDetails = (tvShow: TvShowDetailsData) => (
    <Grid container spacing={2} className={classes.details}>
      {renderLeftDetails(tvShow)}
      {renderRightDetails(tvShow)}
    </Grid>
  );

  return (
    <div className={classes.root}>
      {data?.videos?.length && renderTrailer(data.videos[0])}
      {data?.logo && renderLogo(data.logo)}
      {data?.title && renderTitle(data.title)}
      {data && renderDetails(data)}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    overflowY: "scroll",
  },
  trailer: {
    width: "100%",
    height: "80vh",
    [theme.breakpoints.only("xs")]: {
      height: "40vh",
    },
    [theme.breakpoints.only("sm")]: {
      height: "50vh",
    },
  },
  logo: {
    width: theme.spacing(50),
    height: theme.spacing(25),
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    position: "absolute",
    top: theme.spacing(10),
    left: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2, 3, 0),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(2, 2, 0),
    },
  },
  details: {
    margin: theme.spacing(2, 2, 0),
    [theme.breakpoints.down("md")]: {
      margin: theme.spacing(0, 1, 0),
    },
  },
  contentRating: {
    border: "1px solid currentColor",
  },
  contentRatingText: {
    lineHeight: 0,
  },
}));

export default TvShowDetails;
