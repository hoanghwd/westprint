import React, { Component } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import InputFormWithLabel from "../Forms/InputFormWithLabel";
import InputFormWithText from "../Forms/InputFormWithText";
import Buttons from "../Misc/Buttons";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import Alert from "react-bootstrap/Alert";
import validator from 'validator';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./MyAccount.css";

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

class MyAccountEditForm extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      phone: '',
      email: '',
      company: '',
      level:"",
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      shipUrl: '',
      password: '',
      password2: '',
      errors: [],
      passwordValidation: [],
      updated: false,
      countryList: [],
      stateList: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
  }

  async componentDidMount() {
    
    console.log('this.props.userInfo')
    console.log(this.props.userInfo)
        
    const { phone, email, company, level, street, city, zip, state, country, shipUrl } = this.props.userInfo;

    this.setState ({
      phone: phone,
      email: email,
      company: company,
      level: level,
      street: street,
      city: city,
      zip: zip,
      state: state,
      country: country,
      shipUrl: shipUrl
    });    
    
    const dataList = await axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_COUNTRY_STATE);
    if (dataList.data.error) {
        this.setState({ error: dataList.data.error.text });
    } else {
        this.setState({countryList: dataList.data.country, stateList: dataList.data.state});
    }
  }

  handleSubmit = async event => {
    event.preventDefault();

    const {phone, email, company, level, street, city, state, zip, country, shipUrl, password, password2 } = this.state;
    const { userId, userName, apiKey, userStatus, clientPortalStatuses, jwt } = this.props.userInfo;
    
    let isError = false;
    await this.setState({ errors: []});

    if (!validator.isEmail(email)) {
      await this.setState({ errors: [...this.state.errors, 'Invalid email address! Please follow this email format email@email.com'] });
      isError = true;
    } 
    
    if (company.trim() === '') {
      await this.setState({ errors: [...this.state.errors, "Invalid Company"] });
      isError = true;
    }
    
    if (!validator.isMobilePhone(phone, ['en-US'] )) {
      await this.setState({ errors: [...this.state.errors, 'Invalid phone number! Please follow this phone number format xxx-xxx-xxxx'] });
      isError = true;
    }

    if (zip !== '' && zip.trim() === '') {
      await this.setState({ errors: [...this.state.errors, "Invalid Zipcode"] });
      isError = true;
    }

    if (password !== password2) {
      await this.setState({ errors: [...this.state.errors, "The passwords do not match"] });
      isError = true;
    }

    if (this.state.passwordValidation.length > 0) {
      await this.setState({ errors: [...this.state.errors, "Password must follow the requirements above"] });
      isError = true;
    }

    if (isError) {
      return false;
    }

    const response = await axios.post(
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE,
        { userId, phone, email, password, streetAddress:street, city, state, zip, country, shipUrl, company }
    );

    if (response.data.error) {
      this.setState({ errors: [...this.state.error, response.data.error.text]});
    } else {
      this.setState({ updated: true });
      this.props.handleLogin(true, userId, userName, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus, clientPortalStatuses, jwt, company);
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value,
      ...(event.target.name === "country" ? { state: "" } : {})
    });
  };

  handlePassword = event => {
    
    if(event.target.value === ''){
      
      this.setState({
        password: '',
        password2: '',
        passwordValidation: []
      });

    }else{    
    
      this.setState({
        password: event.target.value,
        passwordValidation: schema.validate(event.target.value, { list: true })
      });

    }
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

    //console.log('this.state')
    //console.log(this.state)
    //console.log(this.state.passwordValidation)

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

    if (this.state.updated) {
      return (
        <Redirect
          to={{
            pathname: "/myaccount/info"
          }}
        />
      );
    }
    
    let setStateForm;
    if(this.state.country === "US") {
        setStateForm = <Form.Control
                    className="input"
                    as="select"
                    name="state"
                    value={this.state.state || ""}
                    onChange={this.handleChange}>
                        <option defaultValue hidden>Select State</option>
                        {this.state.stateList.map((state, index) => <option key={index}>{state}</option>)}
                    </Form.Control>;
    }
    else {
        setStateForm = <Form.Control
                    className="input"
                    as="input"
                    name="state"
                    placeholder="State / Region / Province"
                    value={this.state.state || ""}
                    onChange={this.handleChange}/>;
    }

    return (
      <Form onSubmit={this.handleSubmit}>

        <InputFormWithLabel
          placeholder="Company"
          icon="fas fa-envelope"
          label="Company"
          type="text"
          handleInput={this.handleChange}
          name="company"
          value={this.state.company}
          required={true} 
        />

        <InputFormWithLabel
          placeholder="Street"
          icon="fas fa-location-arrow"
          label="Street"
          type="text"
          handleInput={this.handleChange}
          name="street"
          value={this.state.street}
          required={false}
        />

        <InputFormWithLabel
          placeholder="City / Town"
          icon="fas fa-location-arrow"
          label="City / Town"
          type="text"
          handleInput={this.handleChange}
          name="city"
          value={this.state.city}
          required={false}
        />

        <Form.Group as={Row}>
            <Form.Label column sm={3} className="mb-3 text-right label">
                State / Region / Province
            </Form.Label>
            <Col sm={9}>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="prepend">
                        <i className="fas fa-location-arrow"/>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    {setStateForm}
                </InputGroup>
            </Col>
        </Form.Group>
        
        <InputFormWithLabel
          placeholder="Zip / Postal Code"
          icon="fas fa-location-arrow"
          label="Zip / Postal Code"
          type="text"
          handleInput={this.handleChange}
          name="zip"
          value={this.state.zip}
          required={false}
        />
        
        <Form.Group as={Row}>
            <Form.Label column sm={3} className="mb-3 text-right label">
              Country
            </Form.Label>
            <Col sm={9}>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text className="prepend">
                        <i className="fas fa-location-arrow"/>
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    
                    <Form.Control
                    className="input"
                    as="select"
                    name="country"
                    value={this.state.country || ""}
                    onChange={this.handleChange}>
                        <option defaultValue hidden>Select Country</option>
                        {this.state.countryList.map((country, index) => <option key={index} value={country.code}>{country.name}</option>)}
                    </Form.Control>
                </InputGroup>
            </Col>
        </Form.Group>

        <InputFormWithLabel
          placeholder="(xxx) xxx-xxxx"
          icon="fas fa-phone"
          label="Phone"
          type="text"
          handleInput={this.handleChange}
          name="phone"
          value={this.state.phone}  
          required={true}        
        />

        <InputFormWithLabel
          placeholder="Email"
          icon="fas fa-envelope"
          label="Email"
          type="email"
          handleInput={this.handleChange}
          name="email"
          value={this.state.email}
          required={true} 
        />

        <InputFormWithLabel
          placeholder="Status URL"
          icon="fas fa-location-arrow"
          label="Status URL"
          type="text"
          handleInput={this.handleChange}
          name="shipUrl"
          value={this.state.shipUrl}
          required={false}
        />

        <InputFormWithText
          placeholder="Password"
          label="Password"
          handleInput={this.handlePassword}
          text={passwordText}
          password={this.state.password}
          isPassword="true"
          name="password"
          value={this.state.password}
          required={false}
        />

        <InputFormWithText
          placeholder="Confirm Password"
          label="Confirm Password"
          handleInput={this.handleChange}
          text={confirmText}
          name="password2"
          required={false}
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

        <Buttons submit="Confirm" cancelPath="/myaccount/info" />
      </Form>
    );
  }
}

const mapStateToProps = state => (
  { 
    userInfo: state.session
  }
);

export default connect(
  mapStateToProps
) ( MyAccountEditForm );
