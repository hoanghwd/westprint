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
                            <b>A - Create Order API</b>
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey="token_create" className="nav-link-steps child">
                            {/*A.1 -OAuth 2.0*/}
                            A.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.sample} eventKey="sample_create" className="nav-link-steps child">
                            <div className={this.props.sample ? '' : "incompleted"}>
                                A.2 - Order Placement
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    {/*
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.xml} eventKey="xml_create" className="nav-link-steps child">
                            <div className={this.props.xml ? '' : "incompleted"}>XML Structures</div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.errors} eventKey="errors_create" className="nav-link-steps child">
                            <div className={this.props.errors ? '' : "incompleted"}>
                                A.3 - Error Codes
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlan} eventKey="testPlan_create" className="nav-link-steps child">
                            <div className={this.props.testPlan ? '' : "incompleted"}>
                                {/*<b className = "father" >Order Placement Test Plan</b>*/}
                                A.4 - Test Plan
                            </div>
                        </Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlanStatus} eventKey="testPlanStatus_create" className="nav-link-steps child">
                            <div className={this.props.testPlanStatus ? '' : "incompleted"}>
                                A.5 - Test Plan Status
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.review} eventKey="review_create" className="nav-link-steps child">
                            <div className={this.props.review ? '' : "incompleted"}>
                                {/*<b className = "father" >Review/Verify the Results</b>*/}
                                A.6 - Review/Verify Results
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
        sample: state.handler.create.sample,
        xml: state.handler.create.xml,
        errors: state.handler.create.errors,
        testPlan: state.handler.create.testPlan,
        testPlanStatus: state.handler.create.testPlanStatus,
        review: state.handler.create.review
    }
);

//export default App;
export default connect(
    mapStateToProps
)(TabNav);

