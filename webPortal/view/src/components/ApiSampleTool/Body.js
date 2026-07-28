import React, { Component } from "react";
import AceEditor from "react-ace";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Measure from 'react-measure';

import "brace/mode/xml";
import "brace/theme/monokai";

class ApiSampleTool extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            width: 0
        }

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize(width) {
        this.setState({
            width: width
        });
    }

    render() {
        return (
            <div className="my-account">
                <Row>
                    <Col sm={7}><h5><b>Body</b></h5></Col>
                    <Col sm={5}>
                        <Form.Control as="select" name="preXml" onChange={this.props.handlePreXml}>
                            <option value="create">Create</option>
                            <option value="cancel">Cancel Order</option>
                            <option value="cancelItem">Cancel Item</option>
                            <option value="redo">Redo With Changes</option>
                            <option value="redoAsIs">Redo As Is</option>
                            <option value="updateShippingType">Update Shipping Type</option>
                            <option value="updateAddress">Update Address</option>
                        </Form.Control>
                    </Col>
                </Row>

                <Measure
                    bounds
                    onResize={(contentRect) => this.handleResize(contentRect.bounds.width)}
                >
                    {({ measureRef }) => (
                        <div ref={measureRef} className="mx-auto">
                            <AceEditor
                                onChange={this.props.handleRequestXml}
                                mode="xml"
                                theme="monokai"
                                onBlur={() => this.props.handleBlur(this.props.reqXml)}
                                showGutter={false}
                                setOptions={{
                                    showLineNumbers: false
                                }}
                                value={this.props.reqXml}
                                editorProps={{ $blockScrolling: true }}
                                width={`${this.state.width}px`}
                            />                           
                        </div>


                    )}
                </Measure>

                <Form.Group as={Row} controlId="formPlaintextEmail" className="mt-3 mb-1">
                    <Form.Label column sm="3">
                        <b>Endpoint</b>
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            type="text"
                            name="endpoint"
                            value={this.props.endpoint}
                            onChange={this.props.handleChange}
                            size='sm'
                            required
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formPlaintextEmail">
                    <Form.Label column sm="3" className="py-0">
                        <b>HTTP Method</b>
                    </Form.Label>
                    <Col sm="9" className="py-0">
                        <p className="form-control-plaintext py-0">{this.props.httpMethod}</p>
                    </Col>
                </Form.Group>
                <div className="text-center mt-3">
                    <Button variant="primary" type="submit" > Submit </Button>
                </div>
            </div>
        );
    }
}

export default ApiSampleTool;
