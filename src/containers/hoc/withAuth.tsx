import React, { useEffect, FunctionComponent } from 'react';
import { CssBaseline, Grid, makeStyles, Paper } from "@material-ui/core";

import Images from '../../assets';
import auth from '../../utils/auth';
import { AuthExtra, AuthInfo } from '../../types/auth';

const withAuth = (
  Component: FunctionComponent<{ title: string, method: Function, extras: Array<AuthExtra> }>,
  title: string,
  method: Function,
  extras: Array<AuthExtra>
) => () => {
  const classes = useStyles();

  useEffect(() => auth.onAuthStateChange(onAuthStateChange));

  const onAuthStateChange = (authInfo: AuthInfo) => { };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} elevation={6} square component={Paper}>
        <Component title={title} method={method} extras={extras} />
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${Images.logo})`,
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default withAuth;
