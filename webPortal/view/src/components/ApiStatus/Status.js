import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "../Navbar/NavBar";
import StatusBox from "./StatusBox";

import "./Status.css";

class Status extends Component {
  constructor(props) {
    super(props);

    this.state = {
        currentState: 'A'
      };

     this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event){
    this.setState({ currentState: event.target.value });
  }

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container className = "status-circles">
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-blue" value = "A" onClick = {this.handleClick}>A</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-blue" value = "B" onClick = {this.handleClick}>B</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-blue" value = "C" onClick = {this.handleClick}>C</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-blue" value = "D" onClick = {this.handleClick}>D</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-blue" value = "E" onClick = {this.handleClick}>E</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-gray" value = "F" onClick = {this.handleClick}>F</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-gray" value = "G" onClick = {this.handleClick}>G</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-gray" value = "H" onClick = {this.handleClick}>H</button>
            <button type="button" className="btn btn-primary btn-circle btn-xl circle-color-gray" value = "I" onClick = {this.handleClick}>I</button>
        </Container>
        <Container>
          <h2 className="text-monospace font-weight-bold text-left mt-3">
            Api Process Status
          </h2>
          <StatusBox {...this.state}></StatusBox>
        </Container>
      </div>
    );
  }
}

export default Status;
