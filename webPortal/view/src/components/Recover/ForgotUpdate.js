import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputFormWithoutLabel from "../Forms/InputFormWithoutLabel";
import CardTitle from "../Misc/CardTitle";
import Alert from "react-bootstrap/Alert";

import "../MyAccount/MyAccount.css";

const passwordText =
  "Your password must be at least 8 characters long. Use a mix of upper case letters, lower case letters, numbers, and symbols for a stronger password.";
const confirmText = "Type your password again";

var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();

// Add properties to schema
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols()


class ForgotUpdate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      validateString: this.props.match.params.validateString,
      password: "",
      password2: "",
      isSuccess: false,
      errors: [],
      passwordValidation: []
    };

    this.handleSubmitForgotUpdate = this.handleSubmitForgotUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  handleSubmitForgotUpdate = async event => {
    
    event.preventDefault();

    const password = this.state.password;
    const password2 = this.state.password2;
    const validateString = this.state.validateString;

    this.setState({ errors: []});

    if (password !== password2) {
      this.setState({
        errors: ["The passwords do not match."],
        isSuccess: false
      });
      return false;
    }             

    if (this.state.passwordValidation.length > 0) {
      this.setState({ errors: [...this.state.errors, "Password must follow the requirements above"] });
      return false;
    }

    const response = await axios.post(
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_FORGOT_UPDATE,
      { password, validateString }
    );

    if (response.data.error) {
      this.setState({ error: response.data.error.text, isSuccess: false });
    } else {
      this.setState({ isSuccess: true });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };


  handlePassword = event => {
    
    this.setState({
      password: event.target.value,
      passwordValidation: schema.validate(event.target.value, { list: true })
    });

  };

  getPasswordError(error) {
    
    switch (error) {
      case "min":
        return "Be a minimum of eight (8) characters in length";
      case "digits":
        return "Contain at least one (1) digit (0-9)";
      case "lowercase":
        return "Contain at least one (1) lowercase character (a-z)";
      case "uppercase":
        return "Contain at least one (1) uppercase character (A-Z)";
      case "symbols":
        return "Contain at leat one (1) special character (~`!@#$%^&*()+=_-{}[]\\|:;”’?/<>,.)";
      default:
        return "";
    }

  }


  render() {
        
    let errMsg;

    errMsg = this.state.errors.length > 0 && (
      <Alert variant="dark" className="error text-light">
        <ul>
          {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
        </ul>        
      </Alert>
    );

    const passwordValidation = [
      "min",
      "lowercase",
      "uppercase",
      "digits",
      "symbols"
    ];
    
    //alert(this.props.match.params.userName);
    if (this.props.userId) {
      return (
        <Redirect
          to={{
            pathname: "/myaccountinfo"
          }}
        />
      );
    }

    if (this.state.isSuccess) {
      return (
        <Redirect
          to={{
            pathname: "/forget/confirm"
          }}
        />
      );
    }

    {/*
    let error = "";

    error = this.state.error && (
      <Alert variant="dark" className="error text-light">
        {this.state.error}
      </Alert>
    );
    */}

    return (
      <div className="Signin">
        <Container>
          <Row>
            <Col md={4} className="mx-auto my-5 py-5">
              <Card>
                <Card.Body>
                  <CardTitle />

                  <Form onSubmit={this.handleSubmitForgotUpdate}>
                    <InputFormWithoutLabel
                      placeholder="New Password"
                      inputName="Password"
                      type="password"
                      icon="fas fa-lock"
                      handleInput={this.handlePassword}
                      name="password"
                      isPassword="true"
                      password={this.state.password}
                    />

                    <InputFormWithoutLabel
                      placeholder="Re-type New Password"
                      inputName="Password"
                      type="password"
                      icon="fas fa-lock"
                      handleInput={this.handleChange}
                      name="password2"
                    />

                    {
                      this.state.passwordValidation.length !== 0 ?
                        <Alert variant="dark">
                          <div className="red">Password must:</div>
                          <ul className="password-validation">
                            {passwordValidation.map(error =>
                              <li
                                key={error}
                                className={this.state.passwordValidation.includes(error) ? "red" : "green"}
                              >
                                {this.getPasswordError(error)}
                              </li>)}
                          </ul>
                        </Alert> : ''
                    }

                    {errMsg}
               
                    <div className="d-flex justify-content-center my-3">
                      <Button variant="primary" type="submit" size="lg" block>
                        Reset Password
                      </Button>
                    </div>

                    <div>
                      <p className="font-italic">
                        Enter a new password to reset your password.
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ForgotUpdate;
