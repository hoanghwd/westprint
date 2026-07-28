import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../Navbar/NavBar";
import ClientsTable from "./ClientsTable";
import SearchForm from "./SearchForm";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Admin.css";

class SearchClients extends Component {

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
                  Customer View
              </h2>
              <Card className="text-left">
                <Card.Header className="card-header-account text-light">
                  Search
                </Card.Header>
                <Card.Body>
                  {/* <SearchForm {...this.props} handleOrdersReqeust={this.handleOrdersReqeust} /> */}
                  <SearchForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mx-auto">
              <Card className="my-5 text-left">
                <Card.Header className="card-header-account text-light">
                  Results
                </Card.Header>
                <Card.Body>
                  {/*<OrdersTable {...this.props} {...this.state} handleLoaNewData = {this.handleLoaNewData} />*/}
                  {/* <OrdersTable userName={this.props.userName} {...this.props.searchOrdersStatus} handleLoaNewData={this.handleLoaNewData} /> */}
                  <ClientsTable handleLogin={this.props.handleLogin} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    );

  }

}

export default SearchClients;
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// ) ( SearchOrders );
