import React, { Component } from "react"
import Col from "react-bootstrap/Col"
import Nav from "react-bootstrap/Nav"
import { connect } from 'react-redux'
import NavStage from '../Shared/NavStage'

class TabNav extends Component {
    render() {
        return (
            <Col sm={2} className="d-flex flex-column pt-3 col-border-right">
                <Nav variant="pills" className="flex-column">
                    
                    <Nav.Item>
                        <Nav.Link  className="nav-link-steps menu-header">
                            <b>C - Redo Order API</b>
                        </Nav.Link>
                    </Nav.Item>
                    {/*}
                    <Nav.Item>
                        <Nav.Link eventKey="token_redo" className="nav-link-steps ">
                            Introduction to XML Elements, Structure, & Error Codes
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link eventKey="token_redo" className="nav-link-steps child">
                            {/*OAuth 2.0*/}
                            C.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.sample} eventKey="sample_redo" className="nav-link-steps child">
                        <div className={this.props.sample ? '' : "incompleted"}>
                            C.2 - Redo Order
                        </div>
                        </Nav.Link>
                    </Nav.Item>
                    {/*
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.xml} eventKey="xml_redo" className="nav-link-steps child">
                            <div className={this.props.xml ? '' : "incompleted"}>XML Structures</div>
                        </Nav.Link>
                    </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.errors} eventKey="errors_redo" className="nav-link-steps child">
                            <div className={this.props.errors ? '' : "incompleted"}>
                                C.3 - Redo Codes
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.errors2} eventKey="errors2_redo" className="nav-link-steps child">
                            <div className={this.props.errors2 ? '' : "incompleted"}>
                                C.4 - Error Codes
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlan} eventKey="testPlan_redo" className="nav-link-steps child">
                            <div className={this.props.testPlan ? '' : "incompleted"}>
                                {/*<b>Redo Test Plan</b>*/}
                                C.5 - Test Plan
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.testPlanStatus} eventKey="testPlanStatus_redo" className="nav-link-steps child">
                            <div className={this.props.testPlanStatus ? '' : "incompleted"}>
                                {/*<b>Redo Test Plan Status</b>*/}
                                C.6 - Redo Test Plan Status
                            </div>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link disabled={!this.props.review} eventKey="review_redo" className="nav-link-steps child">
                            <div className={this.props.review ? '' : "incompleted"}>
                                {/*<b>Review/Verify the Results</b>*/}
                                C.7 - Review/Verify Results
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
        sample: state.handler.redo.sample,
        errors: state.handler.redo.errors,
        errors2: state.handler.redo.errors2,
        testPlan: state.handler.redo.testPlan,
        testPlanStatus: state.handler.redo.testPlanStatus,
        review: state.handler.redo.review
    }
);

//export default App;
export default connect(
    mapStateToProps
)(TabNav);

