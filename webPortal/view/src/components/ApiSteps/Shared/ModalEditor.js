import React, { Component } from "react";
import AceEditor from "react-ace";
import Modal from 'react-bootstrap/Modal';
import Measure from 'react-measure';

import "brace/mode/javascript";
import "brace/mode/xml";
import "brace/theme/monokai";

class ModalEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            width: 0
        }

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize(width) {
        this.setState({
            width: width
        });
    }

    render() {
        const { width } = this.state;

        return (
            <div className="response pt-3">
                <Modal
                    onHide={this.props.modalClose}
                    show={this.props.modalShow}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton className="modal-header-editor">
                        Output
                    </Modal.Header>
                    <Measure
                        bounds
                        onResize={(contentRect) => this.handleResize(contentRect.bounds.width)}
                    >
                        {({ measureRef }) => (
                            <Modal.Body ref={measureRef} className="modal-body-editor">
                                <AceEditor
                                    mode={this.props.aceMode}
                                    theme="monokai"
                                    showGutter={false}
                                    setOptions={{
                                        showLineNumbers: false
                                    }}
                                    readOnly={true}
                                    value={this.props.modalText}
                                    editorProps={{ $blockScrolling: true }}
                                    width={`${width}px`}
                                    height="532px"
                                />

                            </Modal.Body>
                        )}
                    </Measure>
                </Modal>
            </div>
        );
    }
}

export default ModalEditor;
