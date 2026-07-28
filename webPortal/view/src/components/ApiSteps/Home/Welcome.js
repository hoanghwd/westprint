import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Navbar from "../../Navbar/NavBar";
import TabNavDisabled from "./TabNav";
import TabNavActive from "../GoLive/TabNav";
import TabContentWelcome from "./TabContent";
import TabContentLive from "../GoLive/TabContent";
import Tab from "react-bootstrap/Tab";
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { handleStart, handleSelect } from '../../../actions';

class Welcome extends Component {
  render() {
    if (!this.props.userId) {
        return <Redirect to={"/login"} />;
      }

    if (typeof(this.props.curStage) !== 'undefined' && this.props.curStage !== '' && this.props.appStatus !== "live") {
        return <Redirect to={"/api/steps/" + this.props.curStage} />;
      }

    const nav = this.props.appStatus === "live" ? <TabNavActive /> : <TabNavDisabled />;
    const content = this.props.appStatus === "live" ? <TabContentLive welcome={true}/> : <TabContentWelcome handleStart={this.props.handleStart}/>;
    
    return (
      <div className="intro">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <h2 className="text-monospace font-weight-bold text-left mt-5 mb-3 ml-3">
          INITIATE API: WELCOME
        </h2>

        <Card className="text-left">
          <Card.Header className="card-header-account text-light">
            Documentation
          </Card.Header>
          <Card.Body>
          <Tab.Container id="left-tabs-example" activeKey={this.props.curPageShow} onSelect={(e) => this.props.handleSelect(e)} className="padding-20px">
              <Row>
                {nav}
                {content}
              </Row>
              </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
      curPage: state.handler.curPage,
      curPageShow: state.handler.curPageShow,
      curStage: state.handler.curStage,     
      appStatus: state.handler.appStatus      
  }
);

const mapDispatchToProps = dispatch => ({
  handleStart: (orderOrigin) => dispatch(handleStart(orderOrigin)),
  handleSelect: (nextPage) => dispatch(handleSelect(nextPage)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
) ( Welcome );