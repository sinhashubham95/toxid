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
        <Route path="/signUp">
          <AuthSignUpEmailPassword />
        </Route>
        <Route path="/">
          <AuthSignInEmailPassword />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
