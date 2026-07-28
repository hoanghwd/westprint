import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import Token from "./Introduction/AccessTokenOrder";
import Sample from "./Introduction/SampleOrder";
//import Xml from "./Introduction/XmlStructure"
import Errors from "./Introduction/ErrorCodes";
import TestPlan from "./TestPlan/TestPlan";
import TestPlanStatus from "./TestPlan/TestPlanStatus";
import Review from "./Review/Review";
import { connect } from 'react-redux';
import { handleNext } from '../../../actions'

class TabContent extends Component {
        
    constructor(props) {
        
        super(props);
  
        this.state = {
          
          allTestsApproved: false
                
        };
  
        this.handleSetAllTestsApproved = this.handleSetAllTestsApproved.bind(this);
        
    }

    handleSetAllTestsApproved(allTestsApproved) {
        this.setState({allTestsApproved});
    }
        
    render() {
        return (
            <Col sm={10}>
                <Tab.Content>
                    <Tab.Pane unmountOnExit = {true} eventKey="token_create">
                        <Token handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser}  />
                    </Tab.Pane>
                    <Tab.Pane unmountOnExit = {true} eventKey="sample_create">
                        <Sample handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser} />
                    </Tab.Pane>
                    {/*
                    <Tab.Pane eventKey="xml_create">
                        <Xml handleNext={this.props.handleNext}  approved={this.props.approved} />
                    </Tab.Pane>
                    */}
                    <Tab.Pane unmountOnExit = {true} eventKey="errors_create">
                        <Errors handleNext={this.props.handleNext}  approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser} />
                    </Tab.Pane>
                    <Tab.Pane unmountOnExit = {true} eventKey="testPlan_create" >
                        <TestPlan handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser} />
                    </Tab.Pane>
                    <Tab.Pane unmountOnExit = {true} eventKey="testPlanStatus_create" >
                        <TestPlanStatus handleSetAllTestsApproved = {this.handleSetAllTestsApproved} handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser}/>
                    </Tab.Pane>
                    <Tab.Pane unmountOnExit = {true} eventKey="review_create">
                        <Review allTestsApproved = {this.state.allTestsApproved} handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser} />
                    </Tab.Pane>
                </Tab.Content>
            </Col>
        );
    }
}

const mapStateToProps = state => (
    {
        approved: state.handler.create.approved,
        skipped: state.handler.create.skipped,
        asUser: state.session.asUser,
    }
);

const mapDispatchToProps = dispatch => ({
    handleNext: (nextPage, score) => dispatch(handleNext(nextPage, score)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
  ) ( TabContent );
  
