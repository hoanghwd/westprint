import React, { Component } from "react";
import Navbar from "../Navbar/NavBar";
import OrdersTable from "./OrdersTable";
import { Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class RecentOrders extends Component {

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    return (
      <div className="my-account">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="text-monospace font-weight-bold text-left mt-3">
                Recent Orders
              </h2>
              <Card className="text-left">
                <Card.Header className="card-header-account text-light">
                  Results
                </Card.Header>
                <Card.Body>
                  <OrdersTable type="recent" {...this.props} />
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
