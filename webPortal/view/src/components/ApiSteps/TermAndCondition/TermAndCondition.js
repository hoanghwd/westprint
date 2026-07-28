import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../../Navbar/NavBar";
import Container from 'react-bootstrap/Container'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

class TermAndCondition extends Component {
    render() {
        if (!this.props.userId) {
            return <Redirect to={"/login"} />;
          }

        return (
            <div className="TermAndCondition">.

            <Navbar {...this.props} handleLogin={this.props.handleLogin} />

            <Container>
            <Row>
            <Col md={12} className="mx-auto">
              <Card className="text-left">
                <Card.Body>
                <h2 className="text-monospace font-weight-bold text-left mt-3">
              Term And Condition
              </h2> 
                    <ol>
                    <li>First Condition</li>
                    <li>Second Condition</li>
                    <li>Third Condition</li>
                    <li>Fourth Condition</li>
                    <li>Fifth Condition</li>
                </ol>
                </Card.Body>
              </Card>
            </Col>
          </Row>
       
                
            </Container>
                
            </div>
        );
    }
}

export default TermAndCondition;
