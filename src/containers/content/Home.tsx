import { useEffect, useState, MouseEvent, createRef } from "react";
import Slider from "react-slick";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  makeStyles,
  Popover,
  Typography,
} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { Movie, MovieAnchorInfo, PaginatedMovies } from "../../types/movies";
import { Genre } from "../../types/genres";
import movies from "../../utils/movies";

const Home = ({
  data: genre,
  showErrorMessage,
}: {
  data: Genre,
  showErrorMessage: (message: string) => void,
}) => {
  const classes = useStyles();

  const slider = createRef<Slider>();

  const [data, setData] = useState<PaginatedMovies>({
    data: [],
    pagesFetched: 0,
    totalPages: 0,
  });
  const [cardAnchor, setCardAnchor] = useState<MovieAnchorInfo | null>(null);

  useEffect(() => {
    if (data.pagesFetched === 0) {
      // fetch the data for the first time, which is the first page
      // here we will populate additional information as well
      (async () => {
        const result = await movies.getPopularMovies(genre);
        if (result.error) {
          // error occurred
          showErrorMessage(result.error.message);
        } else {
          setData({
            data: result.data,
            pagesFetched: 1,
            totalPages: result.totalPages,
          });
        }
      })();
    }
  }, [data, genre, showErrorMessage]);

  const onCardEnter = (item: Movie) => (event: MouseEvent<HTMLDivElement>) =>
    setCardAnchor({ anchor: event.currentTarget, item });

  const onCardLeave = () => setCardAnchor(null);

  const onSliderChange = async (index: number) => {
    if (index >= (data.data.length - 10)) {
      // in this case we need to fetch the next page
      // when we are on the second last page
      const result = await movies.getPopularMovies(genre, data.pagesFetched + 1);
      if (result.error) {
        // error occurred
        showErrorMessage(result.error.message);
        return;
      }
      setData({
        ...data,
        data: [...result.data, ...result.data],
        pagesFetched: data.pagesFetched + 1,
      });
    }
  };

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

  const renderCard = (item: Movie) => (
    <div key={item.id}>
      {renderBasicCard(item)}
      {cardAnchor && renderCardPopover(item)}
    </div>
  );

  const renderPreviousArrow = () => (
    <IconButton
      size="medium"
      onClick={() => slider.current?.slickPrev()}
    >
      <ChevronLeft fontSize="large" />
    </IconButton>
  );

  const renderNextArrow = () => (
    <IconButton
      size="medium"
      onClick={() => slider.current?.slickNext()}
    >
      <ChevronRight fontSize="large" />
    </IconButton>
  );

  return (
    <div className={classes.root}>
      <Typography component="h5" variant="h6" className={classes.title}>{genre.title}</Typography>
      <div className={classes.page}>
        {renderPreviousArrow()}
        <Slider
          ref={slider}
          className={classes.slider}
          infinite={false}
          lazyLoad="progressive"
          slidesToShow={5}
          slidesToScroll={5}
          afterChange={onSliderChange}
        >
          {data.data.map(renderCard)}
        </Slider>
        {renderNextArrow()}
      </div>
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
