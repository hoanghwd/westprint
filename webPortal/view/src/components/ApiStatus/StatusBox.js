import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

import "./Status.css";

const STATUS_TEXTS = {  
    A:
        {
            title:  "A: Transmission Type",
            header: "WELCOM! LET'S GET STARTED",
            text:   <div>
                        <p>Some text a1</p>
                        <p>Some text a2</p>
                        <p>
                            <Link className="link" to="/#nextStep">Link</Link>
                        </p>
                    </div>
        },
    B:
        {
            title:  "B: Orders XML Elements",
            header: "GREAT!",
            text:   <div>
                        <p>Some text b1</p>
                            <p>Some text b2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    C:
        {
            title:  "C: Transmission Type",
            header: "GREAT! C",
            text:   <div>
                        <p>Some text c1</p>
                            <p>Some text c2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    D:
        {
            title:  "D: Transmission Type",
            header: "GREAT! D",
            text:   <div>
                        <p>Some text d1</p>
                            <p>Some text d2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    E:
        {
            title:  "E: Transmission Type",
            header: "GREAT! E",
            text:   <div>
                        <p>Some text e1</p>
                            <p>Some text e2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    F:
        {
            title:  "F: Transmission Type",
            header: "GREAT! F",
            text:   <div>
                        <p>Some text f1</p>
                            <p>Some text f2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    G:
        {
            title:  "G: Transmission Type",
            header: "GREAT! G",
            text:   <div>
                        <p>Some text g1</p>
                            <p>Some text g2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    H:
        {
            title:  "H: Transmission Type",
            header: "GREAT! H",
            text:   <div>
                        <p>Some text h1</p>
                            <p>Some text h2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        },
    I:
        {
            title:  "I: Transmission Type",
            header: "GREAT! I",
            text:   <div>
                        <p>Some text i1</p>
                            <p>Some text i2</p>
                            <p>
                                <Link className="link" to="/#nextStep">Link</Link>
                            </p>
                    </div>
        }

};


class StatusBox extends Component {
  
  render() {
    
    const {currentState} = this.props;

    return (
        <Card className="mb-5 mt-2 text-left">
        <Card.Header className="card-header-account text-light">
            {STATUS_TEXTS[currentState].title}
        </Card.Header>
        <Card.Body>
            <Card.Title>{STATUS_TEXTS[currentState].header}</Card.Title>
            {STATUS_TEXTS[currentState].text}
        </Card.Body>
        </Card>
  
    );

  }

}

export default StatusBox;