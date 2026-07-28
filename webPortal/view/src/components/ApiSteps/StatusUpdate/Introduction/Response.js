import React, { Component } from "react"
import AceEditorReadOnly from '../../Shared/AceEditorReadOnly'
import { statusUpdateAck, statusUpdateAckError, statusUpdateItemized } from '../../../../constants/xml'
import { cancelled, accepted, onHold, processing, shipped, cancelledByCustomer  } from '../../../../constants/statusArrays'

const format = require('xml-formatter');
const options = { collapseContent: true };

//const sample = "curl --location --request POST \"" + process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API + "\" \\ \\r\n  --header \"Content-Type: application/x-www-form-urlencoded\" \\\r\n  --data \"xml=%3Croot%3E%0A%20%20%3CorderRequest%3E%0A%20%20%20%20%3CuserId%3E90%3C/userId%3E%0A%20%20%20%20%3CapiKey%3Ehs6fYcBz564sHj%3C/apiKey%3E%0A%20%20%20%20%3CfirstName%3EMichelle%3C/firstName%3E%0A%20%20%20%20%3ClastName%3EWhitley%3C/lastName%3E%0A%20%20%20%20%3Caddress%3E43900%20A%20ST%3C/address%3E%0A%20%20%20%20%3Ccity%3EHemet%3C/city%3E%0A%20%20%20%20%3Cstate%3ECA%3C/state%3E%0A%20%20%20%20%3Ccountry%3EUS%3C/country%3E%0A%20%20%20%20%3Czip%3E92544%3C/zip%3E%0A%20%20%20%20%3CphoneNumber%3E9519273716%3C/phoneNumber%3E%0A%20%20%20%20%3CpoNumber%3E1555530000%3C/poNumber%3E%0A%20%20%20%20%3CshippingType%3EStandard%3C/shippingType%3E%0A%20%20%20%20%3Cservices%20/%3E%0A%20%20%20%20%3CorderItems%3E%0A%20%20%20%20%20%20%3CorderItem%3E%0A%20%20%20%20%20%20%20%20%3Cqt%3E1%3C/qt%3E%0A%20%20%20%20%20%20%20%20%3Ccode%3E90009%3C/code%3E%0A%20%20%20%20%20%20%20%20%3CimageLocation%3Ehttp%3A//cp-img-proc-vendor.us-west-1.elasticbeanstalk.com/api/images/vendor/9fb9c1cf-80f5-472f-b18a-423e4499f0ea%3C/imageLocation%3E%0A%20%20%20%20%20%20%3C/orderItem%3E%0A%20%20%20%20%3C/orderItems%3E%0A%20%20%20%20%3CtestMode%3E0%3C/testMode%3E%0A%20%20%3C/orderRequest%3E%0A%3C/root%3E\"";
const xmlStatusUpdateAck = format(statusUpdateAck.replace(/(\r\n|\n|\r| {2,})/gm,""), options)
const xmlStatusUpdateAckError = format(statusUpdateAckError.replace(/(\r\n|\n|\r| {2,})/gm,""), options)
const xmlCancelled = cancelled
const xmlAccepted = accepted
const xmlOnHold = onHold
const xmlProcessing = processing
const xmlShipped = shipped
const xmlCancelledByCustomer = cancelledByCustomer
const xmlShippedItemized = statusUpdateItemized

class Response extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputCopied: false,
            outputCopied: false,
        }
        
        this.handleInputCopy = this.handleInputCopy.bind(this);
        this.handleOutputCopy = this.handleOutputCopy.bind(this);
    }

    handleInputCopy() {
        this.setState({ inputCopied: true, outputCopied: false }) 
    }

    handleOutputCopy() {
        this.setState({ inputCopied: false, outputCopied: true }) 
    }
    
    render() {
        const {inputCopied, outputCopied } = this.state;
        return (
            <div className="response">
                {/*<AceEditorReadOnly title={"Example Request"} text={sample} isCopied={inputCopied} handleCopy={this.handleInputCopy} />*/}
                <AceEditorReadOnly title={"Rejected (in Image Validation process)"} text={xmlCancelled} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Accepted"} text={xmlAccepted} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"On Hold"}  height = '200px' text={xmlOnHold} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Processing"}  height = '200px' text={xmlProcessing} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Shipped"}  height = '210px' text={xmlShipped} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Shipped (XML structure)"}  height = '350px' text={xmlShippedItemized} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancelled by customer"}  height = '200px' text={xmlCancelledByCustomer} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                {/*
                <AceEditorReadOnly title={"Status Update Acknowledgement"}  height = '100px'text={xmlStatusUpdateAck} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Status Update Acknowledgement Failed"}  height = '100px' text={xmlStatusUpdateAckError} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                */}
            </div>
        );
    }
}

export default Response;
