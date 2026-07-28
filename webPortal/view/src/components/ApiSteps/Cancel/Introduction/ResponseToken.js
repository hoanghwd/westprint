import React, { Component } from "react";
import AceEditorReadOnly from '../../Shared/AceEditorReadOnly';
import { token } from '../../../../constants/xml';

const format = require('xml-formatter');
const options = { collapseContent: true };

const sample = `curl https://jondohd.com/jondoApi/generateToken.php 
--data 'userId=00&apiKey=ABCDE'`

const xml = format(token, options);
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
                <AceEditorReadOnly title={"Example Request"} height = '100px' text={sample} isCopied={inputCopied} handleCopy={this.handleInputCopy} />
                <AceEditorReadOnly title={"Example Response"} height = '100px' text={xml} isCopied={outputCopied} handleCopy={this.handleOutputCopy} />
            </div>
        );
    }
}

export default Response;
