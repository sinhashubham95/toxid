import { useEffect, useState } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  List,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Movie, Movies } from "../../types/movies";
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

  const renderListItem = (item: Movie) => (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          image={item.imageUrl}
          title={item.title}
          className={classes.media}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {item.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <div className={classes.root}>
      <Typography component="h2" variant="h5" className={classes.title}>{genre.title}</Typography>
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
  },
  title: {
    margin: theme.spacing(0, 0, 2)
  },
  card: {
    margin: theme.spacing(0, 2, 0),
    minWidth: theme.spacing(50),
    minHeight: theme.spacing(40),
  },
  media: {
    height: theme.spacing(30),
    objectFit: 'contain',
  },
}));

export default Home;
