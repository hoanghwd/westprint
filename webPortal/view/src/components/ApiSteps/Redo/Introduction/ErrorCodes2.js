import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip';

//const p = "If your Request failed, you should see one of the following error codes in the Response XML. Please fix the error reported and resubmit your order."
class ErrorCodes extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='status' score={75}/>);
        var increasePercentage = this.props.asUser? 0 : 2 ;


        return (
            <div className="ErrorCodes p-3">
            <h3><b>ERROR CODES</b></h3>
            
            <div>
                <b className="errCodes">
                If your Request failed, you should see one of the following error codes
                in the Response XML. Please fix the error reported and resubmit your 
                order.</b>
                <br></br>
                <br></br>
                <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>01</td>
                                    <td>Cannot log in. Invalid user or password.</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: Street Address missing</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: City missing</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: State missing</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: Zip Code missing</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: Phone Number missing</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: State Invalid!</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: Zip Code Invalid!</td>
                                </tr>
                                <tr>
                                    <td>02</td>
                                    <td>Incomplete Shipping Address: Country Code Invalid!</td>
                                </tr>
                                <tr>
                                    <td>03</td>
                                    <td>Incomplete Billing Address: Company name missing</td>
                                </tr>
                                <tr>
                                    <td>04</td>
                                    <td>Shipping Type Error: Shipping Type Missing</td>
                                </tr>
                                <tr>
                                    <td>04</td>
                                    <td>Shipping Type Error: Invalid Shipping Type!	</td>
                                </tr>
                                <tr>
                                    <td>04</td>
                                    <td>Shipping Type Error: Shipping type given is not allowed for countryCode: [countryCode]</td>
                                </tr>
                                <tr>
                                    <td>05</td>
                                    <td>Invalid PO Number: Already Exists</td>
                                </tr>
                                <tr>
                                    <td>05</td>
                                    <td>Invalid PO Number: Missing</td>
                                </tr>
                                <tr>
                                    <td>06</td>
                                    <td>Quantity must be greater than 0</td>
                                </tr>
                                <tr>
                                    <td>07</td>
                                    <td>Product Code Error: Value can't be NULL</td>
                                </tr>
                                <tr>
                                    <td>07</td>
                                    <td>Product Code Error: Invalid Product Code</td>
                                </tr>
                                <tr>
                                    <td>07</td>
                                    <td>Product Code Error: Order Items Missing</td>
                                </tr>
                                <tr>
                                    <td>08</td>
                                    <td>Image Location Error: Value can't be NULL</td>
                                </tr>
                                <tr>
                                    <td>08</td>
                                    <td>Image Location Error: Invalid URL</td>
                                </tr>
                                <tr>
                                    <td>08</td>
                                    <td>Image Location Error: DPI out of range</td>
                                </tr>
                                <tr>
                                    <td>08</td>
                                    <td>Image Location Error: Invalid Aspect Ratio</td>
                                </tr>
                                <tr>
                                    <td>09</td>
                                    <td>Unknown Error Occurred</td>
                                </tr>
                                <tr>
                                    <td>10</td>
                                    <td>API Under Maintenance! Please try after a while...</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for frontImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for backImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for frontImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for backImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for frontImage of sticker</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid URL for frontImage of coversheet in orderItems tag</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Value can't be NULL for frontImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Value can't be NULL for backImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Value can't be NULL for frontImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Value can't be NULL for backImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Value can't be NULL for frontImage of coverSheet in orderItems tag</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: DPI out of range for frontImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: DPI out of range for backImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: DPI out of range for frontImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: DPI out of range for backImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: DPI out of range for frontImage of coverSheet in orderItems tag</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of packingSlip</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid Aspect Ratio for backImage of insertCard</td>
                                </tr>
                                <tr>
                                    <td>11</td>
                                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of coverSheet in orderItems tag</td>
                                </tr>
                                <tr>
                                    <td>12</td>
                                    <td>Retail Price Error: Value can't be NULL for an International Order</td>
                                </tr>
                                <tr>
                                    <td>13</td>
                                    <td>Duplicate Item Number: Item number used in another node, it should be unique per item node</td>
                                </tr>
                                <tr>
                                    <td>14</td>
                                    <td>Your account is disabled, due to non-payment. To arrange payment, please contact accountsreceivable@jondo.com</td>
                                </tr>
                                <tr>
                                    <td>15</td>
                                    <td>Redo comment error: Missing redo comment</td>
                                </tr>
                                <tr>
                                    <td>16</td>
                                    <td>Redo code error: Missing redo code</td>
                                </tr>
                                <tr>
                                    <td>16</td>
                                    <td>Redo code error: Invalid redo code</td>
                                </tr>
                                <tr>
                                    <td>17</td>
                                    <td>Invalid PO Number: PO Boxes are not supported for Shipping Type/Destination</td>
                                </tr>
                            </tbody>
                        </Table>
            </div>

            <div className="d-flex mt-5 mb-3" style={{justifyContent:"space-between"}}>
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => this.props.handleNext('errors_redo', 0) }
                >
                    PREVIOUS
                </Button>
                <div style={{display:"inline-flex"}}>
                    <Button size="lg" variant="primary" onClick={() => this.props.handleNext('testPlan_redo', increasePercentage)}>NEXT</Button>
                    {skipButton}
                </div>
            </div>
        </div>
        );
    }
}

export default ErrorCodes;
