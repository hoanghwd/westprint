import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Header from './Header';
import Body from './Body';
import GenerateToken from './GenerateToken';
import Form from "react-bootstrap/Form";

class ApiSampleTool extends Component {
    render() {
        return (
            <div className="Request">
                <GenerateToken
                    modalClose={this.props.modalClose}
                    modalShow={this.props.modalShow}
                    handleChange={this.props.handleChange}
                    handleSubmitToken={this.props.handleSubmitToken}
                    rawData={this.props.rawData}
                    id={this.props.id}
                    apiKey={this.props.apiKey}
                    error={this.props.error}
                />
                <Card className="text-left">
                    <Card.Header className="card-header-account text-light">
                        Request
                    </Card.Header>
                    <Card.Body>
                    <Form onSubmit={this.props.handleSubmit}>

                        <Header 
                            token={this.props.token} 
                            handleChange={this.props.handleChange} 
                            handleShow={this.props.handleShow} 
                        />
                        <hr />
                        <Body                             
                            handleSubmit={this.props.handleSubmit} 
                            handleBlur={this.props.handleBlur}  
                            reqXml={this.props.reqXml}
                            handlePreXml={this.props.handlePreXml}
                            endpoint={this.props.endpoint}
                            httpMethod={this.props.httpMethod}
                            handleChange={this.props.handleChange}
                            handleRequestXml={this.props.handleRequestXml}                            
                        />
                    </Form>

                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default ApiSampleTool;
