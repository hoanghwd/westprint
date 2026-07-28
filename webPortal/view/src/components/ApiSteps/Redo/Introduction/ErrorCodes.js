import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip';

//const p = "If your Request failed, you should see one of the following error codes in the Response XML. Please fix the error reported and resubmit your order."
const p = "Please use the following redo codes in the Redo XML relevant to the reason of re-submission.";
class ErrorCodes extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='status' score={75}/>);
        var increasePercentage = this.props.asUser? 0 : 2 ;

        return (
            <div className="ErrorCodes p-3">
            <h3><b>REDO CODES</b></h3>
            <p>{p}</p>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2</td>
                        <td>Incorrect Qty Received</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Incorrect Order Received</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>Customer Request</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>Customer Updated Image</td>
                    </tr>
                    <tr>
                        <td>7</td>
                        <td>Order Didn't Arrive</td>
                    </tr>
                    <tr>
                        <td>8</td>
                        <td>Product Damage</td>
                    </tr>
                    <tr>
                        <td>9</td>
                        <td>Quality Concern</td>
                    </tr>
                    <tr>
                        <td>10</td>
                        <td>Shipping Damage</td>
                    </tr>
                    <tr>
                        <td>11</td>
                        <td>Other</td>
                    </tr>

                </tbody>
            </Table>

            <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => this.props.handleNext('sample_redo', 0) }
                >
                    PREVIOUS
                </Button>
                <div style={{display:"inline-flex"}}>
                    <Button size="lg" variant="primary" onClick={() => this.props.handleNext('errors2_redo', increasePercentage)}>NEXT</Button>
                    {skipButton}
                </div>
            </div>
        </div>
        );
    }
}

export default ErrorCodes;
