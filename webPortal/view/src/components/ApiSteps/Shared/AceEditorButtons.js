import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class AceEditorButtons extends Component {
    render() {
        const { text, isCopied, show, handleCopy, handleModalShow } = this.props;
        return (
            <div className="ace-editor-read-only">
                <CopyToClipboard text={text} onCopy={() => handleCopy()}>
                    <div className={show ? '' : 'btn-hide'}>
                        <Button variant="dark" size="sm" className="btn-clipboard">{isCopied ? "Copied" : "Copy To Clipboard"}</Button>
                    </div>
                </CopyToClipboard>

                <div className={show ? '' : 'btn-hide'}>
                    <Button
                        size="sm"
                        variant="dark"
                        className="btn-expand"
                        onClick={() => handleModalShow()}
                    >
                        Click To Expand
                        </Button>
                </div>
            </div>
        );
    }
}

export default AceEditorButtons;
