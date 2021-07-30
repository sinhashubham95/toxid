import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import AuthSignInEmailPassword from "./containers/AuthSignInEmailPassword";
import AuthSignUpEmailPassword from "./containers/AuthSignUpEmailPassword";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <AuthSignInEmailPassword />
        </Route>
        <Route path="/signUp">
          <AuthSignUpEmailPassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
