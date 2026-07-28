import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "brace/mode/xml";
import "brace/theme/monokai";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./ApiSampleTool.css";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

class ApiSampleTool extends Component {
    render() {
        return (
            <div className="header">
                <h5><b>Header</b></h5>
                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="py-0">
                        <b>Content-Type</b>
                    </Form.Label>
                    <Col sm="9" className="py-0">
                        <p className="form-control-plaintext py-0">application/xml</p>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm="3" className="py-0">
                        <b>Authorization</b>
                    </Form.Label>
                    <Col sm="2" className="py-0">
                        <p className="form-control-plaintext py-0">Bearer</p>
                    </Col>
                    <Col sm="7" className="py-0">
                        <Row>
                            <Col sm="10">
                                <Form.Control
                                    className="py-0"
                                    type="text"
                                    name="token"
                                    value={this.props.token}
                                    placeholder="Enter your token here"
                                    onChange={this.props.handleChange}
                                    size='sm'
                                    required
                                />
                            </Col>
                            <Col sm="2">
                                <OverlayTrigger
                                    placement='top'
                                    overlay={
                                        <Tooltip id={`tooltip-top}`}>
                                            Generate New Token
                                        </Tooltip>
                                    }
                                >
                                    <Button className="token-btn p-0" onClick={this.props.handleShow}>
                                        <i className="fas fa-unlock"></i>
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        </Row>
                    </Col>
                </Form.Group>
            </div>
        );
    }
}

export default ApiSampleTool;
