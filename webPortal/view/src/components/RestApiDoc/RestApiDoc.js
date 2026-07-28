import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Navbar from "../Navbar/NavBar";
import Document from "./Document";
import Navigation from "./Navigation";
import { Redirect } from "react-router-dom";

import "./RestApiDoc.css";

const list = [
  { name: "Introduction", id: "intro" },
  { name: "Create Orders", id: "create" },
  { name: "Error Codes", id: "error" },
  { name: "Support", id: "sup" }
];

class RecentOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "intro",
      list: list
    };

    this.handleChange = this.handleChange.bind(this);
    this.addActiveClass = this.addActiveClass.bind(this);
  }

  addActiveClass(event) {
    this.setState({
      active: event.target.id
    });
  }

  handleChange(event) {
    let term = event.target.value.toLowerCase();
    if (term !== "") {
      this.setState({
        list: list.filter(item => item["name"].toLowerCase().includes(term))
      });
    } else {
      this.setState({
        list: list
      });
    }
  }

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    var activeDoc = document.querySelectorAll(".linkDoc");

    [].forEach.call(activeDoc, function(el) {
      el.classList.remove("activeDoc");
    });
    [].forEach.call(activeDoc, function(el) {
      el.classList.add("tabDoc");
    });

    let doc = <Document id="intro" />;
    var tab = "introduction";
    if (this.props.match) {
      tab = this.props.match.params.tab;
      doc = <Document id={tab} />
    }

    var tabs = document.getElementsByClassName("linkDoc");
    var aElements = Array.prototype.filter.call(tabs, function(aElement){
      return aElement.nodeName === 'A';
    });

    var pLink = null;
    var nLink = null;

    if (!Array.isArray(aElements) || !aElements.length) {
        nLink = "#/docs/api/servicesOffered";
    }


    for (var i = 0; i < aElements.length; i++) {
      var id = aElements[i].getAttribute("id");

      if (tab === id) {
        var cIndex = i;
        var pIndex = cIndex - 1;
        var nIndex = cIndex + 1;

        if (!aElements[i].classList.contains("activeDoc")) {
          aElements[i].className += " activeDoc";
        }
        if (aElements[i].classList.contains("tabDoc")) {
          aElements[i].className = aElements[i].className.replace(/\btabDoc\b/g, "");
        }

        if (pIndex >= 0) {
          pLink = aElements[pIndex].getAttribute("href");
          if (aElements[pIndex].classList.contains("activeDoc")) {
            aElements[pIndex].className = aElements[pIndex].className.replace(/\bactiveDoc\b/g, "");
          }
          if (!aElements[pIndex].classList.contains("tabDoc")) {
            aElements[pIndex].className += " tabDoc";
          }
        }
        if (nIndex < aElements.length) {
          nLink = aElements[nIndex].getAttribute("href");
          if (aElements[nIndex].classList.contains("activeDoc")) {
            aElements[nIndex].className = aElements[nIndex].className.replace(/\bactiveDoc\b/g, "");
          }
          if (!aElements[nIndex].classList.contains("tabDoc")) {
            aElements[nIndex].className += " tabDoc";
          }
        }
      }
    }

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="text-monospace font-weight-bold text-left mt-3">
                  Jondo API Documentation
              </h2> 
              <Card className="text-left">
                <Card.Header className="card-header-account text-light">
                  Documentation
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Navigation />
                    <Col sm={9}>
                      {doc}
                      <Col sm={12} style={{padding: 0, marginTop: 20, display: 'flex', justifyContent: 'space-between'}}><Button href={pLink} disabled={pLink === null ? "disabled" : ""} variant={pLink === null ? "outline-light" : "primary"} style={{fontSize: 13, color: '#ffffff'}}>❮ Previous</Button>{' '}<Button disabled={nLink === null ? "disabled" : ""} href={nLink} variant={nLink === null ? "outline-light" : "primary"} style={{fontSize: 13, color: '#ffffff'}}>Next ❯</Button>{' '}</Col>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RecentOrders;
