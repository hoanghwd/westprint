import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {doSetOptions} from '../../actions'
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import CardTitle from "../Misc/CardTitle";
import InputFormWithoutLabel from "../Forms/InputFormWithoutLabel";


function getCookie(name) {
    var cookie = "; " + document.cookie;
    var parts = cookie.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hdAdmin: "",
            password: "",
            userName: "",
            rememberMe: false,
            error: "",
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }


    handleSubmit = async event => {
        event.preventDefault();

        const hdAdmin = this.state.hdAdmin;
        const password = this.state.password;
        const userName = this.state.userName;

        const response = await axios.post(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_LOGIN_AS,
            {userName: hdAdmin, password, loginAs: userName}
        );

        if (response.data.error) {
            this.setState({error: response.data.error.text});
        }
        else {
            if (this.state.rememberMe) {
                let d = new Date();
                d.setTime(d.getTime() + parseInt(response.data.JWTExpires) * 1000);
                const expires = "expires=" + d.toUTCString();
                const rememberMe = "rememberMe=" + this.state.rememberMe;
                const jwt = "jwt=" + response.data.jwt;
                document.cookie = rememberMe + ";" + expires + ";" + jwt + ";" + expires + ";";
            }

            const {
                id, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, locations, order, request, status,
                clientStatuses, company
            } = response.data;

            this.props.handleLogin(
                true,
                id,
                userName,
                apiKey,
                phone,
                email,
                street,
                city,
                zip,
                state,
                country,
                shipUrl,
                level,
                userStatus,
                clientPortalStatuses,
                jwt,
                company
            );

            const options = {locations, order, request, status, clientStatuses};

            this.props.setOptions(options);
            localStorage.setItem('options', JSON.stringify(options));

            //const responseTestPlan =
            await axios.post(
                process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_TEST_PLAN,
                {userName}
            );
        }
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleCheck = event => {
        this.setState({
            rememberMe: event.target.checked
        })
    }

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

        let errMsg;
        errMsg = this.state.error && (
            <Alert variant="dark" className="error text-light">
                {this.state.error}
            </Alert>
        );

        return (
            <div className="Signin">
                <Container>
                    <Row>
                        <Col md={4} className="mx-auto my-5 py-5">
                            <Card>
                                <Card.Body>
                                    <CardTitle/>
                                    <Form onSubmit={this.handleSubmit}>
                                        <InputFormWithoutLabel
                                            placeholder="HD user"
                                            inputName="Username"
                                            type="text"
                                            icon="fas fa-user"
                                            handleInput={this.handleChange}
                                            name="hdAdmin"
                                            value={this.state.hdAdmin}
                                        />

                                        <InputFormWithoutLabel
                                            placeholder="HD password"
                                            inputName="Password"
                                            type="password"
                                            icon="fas fa-lock"
                                            handleInput={this.handleChange}
                                            name="password"
                                            value={this.state.password}
                                        />

                                        <InputFormWithoutLabel
                                            placeholder="Login as client"
                                            inputName="LoginAs"
                                            type="text"
                                            icon="fas fa-user"
                                            handleInput={this.handleChange}
                                            name="userName"
                                            value={this.state.userName}
                                        />

                                        {errMsg}

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="btn-lg btn-block my-4"
                                        >
                                            Sign As
                                        </Button>
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


const mapDispatchToProps = dispatch => ({
    setOptions: options => dispatch(doSetOptions(options))
});

//export default App;
export default connect(
    undefined,
    mapDispatchToProps
)(Login);

