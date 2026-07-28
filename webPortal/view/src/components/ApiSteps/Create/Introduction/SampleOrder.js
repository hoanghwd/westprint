import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Request from "./Request";
import Response from "./Response";

class SampleOrder extends Component {
    render() {
        return (
            <Row>
                <Col sm={7}>
                    <Request handleNext={this.props.handleNext} approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser}/>
                </Col>
                <Col sm={5} className="background-dark">
                    <Response approved={this.props.approved} skipped={this.props.skipped} asUser={this.props.asUser}/>
                </Col>
            </Row>
        );
    }
}

export default SampleOrder;
