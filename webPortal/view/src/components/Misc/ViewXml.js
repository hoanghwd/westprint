import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "../Navbar/NavBar";
import AceEditor from "react-ace";
import "brace/mode/xml";
import "brace/theme/monokai";
import axios from "axios";


const format = require('xml-formatter');

const options2 = { collapseContent: true, indentation  : '    ' };

const getLogDetail = async (userName, orderId) => {
  const searchParams = `?userName=${userName}&logId=${orderId}`
  return await axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_LOG_DETAIL + searchParams);

};

class ViewXml extends Component {

  constructor(props) {

    super(props);
    this.state = {
      poNumber: "",
      reqXml: "",
      respXml: ""
    };

  }

  async componentDidMount() {//Get Data On Load
    //alert('DID MONT')
    const { userName } = this.props;
    const logid = this.props.match.params.id;

    const response = await getLogDetail(userName, logid);

    if (response.data.error) {
      this.setState({ error: response.data.error.text });
    }
    else {
      let newRespXml = '';
      let respXml = response.data.respXml
      if( respXml.search('Body') !== -1 ) {
          let indexBody = respXml.indexOf('Body');
          newRespXml = respXml.substring(0, indexBody);
          respXml = newRespXml;
      }
      else if(respXml.search('<root>') !== -1) {
        respXml = response.data.respXml.replace(/(\r\n|\n|\r)/gm,"")
        respXml = respXml.replace(/>\s+</g,'><')
        respXml = respXml.replace(/\\/g, "")
        respXml = format(respXml, options2);
      }

      let newReqXml = response.data.reqXml
      .replace(/CancelledAfterProductionCommenced/g, "Cancelled After Production Commenced");

      this.setState({ poNumber: response.data.poNumber, reqXml: newReqXml, respXml: respXml });
    }
  }

  render() {
    return (
        <div className="view-xml">
          <Navbar {...this.props} handleLogin={this.props.handleLogin} />
          <Container>
            <Row>
              <h2 className="text-monospace font-weight-bold text-left mt-3 ml-3">
                PO# {this.state.poNumber}
              </h2>
            </Row>
            <Row>
              <Col sm={6}>
                <Card className="text-left">
                  <Card.Header className="card-header-account text-light">
                    Request
                  </Card.Header>
                  <Card.Body>
                    <div className="mx-auto">
                      <AceEditor
                          mode="javascript"
                          theme="monokai"
                          showGutter={false}
                          fontSize={14}
                          setOptions={{
                            showLineNumbers: false
                          }}
                          readOnly={true}
                          value={this.state.reqXml.replace(/&nbsp;/g, " ")}
                          editorProps={{ $blockScrolling: true }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6}>
                <Card className="text-left">
                  <Card.Header className="card-header-account text-light">
                    Response
                  </Card.Header>
                  <Card.Body>
                    <div className="mx-auto">
                      <AceEditor
                          mode="javascript"
                          theme="monokai"
                          showGutter={false}
                          fontSize={14}
                          setOptions={{
                            showLineNumbers: false
                          }}
                          readOnly={true}
                          value={this.state.respXml}
                          editorProps={{ $blockScrolling: true }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
    );
  }
}

export default ViewXml;