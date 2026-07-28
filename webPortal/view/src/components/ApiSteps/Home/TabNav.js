import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import NavConent from "./NavContent";
import NavStage from "../Shared/NavStage";

class Intro extends Component {
    render() {
        return (
            <Col sm={2} className="d-flex flex-column col-border-right">
                <NavConent apiName='Create Order API' />
                <NavConent apiName='Cancel Order API' />
                <NavConent apiName='Redo Order API' />
                <NavConent apiName='Status Update' />

                <NavStage progress={0} />
            </Col>
        );
    }
}

export default Intro;
