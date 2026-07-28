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
import Links from "./Links";

function getCookie(name) {
    var cookie = "; " + document.cookie;
    var parts = cookie.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Set a Cookie
function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

const getSettings = async () => {
    return axios.get(process.env.REACT_APP_WESTPRINT_API +
        process.env.REACT_APP_GET_SETTINGS);
};

const submit = async (self, token) => {
    const userName = self.state.userName;
    const password = self.state.password;
    const rememberMe = self.state.rememberMe;
    const recaptchaFlag = self.state.recaptchaFlag;
    self.state.recaptchaToken = token;
    const recaptchaToken = self.state.recaptchaToken;
    const response = await axios.post(
        process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_LOGIN,
        {userName, password, rememberMe, recaptchaToken}
    );

    if (response.data.error) {
        self.setState({error: response.data.error.text});

        self.state.recaptchaToken = "";
        if (recaptchaFlag === true) {
            window.grecaptcha.reset();
        }
    }
    else {
        if (self.state.rememberMe) {
            let d = new Date();
            d.setTime(d.getTime() + parseInt(response.data.JWTExpires) * 1000);
            const expires = "expires=" + d.toUTCString();
            const rememberMe = "rememberMe=" + self.state.rememberMe;
            const jwt = "jwt=" + response.data.jwt;
            document.cookie = rememberMe + ";" + expires + ";" + jwt + ";" + expires + ";";
        }

        if (recaptchaFlag === true) {
            const recaptchaBadge = document.getElementsByClassName('grecaptcha-badge')[0];
            recaptchaBadge.style.visibility = 'hidden';
        }

        const {
            id, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, locations, order, request, status,
            clientStatuses, company, orderOrigin
        } = response.data;

        self.props.handleLogin(
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
            company,
            false,
            orderOrigin
        );

        const options = {locations, order, request, status, clientStatuses};

        self.props.setOptions(options);
        localStorage.setItem('options', JSON.stringify(options));
        setCookie('adminName', userName, 30);

        if (level !== 'basic') {
            localStorage.setItem('optionsAs', JSON.stringify(options));
        }

        await axios.post(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_TEST_PLAN,
            {userName}
        );
    }
}

class Login extends Component {
    constructor(props) {
        super(props);

        this.form = React.createRef();

        this.state = {
            userName: "",
            password: "",
            rememberMe: false,
            error: "",
            recaptchaToken: "",
            recaptchaFlag: ""
        };

        this.handleValidate = this.handleValidate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    async componentDidMount() {

        const settings = await getSettings();

        await this.setState({
            recaptchaFlag: settings.data.recaptcha
        });

        if (this.state.recaptchaFlag === true) {
            var loadScript = function (src, async) {
                var tag = document.createElement('script');
                tag.async = async;
                tag.src = src;
                var body = document.getElementsByTagName('body')[0];
                body.appendChild(tag);
            }

            loadScript('https://www.google.com/recaptcha/api.js?render=' + process.env.REACT_APP_CAPTCHA_SITE_KEY, false);

            const recaptchaBadge = document.getElementsByClassName('grecaptcha-badge');

            if (recaptchaBadge.length > 0) {
                recaptchaBadge[0].style.visibility = 'visible';
            }
        }

        const rememberMe = getCookie('rememberMe');
        const jwt = getCookie('jwt');

        if (rememberMe) {
            const response = await axios.post(
                process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_LOGIN,
                {}, {headers: {'Authorization': 'Bearer ' + jwt}}
            );

            if (!response.data.error) {
                const {
                    id, username, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, locations, order, request,
                    status, clientStatuses, company, orderOrigin
                } = response.data;

                this.props.handleLogin(
                    true,
                    id,
                    username,
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
                    company,
                    false,
                    orderOrigin
                );

                const options = {locations, order, request, status, clientStatuses};

                this.props.setOptions(options);
                localStorage.setItem('options', JSON.stringify(options));
            }
        }
    }

    handleSubmit = async event => {

        event.preventDefault();

        const self = this;

        if (this.state.recaptchaFlag === true) {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(process.env.REACT_APP_CAPTCHA_SITE_KEY, {action: 'api_login'}).then(token => {
                    submit(self, token);
                });
            });
        }
        else {
            submit(self, "");
        }
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleCheck = event => {
        this.setState({
            rememberMe: event.target.checked
        })
    };

    handleValidate() {
        const valid = this.form.current.reportValidity();

        if (!valid) {
            this.setState({recaptchaToken: ""});
            window.grecaptcha.reset();
        }
    }

    render() {
        if (this.props.userId) {
            if (this.props.level !== 'basic') {
                return (
                    <Redirect
                        to={{
                            pathname: "/admin/list"
                        }}
                    />
                );
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: "/myaccount/info"
                        }}
                    />
                );
            }
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
                                    <Form onSubmit={this.handleSubmit} ref={this.form}>
                                        <InputFormWithoutLabel
                                            placeholder="Username"
                                            inputName="Username"
                                            type="text"
                                            icon="fas fa-user"
                                            handleInput={this.handleChange}
                                            name="userName"
                                            value={this.state.userName}
                                        />

                                        <InputFormWithoutLabel
                                            placeholder="Password"
                                            inputName="Password"
                                            type="password"
                                            icon="fas fa-lock"
                                            handleInput={this.handleChange}
                                            name="password"
                                            value={this.state.password}
                                        />

                                        {errMsg}

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="btn-lg btn-block my-4"
                                            onClick={this.handleValidate}
                                        >
                                            Sign In
                                        </Button>
                                    </Form>
                                    <Links/>
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
