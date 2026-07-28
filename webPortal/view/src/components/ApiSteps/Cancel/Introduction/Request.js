import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip';

const title = `Cancel Order`;
const p1 = `Just like order request, cancel order request can be submitted by passing a name/value pair to cancel an order.  This method is like doing a form post where the name would be "xml" and the value would be the "xml string".`
const p2 = `For testing purposes, transmit your post request to the following URL:`
const p3 = `Below is a table of XML fields that must be transmitted with every cancel order request. These fields include all basic information required to cancel an order. Failing to transmit all required fields will result in an error.`
const p4 = `Below is a table that describes three fields and their corresponding values that will be passed with every cancel order response.`
const p5 = `Just like a cancel order request, the cancel item request can be submitted by passing a name/value pair to cancel items on the order. This method is like doing a form post where the name would be "xml" and the value would be the "xml string".`
const p6 = `Below is a table of XML fields that must be transmitted with every cancel item request. These fields include all basic information required to cancel an item. Failing to transmit all required fields will result in an error.`
const p7 = `Below is a table that describes six fields and their corresponding values that will be passed with every cancel item response.`

class Request extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {        
        
        //console.log('this.props.skipped: ' + this.props.skipped);
        //console.log('this.props.approved: ' + this.props.approved);
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='redo' score={50}/>);

        var increasePercentage = this.props.asUser? 0 : 2 ;


         return ( 
            <div className="request pt-3">
                <h5><b>{title}</b></h5>
                <p>{p1}</p>
                
                
                <h5><b>Where to Send Your Post Request</b></h5>
                <p>{p2}</p>

                <p className="request-url p-2">{process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API}</p>
                
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

                <h5><b>Request Data</b></h5>
                <p>{p3}</p>

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
                    </tbody>
                </Table>             

                <h5><b>Response Data</b></h5>
                <p>{p4}</p>
                

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className = "width100" >Data Type</th>
                            <th>Value Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>status</td>
                            <td>Number (1)</td>
                            <td>Status 0 indicates failure and 1 indicates success.</td>
                        </tr>
                        <tr>
                            <td>code</td>
                            <td>Number (8)</td>
                            <td>If successful, code returns 0. If false, code will return a number corresponding to the type of error. All Error Codes and their corresponding description can be viewed on the next page.</td>
                        </tr>
                        <tr>
                            <td>message</td>
                            <td>Text</td>
                            <td>Message is the description of the code. In case of success, value would be either “Cancelled Before Production Commenced” if an order gets cancelled before entering production or “Cancelled After Production Commenced” if an order gets cancelled after the production has started. Once the order enters production it becomes billable. Hence its advisable to look up the status of the order before cancelling it.</td>
                        </tr>
                        <tr>
                            <td>date</td>
                            <td>Date (ISO-8601 format)</td>
                            <td>Date is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex: 2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our facility. When in error, value given is NA</td>
                        </tr>
                    </tbody>
                </Table>
          
                <h5><b>Cancel Item Request Data</b></h5>
                <p>{p5}</p>
                <p>{p6}</p>

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
                            <td>itemNumber</td>
                            <td>String (50)</td>
                            <td>The reference number that identifies the item in the order & cancel item request XML. Item numbers must be unique per item node within an order or an error response will be returned. These item numbers can be used to identify a specific item on an order you would like to cancel.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>qt</td>
                            <td>Number (5)</td>
                            <td>Represents the item amount to be cancelled.</td>
                            <td>Y</td>
                        </tr>
                    </tbody>
                </Table>

                <h5><b>Cancel Item Response Data</b></h5>
                <p>{p7}</p>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th className = "width100" >Data Type</th>
                            <th>Value Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>status</td>
                            <td>Number (1)</td>
                            <td>Status 0 indicates failure and 1 indicates success.</td>
                        </tr>
                        <tr>
                            <td>code</td>
                            <td>Number (8)</td>
                            <td>If successful, code returns 0. If false, code will return a number corresponding to the type of error. All Error Codes and its description can be viewed on the next page.</td>
                        </tr>
                        <tr>
                            <td>date</td>
                            <td>Date (ISO-8601 format)</td>
                            <td>Date is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex: 2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our facility. When in error, value given is NA</td>
                        </tr>
                        <tr>
                            <td>itemNumber</td>
                            <td>String (50)</td>
                            <td>Unique reference number provided by you when submitting an order. This number is used to identify the item that you wish to cancel.</td>
                        </tr>
                        <tr>
                            <td>qt</td>
                            <td>Number (5)</td>
                            <td>Represents the item amount to be cancelled.</td>
                        </tr>
                        <tr>
                            <td>message</td>
                            <td>Text</td>
                            <td>Message is the description of the code. In case of success, value would be either “Cancelled Before Production Commenced” if an order gets cancelled before entering production or “Cancelled After Production Commenced” if an order gets cancelled after the production has started. Once the order enters production it becomes billable. Hence its advisable to look up the status of the order before cancelling it.</td>
                        </tr>
                    </tbody>
                </Table>


                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('token_cancel', 0) }
                    >
                        PREVIOUS
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Button size="lg" variant="primary" onClick={() => this.props.handleNext('errors_cancel', increasePercentage) }>NEXT</Button>
                        {skipButton}
                    </div>
                </div>
             
            </div>
        );
    }
}


export default Request;
