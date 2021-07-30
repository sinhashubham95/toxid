import React from 'react';
import { CssBaseline, Grid, makeStyles, Paper } from "@material-ui/core";

import logo from '../assets/logo.png';

const Auth = ({children}) => {
  const styles = useStyles();

  return (
    <Grid container component="main" className={styles.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={styles.image} />
      <Grid item xs={12} sm={8} md={5} elevation={6} square component={Paper}>
        <div className={styles.paper}>
          {children}
        </div>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${logo})`,
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default Auth;
