import { useState, MouseEvent } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Popover,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { Movie } from "../../types/movies";
import { POPOVER_DELAY_MILLIS } from "../../constants/constants";

const Movies = ({
  data,
  popover,
}: {
  data: Movie,
  popover: boolean,
}) => {
  const classes = useStyles();

  // handling media
  const theme = useTheme();
  const belowSm = useMediaQuery(theme.breakpoints.down('sm'));

  const [cardTimeout, setCardTimeout] = useState<number>(0);
  const [cardAnchor, setCardAnchor] = useState<HTMLElement | null>(null);

  const onCardEnter = (event: MouseEvent<HTMLDivElement>) =>
    setCardTimeout(setTimeout((target: HTMLElement) => setCardAnchor(target),
      POPOVER_DELAY_MILLIS, event.currentTarget));

  const onCardLeave = () => {
    if (cardTimeout) {
      clearTimeout(cardTimeout);
      setCardTimeout(0);
    }
    setCardAnchor(null);
  };

  const renderBasicCard = () => (
    <Card
      aria-owns="card-popover"
      aria-haspopup="true"
      className={classes.card}
      onMouseEnter={onCardEnter}
    >
      <CardActionArea>
        <CardMedia
          image={data.imageUrl}
          className={classes.media}
        />
      </CardActionArea>
    </Card>
  );

  const renderDetailedCard = () => (
    <Card className={classes.detailedCard} onMouseLeave={onCardLeave}>
      <CardActionArea>
        <CardMedia
          image={data.backdropImageUrl}
          className={classes.detailedMedia}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const renderCardPopover = () => (
    <Popover
      id="card-popover"
      className={classes.popover}
      open={!!cardAnchor}
      anchorEl={cardAnchor}
      anchorOrigin={belowSm ? undefined : {
        vertical: 'center',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'center',
      }}
      onClose={onCardLeave}
      disableRestoreFocus
    >
      {renderDetailedCard()}
    </Popover>
  );

  return (
    <div key={data.id}>
      {renderBasicCard()}
      {popover && cardAnchor && renderCardPopover()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: theme.spacing(4),
  },
  title: {
    margin: theme.spacing(0, 10, 1)
  },
  page: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slider: {
    width: '92%',
  },
  card: {
    margin: theme.spacing(0, 2, 0),
    maxWidth: theme.spacing(50),
    height: theme.spacing(40),
    [theme.breakpoints.down('md')]: {
      height: theme.spacing(30),
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(20),
    },
  },
  media: {
    height: theme.spacing(40),
    [theme.breakpoints.down('md')]: {
      height: theme.spacing(30),
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(20),
    },
    objectFit: 'contain',
  },
  popover: {
    pointerEvents: 'auto',
  },
  detailedCard: {
    minHeight: theme.spacing(30),
    width: theme.spacing(60),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(40),
    },
  },
  detailedMedia: {
    height: theme.spacing(30),
  },
}));

export default Movies;
