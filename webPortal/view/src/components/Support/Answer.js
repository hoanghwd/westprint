import React, { Component } from "react";
import Navbar from "../Navbar/NavBar";
import { Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class Answer extends Component {

    /*
    constructor(props) {
        super(props);
    
        this.state = {
          faqsInfo: this.props.match.params.question
        };
      }
*/

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }
    
    console.log(this.props);

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="font-weight-bold text-left mt-3">
                FAQs
              </h2>
              <Card className="text-left">
                <Card.Header className="card-header-account text-light">
                  Result
                </Card.Header>
                <Card.Body>
                    {this.props.match.params.question}
                    {this.props.match.params.answer}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );

  }

}

export default Answer;
