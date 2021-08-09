import Player from "react-player";
import { makeStyles } from "@material-ui/core";
import { CommonProps } from "../../types/common";

const TvShowDetails = ({
  showErrorMessage,
}: CommonProps) => {
  const classes = useStyles();

  const renderPlayer = () => (
    <Player />
  );

  return (
    <div className={classes.root}>
      {renderPlayer()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

export default TvShowDetails;
