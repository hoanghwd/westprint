import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStrengthMeter";

import "./Form.css";

class InputFormWithText extends Component {

  render() {
    
    let required = true
  
    if (typeof this.props.required !== 'undefined'){
      required = this.props.required
    }

    let passwordStrengthMeter = '';
    let minLength = this.props.minLength ? this.props.minLength : 0;

    if (this.props.isPassword && this.props.password.length !== 0) {
      passwordStrengthMeter = <PasswordStrengthMeter password={this.props.password} />;
    }

    return (
        <Form.Group as={Row}>
            <Form.Label column sm={3} className="text-right label">
              {this.props.label} {required === false ? '' : '(*)'}
            </Form.Label>
            <Col sm={9}>
  
            <InputGroup className="mb-1">
                <InputGroup.Prepend >
                  <InputGroup.Text className="prepend">
                    <i className="fas fa-lock" />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  required = {required}
                  className="input"
                  type="password"
                  placeholder={this.props.placeholder}
                  minLength={minLength}
                  onChange={this.props.handleInput}
                  name={this.props.name}
                  defaultValue={this.props.value}
                />
                {passwordStrengthMeter}

              </InputGroup>
              

              <Form.Text className="text-muted mt-1 mb-2">
                <i>{this.props.text}</i>
              </Form.Text>
            </Col>                       
        </Form.Group>
    );
  }
}

export default InputFormWithText;
