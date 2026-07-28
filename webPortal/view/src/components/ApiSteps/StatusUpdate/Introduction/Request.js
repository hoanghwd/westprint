import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from "axios"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip'

const title = `Status Update`
const p1 = `Any time an order's status changes our system will send the status update to the client. We will be using POST method to send the following XML payloads to a URL that client provided us. Please note that Shipped status update provides the item level details and the other status updates are on the order level.`
/*
const p2_1 = `Accepted - Image validation has passed and the order is accepted for production`
const p2_1a = `Rejected - Image validation has failed and the order has been removed from the system.  Images should be fixed and the order should be sent again.`
const p2_2 = `On Hold - Order is held in production due to some issue`
const p2_3 = `Processing - Order is in production`
const p2_4 = `Shipped - Order is shipped`
const p2_5 = `Cancelled - Order is cancelled due to customer's request`
*/

const p2_1 = `Accepted - Image validation has passed and the order is accepted for production`
const p2_1a = `Rejected - Image validation has failed and the order has been removed from the system. Images should be fixed and the order should be sent again`
const p2_2 = `On Hold - Order is held in production`
const p2_3 = `Processing - Order is in production`
const p2_4 = `Shipped - Order is shipped`
const p2_5 = `Cancelled - Order is cancelled`

const p3 = ``
const p6_1 = `HTTP Response – only the HTTP response code will be monitored. Any response code other than 200 will be considered as a failure and status updates will be retried. If a retry is not needed please respond with a HTTP 200.`
const p9 = `To utilize the ship notifications, please provide a URL to post this data to.`


