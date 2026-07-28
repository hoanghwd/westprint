import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";

class Intro extends Component {
    render() {
        return (
            <Nav variant="pills" className="flex-column mb-3">
                <Nav.Item>
                    <Nav.Link disabled eventKey="sample" className="nav-link-steps ">
                        <div className="incompleted"><b>Introduction to { this.props.apiName }</b></div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="sample" className="nav-link-steps child">
                        <div className="incompleted">Introduction</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="xml" className="nav-link-steps child">
                        <div className="incompleted">XML Structures</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="errors" className="nav-link-steps child">
                        <div className="incompleted">Error Codes</div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="testPlan" className="nav-link-steps">
                        <div className="incompleted"><b>{ this.props.apiName } Test Plan</b></div>
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link disabled eventKey="review" className="nav-link-steps">
                        <div className="incompleted"><b>Review Results</b></div>
                    </Nav.Link>
                </Nav.Item>
            </Nav>

        );
    }
}

export default Intro;
