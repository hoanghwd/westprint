import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from "../../images/logo2.png";
import RegisterForm from "./RegisterForm";
import "./Register.css";


class Register extends Component {
  render() {
    if (this.props.userId) {
      return (
        <Redirect
          to={{
            pathname: "/myaccount/info"
          }}
        />
      );
    }
    return (
      <div className="my-account">
        <Container>
          <Row>
            <Col md={9} className="mx-auto">
              <Card className="my-5 text-left">
                <Card.Header className="mx-0 px-0 text-center card-header-register">
                  <Card.Img
                    className="my-5 "
                    src={logo}
                  />
                </Card.Header>

                <Card.Body className="mx-0 mt-4">
                  <Row className="mb-3">
                    <Col xs={7}>
                      <Card.Title as="h4" className="text-left flex-nowrap ml-3 title">
                        API Integration Registration
                    </Card.Title>
                    </Col>
                    <Col xs={5}>
                      <Card.Text className="text-right mr-3 normal-text">
                        Fields with (*) are required
                    </Card.Text>
                    </Col>
                  </Row>
                  <RegisterForm
                    handleLogin={this.props.handleLogin} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
