import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {Link} from 'react-router-dom';


class Buttons extends Component {
  render() {
    return (
        <div className="Buttons">
        <Row>
          <Col sm={3} />
          <Col sm={9}>
            <Row>
                <Button variant="primary" type="submit" onClick={this.props.onClick} className="mx-3 p3"> 
                {this.props.submit}
              </Button>
              <Link className="btn btn-outline-dark px-3" id="btn-cancel" to={this.props.cancelPath}>Cancel</Link>
            </Row>
          </Col>
        </Row>
        </div>
        
    );
  }
}

export default Buttons;
