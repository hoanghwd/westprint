import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/ProgressBar";
import Accordion from 'react-bootstrap/Accordion'
import Button from "react-bootstrap/Button"
import {Link} from "react-router-dom";

import Navbar from "../Navbar/NavBar";
import "./MyAccount.css";
import NavDropdown from "react-bootstrap/NavDropdown";
import {forEach} from "react-bootstrap/ElementChildren";

class MyAccountInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 10,
            nextStep: "8: Order XML elements structure & error codes",
            sign: 'fas fa-minus',
            showOn: false
        };

        // this.handleLogin = this.handleLogin.bind(this);
        this.toggleSign = this.toggleSign.bind(this);
    }

    // handleLogin(isLoged){
    //   this.props.handleLogin(isLoged);
    // }


    toggleSign() {
        if (this.state.sign === "fas fa-minus") {
            this.setState({sign: "fas fa-plus"});
        } else {
            this.setState({sign: "fas fa-minus"})
        }
    }

    toggleEye() {
        this.setState((prevState, props) => {
            return {showOn: !prevState.showOn}
        })
    }

    render() {
        console.log(this.props, JSON.stringify(this.props));

        if (!this.props.userId) {
            return <Redirect to={"/login"}/>;
        }

        const {curStage, progress} = this.props;
        let {curPage} = this.props;

        if (curPage !== null) {
            let strs = curPage.split("_");
            curPage = strs[0];
        }

        let nextStep = 'Welcome to the Jondo Initiate API Process';
        let stageName = '';

        if (curStage === "create") {
            stageName = "Order Placement";
        } else if (curStage === "cancel") {
            stageName = "Cancel Order";
        } else if (curStage === "redo") {
            stageName = "Redo Order";
        } else if (curStage === "status") {
            stageName = "Status Update";
        }

        if (curPage === "xml" || curPage === "sample" || curPage === "errors" || curPage === "token") {
            nextStep = `Introduction to ${stageName}`;
        } else if (curPage === "testPlan" || curPage === "testPlanStatus") {
            nextStep = `Test Plan for ${stageName}`;
        } else if (curPage === "review") {
            nextStep = `Review/verify results for ${stageName}`;
        }

        let message = '';
        let progressBar = '';
        let percentComplete = '';
        let userStatus = this.props.userStatus;
        let myAccountTop = '';

        /**
         * Toggle API Key
         * https://app.clickup.com/t/31ery92
         */
        const toggleEye = {
            marginLeft: "10px",
            color: "#555555"
        };
        const dot = {
            verticalAlign: "middle",
            fontSize: "8px"
        }
        const showEye = 'fas fa-eye';
        const hideEye = 'fas fa-eye-slash';
        let toggledContent;
        let toggledTittle;
        let toggledIcon;
        let start = 0;
        let countCharacters = this.props.apiKey.length;
        let dots = [];

        while (start < countCharacters) {
            dots[start] = <i className={"fas fa-circle"} style={dot}></i>;
            start++;
        }

        if (this.state.showOn) {
            toggledContent = this.props.apiKey;
            toggledTittle = 'Hide API Key';
            toggledIcon = hideEye;
        } else {
            {toggledContent = dots;}
            toggledTittle = 'Show API Key';
            toggledIcon = showEye;
        }

        if (this.props.progress === 100 || this.props.userStatus == "ENABLED") {
            message =
                <div><b>Congratulations, you've completed the Direct API Integration and your account is LIVE!</b></div>
            progressBar = <ProgressBar
                className="mb-0"
                now={100}
                label={`100%`}
                srOnly/>
            percentComplete = <p className="text-center mt-0"> 100% Completed</p>
        }
        else {
            message = (<div>
                <b>Current Step:</b> <Link className="link" to="/api/steps">{nextStep}</Link>
            </div>)
            progressBar = <ProgressBar
                className="mb-0"
                now={progress}
                label={`${progress}%`}
                srOnly/>
            percentComplete = <p className="text-center mt-0"> {this.props.progress}% Completed </p>
        }

        /**
         * Huynh - 09/14/2021
         * https://app.clickup.com/t/1gu4174
         */
        myAccountTop = (userStatus.toUpperCase() !== 'PORTAL_ACCESS_APPROVED') ?
            (
                <Card className="mb-5 mt-2 text-left">
                    <Card.Header className="card-header-account text-light">
                        Integration Status
                    </Card.Header>
                    <Card.Body>
                        {progressBar}
                        {percentComplete}
                        {message}
                    </Card.Body>
                </Card>
            ) : '';

        return (
            <div className="my-account">
                <Navbar {...this.props} handleLogin={this.props.handleLogin}/>
                <Container>
                    <h2 className="text-monospace font-weight-bold text-left mt-3">
                        My Account
                    </h2>

                    {
                        /*
                        <Accordion defaultActiveKey="0">
                          <Card>
                            <Card.Header className="card-header-account text-light p-1">
                              <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={this.toggleSign}  className="text-dark">
                                <i className={this.state.sign}/>
                              </Accordion.Toggle>
                              Welcome
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                              <Card.Body>
                              <p>Thank you for your partnership with Jondo!</p>

                              <p>In this portal we have five sections:</p>

                              <ul>
                                <li><strong>CATALOG</strong> - Check the products offered. </li>
                                <li><strong>ORDERS</strong> - Check the status of your orders. </li>
                                <li><strong>API</strong> - Step by Step Process will guide and provide you with everything needed to complete the API integration. Moreover, you can view the order and status update requests & responses too.</li>
                                <li><strong>DOCUMENTATION</strong> - The documentation of JONDO API and the API sample tool to check how our API works.</li>
                                <li><strong>SUPPORT</strong> - Have a look at the FAQs and if you still have any questions, reach out to us by submitting a support request.</li>

                              </ul>


                              </Card.Body>
                            </Accordion.Collapse>
                          </Card>
                        </Accordion>
                        <br></br>
                        <br></br>
                        */
                    }

                    {myAccountTop}

                    <Card className="my-5 text-left">
                        <Card.Header className="card-header-account text-light">
                            Account Information
                        </Card.Header>
                        <Card.Body>
                            <ul id="user-info">
                                <li><b>Company Name:</b> {this.props.company}</li>
                                <li><b>User Name:</b> {this.props.userName}</li>
                                <li><b>User ID:</b> {this.props.userId}</li>
                                <li><b>API Key:</b> {toggledContent}<i className={toggledIcon} style={toggleEye} title={toggledTittle} onClick={() => this.toggleEye()}></i></li>
                                <li><b>Phone:</b> {this.props.phone}</li>
                                <li><b>Email:</b> {this.props.email}</li>
                            </ul>
                            <Link to="/myaccount/edit" className="link">
                                Edit Info/Password
                            </Link>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        progress: state.handler.progress,
        curStage: state.handler.curStage,
        curPage: state.handler.curPage,
    }
);

export default connect(
    mapStateToProps
)(MyAccountInfo);
