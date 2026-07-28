import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

class CheckBox extends Component {
  render() {
    return (
      <Row>
        <Col sm={3} />
        <Col sm={9}>
          <div className="form-check mb-3 normal-text">
            <input
              className="form-check-input "
              type="checkbox"
              value=""
              id="defaultCheck1"
              required
            />
            <label className="form-check-label" htmlFor="defaultCheck1">
              <a href="#terms" className="link">
                {this.props.text}
              </a>
            </label>
          </div>
        </Col>
      </Row>
    );
  }
}

export default CheckBox;
