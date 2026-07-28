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
                            <b>B - Cancel Order API</b>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="token_cancel" className="nav-link-steps child">
                            {/*OAuth 2.0*/}
                            B.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.sample} eventKey="sample_cancel" className="nav-link-steps child">
                            <div className={this.props.sample ? '' : "incompleted"}>
                            B.2 - Cancel Order
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    {/*
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.xml} eventKey="xml_cancel" className="nav-link-steps child">
                            <div className={this.props.xml ? '' : "incompleted"}>XML Structures</div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.errors} eventKey="errors_cancel" className="nav-link-steps child">
                            <div className={this.props.errors ? '' : "incompleted"}>
                                B.3 - Error Codes
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlan} eventKey="testPlan_cancel" className="nav-link-steps child">
                            <div className={this.props.testPlan ? '' : "incompleted"}>
                                {/*<b>Cancel Test Plan</b>*/}
                                B.4 - Test Plan
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlanStatus} eventKey="testPlanStatus_cancel" className="nav-link-steps child">
                            <div className={this.props.testPlanStatus ? '' : "incompleted"}>
                                {/*<b>Cancel Test Plan Staus</b>*/}
                                B.5 - Test Plan Status
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.review} eventKey="review_cancel" className="nav-link-steps child">
                            <div className={this.props.review ? '' : "incompleted"}>
                                {/*<b>Review/Verify the Results</b></div>*/}
                                B.6 - Review/Verify Results
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
        sample: state.handler.cancel.sample,
        errors: state.handler.cancel.errors,
        testPlan: state.handler.cancel.testPlan,
        testPlanStatus: state.handler.cancel.testPlanStatus,
        review: state.handler.cancel.review
    }
);

//export default App;
export default connect(
    mapStateToProps
)(TabNav);

