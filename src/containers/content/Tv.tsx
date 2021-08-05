import { useState, MouseEvent } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  makeStyles,
  Popover,
  Typography,
} from "@material-ui/core";
import { Tv as TvType } from "../../types/tv";

const Tv = ({
  data,
}: {
  data: TvType,
}) => {
  const classes = useStyles();

  const [cardAnchor, setCardAnchor] = useState<HTMLElement | null>(null);

  const onCardEnter = (event: MouseEvent<HTMLDivElement>) =>
    setCardAnchor(event.currentTarget);

  const onCardLeave = () => setCardAnchor(null);

  const renderBasicCard = () => (
    <Card
      aria-owns={'card-popover'}
      aria-haspopup="true"
      className={classes.card}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
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
    <Card className={classes.detailedCard}>
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
      {renderDetailedCard()}
    </Popover>
  );

  return (
    <div key={data.id}>
      {renderBasicCard()}
      {cardAnchor && renderCardPopover()}
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

export default Tv;
