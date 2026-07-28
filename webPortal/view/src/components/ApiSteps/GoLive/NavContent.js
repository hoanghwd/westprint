import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";


class Intro extends Component {
    
    render() {
        
        if (this.props.apiName === 'create') {
            
            return (
                <Nav variant="pills" className="flex-column mb-3">
                    <Nav.Item>
                        <Nav.Link   className="nav-link-steps ">
                        <b>A - Create Order API</b>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link  eventKey = "token_create" className="nav-link-steps child">
                        A.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "sample_create" className="nav-link-steps child">
                        A.2 - Order Placement
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "errors_create" className="nav-link-steps child">
                        A.3 - Error Codes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "testPlan_create"  className="nav-link-steps child">
                        A.4 - Test Plan
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "testPlanStatus_create" className="nav-link-steps child">
                        A.5 - Test Plan Status
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "review_create" className="nav-link-steps child">
                        A.6 - Review/Verify Results
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
    
            );
        }else if (this.props.apiName === 'cancel'){
            return (
                <Nav variant="pills" className="flex-column mb-3">
                    <Nav.Item>
                        <Nav.Link  className="nav-link-steps ">
                        <b>B - Cancel Order API</b>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link  eventKey = "token_cancel" className="nav-link-steps child">
                        B.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "sample_cancel" className="nav-link-steps child">
                        B.2 - Cancel Order
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "errors_cancel" className="nav-link-steps child">
                        B.3 - Error Codes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "testPlan_cancel" className="nav-link-steps child">
                            {/*<b>{ this.props.apiTitle } Test Plan</b>*/}
                        B.4 - Test Plan
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "testPlanStatus_cancel" className="nav-link-steps child">
                           {/*<b>Review Results</b>*/}
                           B.5 - Test Plan Status
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "review_cancel" className="nav-link-steps child">
                           {/*<b>Review Results</b>*/}
                           B.6 - Review/Verify Results
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
    
            );
        }else if (this.props.apiName === 'redo'){
            return (
                <Nav variant="pills" className="flex-column mb-3">
                    <Nav.Item>
                        <Nav.Link   className="nav-link-steps ">
                        <b>C - Redo Order API</b>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link  eventKey = "token_redo" className="nav-link-steps child">
                        C.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "sample_redo" className="nav-link-steps child">
                        C.2 - Redo Order
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "errors_redo" className="nav-link-steps child">
                        C.3 - Redo Codes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey = "errors2_redo" className="nav-link-steps child">
                            {/*<b>{ this.props.apiTitle } Test Plan</b>*/}
                            C.4 - Error Codes
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "testPlan_redo" className="nav-link-steps child">
                           {/*<b>Review Results</b>*/}
                           C.5 - Test Plan
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "testPlanStatus_redo" className="nav-link-steps child">
                           {/*<b>Review Results</b>*/}
                           C.6 - Redo Test Plan Status
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "review_redo" className="nav-link-steps child">
                           {/*<b>Review Results</b>*/}
                           C.7 - Review/Verify Results
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
    
            );
        }else{//Status 
            return (
                <Nav variant="pills" className="flex-column mb-3">
                    <Nav.Item>
                        <Nav.Link   className="nav-link-steps ">
                        <b>D - Status Update</b>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link  eventKey =  "sample_status" className="nav-link-steps child">
                        D.1 - Introduction
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "testPlan_status" className="nav-link-steps child">
                        D.2 - Test Plan
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey =  "review_status" className="nav-link-steps child">
                        D.3 - Review/Verify the Results
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
    
            );
        }
        
    }
}

export default Intro;