const checkForSkip = async (userName, jwt) => {
    const section = 'status' 
    const searchParams = `?userName=${userName}&sectionName=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_CHECK_FOR_SKIP +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    )
}

class Request extends Component {
    
    constructor(props) {
        
        super(props);
    
        this.state = {
            skip: false                   
        }
      
    }

    // update the table when submit search form
    async componentDidMount() {
                  
        const { userName, jwt } = this.props;
        
        const response = await checkForSkip(userName, jwt)
               
        if (response.data) {    
            //console.log("response.data", response.data)          
            //console.log("response.data.isAllow", response.data.isAllow)
            this.setState({ skip: response.data.isAllow});
        }
               
    }



    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {        
        
        //const skipButton = this.props.approved ? '' : (<Skip />);
        const skipButton = (this.props.skipped || this.props.approved || !this.state.skip) ? '' : (<Skip />);
        var increasePercentage = this.props.asUser? 0 : 2 ;
        
        return ( 
            <div className="request pt-3">
                
                <h5><b>{title}</b></h5>
                
                <p>{p1}</p>
                
                <ul>
                    <li>{p2_1}</li>
                    <li>{p2_1a}</li>
                    <li>{p2_2}</li>
                    <li>{p2_3}</li>
                    <li>{p2_4}</li>
                    <li>{p2_5}</li>
                </ul>
               
                <p>{p3}</p>

                <h5><b>Request Data</b></h5>

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
                            <td>userId</td>
                            <td>Number (5)</td>
                            <td>Your user account ID will be provided to you and can be used in conjunction with the apiKey to authenticate (optional).</td>
                        </tr>
                        <tr>
                            <td>apiKey</td>
                            <td>String (30)</td>
                            <td>Your api key will be provided to you and can be used in conjunction with the userID to authenticate (optional).</td>
                       </tr>
                        <tr>
                            <td>poNumber</td>
                            <td>String (50)</td>
                            <td>The purchase order number you originally submitted with your order.</td>
                        </tr>
                        <tr>
                            <td>orderId</td>
                            <td>Number (12)</td>
                            <td>The unique order ID# in the synergize system, returned after every successful order is placed</td>
                        </tr>
                        <tr>
                            <td>trackingUrl</td>
                            <td>Text</td>
                            <td>Tracking link that can be used to track the package.</td>
                        </tr>
                        <tr>
                            <td>trackingUrlSecondary</td>
                            <td>Text</td>
                            <td>Tracking link that can be used to track the package.</td>
                        </tr>
                        <tr>
                            <td>tracking</td>
                            <td>Text</td>
                            <td>A pipe delimited list of tracking numbers used to ship the order. Normally, there will only be one tracking number. </td>
                        </tr>
                        <tr>
                            <td>trackingSecondary</td>
                            <td>Text</td>
                            <td>Secondary tracking number will be populated in this field when an original carrier uses secondary carrier for delivery.</td>
                        </tr>
                        <tr>
                            <td>carrier</td>
                            <td>String (20)</td>
                            <td>Carrier the order was shipped with.</td>
                        </tr>
                        <tr>
                            <td>carrierSecondary</td>
                            <td>String (20)</td>
                            <td> Secondary carrier will be populated in this field when an original carrier uses secondary carrier for delivery.</td>
                        </tr>
                        <tr>
                            <td>packages/package/carrier</td>
                            <td>String (20)</td>
                            <td>Carrier the item was shipped with.</td>
                        </tr>
                        <tr>
                            <td>packages/package/tracking</td>
                            <td>Text</td>
                            <td>Tracking number will be populated in this field.</td>
                        </tr>
                        <tr>
                            <td>packages/package/trackingUrl</td>
                            <td>Text</td>
                            <td>Tracking link that can be used to track the package.</td>
                        </tr>
                        <tr>
                            <td>packages/package/carrierSecondary</td>
                            <td>String (20)</td>
                            <td>Carrier the item was shipped with.</td>
                        </tr>
                        <tr>
                            <td>packages/package/trackingSecondary</td>
                            <td>Text</td>
                            <td>Tracking number will be populated in this field.</td>
                        </tr>
                        <tr>
                            <td>packages/package/trackingUrlSecondary</td>
                            <td>Text</td>
                            <td>Tracking link that can be used to track the package.</td>
                        </tr>
                        <tr>
                            <td>packages/package/items/itemNumber</td>
                            <td>String (50)</td>
                            <td>This is the exact value that represents the itemNumber we received from you in the order request XML.</td>
                        </tr>
                        <tr>
                            <td>status</td>
                            <td>String (20)</td>
                            <td>Indicates whether the order is “Accepted”, "Rejected", “On Hold”, “Processing”, “Shipped”, or “Cancelled”.<br></br>
                            <strong>NOTE:</strong> For “Cancelled” statuses, orders cancelled before production started won’t be billed and will have the [tracking] as “Cancelled Before Production Commenced”. Orders cancelled after production started will be billed and will have the [tracking] as “Cancelled After Production Commenced”.
                            </td>
                        </tr>
                        <tr>
                            <td>statusMessage</td>
                            <td>Text</td>
                            <td>Reason for placing the order on hold. Ex: Address Issue</td>
                        </tr>
                        <tr>
                            <td>statusDate</td>
                            <td>Date (ISO-8601 format)</td>
                            <td>Date is of ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex: 2017-03-21T22:09:01Z). This date represents the exact date and time the order was shipped / cancelled from our facility. When in error, value given is NA.</td>
                        </tr>                        
                    </tbody>
                </Table>
                {/*<p>*These fields are only applicable if your endpoint is capable of accepting the XML payload for Shipped status</p>*/}

                <p>{p6_1}</p>
                
                {/*
                <h5><b>Status Update Acknowledgement</b></h5>
                
                <p>{p4}</p>
                <p>{p5}</p>


                <h5><b>Response Data</b></h5>

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
                            <td>statusCode</td>
                            <td>Number (1)</td>
                            <td>1 for success and 0 for failure</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>statusMessage </td>
                            <td>Text</td>
                            <td>Message indicating success or failure</td>
                            <td>Y</td>
                       </tr>
                       <tr>
                            <td>customMessage </td>
                            <td>Text</td>
                            <td>Custom message can be used in this tag (Ex: parsing error). This could be useful for debugging purposes</td>
                            <td>N</td>
                        </tr>
                                                
                    </tbody>
                </Table>

                <p>{p7}</p>
                <p>{p8}</p>
                */}
                
                <p>{p9}</p>
                
                <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                    <Button
                        disabled
                        size="lg"
                        variant="outline-light"
                        onClick={() => this.props.handleNext('', 0) }
                    >
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Button size="lg" variant="primary" onClick={() => this.props.handleNext('testPlan_status', increasePercentage) }>NEXT</Button>
                        {skipButton}
                    </div>
                </div>
             
            </div>
        );
    }
}


const mapStateToProps = state => (
    {
        userName: state.session.userName, 
        jwt: state.session.jwt
    }
);

export default connect(
    mapStateToProps
)(Request);

//export default Request;
