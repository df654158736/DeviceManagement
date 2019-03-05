import React from "react";
import App from "./App";
import MainPage from "./mainpage";
import Button from "./pages/ui/buttons";
import Home from "./pages/home";
import NoMatch from "./pages/nomatch";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

export default class IRouter extends React.Component {
  render() {
    return (
      <Router>
        <App>
          <MainPage>
            <Switch>
              <Route path="/home" component={Home} />
              <Route
                exact="true"
                path="/base"
                render={() => (
                  <div>
                    <Switch>
                      <Route path="/base/goods" component={Home} />
                      <Route path="/base/departments" component={Button} />
                      <Route component={NoMatch} />
                    </Switch>
                    <Route component={NoMatch} />
                  </div>
                )}
              />
               <Route component={NoMatch} />
            </Switch>
          </MainPage>
        </App>
      </Router>
    );
  }
}
