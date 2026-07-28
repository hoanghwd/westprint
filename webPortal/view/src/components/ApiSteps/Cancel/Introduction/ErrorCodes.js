import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip';

const orderId = "{orderId}"
const p = "If your Request failed, you should see one of the following error codes in the Response XML. Please fix the error reported and resubmit your order."

class ErrorCodes extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='redo' score={50}/>);

        var increasePercentage = this.props.asUser? 0 : 2 ;

        return (
            <div className="ErrorCodes p-3">
            <h5><b>ERROR CODES</b></h5>
            <p>{p}</p>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {/*}
                    <tr>
                        <td>0</td>
                        <td>Success!</td>
                    </tr>
                    */}
                    <tr>
                        <td>6</td>
                        <td>Connection error</td>
                    </tr>
                    <tr>
                        <td>100</td>
                        <td>Login Error. Invalid userId or apiKey.</td>
                    </tr>
                    <tr>
                        <td>201</td>
                        <td>Order does not exist</td>
                    </tr>
                    <tr>
                        <td>202</td>
                        <td>Order is Complete! Order cannot be cancelled</td>
                    </tr>
                    <tr>
                        <td>203</td>
                        <td>Order is already cancelled</td>
                    </tr>
                    <tr>
                        <td>204</td>
                        <td>Item does not exist</td>
                    </tr>
                    <tr>
                        <td>205</td>
                        <td>Order is Complete! Item cannot be cancelled</td>
                    </tr>
                    <tr>
                        <td>206</td>
                        <td>Item is already cancelled</td>
                    </tr>
                    <tr>
                        <td>207</td>
                        <td>Invalid Item Quantity</td>
                    </tr>
                    <tr>
                        <td>208</td>
                        <td>Item cancellation is not allowed in this location</td>
                    </tr>
                </tbody>
            </Table>

            <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => this.props.handleNext('sample_cancel', 0) }
                >
                    PREVIOUS
                </Button>
                <div style={{display:"inline-flex"}}>
                    <Button size="lg" variant="primary" onClick={() => this.props.handleNext('testPlan_cancel', increasePercentage)}>NEXT</Button>
                    {skipButton}
                </div>
            </div>
        </div>
        );
    }
}

export default ErrorCodes;
