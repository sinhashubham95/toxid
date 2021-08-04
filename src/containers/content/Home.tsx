import { useEffect, useState, MouseEvent } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  List,
  makeStyles,
  Popover,
  Typography,
} from "@material-ui/core";
import { Movie, MovieAnchorInfo, Movies } from "../../types/movies";
import { Genre } from "../../types/genres";

const Home = ({
  param: genre,
  pageNumber,
  fetcher,
  showErrorMessage,
}: {
  param: Genre,
  pageNumber: number,
  totalPages: number,
  total: number,
  fetcher: (genre: Genre, pageNumber?: number) => Promise<Movies>,
  showErrorMessage: (message: string) => void,
}) => {
  const classes = useStyles();

  const [data, setData] = useState<Movies | null>(null);
  const [cardAnchor, setCardAnchor] = useState<MovieAnchorInfo | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetcher(genre, pageNumber);
      if (result.error) {
        // error occurred
        showErrorMessage(result.error.message);
      } else {
        setData(result);
      }
    })();
    // eslint-disable-next-line
  }, [pageNumber]);

  const onCardEnter = (item: Movie) => (event: MouseEvent<HTMLDivElement>) =>
    setCardAnchor({ anchor: event.currentTarget, item });

  const onCardLeave = () => setCardAnchor(null);

  const renderBasicCard = (item: Movie) => (
    <Card
      aria-owns={'card-popover'}
      aria-haspopup="true"
      className={classes.card}
      onMouseEnter={onCardEnter(item)}
      onMouseLeave={onCardLeave}
    >
      <CardActionArea>
        <CardMedia
          image={item.imageUrl}
          className={classes.media}
        />
      </CardActionArea>
    </Card>
  );

  const renderDetailedCard = (item: Movie) => (
    <Card className={classes.detailedCard}>
      <CardActionArea>
        <CardMedia
          image={item.backdropImageUrl}
          className={classes.detailedMedia}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {item.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {item.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  const renderCardPopover = (item: Movie) => (
    <Popover
      id="card-popover"
      className={classes.popover}
      open={!!cardAnchor && item.id === cardAnchor.item.id}
      anchorEl={cardAnchor?.anchor}
      anchorOrigin={{
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
      {renderDetailedCard(item)}
    </Popover>
  );

  const renderListItem = (item: Movie) => (
    <div key={item.id}>
      {renderBasicCard(item)}
      {cardAnchor && renderCardPopover(item)}
    </div>
  );

  return (
    <div className={classes.root}>
      <Typography component="h5" variant="h6" className={classes.title}>{genre.title}</Typography>
      <List style={{ display: "flex", flexDirection: "row", padding: 1 }}>
        {data?.data.map((value: Movie) => renderListItem(value))}
      </List>
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
    margin: theme.spacing(0, 2, 1)
  },
  card: {
    margin: theme.spacing(0, 2, 0),
    width: theme.spacing(50),
    height: theme.spacing(30),
  },
  media: {
    height: theme.spacing(30),
    objectFit: 'contain',
  },
  popover: {
    pointerEvents: 'none',
  },
  detailedCard: {
    minHeight: theme.spacing(50),
    width: theme.spacing(60),
  },
  detailedMedia: {
    height: theme.spacing(30),
  },
}));

export default Home;
