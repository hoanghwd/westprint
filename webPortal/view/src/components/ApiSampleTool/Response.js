import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AceEditor from "react-ace";
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
            <Card className="text-left reponse-card">
                <Card.Header className="card-header-account text-light">
                    Response
                </Card.Header>
                <Card.Body>
                    <h5><b>Header</b></h5>
                    <Form.Group as={Row}>
                        <Form.Label column sm="3" className="py-0">
                            <b>Content-Type</b>
                        </Form.Label>
                        <Col sm="9" className="py-0">
                            <p className="form-control-plaintext py-0">{this.props.contentType}</p>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='margin-api-sample'>
                        <Form.Label column sm="3" className="py-0">
                            <b>Status</b>
                        </Form.Label>
                        <Col sm="9" className="py-0">
                            <p className="form-control-plaintext py-0">{this.props.status}</p>
                        </Col>
                    </Form.Group>
                    <hr />

                    <div className="padding-body-api-sample"><h5><b>Body</b></h5></div>
                    <Measure
                        bounds
                        onResize={(contentRect) => this.handleResize(contentRect.bounds.width)}
                    >
                        {({ measureRef }) => (
                            <div ref={measureRef} className="mx-auto">
                                <AceEditor
                                    mode="xml"
                                    theme="monokai"
                                    showGutter={false}
                                    setOptions={{
                                        showLineNumbers: false
                                    }}
                                    readOnly={true}
                                    value={this.props.respXml}
                                    editorProps={{ $blockScrolling: true }}
                                    width={`${this.state.width}px`}
                                />
                            </div>
                        )}
                    </Measure>
                    {/*
                    <div className="text-center btn-api-sample">
                        <Button variant="primary" type="submit" onClick={this.props.handleClear}>Clear</Button>
                    </div>
                    */}
                </Card.Body>
            </Card>
        );
    }
}

export default ApiSampleTool;
