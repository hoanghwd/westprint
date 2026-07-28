import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AceEditor from "react-ace";
import Alert from 'react-bootstrap/Alert'
import "brace/mode/xml";
import "brace/theme/monokai";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import "./ApiSampleTool.css";


class GenerateToken extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled: false,
        }
    }

    
    render() {

        let error = this.props.error ?
        (
            <Alert className="my-3 alert-error" variant='dark'>
                {this.props.error}
            </Alert>
        ) 
        : '';

        let rawResponse = this.props.rawData ?
            (
                <div>
                    <hr />
                    {error}
                    <h5>Response</h5>
                    <div className="mx-auto">
                        <AceEditor
                            mode="xml"
                            theme="monokai"
                            showGutter={false}
                            setOptions={{
                                showLineNumbers: false
                            }}
                            readOnly={true}
                            value={this.props.rawData}
                            editorProps={{ $blockScrolling: true }}
                            height='150px'
                            width="466px"
                        />
                    </div>
                </div>
            )
            : '';
        return (
            <div className="generate-token">
                <Modal
                    show={this.props.modalShow}
                    onHide={this.props.modalClose}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    className="token-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                           <b>Generate Token</b> 
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><i>Your token will be automatically filled in after the generating process</i></p>
                        <Form onSubmit={this.props.handleSubmitToken}>
                            <Form.Group as={Row} controlId="formHorizontalId">
                                <Form.Label column sm={2} className="py-0">
                                    <b>Type</b>
                                </Form.Label>
                                <Col sm={10}>
                                    <p className="form-control-plaintext py-0">POST</p>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formHorizontalId">
                                <Form.Label column sm={2} className="py-0">
                                    <b>URL</b>
                                </Form.Label>
                                <Col sm={10}>
                                    <p className="form-control-plaintext py-0">https://jondohd.com/jondoApi/generateToken.php</p>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formHorizontalId">
                                <Form.Label column sm={2}>
                                    <b>Id</b>
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" name="id" onChange={this.props.handleChange} value={this.props.id} required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formHorizontalApiKey">
                                <Form.Label column sm={2}>
                                    <b>API Key</b>
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" name="apiKey" onChange={this.props.handleChange} value={this.props.apiKey} required/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Col sm={{ span: 10, offset: 2 }}>
                                    <Button variant='primary' type='submit'>Generate</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                        {rawResponse}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default GenerateToken;
