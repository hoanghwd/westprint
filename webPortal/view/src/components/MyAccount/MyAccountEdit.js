import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "../Navbar/NavBar";
import MyAccountEditForm from "./MyAccountEditForm";

import "./MyAccount.css";

class MyAccountEdit extends Component {
  render() {
    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={9} className="mx-auto">
              <Card className="my-5 text-left">
                <Card.Header className="card-header-account text-light">
                  Account Information
                </Card.Header>
                <Card.Body>
                  <MyAccountEditForm handleLogin={this.props.handleLogin}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default MyAccountEdit;
