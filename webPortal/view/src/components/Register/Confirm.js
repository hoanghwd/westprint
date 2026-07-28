import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logo from "../../images/logo2.png";
import { connect } from 'react-redux';

import "./Register.css";

class Confirm extends Component {
  render() {
    return (
      <div className="my-account">
        <Container>
          <Row>
            <Col md={8} className="mx-auto">
              <Card className="my-5 text-left">
                <Card.Header className="mx-0 px-0 text-center card-header-register">
                  <Card.Img
                    className="my-5 "
                    src={logo}
                  />
                </Card.Header>
                <Card.Body>
                  <p className="sub-heading">
                    Confirm Your Email Address
                  </p>
                  <p>
                    Your registration form has been received. Please click the confirmation link in the email we've sent you to complete your registration.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => (
  { 
    email: state.session.email,
  }
);

export default connect(
  mapStateToProps
)(Confirm);
