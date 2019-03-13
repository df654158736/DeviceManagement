import React from "react";
import App from "./App";
import MainPage from "./mainpage";
import Login from "./pages/login";
import InManagement from "./pages/inmanagement/management";
import InStatistics from "./pages/inmanagement/statistics";
import OutManagement from "./pages/outmanagement/management";
import OutStatistics from "./pages/outmanagement/statistics";
import ReceiveManagement from "./pages/receivemanagement/management";
import ReceiveStatistics from "./pages/receivemanagement/statistics";
import RefundManagement from "./pages/refundmanagement/management";
import RefundStatistics from "./pages/refundmanagement/statistics";
import SparePart from "./pages/basic/SparePart";
import Hall from "./pages/basic/hall";
import NoMatch from "./pages/nomatch";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

export default class IRouter extends React.Component {
  render() {
    return (
      <Router>
        <App>
          <Switch>
            <Route path="/login" component={Login} />
            <Route
              render={() => (
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
                          <Route
                            path="/checkin/manage"
                            component={InManagement}
                          />
                          <Route
                            path="/checkin/count"
                            component={InStatistics}
                          />
                          <Route component={NoMatch} />
                        </Switch>
                      )}
                    />
                    <Route
                      path="/checkout"
                      render={() => (
                        <Switch>
                          <Route
                            path="/checkout/manage"
                            component={OutManagement}
                          />
                          <Route
                            path="/checkout/count"
                            component={OutStatistics}
                          />
                          <Route component={NoMatch} />
                        </Switch>
                      )}
                    />
                    <Route
                      path="/receive"
                      render={() => (
                        <Switch>
                          <Route
                            path="/receive/manage"
                            component={ReceiveManagement}
                          />
                          <Route
                            path="/receive/count"
                            component={ReceiveStatistics}
                          />
                          <Route component={NoMatch} />
                        </Switch>
                      )}
                    />
                    <Route
                      path="/refund"
                      render={() => (
                        <Switch>
                          <Route
                            path="/refund/manage"
                            component={RefundManagement}
                          />
                          <Route
                            path="/refund/count"
                            component={RefundStatistics}
                          />
                          <Route component={NoMatch} />
                        </Switch>
                      )}
                    />
                    <Route component={NoMatch} />
                  </Switch>
                </MainPage>
              )}
            />
          </Switch>
        </App>
      </Router>
    );
  }
}
