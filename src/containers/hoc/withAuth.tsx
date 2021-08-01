import React, { useEffect, FunctionComponent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { CssBaseline, Grid, makeStyles, Paper, Snackbar } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';

import Images from '../../assets';
import { AuthExtra, AuthInfo, AuthProps, SignInExtra } from '../../types/auth';
import { SnackInfo, SnackState } from '../../types/common';
import isSignedInSelector from '../../recoil/selectors/auth/isSignedIn';
import isMandatoryUserInfoAvailableSelector from '../../recoil/selectors/auth/isMandatoryUserInfoAvailable';
import { BASIC_INFO } from '../../constants/routes';
import auth from '../../utils/auth';
import authInfo from '../../recoil/atoms/auth/authInfo';

const withAuth = (
  Component: FunctionComponent<AuthProps>,
  title: string,
  method: Function,
  extras: Array<AuthExtra>,
  signInExtras: Array<SignInExtra>,
) => () => {
  const classes = useStyles();

  const history = useHistory();

  const setAuthInfo = useRecoilState(authInfo)[1];
  const isSignedIn = useRecoilValue(isSignedInSelector);
  const isMandatoryUserInfoAvailable = useRecoilValue(isMandatoryUserInfoAvailableSelector);

  const [snack, setSnack] = useState<SnackInfo | null>(null);

  useEffect(() => {
    let unblock = history.block((location) => {
      // now that the navigation was attempted and was blocked
      // see if the login has been completed
      if (isSignedIn) {
        // because user is signed in, unblock the navigation
        unblock();
        // after unblocking
        history.push(location.pathname);
      }
    });
  }, [history, isSignedIn]);

  useEffect(() => auth.onAuthStateChange(onAuthStateChange));

  useEffect(() => {
    if (isSignedIn) {
      if (!isMandatoryUserInfoAvailable) {
        //move to the basic info screen
        history.push(BASIC_INFO);
      }
    }
  }, [isSignedIn, isMandatoryUserInfoAvailable, history]);

  const onAuthStateChange = (info: AuthInfo) => setAuthInfo(info);

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
            signInExtras={signInExtras}
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
