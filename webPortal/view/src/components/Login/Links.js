import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from 'react-router-dom';

class Links extends Component {
  render() {
    return (
      <Row>
        <Col xs={5}>
          <Link to="/forgot/send" className="link text-nowrap">
            Forgot password?
          </Link>
        </Col>
        <Col xs={7}>
          <div className="text-right">
            <Link to="/register" className="link">Create a new account</Link>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Links;
