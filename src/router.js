import React from "react";
import App from "./App";
import MainPage from "./mainpage";
import Button from "./pages/ui/buttons";
import Home from "./pages/home";
import NoMatch from "./pages/nomatch";
import { HashRouter as Router, Route ,Switch} from "react-router-dom";

export default class IRouter extends React.Component {
  render() {
    return (
      <Router>
        <App>
          <Route
            path="/admin"
            render={() => (
              <MainPage>
                <Switch>
                  <Route exact={true} path="/admin/" component={Home} />
                  <Route path="/admin/home" component={Home} />
                  <Route path="/admin/ui/buttons" component={Button} />
                  <Route component={NoMatch} />
                </Switch>
              </MainPage>
            )}
          />
        </App>
      </Router>
    );
  }
}
