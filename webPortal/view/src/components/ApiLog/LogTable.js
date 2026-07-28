import React, { Component } from "react";
import axios from "axios";
import { connect } from 'react-redux';
import { doToggleLoadLogs } from '../../actions'
import Table from "react-bootstrap/Table";
import Footer from "../Misc/Footer";
import SortButton from "../Misc/SortButton";
import Spinner from 'react-bootstrap/Spinner'

const LIMIT = 30;

const getLogs = async (userName, searchData) => {

  const { dateFrom, dateTo, poNumber, status, page, orderBy, descAsc = "desc", appType } = searchData

  const searchParams = `?userName=${userName}&poNumber=${poNumber}
  &dateFrom=${dateFrom}&dateTo=${dateTo}&status=${status}
  &page=${page}&limit=${LIMIT}&orderBy=${orderBy}&descAsc=${descAsc}&appType=${appType}`;

  return axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_LOGS + searchParams);
};

class LogTable extends Component
{
  _isMounted = false;

  constructor(props) {
    super(props);
    //this.myRef = React.createRef();

    this.state = {
      page: 0,
      orderBy: 'reqTime',
      total: 0,
      isDataReady: false,
      dsc_poNumber: true,
      dsc_reqTime: true,
      dsc_respTime: true,
      orders: []
    };

    this.handleSort = this.handleSort.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.updateTable = this.updateTable.bind(this);
  }

  async updateTable(firstVisit = false)
  {
    const userName = this.props.userName;
    const descAsc = this.state["dsc_" + this.state.orderBy] ? "desc" : "asc";
    //const searchOptions = { ...this.props.searchOptions, page: this.state.page, orderBy: this.state.orderBy, descAsc: descAsc, appType: this.props.appType };
    let searchOptions = {};

    if(firstVisit) {
      const getDateString = (date) =>  {
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      }

      //Reset default date range
      let dateNow = new Date();
      dateNow.setDate(dateNow.getDate());
      const dateNowString = getDateString(dateNow);

      let datePreviousMonth = new Date();
      datePreviousMonth.setDate(datePreviousMonth.getDate() - 1);
      const datePreviousMonthString = getDateString(datePreviousMonth);

      this.props.searchOptions.dateFrom = datePreviousMonthString;
      this.props.searchOptions.dateTo = dateNowString;

      console.log("Reset default date range \n");
      console.log(this.props.searchOptions);
    }

    searchOptions = { ...this.props.searchOptions, page: this.state.page, orderBy: this.state.orderBy, descAsc: descAsc, appType: this.props.appType };

    const response = await getLogs(userName, searchOptions);

    if (response.data.orders) {
      if (this._isMounted) {
        this.setState({
          orders: response.data.orders,
          total: response.data.total,
          isDataReady: true
        });
      }
    }
  }

  // update the table when submit search form
  componentDidUpdate() {
    const { loadNewData } = this.props;

    if (loadNewData) {
      this.props.onToggleLoadLogsFlag();
      this.setState({
        page: 0,
        //Turn back to data is not ready state before submit
        isDataReady : false
      }, () => this.updateTable());
    }
  }

  // update the the table when first load
  async componentDidMount() {
    this._isMounted = true;

    await this.updateTable(true);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // ***************************************** */
  // Function to handle events for Pagination  */
  // ***************************************** */

  handleClick(e) {
    window.scrollTo(0, 600);
    this.setState({
      page: e.target.id - 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  handlePrevious(e) {
    window.scrollTo(0, 600);
    this.setState({
      page: parseInt(this.state.page) - 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  handleNext(e) {
    window.scrollTo(0, 600);
    this.setState({
      page: parseInt(this.state.page) + 1,
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }
  // End of Pagination functions

  handleSort(e) {
    window.scrollTo(0, 600);
    this.setState({
      orderBy: e.target.id,
      ["dsc_" + e.target.id]: !this.state["dsc_" + e.target.id],
      orders: [],
      isDataReady: false
    }, () => this.updateTable());
  }

  render() {
    const { orders, isDataReady } = this.state;
    const pageCount = Math.ceil(parseInt(this.state.total) / LIMIT);

    const header = (
        <thead>
        <tr>
          <th>
            PO# &nbsp;
            <SortButton
                id="poNumber"
                handleSort={this.handleSort}
                btnSort={this.state.dsc_poNumber ? "fas fa-caret-down" : "fas fa-caret-up"}
            />
          </th>

          <th>
            Request Time &nbsp;
            <SortButton
                id="reqTime"
                handleSort={this.handleSort}
                btnSort={this.state.dsc_reqTime ? "fas fa-caret-down" : "fas fa-caret-up"}
            />
          </th>

          <th>
            Response Time &nbsp;
            <SortButton
                id="respTime"
                handleSort={this.handleSort}
                btnSort={this.state.dsc_respTime ? "fas fa-caret-down" : "fas fa-caret-up"}
            />
          </th>

          <th>Request & Response</th>
          <th>Application Type</th>
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
          <div className="LogTable">
            No records found
          </div>
      )
    }

    //<Link to={"/viewXml/" + item.logId} className="link">View</Link>
    return (
        <div className="LogTable" ref={this.myRef}>
          <Table striped bordered hover>
            {header}
            <tbody id="LogTableBody">
            {
              orders.map(
                  item => (
                      <tr key={item.logId}>
                        <td>{item.poNumber}</td>
                        <td>{item.reqTime}</td>
                        <td>{item.respTime}</td>
                        <td>
                          {/*
                      <Link to={"/viewXml/" + item.logId} className="link">
                        View
                      </Link>
                      */}
                          {
                            item.validReq ? (
                                <a target="_blank" rel="noopener noreferrer" href={`#/viewXml/` + item.logId}>View</a>
                            ) : (
                                'NA'
                            )}
                        </td>
                        <td>{item.applicationType}</td>
                        <td>{item.status}</td>
                      </tr>
                  )
              )
            }
            </tbody>
          </Table>

          <Footer
              page={this.state.page}
              offset={LIMIT}
              total={this.state.total}
              handleClick={this.handleClick}
              handleNext={this.handleNext}
              handlePrevious={this.handlePrevious}
              pageCount={pageCount}
          />

        </div>
    );
  }
}

const mapStateToProps = state => (
    {
      searchOptions: state.searchLogsOption.searchOptions,
      loadNewData: state.searchLogsOption.loadNewData
    }
);

const mapDispatchToProps = dispatch => (
    {
      onToggleLoadLogsFlag: () => dispatch(doToggleLoadLogs())
    }
);

//export default RecentOrders;
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LogTable);
