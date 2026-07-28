import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardTitle from "../Misc/CardTitle";
import { Link } from "react-router-dom";

class ResetConfirm extends Component {
  render() {
    return (
      <div className="Signin">
        <Container>
          <Row>
            <Col md={4} className="mx-auto my-5 py-5">
              <Card>
                <Card.Body>
                  <CardTitle />
                  <div>
                    <p>
                      Your password has been updated!!
                    </p>
                  </div>
                  <div>
                    <Link to="/login" className="link">Sign Into Your Account</Link>
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

export default ResetConfirm;
