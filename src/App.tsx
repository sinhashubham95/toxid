import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { createTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";
import AuthResetEmailPassword from "./containers/AuthResetEmailPassword";
import AuthUserInfo from "./containers/AuthUserInfo";
import { BASIC_INFO, FORGOT_PASSWORD, HOME, SIGN_IN, SIGN_UP } from './constants/routes';
import { AuthInfo, AuthState } from './types/auth';
import auth from './utils/auth';
import Home from './containers/Home';

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
  const history = useHistory();

  useEffect(() => auth.onAuthStateChange(onAuthStateChange));

  const onAuthStateChange = (info: AuthInfo) => {
    if (info.state === AuthState.SignedOut) {
      // move to the first screen to ask the user to sign in
      history.push(SIGN_IN);
    }
  };

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path={SIGN_UP}>
              <AuthSignUpEmailPassword />
            </Route>
            <Route path={FORGOT_PASSWORD}>
              <AuthResetEmailPassword />
            </Route>
            <Route path={BASIC_INFO}>
              <AuthUserInfo />
            </Route>
            <Route path={HOME}>
              <Home />
            </Route>
            <Route path={SIGN_IN}>
              <AuthSignInEmailPassword />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
