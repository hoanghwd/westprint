import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";

import { connect } from 'react-redux';
import Card from "react-bootstrap/Card";

import Container from "react-bootstrap/Container";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from "react-bootstrap/Alert";

import Navbar from "../Navbar/NavBar";
import InputFormWithoutLabel from "../Forms/InputFormWithoutLabel";
import InputFormWithLabel from "../Forms/InputFormWithLabel";


class SupportRequest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientEmail: this.props.userInfo.email,
            comment: "",
            submitted: false,
            errors:[]
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {

        //console.log('this.props.userInfo')
        //console.log(this.props.userInfo)

        const { phone, email, company, level, street, city, zip, state, country, shipUrl } = this.props.userInfo;

        this.setState ({
            clientEmail: email,
            /*
            phone: phone,
            company: company,
            level: level,
            street: street,
            city: city,
            zip: zip,
            state: state,
            country: country,
            shipUrl: shipUrl
             */
        });
    }

    handleChange(e) {
        this.setState({
            comment: e.target.value
        })
    }

    handleEmailClientChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    async handleSubmit(e) {

        e.preventDefault();

        const comment = this.state.comment;
        const clientEmail = this.state.clientEmail;

        this.setState({ errors: []});

        if( clientEmail.trim() !== '' ) {
            if ( !this.isValidEmailValidation(clientEmail) ) {
                this.setState({ errors: ['Email is not valid!'] });
                return false;
            }
        }

        if(comment.trim() === ''){
            this.setState({ errors: ['You forgot the comment!'] });
            return false;
        }

        const { userId, jwt, username} = this.props;

        await axios.post(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_ADD_COMMENT,
            { userId: userId, username: username, comment: comment, section: 'Support', clientEmail: clientEmail },
            { headers: { 'Authorization': 'Bearer ' + jwt } }
        )

        this.setState({
            submitted: true
        });
    }

    isValidEmailValidation(clientEmail){

        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        return regex.test( clientEmail )
    }

    render() {

        if (!this.props.userId) {
            return <Redirect to={"/login"} />;
        }

        let errMsg;

        errMsg = this.state.errors.length > 0 && (
            <Alert variant="dark" className="error text-light">
                <ul>
                    {this.state.errors.map((error, i) => <li key={i}>{error}</li>)}
                </ul>
            </Alert>
        );


        if (this.state.submitted) {
            return (
                <div className="my-account">
                    <Navbar {...this.props} handleLogin={this.props.handleLogin} />
                    <Container>
                        <h2 className="text-monospace font-weight-bold text-left mt-3">
                            Submit Support Request
                        </h2>
                        <Card className="mb-5 mt-2 text-left">
                            <Card.Header className="card-header-account text-light">
                                Support Request
                            </Card.Header>
                            <Card.Body>
                                <div>
                                    Thank you for submitting your support request. We will get back to you within 48 hours regarding your issue and/or question.
                                </div>
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            );
        }
        else {
            return (
                <div className="support-request">
                    <Navbar {...this.props} handleLogin={this.props.handleLogin} />
                    <Container>
                        <h2 className="text-monospace font-weight-bold text-left mt-3">
                            Submit Support Request
                        </h2>
                        <Card className="mb-5 mt-2 text-left">
                            <Card.Header className="card-header-account text-light">
                                Support Request
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <p>
                                        Please take a look at our <Link to="/support/faqs" className="link">FAQs page</Link> if you have any questions.
                                    </p>
                                    <p>
                                        Use the form below to detail any issues or questions you may have. If you would like to contact us directly,
                                        please email us at apisupport@jondo.com.
                                    </p>
                                    <p>
                                        We will use this email below in reply, however, if you prefer to be contacted by a different email for this request you may enter it
                                        now.
                                    </p>
                                </div>
                                <Form onSubmit={this.handleSubmit}>
                                    <InputFormWithoutLabel
                                        placeholder="We will use in reply"
                                        type="input"
                                        handleInput={this.handleEmailClientChange}
                                        name="clientEmail"
                                        value={this.state.clientEmail}
                                        required={false}
                                    />

                                    <Form.Group controlId="formComment">
                                        <Form.Control
                                            as="textarea"
                                            rows="5"
                                            placeholder="Write a comment"
                                            onChange={this.handleChange}
                                            value={this.comment}
                                        />
                                    </Form.Group>
                                    {errMsg}
                                    <Button className='mr-3' variant="primary" type="submit">
                                        Submit
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Container>
                </div>
            );
        }
    }
}

const mapStateToProps = state => (
    {
        username: state.session.userName,
        clientEmail: state.session.email,
        userInfo: state.session,
        jwt: state.session.jwt
    }
);

export default connect(
    mapStateToProps
)(SupportRequest);
