import React, { Component } from "react";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Skip from '../../Shared/Skip';

const p = "Below is a table of XML fields that must be transmitted with every order. These fields include all basic information required to produce the order, so failing to transmit these fields will result in an error, unless the field is marked as optional.";

class XmlStructure extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip/>);
        var increasePercentage = this.props.asUser? 0 : 2 ;

        return (
            <div className="ErrorCodes  p-3">
            <h3><b>XML Structure and Elements</b></h3>
            <p>{p}</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                    <th>Name</th>
                    <th>Value Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>userId</td>
                    <td>Your user account ID will be provided to you and must be passed with every order</td>
                    </tr>
                    <tr>
                    <td>apiKey</td>
                    <td>Your api key will be provided to you and must be passed with each order so that your identity can be validated</td>
                    </tr>
                    <tr>
                    <td>customerInfo/companyName</td>
                    <td>Return Company Name – will be printed on Shipping Label</td>
                    </tr>
                    <tr>
                    <td>customerInfo/custLogo</td>
                    <td>Dynamic custom logo printed on the back of the product that can be changed order to order</td>
                    </tr>
                    <tr>
                    <td>customerInfo/billingIsReturnAddress</td>
                    <td>Set this to Y to use Company name as Return Company Name on the shipping label</td>
                    </tr>
                </tbody>
            </Table>

            <div className="d-flex justify-content-end mt-5 mb-3">
                <Button size="lg" variant="primary" onClick={() => this.props.handleNext('errors_status', increasePercentage)}>NEXT</Button>
                {skipButton} 
            </div>
        </div>
        );
    }
}

export default XmlStructure;
