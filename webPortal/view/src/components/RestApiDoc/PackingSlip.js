import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Navbar from "../Navbar/NavBar";
import "../MyAccount/MyAccount.css";

//import frontPackingSlip from "../../images/frontPackingSlip.jpg";
//import backPackingSlip from "../../images/backPackingSlip.jpg";

class PackingSlip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 10,
      nextStep: "8: Order XML elements structure & error codes",
      sign : 'fas fa-minus'
    };

    // this.handleLogin = this.handleLogin.bind(this);
    this.toggleSign = this.toggleSign.bind(this);
  }

 

  toggleSign() {
    if(this.state.sign === "fas fa-minus") {
      this.setState({ sign: "fas fa-plus" });      
    } else {
      this.setState({ sign: "fas fa-minus"})
    }
  }

  render() {

      var headerTitles = {
          fontWeight: 300,
          borderRadius: 0,
          textTransform: "uppercase",
          cursor: "default",
          padding: "10px 20px",
          marginBottom: "15px",
          display: "inline-block",
          textAlign: "center",
          verticalAlign: "middle",
          fontSize: "1rem",
          lineHeight: 1.5,
          color: "#fff",
          backgroundColor: "#2E59A0",
          border: "none"
      };
    
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }
   
    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <h2 className="text-monospace font-weight-bold text-left mt-3">
            Premium Branding Guidelines
          </h2>   

        <Card className="my-3 text-left">
            {/*
            <Card.Header className="card-header-account text-light">
               
            </Card.Header>
            */}
            
            <Card.Body>              
            <h5 style={headerTitles}><b>Introduction</b></h5>
            <p>
                Our Premium Branding package allows for packing slips, card inserts, and stickers
                in full color. Below are the specifications for each asset of the Premium Branding
                package. Be advised images submitted should adhere to the image specifications
                provided for optimum results. PSD templates have been provided to help you set up
                your files. Be sure to delete layers labeled [Delete This Layer] before saving your
                JPEGs.
            </p>
            
            <h5 style={headerTitles}><b>Packing Slip</b></h5>
            <p>
                The Packing Slip is a two sided, full color document that supports two images.
                The images should be JPEGs with the following specifications: 8”x10.5” @ 300 DPI
                (2400px x 3100px). Refer to the PSD templates. Notice the front template has a
                portion of the image reserved for the order details. That area should be blank/white
                in your final JPEG file otherwise it may be “double-printed”. Packing slips are
                printed in a portrait orientation. All packing slips will have a 0.25” white border
                outside your image.
            </p>

            <h5 style={headerTitles}><b>Card Insert</b></h5>
            <p>
                The Card Insert is a two sided, full color document that supports two images. The
                images should be JPEGs with the following specifications: 5”x8” @ 300 DPI
                (1500px x 2400px). Files can be submitted in both portrait and landscape orientations.
                All Card Inserts will have a 0.25” white border outside your image.
            </p>
            
            <h5 style={headerTitles}><b>Sticker</b></h5>
            <p>
                The Sticker is a one sided, adhesive backed, full color document that requires one
                image. The image should be a JPEG with the following specifications: 4.25”x6.25” @ 300
                DPI (1275px x 1875px). This file can be submitted in both portrait and landscape
                orientations. Notice the ruler guides that indicate the portion of the provided image
                that will be used to produce a full bleed. Critical design components should not be
                placed in this area as they may not show up on the sticker adhered to the outside of
                the package.
            </p>

            <h5 style={headerTitles}><b>Logo</b></h5>
            <p>
                A Logo is displayed on the back of a print either through direct printing or through a
                sticker that is adhered. A single image is required and should be a JPEG with the
                following specifications: 0.67”x3.33” @ 300 DPI (200px x 1000px). The logo is printed in
                a landscape orientation.
            </p>
            </Card.Body>
        </Card> 

        
              

        </Container>
      </div>
    );
  }
}


export default PackingSlip;
