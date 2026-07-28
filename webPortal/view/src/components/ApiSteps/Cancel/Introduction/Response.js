import React, { Component } from "react";
import AceEditorReadOnly from '../../Shared/AceEditorReadOnly';
import { cancel, cancelRespBefore, cancelRespAfter, cancelRespError, cancelItem, cancelItemResp, cancelItemRespError, cancelItemRespPartial } from '../../../../constants/xml';

const format = require('xml-formatter');
const options = { collapseContent: true };

//const sample = "curl --location --request POST "" + process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API + "" \\ \\r\n  --header "Content-Type: application/x-www-form-urlencoded" \\\r\n  --data "xml=%3Croot%3E%0A%20%20%3CorderRequest%3E%0A%20%20%20%20%3CuserId%3EXXXXX%3C/userId%3E%0A%20%20%20%20%3CapiKey%XXXXXXXXX%3C/apiKey%3E%0A%20%20%20%20%3CfirstName%John%3C/firstName%3E%0A%20%20%20%20%3ClastName%Doe%3C/lastName%3E%0A%20%20%20%20%3Caddress%3E1000%20Fake%20ST%3C/address%3E%0A%20%20%20%20%3Ccity%3EHemet%3C/city%3E%0A%20%20%20%20%3Cstate%3ECA%3C/state%3E%0A%20%20%20%20%3Ccountry%3EUS%3C/country%3E%0A%20%20%20%20%3Czip%3E92544%3C/zip%3E%0A%20%20%20%20%3CphoneNumber%3E9519273716%3C/phoneNumber%3E%0A%20%20%20%20%3CpoNumber%3E1555530000%3C/poNumber%3E%0A%20%20%20%20%3CshippingType%3EBasic%3C/shippingType%3E%0A%20%20%20%20%3Cservices%20/%3E%0A%20%20%20%20%3CorderItems%3E%0A%20%20%20%20%20%20%3CorderItem%3E%0A%20%20%20%20%20%20%20%20%3Cqt%3E1%3C/qt%3E%0A%20%20%20%20%20%20%20%20%3Ccode%3E90009%3C/code%3E%0A%20%20%20%20%20%20%20%20%3CimageLocation%3Ehttp%3A//cp-img-proc-vendor.us-west-1.elasticbeanstalk.com/api/images/vendor/9fb9c1cf-80f5-472f-b18a-423e4499f0ea%3C/imageLocation%3E%0A%20%20%20%20%20%20%3C/orderItem%3E%0A%20%20%20%20%3C/orderItems%3E%0A%20%20%20%20%3CtestMode%3E0%3C/testMode%3E%0A%20%20%3C/orderRequest%3E%0A%3C/root%3E"";
const sample = `curl "${process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API}" -H "Accept: application/xml" -H "Authorization: Bearer ACCESS_TOKEN" -d '<root><cancelOrder><userId>XXX</userId><apiKey>XXXXXXXXX</apiKey><poNumber>123654789</poNumber></cancelOrder></root>'`;
const xmlCancel = format(cancel.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelRespBefore = format(cancelRespBefore.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelRespAfter = format(cancelRespAfter.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelRespError = format(cancelRespError.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelItem = format(cancelItem.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelItemResp = format(cancelItemResp.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelItemRespError = format(cancelItemRespError.replace(/(\r\n|\n|\r| {2,})/gm,""), options);
const xmlCancelItemRespPartial = format(cancelItemRespPartial.replace(/(\r\n|\n|\r| {2,})/gm,""), options);

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
                <AceEditorReadOnly title={"Example Request"} height = '70px' text={sample} isCopied={inputCopied} handleCopy={this.handleInputCopy} />
                <AceEditorReadOnly title={"Cancel Request"} height = '110px' text={xmlCancel} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Response before the Production started"} height = '120px' text={xmlCancelRespBefore} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Response after the production started"} height = '120px' text={xmlCancelRespAfter} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Response failed"} height = '120px' text={xmlCancelRespError} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Item Request"} height = '260px' text={xmlCancelItem} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Item Response success"} height = '430px' text={xmlCancelItemResp} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Item Response failed"} height = '120px' text={xmlCancelItemRespError} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Cancel Item Response partial"} height = '320px' text={xmlCancelItemRespPartial} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
            </div>
        );
    }
}

export default Response;
