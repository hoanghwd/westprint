import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Navbar from "../Navbar/NavBar";
import OrdersTable from "./OrdersTable";
import SearchForm from "./SearchForm";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class SearchOrders extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();

  }
  // constructor(props) {
  //   super(props);
  //   /*
  //   this.state = {
  //     searchOptions : { 
  //       dateFrom:'', 
  //       dateTo:'', 
  //       orderId:'',
  //       trackingNumber:'', 
  //       status:'',  
  //       locId:'',
  //       page:0, 
  //       limit:10, 
  //       orderBy:'id', 
  //       descAsc:'desc'
  //     },
  //     loadNewData: false,
  //     error: ""      
  //   };
  //   */

  //   this.handleOrdersReqeust = this.handleOrdersReqeust.bind(this);
  //   this.handleLoaNewData = this.handleLoaNewData.bind(this);

  // }

  // handleOrdersReqeust = (searchOptions) => {
  //   //this.setState({ searchOptions, loadNewData : true });
  //   this.props.onUpdateSearchOrdersOptions(searchOptions);
  //   this.props.onToggleLoadOrdersFlag();
  // };

  // handleLoaNewData = () => {
  //   //this.setState({ loadNewData : false }); 
  //   this.props.onToggleLoadOrdersFlag();
  // }


  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }

    return (

      <div className="SearchOrders" ref={this.myRef}>
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="text-monospace font-weight-bold text-left mt-3">
                  Search Orders
              </h2>
           
                  {/* <SearchForm {...this.props} handleOrdersReqeust={this.handleOrdersReqeust} /> */}
                  <SearchForm />
               
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
                  <OrdersTable {...this.props} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

    );

  }

}

export default SearchOrders;
// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// ) ( SearchOrders );
