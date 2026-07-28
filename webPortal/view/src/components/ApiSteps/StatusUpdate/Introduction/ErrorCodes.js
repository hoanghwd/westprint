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
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip/>);
        var increasePercentage = this.props.asUser? 0 : 2 ;

        return (
            <div className="ErrorCodes p-3">
            <h3><b>ERROR CODES</b></h3>
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
                    <td>{orderId}</td>
                    <td>Success!</td>
                    </tr>
                    <tr>
                    <td>01</td>
                    <td>Cannot log in. Invalid user or password</td>
                    </tr>
                    <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Street Address missing</td>
                    </tr>
                    <tr>
                    <td>03</td>
                    <td>Incomplete Billing Address: Company name missing</td>
                    </tr>
                    <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Invalid Shipping Type!	</td>
                    </tr>
                </tbody>
            </Table>

            <div className="d-flex justify-content-end mt-5 mb-3">
                <Button size="lg" variant="primary" onClick={() => this.props.handleNext('testPlan_status', increasePercentage)}>NEXT</Button>
                {skipButton}
            </div>
        </div>
        );
    }
}

export default ErrorCodes;
