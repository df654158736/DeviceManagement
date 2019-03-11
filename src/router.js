import React from "react";
import App from "./App";
import MainPage from "./mainpage";
import InManagement from "./pages/inmanagement/management";
import InStatistics from "./pages/inmanagement/statistics";
import SparePart from "./pages/basic/SparePart";
import Hall from "./pages/basic/hall"
import NoMatch from "./pages/nomatch";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

export default class IRouter extends React.Component {
  render() {
    return (
      <Router>
        <App>
          <MainPage>
            <Switch>
              <Route
                path="/basic"
                render={() => (
                    <Switch>
                      <Route path="/basic/product" component={SparePart} />
                      <Route path="/basic/hall" component={Hall} />
                      <Route component={NoMatch} />
                    </Switch>
                )}
               />
                <Route
                path="/checkin"
                render={() => (
                    <Switch>
                      <Route path="/checkin/manage" component={InManagement} />
                      <Route path="/checkin/count" component={InStatistics} />
                      <Route component={NoMatch} />
                    </Switch>
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
