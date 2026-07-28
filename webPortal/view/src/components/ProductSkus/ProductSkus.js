import React, { Component } from "react";
import axios from "axios";
import Navbar from "../Navbar/NavBar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Redirect } from "react-router-dom";
import SearchForm from "./SearchForm";
import SkuTable from "./SkuTable";

const LIMIT = 30;

class ProductSku extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      description: '',
      category: '',
      subcategory: '',
      substrate: '',
      page: 0,
      total: 0,
      skus: [],
      csv: [],
      isReady: false,
      mapProductUsingSKU : '',
      placeHolderId : ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  async updateTable() {
    const { userName, jwt } = this.props;
    const { id, description, category, subcategory, substrate, page } = this.state;

    const searchParams = `?userName=${userName}&id=${id}&description=${description}&category=${category}&subcategory=${subcategory}&substrate=${substrate}&page=${page}&limit=${LIMIT}`;

    const response = await axios.get(
      process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_SKUS + searchParams,
      { headers: { 'Authorization': 'Bearer ' + jwt } }
    );

    if (response.data.error) {
      this.setState({ 
        error: response.data.error.text,
        skus: [],
        total: 0,
        isReady: true,
       });
    }
    else {
      this.setState({
        skus: response.data.skus,
        total: response.data.total,
        isReady: true,
        mapProductUsingSKU : response.data.mapProductUsingSKU,
        placeHolderId : response.data.placeHolderId
      });
    }
  }

  async getCsvData() {
    const { userName, jwt } = this.props;
    const {  id, description, category, subcategory, substrate, page } = this.state;

    //const searchParams = `?userName=${userName}&csv=1`;
    const searchParams = `?userName=${userName}&id=${id}&csv=1`;
    
    const response = await axios.get(
      process.env.REACT_APP_WESTPRINT_API +  process.env.REACT_APP_GET_SKUS + searchParams, { headers: { 'Authorization': 'Bearer ' + jwt } }
    );

    if (response.data.error) {
      this.setState({ 
        error: response.data.error.text,
       });
    } else {
      this.setState({
        csv: response.data.csv,
      });
    }
  }

  componentDidMount() {
    this.getCsvData();
    this.updateTable();
  }

  handleClick(e) {       
    this.setState({
      page: e.target.id - 1,
      skus: [],
      csv: [],
      isReady: false
    }, () => {this.updateTable(); this.getCsvData()})
  }

  handlePrevious(e) {
    e.preventDefault();
    this.setState({
      page: parseInt(this.state.page) - 1,
      skus: [],
      csv: [],
      isReady: false
    }, () => {this.updateTable(); this.getCsvData()});
  }

  handleNext(e) {
    e.preventDefault();
    this.setState({
      page: parseInt(this.state.page) + 1,
      skus: [],
      csv: [],
      isReady: false
    }, () => {this.updateTable(); this.getCsvData()});
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ 
      page: 0,
      skus: [],
      csv: [],
      isReady: false
    }, () => {this.updateTable(); this.getCsvData()});
  }

  handleClear(e) {
    this.setState({
      id: '',
      description: '',
      category: '',
      subcategory: '',
      substrate: ''
    }, () => {this.updateTable(); this.getCsvData();});
  }

  render() {
    if (!this.props.userId) {
      return <Redirect to={"/login"} />;
    }
    
    return (
      <div className="OrdersTable">
        <Navbar {...this.props} handleLogin={this.props.handleLogin} />
        <Container>
          <Row>
            <Col md={12} className="mx-auto">
              <h2 className="text-monospace font-weight-bold text-left mt-3">
                Products
              </h2>
              <Card className="text-left">
                <Card.Header className="card-header-account text-light">
                  Search
                </Card.Header>
                <Card.Body>
                  <SearchForm {...this.state} handleChange={this.handleChange} handleClear={this.handleClear} handleSubmit={this.handleSubmit} />
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
                  <SkuTable 
                    {...this.state} 
                    handleClick={this.handleClick}
                    handleNext={this.handleNext} 
                    handlePrevious={this.handlePrevious} 
                    limit={LIMIT}
                    userName = {this.props.userName}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

//export default RecentOrders;
export default ProductSku;


