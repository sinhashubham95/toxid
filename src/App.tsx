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
  IconButton,
  CssBaseline,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Snackbar,
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {
  Switch,
  Route,
  useHistory,
  Link,
  useLocation,
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";
import AuthResetEmailPassword from "./containers/AuthResetEmailPassword";
import AuthUserInfo from "./containers/AuthUserInfo";
import ContentHome from "./containers/ContentHome";
import { BASIC_INFO, CONTENT, CONTENT_ROUTES, FORGOT_PASSWORD, HOME, SIGN_IN, SIGN_UP } from './constants/routes';
import { AuthInfo, AuthState } from './types/auth';
import { SnackInfo, SnackState } from './types/common';
import auth from './utils/auth';
import { DRAWER_WIDTH } from './constants/constants';
import authInfo from './recoil/atoms/auth/authInfo';
import ProfilePhoto from './components/ProfilePhoto';

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

  const [info, setInfo] = useRecoilState(authInfo);

  const [showAppBarAndDrawer, setShowAppBarAndDrawer] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    if (location.pathname.startsWith(CONTENT) && !showAppBarAndDrawer) {
      setShowAppBarAndDrawer(true);
    } else if (!location.pathname.startsWith(CONTENT) && showAppBarAndDrawer) {
      setShowAppBarAndDrawer(false);
    }
  }, [location, showAppBarAndDrawer]);

  const onSignOut = async () => {
    const error = await auth.signOut();
    if (error) {
      // show error message
      showErrorMessage(error.message);
    }
  };

  const onDrawerOpen = () => setDrawerOpen(true);

  const onDrawerClose = () => setDrawerOpen(false);

  const onCloseSnack = () => setSnack(null);

  const showSuccessMessage = (message: string) => setSnack({
    state: SnackState.Success,
    message,
  });

  const showErrorMessage = (message: string) => setSnack({
    state: SnackState.Error,
    message,
  });

  const renderAppBar = () => (
    <Fragment>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, { [classes.appBarShift]: drawerOpen })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, drawerOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {t("title")}
          </Typography>
          <Button onClick={onSignOut}>{t("signOut")}</Button>
        </Toolbar>
      </AppBar>
      <div className={classes.toolbar} />
    </Fragment>
  );

  const renderDrawerList = () => (
    <List>
      {CONTENT_ROUTES.map(({ title, icon: IconComponent, location }) => (
        <ListItem
          button
          key={title}
          component={Link}
          to={location}
        >
          <ListItemIcon>
            <IconComponent />
          </ListItemIcon>
          <ListItemText primary={t(title)} />
        </ListItem>
      ))}
    </List>
  );

  const renderInfo = () => (
    <div className={classes.info}>
      <ProfilePhoto
        photoUrl={info.details?.photoUrl}
        avatarStyle={classes.avatar}
        onClick={() => history.replace(`${BASIC_INFO}/false`)}
      />
      <Typography className={classes.name}>{info.details?.firstName}</Typography>
    </div>
  );

  const renderDrawer = () => (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        {renderInfo()}
        <IconButton onClick={onDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      {renderDrawerList()}
    </Drawer>
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
        clsx(
          { [classes.content]: showAppBarAndDrawer },
          { [classes.contentShift]: showAppBarAndDrawer && drawerOpen },
        )
      }
    >
      <Switch>
        <Route path={SIGN_IN} exact component={getWrappedComponent(AuthSignInEmailPassword)} />
        <Route path={SIGN_UP} component={getWrappedComponent(AuthSignUpEmailPassword)} />
        <Route path={FORGOT_PASSWORD} component={getWrappedComponent(AuthResetEmailPassword)} />
        <Route path={`${BASIC_INFO}/:init`} component={getWrappedComponent(AuthUserInfo)} />
        <Route path={HOME} component={getWrappedComponent(ContentHome)} />
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
        {showAppBarAndDrawer && renderAppBar()}
        {showAppBarAndDrawer && renderDrawer()}
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
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: DRAWER_WIDTH,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  hide: {
    display: 'none',
  },
  toolbar: theme.mixins.toolbar,
  drawer: {
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
  },
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
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: DRAWER_WIDTH,
  },
}));

export default App;
