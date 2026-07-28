import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./Form.css";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStrengthMeter";

class InputFormWithoutLabel extends Component {
  render() {
    let passwordStrengthMeter = '';
    let minLength = this.props.isPassword ? 7 : 0;

    if (this.props.isPassword && this.props.password.length !== 0) {
      passwordStrengthMeter = <PasswordStrengthMeter password={this.props.password} />;
    }

    return (
        <Form.Group>
          <InputGroup className="mb-4" size="lg">
            <InputGroup.Prepend>
              <InputGroup.Text className="prepend">
                <i className={this.props.icon} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className="input"
              placeholder={this.props.placeholder}
              onChange={this.props.handleInput}
              type={this.props.type}
              name={this.props.name}
              minLength={minLength}
              defaultValue={this.props.value}
              required
            />
            {passwordStrengthMeter}
          </InputGroup>
        </Form.Group>
    );
  }
}

export default InputFormWithoutLabel;
