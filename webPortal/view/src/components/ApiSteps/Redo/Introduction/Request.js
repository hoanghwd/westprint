import React, { Component } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip'

const title = "Redo Order"
const p1 = `Just like a order request, a redo order request can be submitted by passing a name/value pair. This method is like doing a form post where the name would be "xml" and the value would be the "xml string". The redo order call should be used when you want to create a copy of a portion or entire order that was previously submitted. We currently provide two versions of redo order described below.`
const p2 = `For testing purposes, transmit your post request to the following URL:`
const p3 = `Redo orders that are AS-IS require no changes as the order needs to be made again in its entirely with no updated address or shipping method. In other words, the redo order will be remade exactly the same as the original order.`
const p4 = `Redo orders that are WITH-CHANGES require changes and is similar to submitting a create order request. Redo order changes include new images, quantity of items, change in address, etc.  The only difference between this and a new order request is the order created via the Redo Order request will be tied to the original order for reference reasons.`
const p5 = `Below is a table of XML fields that must be transmitted with every redo order request. These fields include all basic information required to redo an order. Failing to transmit all required fields will result in an error.`


class Request extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {        
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='status' score={75}/>);
        var increasePercentage = this.props.asUser? 0 : 2 ;

         return ( 
            <div className="request pt-3">
                
                <h5><b>{title}</b></h5>
                <p>{p1}</p>
                <p><strong>NOTE 1:</strong> To place a redo, an order must have been created in our system first (see A.2 - Order Placement step).</p>
                <p><strong>NOTE 2:</strong> Redo order testing should always be against TEST orders instead of LIVE orders. A redo placed against a LIVE order will result in a LIVE redo order which will be produced, shipped, and billed.</p>
                
                <h5><b>Where to Send Your Post Request</b></h5>
                <p>{p2}</p>

                <p className="request-url p-2">{process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_REDO_API}</p>
                

                <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>
                <Row className="mb-2">
                    <Col sm={3}><b>Content-Type</b></Col>
                    <Col sm={9}>application/xml</Col>
                </Row>
                <Row>
                    <Col sm={3}><b>Authorization</b></Col>
                    <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
                </Row>

                <br></br>
                <h5><b>AS-IS</b></h5>
                <p>{p3}</p>
                
                
                <h5><b>WITH-CHANGES</b></h5>
                <p>{p4}</p>
                
                <h5><b>Request Data</b></h5>
                <p>{p5}</p>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className = "width100" >Data Type</th>
                            <th>Value Description</th>
                            <th>Required?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>userId</td>
                            <td>Number (5)</td>
                            <td>Your user account ID will be provided to you and must be passed with every request</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>apiKey</td>
                            <td>String (30)</td>
                            <td>Your api key will be provided to you and must be passed with each request so that your identity can be validated</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>poNumber</td>
                            <td>String (50)</td>
                            <td>Reference number that appears on the order and identifies the order. It is highly recommended to use an order number that the recipient will recognize. PO numbers must be unique per order, or an error response will be returned. Character limit for a valid poNumber is 50 characters.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>redoCode</td>
                            <td>Number (3)</td>
                            <td>Code to determine why you need to resubmit the order.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>redoComment</td>
                            <td>Text</td>
                            <td>Short comment for additional context about why a redo order was submitted (image was too dark, incorrect address, etc.). Note that this is different from the Message column on the table shown in the Error Codes page. Also note instructions placed here will not be followed, this field is just for reference. Any changes need should be specified in the request itself via other fields.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>changesRequired</td>
                            <td>Enum (Y,N)</td>
                            <td>Used to validate redo orders WITH-CHANGES. Any other value submitted for this flag will be considered as an AS-IS redo order.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td colSpan = "4" ><strong>All the other tags are just the same as order request.</strong></td>
                           
                        </tr>
                    </tbody>
                </Table>

                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('token_redo', 0) }
                    >
                        PREVIOUS
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Button size="lg" variant="primary" onClick={() => this.props.handleNext('errors_redo', increasePercentage) }>NEXT</Button>
                        {skipButton}
                    </div>
                </div>
             
            </div>
        );
    }
}


export default Request;
