import React, { useEffect, FunctionComponent, useState } from 'react';
import { CssBaseline, Grid, makeStyles, Paper, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import Images from '../../assets';
import auth from '../../utils/auth';
import { AuthExtra, AuthInfo, AuthProps } from '../../types/auth';
import { SnackInfo, SnackState } from '../../types/common';

const withAuth = (
  Component: FunctionComponent<AuthProps>,
  title: string,
  method: Function,
  extras: Array<AuthExtra>
) => () => {
  const classes = useStyles();

  const [snack, setSnack] = useState<SnackInfo | null>(null);

  useEffect(() => auth.onAuthStateChange(onAuthStateChange));

  const onAuthStateChange = (authInfo: AuthInfo) => { };

  const onCloseSnack = () => setSnack(null);

  const showSuccessMessage = (message: string) => setSnack({
    state: SnackState.Success,
    message,
  });

  const showErrorMessage = (message: string) => setSnack({
    state: SnackState.Error,
    message,
  });

  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} elevation={6} square component={Paper}>
          <Component
            title={title}
            method={method}
            extras={extras}
            showSuccessMessage={showSuccessMessage}
            showErrorMessage={showErrorMessage}
          />
        </Grid>
      </Grid>
      <Snackbar open={!!snack} autoHideDuration={6000} onClose={onCloseSnack}>
        <Alert elevation={6} variant="filled" severity={snack?.state} onClose={onCloseSnack}>
          {snack?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: `url(${Images.logo})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default withAuth;
