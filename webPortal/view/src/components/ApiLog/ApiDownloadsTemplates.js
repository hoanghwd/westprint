import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

import logoOrders from "../../images/Icon-Downloads2x.png";
import Navbar from "../Navbar/NavBar";

import "../Support/Support.css";

class ApiDonwloads extends Component {
  
  render() {
    
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        
        <Container>
          <h2 className="text-monospace font-weight-bold text-left mt-3">
          Premium Branding Templates
          </h2>

          <Card className="my-2 text-left">
            <Card.Header className="card-header-account text-light">
             Download Templates
            </Card.Header>
            <Card.Body>

              <img className="my-2 sm-img  mr-2" src={logoOrders} alt="logo" />
              <h3 className="inline-text"><b>CHOOSE FROM THE TEMPLATES TO DOWNLOAD</b></h3>
              
              <ul className="my-2 code-list" id="user-info">
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=packing-slip-front`} >Packing Slip Front</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=packing-slip-back`} >Packing Slip Back</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=card-insert-portrait`} >Card Insert Portrait</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=card-insert-landscape`} >Card Insert Landscape</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=sticker-portrait`} >Sticker Portrait</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=sticker-landscape`} >Sticker Landscape</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=logo`} >Custom Logo</a></li>
                <li><a href = {`${process.env.REACT_APP_WESTPRINT_API+process.env.REACT_APP_GET_SAMPLETEMPLATE}?type=premium-branding`} >Premium Branding Specs</a></li>
              </ul>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }
}
export default ApiDonwloads