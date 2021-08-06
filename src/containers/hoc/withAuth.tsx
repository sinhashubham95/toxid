import { useEffect, FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { CssBaseline, Grid, makeStyles, Paper } from "@material-ui/core";

import Images from '../../assets';
import { AuthExtra, AuthProps, SignInExtra } from '../../types/auth';
import { CommonProps } from '../../types/common';
import isSignedInSelector from '../../recoil/selectors/auth/isSignedIn';
import isMandatoryUserInfoAvailableSelector from '../../recoil/selectors/auth/isMandatoryUserInfoAvailable';
import { BASIC_INFO, HOME } from '../../constants/routes';

const withAuth = (
  Component: FunctionComponent<AuthProps>,
  title: string,
  method: Function,
  extras: Array<AuthExtra>,
  signInExtras: Array<SignInExtra>,
) => ({ showSuccessMessage, showErrorMessage }: CommonProps) => {
  const classes = useStyles();

  const history = useHistory();

  const isSignedIn = useRecoilValue(isSignedInSelector);
  const isMandatoryUserInfoAvailable = useRecoilValue(isMandatoryUserInfoAvailableSelector);

  useEffect(() => {
    if (isSignedIn) {
      if (!isMandatoryUserInfoAvailable) {
        //move to the basic info screen
        history.replace(`${BASIC_INFO}/true`);
      } else {
        history.replace(HOME);
      }
    }
  }, [isSignedIn, isMandatoryUserInfoAvailable, history]);

  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item sm={false} md={7} className={classes.image} />
        <Grid item xs={12} sm={12} md={5} elevation={6} square component={Paper}>
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
