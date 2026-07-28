import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CardTitle from "../Misc/CardTitle";
import InputFormWithoutLabel from "../Forms/InputFormWithoutLabel";

const successMessage =
  "Please check your email. You will receive an email from us with instructions for resetting your password. If you don't receive this email, please check your junk mail folder or contact support@jondo.com for further assistance.";

class ForgotSend extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      message: "",
      isSuccess: false
    };

    this.handleSubmitForgotSend = this.handleSubmitForgotSend.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmitForgotSend = async event => {
    event.preventDefault();

    const email = this.state.email;

    const response = await axios.post(
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_FORGOT_SEND,
      { email }
    );

    if (response.data.error) {
      this.setState({ message: response.data.error.text, isSuccess: false });
    } else {
      this.setState({ message: successMessage, isSuccess: true });
    }
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    if (this.props.userId) {
      return (
        <Redirect
          to={{
            pathname: "/myaccount/info"
          }}
        />
      );
    }

    let message;

    if (this.state.message !== "") {
      message = this.state.isSuccess ? (
        <Alert variant="success">{this.state.message}</Alert>
      ) : (
          <Alert variant="dark" className="error text-light">
            {this.state.message}
          </Alert>
        );
    }

    return (
      <div className="Signin">
        <Container>
          <Row>
            <Col md={4} className="mx-auto my-5 py-5">
              <Card>
                <Card.Body>
                  <CardTitle />
                  <Form onSubmit={this.handleSubmitForgotSend}>
                    <InputFormWithoutLabel
                      placeholder="Email"
                      type="email"
                      icon="fas fa-user"
                      handleInput={this.handleChange}
                      name="email"
                    />
                    {message}
                    <Button
                      className="btn-lg btn-block my-3"
                      variant="primary"
                      type="submit"
                    >
                      Recover Password
                    </Button>

                    <div className="my-3">
                      <Link to="/login" className="link">
                        Return to sign in
                      </Link>
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
export default ForgotSend;
