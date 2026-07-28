import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux';
import Navbar from "../Navbar/NavBar";
import LogTable from "./LogTable";
import SearchForm from "./SearchForm";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


class ApiRequestLog extends Component {

  // constructor(props) {
  //   super(props);

    // this.state = {
    //   searchOptions : { 
    //     dateFrom:'', 
    //     dateTo:'', 
    //     poNumber:'',
    //     status:'',  
    //     page:0, 
    //     limit:10, 
    //     orderBy:'logId', 
    //     descAsc:'desc',
    //   },
    //   isStatusUpdate: false,
    //   loadNewData: false,
    //   error: ""      
    // };

    // this.handleOrdersReqeust = this.handleOrdersReqeust.bind(this);
    // this.handleLoaNewData = this.handleLoaNewData.bind(this);
    
  // }

  // handleOrdersReqeust =  (searchOptions) => {
  //   // this.setState({ searchOptions, loadNewData : true });
  //   this.props.onUpdateSearchOrdersOptions(searchOptions);
  //   this.props.onToggleLoadOrdersFlag();
  // };

  // handleLoaNewData = () => { 
  //   // this.setState({ loadNewData : false })
  //   this.props.onToggleLoadOrdersFlag();
  // }

  render() {    
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }
    
    return (
      <div className = "my-account">
        <Navbar {...this.props} handleLogin = {this.props.handleLogin} />
        <Container>
        <Row>
            <Col md={12} className="mx-auto">
              <h2 className="text-monospace font-weight-bold text-left mt-3">
                  API Request Log
              </h2> 
              <Card className = "text-left">
                <Card.Header className="card-header-account text-light">
                  Search
                </Card.Header>
                <Card.Body>
                  <SearchForm status={this.props.status} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md = {12} className="mx-auto">
              <Card className = "my-5 text-left">
                <Card.Header className="card-header-account text-light">
                  Results
                </Card.Header>
                <Card.Body>
                  <LogTable {...this.props} appType="request" />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    
    );
  
  }

}

const mapStateToProps = state => (
  { 
    status: state.options.request,
  }
);

export default connect(
  mapStateToProps
) ( ApiRequestLog );


