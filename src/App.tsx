import { RecoilRoot } from 'recoil';
import { createTheme, ThemeProvider, responsiveFontSizes } from "@material-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";
import AuthResetEmailPassword from "./containers/AuthResetEmailPassword";
import AuthBasicInfo from "./containers/AuthBasicInfo";
import { BASIC_INFO, FORGOT_PASSWORD, SIGN_IN, SIGN_UP } from './constants/routes';

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
              <AuthBasicInfo />
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
