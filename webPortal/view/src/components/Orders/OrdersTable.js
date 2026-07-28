import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import { doToggleLoadOrders } from '../../actions'
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Spinner from 'react-bootstrap/Spinner'
import DOMPurify from "dompurify";
import Card from "react-bootstrap/Card";

/**
 * Huynh Do: This will serve as global LIMIT for search orders
 * @type {number}
 */
const LIMIT = 40;

const getOrders = async (userName, searchData, jwt) => {

  const { dateFrom, dateTo, orderId, trackingNumber, status, locId, page, orderBy, descAsc = "desc" } = searchData;
  const searchParams = `?userName=${userName} &dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}&locId=${locId}&orderId=${orderId}&trackingNumber=${trackingNumber}&page=${page}&limit=${LIMIT}&orderBy=${orderBy}&descAsc=${descAsc}`;
  const orderUrl = process.env.REACT_APP_WESTPRINT_API +  process.env.REACT_APP_GET_ORDERS;
  const response = await axios.get(
      orderUrl + searchParams,
      {headers: {'Authorization': 'Bearer ' + jwt}}
  ).catch(error => {
    console.log(error.response)
  });

  return response;
};

class OrderTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      total: 0,
      orderBy: "orderTime",
      isDataReady: false,
      error: "",
      orders: [],
      dsc_poNumber: true,
      dsc_orderTime: false,
      dsc_total: true
    };

    this.handleSort = this.handleSort.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  async updateTable() {
    const { userName, jwt } = this.props;
    
    const descAsc = this.state["dsc_" + this.state.orderBy] ? "desc" : "asc";
    const extraOptions = { page: this.state.page, orderBy: this.state.orderBy, descAsc: descAsc }
    
    // if the request come from recent order page, just use the default options 
    const searchOptions = this.props.type === "recent" ? extraOptions : { ...this.props.searchOptions, ...extraOptions };
        
    const response = await getOrders(userName, searchOptions, jwt);
    
    if (response.data.error) {
      this.setState({ error: response.data.error.text });
    } else {
      this.setState({ orders: response.data.orders, total: response.data.total, isDataReady: true });
    }

  }

  // update the table when submit search form
  componentDidUpdate() {
    window.scrollTo(0, 0);
    const { loadNewData } = this.props;

    if (loadNewData) {
      
      this.props.onToggleLoadOrdersFlag();
      this.setState({
        page: 0
      }, () => this.updateTable());

    }
  }

  // update the the table when first load
  async componentDidMount() {

    this.setState({ isDataReady: false });
    const { userName, jwt } = this.props;
    
    const searchOptions = this.props.type === "recent" ? '' : { ...this.props.searchOptions };

    //const searchOptions = (({ dateFrom, dateTo, orderId, status,  locId, page, limit, orderBy, descAsc }) => ({ dateFrom, dateTo, orderId, status,  locId, page, limit, orderBy, descAsc }))(this.state);
    
    const response = await getOrders(userName, searchOptions, jwt);

    if (response.data.orders) {

      this.setState({
        orders: response.data.orders,
        total: response.data.total,
        isDataReady: true
      });
    }
  }

  // ***************************************** */
  // Function to handle events for Pagination  */
  // ***************************************** */
  handleClick(e) {
    // window.scrollTo(0, 700);
    this.setState({
      page: e.target.id - 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  handlePrevious(e) {
    // window.scrollTo(0, 700);
    this.setState({
      page: parseInt(this.state.page) - 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  handleNext(e) {
    // window.scrollTo(0, 700);
    this.setState({
      page: parseInt(this.state.page) + 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }
  // End of Pagination functions

  handleSort(e) {
    // window.scrollTo(0, 700);
    this.setState({
      orderBy: e.target.id,
      ["dsc_" + e.target.id]: !this.state["dsc_" + e.target.id],
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  render() {
    const { orders, isDataReady } = this.state;

    const header = (
      <thead>
        <tr>
          <th>PO# &nbsp;
            {/*
              <SortButton
                  id="poNumber"
                  handleSort={this.handleSort}
                  btnSort={this.state.dsc_poNumber ? "fas fa-caret-down" : "fas fa-caret-up"}
              />
              */
            }
          </th>

          <th>Date &nbsp;
            {/*
              <SortButton
                  id="orderTime"
                  handleSort={this.handleSort}
                  btnSort={this.state.dsc_orderTime ? "fas fa-caret-down" : "fas fa-caret-up"}
              />*/
            }
          </th>

          <th>Total &nbsp;
            {/*
              <SortButton
                  id="total"
                  handleSort={this.handleSort}
                  btnSort={this.state.dsc_total ? "fas fa-caret-down" : "fas fa-caret-up"}
              />*/
            }
          </th>

          <th>Details</th>
          <th>Recipient</th>
          <th>Tracking Number</th>
          <th>Carrier</th>
          <th>Status</th>
        </tr>
      </thead>
    );

    if (!isDataReady) {
      return (
        <Table striped bordered hover>
          {header}
          <tbody>
            <tr>
              <td colSpan="8"><Spinner animation="border" /></td>
            </tr>
          </tbody>
        </Table>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="OrdersTable">
          No records found.
        </div>
      )
    }
    
    var orderItems = [];
    for(var i of orders) {
        var tracking = i.trackingNumber;
        if(i.trackingNumber !== "N/A") {
            tracking = <a href={i.trackingURL} target="_blank" rel="noopener noreferrer">{i.trackingNumber}</a>;
        }

        orderItems.push(
        <tr key={i.id}>
            <td>{i.poNumber}</td>
            <td>{i.orderTime}</td>
            <td>{i.total} USD</td>
            <td>
              <Link to={"/order/" + i.id} className="link">View</Link>
            </td>
            <td>{i.firstName} {i.lastName}</td>
            <td>{tracking}</td>
            <td>{i.carrier}</td>
            <td>{i.status}</td>
        </tr>);
    }

    let totalHtml =
        (
          <Card.Body>
            {<div class="row" id="total" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize('Total: ' + this.state.total)}}/>}
          </Card.Body>
        );

    return (
      <div className="OrdersTable">
        <Table striped bordered hover>
          {header}
          <tbody>
            {orderItems}
          </tbody>
        </Table>
        {
          /*
          Modified by Huynh Do - 06/29/2021
          For security we only show the first 40 records
          */
          /*
          <Footer
              showPaginationBottom={false}
              page={this.state.page}
              total={this.state.total}
              offset={LIMIT}
              handleClick={this.handleClick}
              handleNext={this.handleNext}
              handlePrevious={this.handlePrevious}
              pageCount={pageCount}
          />
        */
          totalHtml
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  { 
    searchOptions: state.searchOrdersOption.searchOptions,
    loadNewData: state.searchOrdersOption.loadNewData
  }
);

const mapDispatchToProps = dispatch => (
  {
    onToggleLoadOrdersFlag: () => dispatch(doToggleLoadOrders())
  }
);

//export default RecentOrders;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderTable);


