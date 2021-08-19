import {
  Box,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  Collapse,
  CardActionArea,
} from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { EpisodeDetail, TvShowSeasonDetailsData } from "../../types/tvShows";
import tvShows from "../../utils/tvShows";

const TvShowSeasonDetails = ({
  id,
  seasonNumber,
  showErrorMessage,
}: {
  id: number;
  seasonNumber: number;
  showErrorMessage: (message: string) => void;
}) => {
  const classes = useStyles();

  // handling media
  const theme = useTheme();
  const belowMd = useMediaQuery(theme.breakpoints.down("md"));

  const [data, setData] = useState<TvShowSeasonDetailsData | null>(null);
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    (async () => {
      const result = await tvShows.getTvShowSeasonDetails(id, seasonNumber);
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
  }, [id, seasonNumber, showErrorMessage]);

  const renderEpisodeNumber = (episodeNumber: number) => (
    <Box
      className={classes.index}
      component="div"
      display={{ xs: "none", sm: "none", md: "flex" }}
    >
      <Typography variant="h6">{episodeNumber}</Typography>
    </Box>
  );

  const renderEpisodePoster = (imageUrl: string, name: string) => (
    <CardMedia image={imageUrl} title={name} className={classes.media} />
  );

  const renderEpisodeTitle = (episodeNumber: number, name: string) => (
    <Typography
      className={classes.title}
    >{`${episodeNumber}. ${name}`}</Typography>
  );

  const renderEpisodeDescription = (name: string, description: string) => (
    <CardContent className={classes.content}>
      {name && (
        <Typography component="h5" variant="h5">
          {name}
        </Typography>
      )}
      <Typography variant="subtitle1" color="textSecondary">
        {description}
      </Typography>
    </CardContent>
  );

  const renderBelowMdCard = (
    { id, name, description, episodeNumber, imageUrl }: EpisodeDetail,
    index: number
  ) => (
    <Card
      onClick={() => setExpanded({ ...expanded, [index]: !expanded[index] })}
    >
      <CardActionArea className={classes.card}>
        <div className={classes.details}>
          {renderEpisodePoster(imageUrl, name)}
          {renderEpisodeTitle(episodeNumber, name)}
        </div>
        <Collapse in={!!expanded[index]} timeout="auto" unmountOnExit>
          {renderEpisodeDescription("", description)}
        </Collapse>
      </CardActionArea>
    </Card>
  );

  const renderNotBelowMdCard = ({
    id,
    name,
    description,
    episodeNumber,
    imageUrl,
  }: EpisodeDetail) => (
    <Card className={classes.card}>
      {renderEpisodeNumber(episodeNumber)}
      {renderEpisodePoster(imageUrl, name)}
      {renderEpisodeDescription(name, description)}
    </Card>
  );

  const renderEpisode = (episode: EpisodeDetail, index: number) => (
    <ListItem key={id}>
      {belowMd && renderBelowMdCard(episode, index)}
      {!belowMd && renderNotBelowMdCard(episode)}
    </ListItem>
  );

  return (
    <List className={classes.root}>
      {data?.episodes?.map((episode, index) => renderEpisode(episode, index))}
    </List>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: theme.spacing(2, 2, 0),
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      padding: theme.spacing(0, 2, 0),
    },
  },
  details: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  index: {
    width: "2%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    width: "65%",
    marginLeft: "5%",
    [theme.breakpoints.down("md")]: {
      justifyContent: "center",
      alignItems: "flex-start",
      width: "100%",
      marginLeft: 0,
    },
  },
  title: {
    width: "75%",
    marginLeft: "5%",
  },
  media: {
    height: 150,
    width: "20%",
    margin: theme.spacing(2, 0, 2),
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "center",
    [theme.breakpoints.down("md")]: {
      margin: 0,
      width: "30%",
      height: 100,
    },
  },
}));

export default TvShowSeasonDetails;
