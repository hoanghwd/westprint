import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { connect } from 'react-redux';
import NavStage from '../Shared/NavStage';

class TabNav extends Component {
    render() {
        return (
            <Col sm={2} className="d-flex flex-column pt-3 col-border-right">
                <Nav variant="pills" className="flex-column">
                    
                    <Nav.Item>
                        <Nav.Link  className="nav-link-steps menu-header">
                            <b>D - Status Update</b>
                        </Nav.Link>
                    </Nav.Item>
                    {/*
                    <Nav.Item>
                        <Nav.Link eventKey="sample_status" className="nav-link-steps ">
                            Introduction to XML Elements, Structure, & Error Codes
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link eventKey="sample_status" className="nav-link-steps child">
                            D.1 - Introduction 
                        </Nav.Link>
                    </Nav.Item>
                    {/*
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.xml} eventKey="xml_status" className="nav-link-steps child">
                            <div className={this.props.xml ? '' : "incompleted"}>XML Structures</div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    {/*<Nav.Item>
                        <Nav.Link disabled={!this.props.errors} eventKey="errors_status" className="nav-link-steps child">
                            <div className={this.props.errors ? '' : "incompleted"}>Error Codes</div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlan} eventKey="testPlan_status" className="nav-link-steps child">
                            <div className={this.props.testPlan ? '' : "incompleted"}>
                                D.2 - Test Plan 
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    
                    
                    {/*
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlanStatus } eventKey="testPlanStatus_status" className="nav-link-steps child">
                            <div className={this.props.testPlanStatus ? '' : "incompleted"}>
                                D.3 - Test Plan Status
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.review} eventKey="review_status" className="nav-link-steps child">
                            <div className={this.props.review ? '' : "incompleted"}>
                                {/*<b>Review/Verify the Results</b>*/}
                                D.3 - Review/Verify the Results
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                <NavStage />
            </Col>
        );
    }
}


const mapStateToProps = state => (
    {
        xml: state.handler.status.xml,
        errors: state.handler.status.errors,
        testPlan: state.handler.status.testPlan,
        testPlanStatus: state.handler.status.testPlanStatus,
        review: state.handler.status.review
    }
);

//export default App;
export default connect(
    mapStateToProps
)(TabNav);

