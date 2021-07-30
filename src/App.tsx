import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import Auth from "./containers/Auth";
import SignInEmailPassword from "./containers/auth/SignInEmailPassword";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Auth>
            <SignInEmailPassword />
          </Auth>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
