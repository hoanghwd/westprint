import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";


import TokenCreate from "../Create/Introduction/AccessTokenOrder";
import SampleCreate from "../Create/Introduction/SampleOrder";
import ErrorsCreate from "../Create/Introduction/ErrorCodes";
import TestPlanCreate from "../Create/TestPlan/TestPlan";
import TestPlanStatusCreate from "../Create/TestPlan/TestPlanStatus";
import ReviewCreate from "../Create/Review/Review";

import TokenCancel from "../Cancel/Introduction/AccessTokenOrder";
import SampleCancel from "../Cancel/Introduction/SampleOrder";
import ErrorsCancel from "../Cancel/Introduction/ErrorCodes";
import TestPlanCancel from "../Cancel/TestPlan/TestPlan";
import TestPlanStatusCancel from "../Cancel/TestPlan/TestPlanStatus";
import ReviewCancel from "../Cancel/Review/Review";

import TokenRedo from "../Redo/Introduction/AccessTokenOrder";
import SampleRedo from "../Redo/Introduction/SampleOrder";
import ErrorsRedo from "../Redo/Introduction/ErrorCodes";
import Errors2Redo from "../Redo/Introduction/ErrorCodes2"
import TestPlanRedo from "../Redo/TestPlan/TestPlan";
import TestPlanStatusRedo from "../Redo/TestPlan/TestPlanStatus";
import ReviewRedo from "../Redo/Review/Review";

import SampleStatus from "../StatusUpdate/Introduction/SampleOrder";
import TestPlanStatus from "../StatusUpdate/TestPlan/TestPlan";
import ReviewStatus from "../StatusUpdate/Review/Review";

/*
import SampleCreate from "../Create/Introduction/SampleOrder";
import XmlCreate from "../Create/Introduction/XmlStructure"
import ErrorsCreate from "../Create/Introduction/ErrorCodes";
import TestPlanCreate from "../Create/TestPlan/TestPlan";
import TestPlanCreateStatus from "../Create/TestPlan/TestPlanStatus";
import ReviewCreate from "../Create/Review/Review";
import SampleCancel from "../Cancel/Introduction/SampleOrder";
import XmlCancel from "../Cancel/Introduction/XmlStructure"
import ErrorsCancel from "../Cancel/Introduction/ErrorCodes";
import TestPlanCancel from "../Cancel/TestPlan/TestPlan";
import ReviewCancel from "../Cancel/Review/Review";
import SampleRedo from "../Redo/Introduction/SampleOrder";
import XmlRedo from "../Redo/Introduction/XmlStructure"
import ErrorsRedo from "../Redo/Introduction/ErrorCodes";
import TestPlanRedo from "../Redo/TestPlan/TestPlan";
import ReviewRedo from "../Redo/Review/Review";
import SampleStatus from "../StatusUpdate/Introduction/SampleOrder";
import XmlStatus from "../StatusUpdate/Introduction/XmlStructure"
import ErrorsStatus from "../StatusUpdate/Introduction/ErrorCodes";
import TestPlanStatus from "../StatusUpdate/TestPlan/TestPlan";
import ReviewStatus from "../StatusUpdate/Review/Review";
*/

import { connect } from 'react-redux';
import { handleNext } from '../../../actions';
import logo from "../../../images/JONDOConfetti.gif";

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
        //console.log("this.props.welcome: ",this.props.welcome)
        
        const welcome= "You have completed the JONDO API Integration Process and are configured for live orders. To review any parts of the process, use left navigation";
        //const goLive = "Your request to Go Live has been received. We will notify you via email once the account has been validated & configured for production between the following 2 business days.";       
        //const goLive = "Your request to Go Live has been received. Once the account has been validated and configured for production, we will notify you via email within 2 business days."
        
        //const title = this.props.welcome ? 'WELCOME' : 'READY TO GO LIVE';    
        //const p = this.props.welcome ? welcome : goLive;
        const title = 'WELCOME'
        const p =  welcome 

        return (
            <Col sm={10}>
                <Tab.Content>
                    <Tab.Pane eventKey="home">
                        <Col sm={10} className="d-flex flex-column">
                            <h5><b>{title}</b></h5>
                            <p>{p}</p>
                            <p><img src={logo} alt="JONDO API integration complete" /></p>
                        </Col>                    
                    </Tab.Pane>
                        
                    
                    <Tab.Pane eventKey="token_create">
                        <TokenCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="sample_create">
                        <SampleCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_create">
                        <ErrorsCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_create" >
                        <TestPlanCreate handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlanStatus_create" >
                        <TestPlanStatusCreate handleSetAllTestsApproved = {this.handleSetAllTestsApproved} handleNext={this.props.handleNext} approved={this.props.approved}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_create">
                        <ReviewCreate  approved={true}/>
                    </Tab.Pane>

                    {/*<Tab.Pane eventKey="sample_create">
                        <SampleCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="xml_create">
                        <XmlCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_create">
                        <ErrorsCreate handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_create" >
                        <TestPlanCreate handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlanStatus_create" >
                        <TestPlanCreateStatus handleSetAllTestsApproved = {this.handleSetAllTestsApproved} handleNext={this.props.handleNext} approved={this.props.approved}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_create">
                        <ReviewCreate  approved={true}/>
                    </Tab.Pane>
                    */}


                    <Tab.Pane eventKey="token_cancel">
                        <TokenCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="sample_cancel">
                        <SampleCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_cancel">
                        <ErrorsCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_cancel" >
                        <TestPlanCancel handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlanStatus_cancel" >
                        <TestPlanStatusCancel handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_cancel">
                        <ReviewCancel approved={true} />
                    </Tab.Pane>



                    {/*<Tab.Pane eventKey="sample_cancel">
                        <SampleCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="xml_cancel">
                        <XmlCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_cancel">
                        <ErrorsCancel handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_cancel" >
                        <TestPlanCancel handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_cancel">
                        <ReviewCancel approved={true} />
                    </Tab.Pane>
                    */}
                    
                    
                    <Tab.Pane eventKey="token_redo">
                        <TokenRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="sample_redo">
                        <SampleRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_redo">
                        <ErrorsRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors2_redo" >
                        <Errors2Redo handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_redo" >
                        <TestPlanRedo handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlanStatus_redo" >
                        <TestPlanStatusRedo handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_redo">
                        <ReviewRedo approved={true} />
                    </Tab.Pane>

                    
                    {/*<Tab.Pane eventKey="sample_redo">
                        <SampleRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="xml_redo">
                        <XmlRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_redo">
                        <ErrorsRedo handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_redo" >
                        <TestPlanRedo handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_redo">
                        <ReviewRedo approved={true} />
                    </Tab.Pane>
                    */}

                    <Tab.Pane eventKey="sample_status">
                        <SampleStatus handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_status">
                        <TestPlanStatus handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                   
                    <Tab.Pane eventKey="review_status">
                        <ReviewStatus approved={true} />
                    </Tab.Pane>

                    {/*<Tab.Pane eventKey="sample_status">
                        <SampleStatus handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="xml_status">
                        <XmlStatus handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="errors_status">
                        <ErrorsStatus handleNext={this.props.handleNext} approved={true} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="testPlan_status" >
                        <TestPlanStatus handleNext={this.props.handleNext} approved={true}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey="review_status">
                        <ReviewStatus approved={true} />
                    </Tab.Pane>
                    */}
                </Tab.Content>
            </Col>
        );
    }
}


const mapDispatchToProps = dispatch => ({
    handleNext: (nextPage, score) => dispatch(handleNext(nextPage, score)),
});

export default connect(
    undefined,
    mapDispatchToProps
  ) ( TabContent );
  
