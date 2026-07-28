import React, { Component } from "react";
import Card from "react-bootstrap/Card";

class CardTitle extends Component {
  render() {

    let logSrc = (process.env.REACT_APP_WESTPRINT_API) + 'public/images/logo.png';

    return (
      <Card.Title>
        <div className="text-center">
          <Card.Img className="my-5" src={logSrc} style={{ width: "70%" }} />
        </div>
        <h3 className="text-center mb-5 title">WestPrint INTEGRATION</h3>
      </Card.Title>
    );
  }
}

export default CardTitle;
