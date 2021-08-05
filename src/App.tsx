import { ComponentType, Fragment, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
  makeStyles,
  AppBar,
  Toolbar,
  CssBaseline,
  Button,
  Snackbar,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";
import AuthResetEmailPassword from "./containers/AuthResetEmailPassword";
import AuthUserInfo from "./containers/AuthUserInfo";
import ContentHome from './containers/ContentHome';
import ContentMovies from "./containers/ContentMovies";
import ContentTv from "./containers/ContentTv";
import {
  BASIC_INFO,
  CONTENT,
  CONTENT_ROUTES,
  FORGOT_PASSWORD,
  HOME,
  MOVIES,
  SIGN_IN,
  SIGN_UP,
  TV,
} from './constants/routes';
import { AuthInfo, AuthState } from './types/auth';
import { SnackInfo, SnackState } from './types/common';
import auth from './utils/auth';
import authInfo from './recoil/atoms/auth/authInfo';

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: 'rgb(235, 197, 69)',
    },
    secondary: {
      main: 'rgb(56, 72, 92)',
    },
  },
}));

const App = () => {
  const classes = useStyles();

  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const setInfo = useRecoilState(authInfo)[1];

  const [showAppBar, setShowAppBar] = useState(false);

  const [snack, setSnack] = useState<SnackInfo | null>(null);

  const onAuthStateChange = (info: AuthInfo) => {
    setInfo(info);
    if (info.state === AuthState.SignedOut) {
      // move to the first screen to ask the user to sign in
      history.replace(SIGN_IN);
    }
  };

  // eslint-disable-next-line
  useEffect(() => auth.onAuthStateChange(onAuthStateChange), []);

  useEffect(() => {
    if (location.pathname.startsWith(CONTENT) && !showAppBar) {
      setShowAppBar(true);
    } else if (!location.pathname.startsWith(CONTENT) && showAppBar) {
      setShowAppBar(false);
    }
  }, [location, showAppBar]);

  const onSignOut = async () => {
    const error = await auth.signOut();
    if (error) {
      // show error message
      showErrorMessage(error.message);
    }
  };

  const onCloseSnack = () => setSnack(null);

  const showSuccessMessage = (message: string) => setSnack({
    state: SnackState.Success,
    message,
  });

  const showErrorMessage = (message: string) => setSnack({
    state: SnackState.Error,
    message,
  });

  const renderNav = () => (
    <div>
      {CONTENT_ROUTES.map(({ title, location }) => (
        <ButtonBase
          key={title}
          disabled={history.location.pathname === location}
          onClick={() => history.replace(location)}
          className={classes.navButton}
          focusVisibleClassName={classes.focusNavButton}
        >
          <Typography variant="button" color="secondary" className={classes.navButtonTitle}>
            {t(title)}
          </Typography>
        </ButtonBase>
      ))}
    </div>
  );

  const renderAppBar = () => (
    <Fragment>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar className={classes.appBar}>
          <div className={classes.leftAppBar}>
            <Typography variant="h4" color="secondary" className={classes.title}>
              {t("title")}
            </Typography>
            {renderNav()}
          </div>
          <Button color="secondary" onClick={onSignOut}>{t("signOut")}</Button>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </Fragment>
  );

  const getWrappedComponent = (Component: ComponentType<any>) => () => (
    <Component
      showSuccessMessage={showSuccessMessage}
      showErrorMessage={showErrorMessage}
    />
  );

  const renderSwitch = () => (
    <main
      className={
        clsx({ [classes.content]: showAppBar })
      }
    >
      <Switch>
        <Route path={SIGN_IN} exact component={getWrappedComponent(AuthSignInEmailPassword)} />
        <Route path={SIGN_UP} component={getWrappedComponent(AuthSignUpEmailPassword)} />
        <Route path={FORGOT_PASSWORD} component={getWrappedComponent(AuthResetEmailPassword)} />
        <Route path={`${BASIC_INFO}/:init`} component={getWrappedComponent(AuthUserInfo)} />
        <Route path={HOME} component={getWrappedComponent(ContentHome)} />
        <Route path={MOVIES} component={getWrappedComponent(ContentMovies)} />
        <Route path={TV} component={getWrappedComponent(ContentTv)} />
      </Switch>
    </main>
  );

  const renderSnack = () => (
    <Snackbar open={!!snack} autoHideDuration={6000} onClose={onCloseSnack}>
      <Alert elevation={6} variant="filled" severity={snack?.state} onClose={onCloseSnack}>
        {snack?.message}
      </Alert>
    </Snackbar>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        {showAppBar && renderAppBar()}
        {renderSwitch()}
        {renderSnack()}
      </div>
    </ThemeProvider>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftAppBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  navButton: {
    margin: theme.spacing(0, 2, 0),
    '&:hover, &$focusNavButton': {
      zIndex: 1,
      '& $navButtonTitle': {
        opacity: 0.6,
      },
    },
  },
  focusNavButton: {},
  navButtonTitle: {
    transition: theme.transitions.create('opacity'),
    padding: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(0, 6, 0),
    fontFamily: 'Roboto',
  },
  hide: {
    display: 'none',
  },
  toolbar: theme.mixins.toolbar,
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
    paddingRight: theme.spacing(1),
  },
  info: {
    justifyContent: "center",
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    margin: theme.spacing(0),
  },
  name: {
    marginLeft: theme.spacing(2),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3, 0, 3),
  },
}));

export default App;
