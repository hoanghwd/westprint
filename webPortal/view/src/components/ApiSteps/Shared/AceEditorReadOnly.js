import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import AceEditor from "react-ace";
import Measure from 'react-measure';
import Buttons from './AceEditorButtons';
import ModalEditor from "./ModalEditor";
import "brace/mode/javascript";
import "brace/mode/xml";
import "brace/theme/monokai";

class Response extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            show: false,
            modalShow: false,
            width: 0
        }

        this.handleModal= this.handleModal.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    handleModal() {
        this.setState({ modalShow: !this.state.modalShow });
    }

    handleResize(width) {
        this.setState({ width: width })
    }

    render() {
        const { text, title } = this.props;
        const { width, show, modalShow } = this.state;

        const height =this.props.height || '150px'

        return (
            <div className="ace-editor-read-only">
                <ModalEditor
                    modalClose={this.handleModal}
                    modalShow={modalShow}
                    modalText={this.props.text}
                    aceMode={"javascript"} 
                />

                <div className="title-response">{title}</div>
                <Measure
                    bounds
                    onResize={(contentRect) => this.handleResize(contentRect.bounds.width)}
                >
                    {({ measureRef }) => (
                        <div
                            ref={measureRef}
                            onMouseEnter={() => {this.setState({ show: true })} }
                            onMouseLeave={() => {this.setState({ show: false })} }
                        >
                            <Card className="card-response my-3">
                                {/*<Card.Header className="card-header-response">Input</Card.Header>*/}
                                <Card.Body className="card-body-response">

                                    <Buttons show={show} handleModalShow={this.handleModal} {...this.props} />
                                  
                                    <AceEditor
                                        className="response-editor"
                                        mode="javascript"
                                        theme="monokai"
                                        showGutter={false}
                                        setOptions={{
                                            showLineNumbers: false
                                        }}
                                        readOnly={true}
                                        value={text}
                                        editorProps={{ $blockScrolling: true }}
                                        width={`${width-2}px`}
                                        height={height}
                                    />
                                </Card.Body>
                            </Card>
                        </div>
                    )}
                </Measure>
            </div>
        );
    }
}

export default Response;
