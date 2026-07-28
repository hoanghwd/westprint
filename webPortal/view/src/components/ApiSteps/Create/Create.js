import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Navbar from "../../Navbar/NavBar";
import Tab from "react-bootstrap/Tab";
import TabNav from "./TabNav";
import TabContent from "./TabContent";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import { handleSelect } from '../../../actions'

import "./Create.css";

class CreateOrderSteps extends Component {
  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    if (this.props.curStage !== 'create' && this.props.curStage !== '' && typeof (this.props.curStage) !== 'undefined') {
      return <Redirect to={"/api/steps/" + this.props.curStage} />;
    }

    console.log('all handler')
    console.log(this.props.allHandler)

    let skippedOrAceptedFlag = ''

    if (this.props.asUser){
      if(this.props.approved){
        skippedOrAceptedFlag = ' - APPROVED'
      }else if (this.props.skipped){
        skippedOrAceptedFlag = ' - SKIPPED'
      }
    }

    return (
      <div className="create">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        {/*<h2 className="text-monospace font-weight-bold text-left mt-5 mb-3 ml-3">*/}
        <h2 className="text-monospace font-weight-bold text-left mt-3">
          Initiate API: (A) Order Placement {skippedOrAceptedFlag}          
        </h2>

        <Card className="text-left">
          <Card.Header className="card-header-account text-light">
            Documentation
          </Card.Header>
          <Card.Body className="no-padding">
            <Tab.Container
              id="left-tabs-example"
              activeKey={this.props.curPageShow}
              onSelect={(e) => this.props.handleSelect(e)}
              className="padding-20px"
            >
              <Row>
                <TabNav />
                <TabContent />
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
    approved: state.handler.create.approved,
    skipped: state.handler.create.skipped,
    asUser: state.session.asUser,
    allHandler: state.handler
  }
);

const mapDispatchToProps = dispatch => ({
  handleSelect: (nextPage) => dispatch(handleSelect(nextPage)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrderSteps);
