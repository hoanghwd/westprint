import React, { Component } from "react";
import axios from "axios";
import Navbar from "../Navbar/NavBar";
import FaqCategories from "./FaqCategories";
import { Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import logoRegistration from "../../images/FAQ-Registration.png";
import logoAPI from "../../images/FAQ-API.png";
import logoOrders from "../../images/FAQ-Orders.png";
import logoStatusUpdates from "../../images/FAQ-StatusUpdates.png";
import logoProduction from "../../images/FAQ-Production.png";
import logoBilling from "../../images/FAQ-Billing.png";
import Spinner from 'react-bootstrap/Spinner'
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "./Support.css";

const getFaqData = () => {
  return axios.get(
    process.env.REACT_APP_WESTPRINT_API +
    process.env.REACT_APP_API_FAQS
  );
};

class Faqs extends Component {

  constructor(props) {
    super(props);

    this.state = {
        faqs: [],
        loading: true
        };
      
        this.handleChange = this.handleChange.bind(this);
    }
  
    async handleChange(event) {
        let search = event.target.value.toLowerCase();
        let response = [];
        
        if(search !== "") {
            response = await axios.get(
                process.env.REACT_APP_WESTPRINT_API +
                process.env.REACT_APP_API_FAQS + `?search=${search}`
            );
        }
        else {
            response = await getFaqData();
        }
        
        if(response.data.faqs) {
            await this.setState({
                faqs: response.data.faqs,
                loading: false
            });
        }
    }

  async componentDidMount() {
    const response = await getFaqData();

    if (response.data.faqs) {
      await this.setState({
        faqs: response.data.faqs,
        loading: false
      });
    }

  }

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    if (this.state.loading) {
      return (
        <div className="my-account">
          <Navbar {...this.props} handleLogin={this.props.handleLogin} />
          <Container>
            <Row>
              <Col md={12} className="mx-auto">
                <h2 className="font-weight-bold text-left mt-3">
                  Faqs
              </h2>
                <Card className="text-left">
                  <Card.Header className="card-header-account text-light">
                    Topic
                </Card.Header>
                  <Card.Body>
                    <Container>
                      <Row>
                        <Spinner animation="border" />
                      </Row>
                    </Container>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )
    }

    const faqs = this.state.faqs;

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="font-weight-bold text-left mt-3">
                FAQs
              </h2>
              <Card className="text-left mb-5">
                <Card.Header className="card-header-account text-light">
                  Topic
                </Card.Header>
                <Card.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1" className="prepend">
                        <i className="fas fa-search" />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      className="input"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="basic-addon1"
                      onChange={this.handleChange}
                    />
                </InputGroup>
                <div style={{paddingBottom: "20px"}}></div>
                    
                <Container>
                    {typeof faqs.registration !== "undefined" ? (
                        <FaqCategories faqs={faqs.registration} logo={logoRegistration} title="REGISTRATION" />
                    ):('')
                    }
                    
                    {typeof faqs.api !== "undefined" ? (
                        <FaqCategories faqs={faqs.api} logo={logoAPI} title="API" />
                    ):('')
                    }
                    
                    {typeof faqs.order !== "undefined" ? (
                        <FaqCategories faqs={faqs.order} logo={logoOrders} title="ORDERS" />
                    ):('')
                    }
                    
                    {typeof faqs.status !== "undefined" ? (
                        <FaqCategories faqs={faqs.status} logo={logoStatusUpdates} title="STATUS UPDATE" />
                    ):('')
                    }

                    {typeof faqs.production !== "undefined" ? (
                      <FaqCategories faqs={faqs.production} logo={logoProduction} title="PRODUCTION" />
                    ):('')
                    }
                    
                    {typeof faqs.billing !== "undefined" ? (
                    <FaqCategories faqs={faqs.billing} logo={logoBilling} title="BILLING" />
                    ):('')
                    }
                </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Faqs;
