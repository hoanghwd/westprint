import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./Form.css";

class InputFormWithLabel extends Component {
  
  render() {
    //alert(this.props.options)
    return (
      <Form.Group as={Row}>
        <Form.Label column sm={3} className="text-right label">
          {this.props.label} {this.props.required === false ? '' : '(*)'}
        </Form.Label>
        <Col sm={9}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend>
              <InputGroup.Text className="prepend">
                <i className={this.props.icon} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              className="input"
              as = {this.props.as?this.props.as:'input'}
              required={this.props.required === false ? false : true}
              type={this.props.type}
              placeholder={this.props.placeholder}
              onChange={this.props.handleInput}
              name={this.props.name}
              defaultValue={this.props.value}
            >
            {this.props.options?this.props.options.map( option => <option>{option}</option>):null}
            </FormControl>
          </InputGroup>
        </Col>
      </Form.Group>
    );
  }
}

export default InputFormWithLabel;
