import React, { Component } from "react"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Row from "react-bootstrap/Row"
import { connect } from 'react-redux'
import Button from "react-bootstrap/Button"
import DatePickerForm from "../Misc/DatePickerForm"
import { doToggleLoadLogs, doUpdateSearchLogsOptions } from '../../actions'

import "react-datepicker/dist/react-datepicker.css"

import "./ApiLog.css"

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const getDateString = (date) =>  {
  if (!date) {
    return "";
  }
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

let dateNow = new Date();
//dateNow.setDate(dateNow.getDate() + 1);
dateNow.setDate(dateNow.getDate());
const dateNowString = getDateString(dateNow);

let datePreviousMonth = new Date();
//datePreviousMonth.setDate(datePreviousMonth.getDate() - 30);
datePreviousMonth.setDate(datePreviousMonth.getDate() - 1);
const datePreviousMonthString = getDateString(datePreviousMonth);

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: "",
      dateTo: "",
      dateNow: "",
      poNumber: "",
      status: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClearResults = this.handleClearResults.bind(this);
    this.handleDateFrom = this.handleDateFrom.bind(this);
    this.handleDateTo = this.handleDateTo.bind(this);
  }

  getDateString(date) {
    if (!date) {
      return "";
    }
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
  }

  componentDidMount() {
    
    this.setState ({
      dateFrom: datePreviousMonthString,
      dateTo: dateNowString,
      dateNow: dateNowString
    });

  }

  handleSubmit = event => {
    event.preventDefault();
    const { dateFrom, dateTo, poNumber, status  } = this.state;
    const searchOptions = { dateFrom, dateTo, poNumber, status };
    this.props.onUpdateSearchOrdersOptions(searchOptions);
    this.props.onToggleLoadOrdersFlag();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: encodeURIComponent(event.target.value) });
  };

  handleDateFrom = date => {
    if (!date) {
      this.setState({ dateFrom: "" });
      return;
    }

    let dateString =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.setState({
      dateFrom: dateString
    });
  };

  handleDateTo = date => {
    if (!date) {
      this.setState({ dateTo: "" });
      return;
    }

    let dateString =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    this.setState({
      dateTo: dateString
    });
  };

  handleClearResults = () => {
    const searchOptions = {
      dateFrom: datePreviousMonthString,
      dateTo: dateNowString,
      poNumber: "",
      status: ""
    };

    //Resets the search form
    this.setState({
      ...searchOptions,
      dateNow: dateNowString,
    });

    this.props.onUpdateSearchOrdersOptions(searchOptions);
    this.props.onToggleLoadOrdersFlag();
  };

  render() {

    let dateFrom = this.state.dateFrom ? new Date(this.state.dateFrom) : new Date();
    let dateTo = this.state.dateTo ? new Date(this.state.dateTo) : new Date();
    let dateNow = this.state.dateNow ? new Date(this.state.dateNow) : new Date();

    return (
      <Form onSubmit={this.handleSubmit}>
        < DatePickerForm dateFrom={dateFrom} dateTo={dateTo} dateNow={dateNow} handleDateFrom={this.handleDateFrom} handleDateTo={this.handleDateTo} />

        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            PO Number
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              placeholder="PO Number"
              name="poNumber"
              onChange={this.handleChange}
              value={decodeURIComponent(this.state.poNumber)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm="2" className="text-right label">
            Status
          </Form.Label>
          <Col sm="9">
            <Form.Control
              className="input"
              as="select"
              name="status"
              onChange={this.handleChange}
            >
              <option>All</option>
              {this.props.status.map((status, index) => <option key={index} value={camelize(status)}>{status}</option>)}
            </Form.Control>
          </Col>
        </Form.Group>


        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <Button className="mr-3" variant="primary" type="submit" size="lg">
              SEARCH
            </Button>
            <Button
              variant="outline-dark"
              size="lg"
              id="btn-clear"
              onClick={this.handleClearResults}
            >
              CLEAR
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


const mapDispatchToProps = dispatch => ({
  onToggleLoadOrdersFlag: () => dispatch(doToggleLoadLogs()),
  onUpdateSearchOrdersOptions: searchOptions => dispatch(doUpdateSearchLogsOptions(searchOptions))
});

export default connect(
  undefined,
  mapDispatchToProps
)(SearchForm);

