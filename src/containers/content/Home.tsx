import { useEffect, useState } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import { Movies } from "../../types/movies";

const Home = ({
  pageNumber,
  fetcher,
}: {
  pageNumber: number,
  fetcher: (pageNumber?: number) => Promise<Movies>,
}) => {
  const classes = useStyles();

  const [data, setData] = useState<Movies | null>(null);

  useEffect(() => {
    (async () => {
      const result = await fetcher(pageNumber);
      if (result.error) {
        // error occurred
      } else {
        setData(result);
      }
    })();
  }, [pageNumber, fetcher]);

  return (
    <Grid container spacing={2} className={classes.root}>
      {data && data.data.map(({ id, imageUrl, title }) => (
        <Grid item key={id} xs={12} sm={3}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                image={imageUrl}
                title={title}
                className={classes.media}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    margin: 0,
    padding: 0,
  },
  card: {
    maxWidth: 400,
    maxHeight: 600,
  },
  media: {
    height: 300,
  },
}));

export default Home;
