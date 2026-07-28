import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import NavConent from "./NavContent";
import NavStage from "../Shared/NavStage";

class Intro extends Component {
    render() {
        return (
            <Col sm={2} className="d-flex flex-column col-border-right">
                <NavConent apiTitle='Create Order API' apiName='create' />
                <NavConent apiTitle='Cancel Order API' apiName='cancel' />
                <NavConent apiTitle='Redo Order API' apiName='redo' />
                <NavConent apiTitle='Status Update' apiName='status' />

                <NavStage progress={0} />
            </Col>
        );
    }
}

export default Intro;
