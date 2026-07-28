import React, { Component } from "react"
import AceEditorReadOnly from '../../Shared/AceEditorReadOnly'
import { redoAsIs, redoWithChanges, redoResp, redoRespError } from '../../../../constants/xml'

const format = require('xml-formatter');
const options = { collapseContent: true };

//const sample = "curl --location --request POST \"" + process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API + "\" \\ \\r\n  --header \"Content-Type: application/x-www-form-urlencoded\" \\\r\n  --data \"xml=%3Croot%3E%0A%20%20%3CorderRequest%3E%0A%20%20%20%20%3CuserId%3EXXXXX%3C/userId%3E%0A%20%20%20%20%3CapiKey%3EXXXXXX%3C/apiKey%3E%0A%20%20%20%20%3CfirstName%3EJohn%3C/firstName%3E%0A%20%20%20%20%3ClastName%3EDoe%3C/lastName%3E%0A%20%20%20%20%3Caddress%3E1000%20fakt%20ST%3C/address%3E%0A%20%20%20%20%3Ccity%3EHemet%3C/city%3E%0A%20%20%20%20%3Cstate%3ECA%3C/state%3E%0A%20%20%20%20%3Ccountry%3EUS%3C/country%3E%0A%20%20%20%20%3Czip%3E92544%3C/zip%3E%0A%20%20%20%20%3CphoneNumber%3E9519273716%3C/phoneNumber%3E%0A%20%20%20%20%3CpoNumber%3E1555530000%3C/poNumber%3E%0A%20%20%20%20%3CshippingType%3EStandard%3C/shippingType%3E%0A%20%20%20%20%3Cservices%20/%3E%0A%20%20%20%20%3CorderItems%3E%0A%20%20%20%20%20%20%3CorderItem%3E%0A%20%20%20%20%20%20%20%20%3Cqt%3E1%3C/qt%3E%0A%20%20%20%20%20%20%20%20%3Ccode%3E90009%3C/code%3E%0A%20%20%20%20%20%20%20%20%3CimageLocation%3Ehttp%3A//cp-img-proc-vendor.us-west-1.elasticbeanstalk.com/api/images/vendor/9fb9c1cf-80f5-472f-b18a-423e4499f0ea%3C/imageLocation%3E%0A%20%20%20%20%20%20%3C/orderItem%3E%0A%20%20%20%20%3C/orderItems%3E%0A%20%20%20%20%3CtestMode%3E0%3C/testMode%3E%0A%20%20%3C/orderRequest%3E%0A%3C/root%3E\""
const sample = "curl \"" + process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_REDO_API + "\" -H \"Accept: application/xml\" -H \"Authorization: Bearer ACCESS_TOKEN\" -d '<root><redoOrder><userId>XXX</userId><apiKey>XXXXXXXXX</apiKey><poNumber>123654789</poNumber><redoCode>4</redoCode><redoComment>Image was too dark</redoComment></redoOrder></root>'";
const xmlRedoAsIs = format(redoAsIs.replace(/(\r\n|\n|\r| {2,})/gm,""), options)
const xmlRedoWithChanges = format(redoWithChanges.replace(/(\r\n|\n|\r| {2,})/gm,""), options)
const xmlRedoResp = format(redoResp.replace(/(\r\n|\n|\r| {2,})/gm,""), options)
const xmlRedoRespError = format(redoRespError.replace(/(\r\n|\n|\r| {2,})/gm,""), options)



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
                <AceEditorReadOnly title={"Redo Request As Is"} height = '140px' text={xmlRedoAsIs} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Redo Request With Changes"} height = '830px' text={xmlRedoWithChanges} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Redo Response success"} height = '180px' text={xmlRedoResp} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
                <AceEditorReadOnly title={"Redo Response failure"} height = '220px' text={xmlRedoRespError} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
            </div>
        );
    }
}

export default Response;
