import { Button, withStyles } from "@material-ui/core";

const withButtonColor = (color: string, backgroundColor: string, hoverBackgroundColor: string) => withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(color),
    backgroundColor,
    '&:hover': {
      backgroundColor: hoverBackgroundColor,
    },
  },
}))(Button);

export default withButtonColor;
