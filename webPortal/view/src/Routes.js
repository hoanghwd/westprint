import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import MyAccountInfo from "./components/MyAccount/MyAccountInfo";
import Login from "./components/Login/Login";
import LoginAs from "./components/Login/LoginAs";
import ForgotSend from "./components/Recover/ForgotSend";
import ForgotUpdate from "./components/Recover/ForgotUpdate";
import ForgotConfirm from "./components/Recover/ForgotConfirm";
import Register from "./components/Register/Register";
import Confirm from "./components/Register/Confirm";
import Thanks from "./components/Register/Thanks";
import MyAccountEdit from "./components/MyAccount/MyAccountEdit";
import SearchOrders from "./components/Orders/SearchOrders";
import RecentOrders from "./components/Orders/RecentOrders";
import OrderDetails from "./components/Orders/OrderDetails";
// import Status from "./components/ApiStatus/Status";
import ApiRequestLog from "./components/ApiLog/ApiRequestLog";
import ApiStatusLog from "./components/ApiLog/ApiStatusLog";
import ApiDownloads from "./components/ApiLog/ApiDownloads";
import ApiDownloadsTemplates from "./components/ApiLog/ApiDownloadsTemplates";
import ApiSampleTool from "./components/ApiSampleTool/ApiSampleTool";
import TestAddresses from "./components/ApiSampleTool/TestAddresses";
import RestApiDoc from "./components/RestApiDoc/RestApiDoc";
import PackingSlip from "./components/RestApiDoc/PackingSlip";
import ViewXml from "./components/Misc/ViewXml";
import Create from "./components/ApiSteps/Create/Create";
import Cancel from "./components/ApiSteps/Cancel/Cancel";
import Redo from "./components/ApiSteps/Redo/Redo";
import StatusUpdate from "./components/ApiSteps/StatusUpdate/StatusUpdate";
import Welcome from "./components/ApiSteps/Home/Welcome";
import GoLive from "./components/ApiSteps/GoLive/GoLive";
import TermAndCondition from "./components/ApiSteps/TermAndCondition/TermAndCondition";
import ProductSkus from "./components/ProductSkus/ProductSkus";
import Faqs from "./components/Support/Faqs";
import SupportRequests from "./components/Support/SupportRequests";
import Answer from "./components/Support/Answer";

//Sales Portal
import SearchClients from "./components/Admin/SearchClients";


class Routes extends Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(
    isLoged,
    userId = null,
    userName = null,
    apiKey = null,
    phone = null,
    email = null,
    street = null,
    city = null,
    zip = null,
    state = null,
    country = null,
    shipUrl = null,
    level = null,
    userStatus = null,
    clientPortalStatuses = null,
    jwt = '', 
    company = null,
    asUser = false,
    orderOrigin = null
  ) {
    this.props.handleLogin(isLoged, userId, userName, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, company, asUser, orderOrigin);
  }

  render() {
    return (
      /*basename= {process.env.REACT_APP_ROUTER_BASENAME}*/
      <HashRouter>
        <Switch>
          
          <Route
            exact
            path="/"
            render={() => (
              <Login {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            exact
            path="/login"
            render={() => (
              <Login {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            exact
            path="/loginAs"
            render={() => (
              <LoginAs {...this.props} handleLogin={this.handleLogin} />
            )}
          />


          <Route
            path="/myaccount/info"
            render={() => (
              <MyAccountInfo {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/myaccount/edit"
            render={() => (
              <MyAccountEdit {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/forgot/send"
            render={() => <ForgotSend {...this.props} />}
          />

          <Route
            path="/forgot/update/:validateString"
            render={({ match }) => (
              <ForgotUpdate {...this.props} match={match} />
            )}
          />

          <Route
            path="/forget/confirm"
            render={({ match }) => (
              <ForgotConfirm {...this.props} />
            )}
          />

          <Route
            path="/register"
            render={() => (
              <Register {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/orders/search"
            render={() => (
              <SearchOrders {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/orders/recent"
            render={() => (
              <RecentOrders {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/order/:orderId"
            render={({ match }) => (
              <OrderDetails {...this.props} handleLogin={this.handleLogin} match={match} />
            )}
          />

          <Route
            path="/api/steps/create"
            render={() => (
              <Create {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          {/* <Route
            path="/api/status"
            render={() => (
              <Status {...this.props} handleLogin={this.handleLogin} />
            )}
          /> */}
          
          <Route
            path="/api/steps/status"
            render={() => (
              <StatusUpdate {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/api/steps/redo"
            render={() => (
              <Redo {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/api/steps/cancel"
            render={() => (
              <Cancel {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
              path="/api/steps/golive"
              render={() => (
                <GoLive {...this.props} handleLogin={this.handleLogin} />
              )}
          />

          <Route
              path="/api/steps/termandcondition"
              render={() => (
                <TermAndCondition {...this.props} handleLogin={this.handleLogin} />
              )}
          />

          <Route
            path="/api/steps"
            render={() => (
              <Welcome {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/api/log/request"
            render={() => (
              <ApiRequestLog {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/api/log/status"
            render={() => (
              <ApiStatusLog {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/api/downloads"
            render={() => (
              <ApiDownloads {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route 
            path="/api/downloadTemplates"
            render={() => (
              <ApiDownloadsTemplates {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/docs/api/:tab"
            render={({ match }) => (
              <RestApiDoc {...this.props} match={match} />
            )}
          />

          <Route
            path="/docs/api"
            render={() => (
              <RestApiDoc {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/docs/packingslip"
            render={() => (
              <PackingSlip {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/docs/tool"
            render={() => (
              <ApiSampleTool {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/docs/testAddresses"
            render={() => (
              <TestAddresses {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/support/faqs"
            render={() => (
              <Faqs {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/support/supportRequests"
            render={() => (
              <SupportRequests {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route
            path="/support/answer/:question/:answer"
            render={({ match }) => (
              <Answer {...this.props} match={match} />
            )}
          />

          <Route
            path="/confirm"
            render={() => (
              <Confirm />
            )}
          />

          <Route
            path="/thanks/:id"
            render={({ match }) => (
              <Thanks {...this.props} match={match} />
            )}
          />

          <Route
            path="/viewXml/:id"
            render={({ match }) => (
              <ViewXml {...this.props} handleLogin={this.handleLogin} match={match} />
            )}
          />


          <Route 
            path="/admin/list"
            render={() => (
              <SearchClients {...this.props} handleLogin={this.handleLogin} />
            )}
          />

          <Route 
            path="/orders/skus"
            render={() => (
              <ProductSkus {...this.props} handleLogin={this.handleLogin} />
            )}
          />
      

        </Switch>
      </HashRouter>
    );
  }
}

export default Routes;