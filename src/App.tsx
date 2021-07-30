import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";
import AuthResetEmailPassword from "./containers/AuthResetEmailPassword";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/signUp">
          <AuthSignUpEmailPassword />
        </Route>
        <Route path="/forgotPassword">
          <AuthResetEmailPassword />
        </Route>
        <Route path="/">
          <AuthSignInEmailPassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
