import React, { Component } from "react";
import { connect } from 'react-redux';
import { doToggleLoadOrders, doUpdateSearchOrdersOptions } from '../../actions'
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Accordion from 'react-bootstrap/Accordion'
import DatePickerForm from "../Misc/DatePickerForm";

import Card from "react-bootstrap/Card";

import "react-datepicker/dist/react-datepicker.css";
import "./Orders.css";


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
datePreviousMonth.setDate(datePreviousMonth.getDate() - 30);
//datePreviousMonth.setDate(datePreviousMonth.getDate() );
const datePreviousMonthString = getDateString(datePreviousMonth);

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dateFrom: '',
      dateTo: '',
      dateNow:'',
      orderId: '',
      trackingNumber: '',
      status: '',
      locId: 'ALL',
      sign: "fas fa-minus"
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClearResults = this.handleClearResults.bind(this);
    this.handleDateFrom = this.handleDateFrom.bind(this);
    this.handleDateTo = this.handleDateTo.bind(this);
    this.toggleSign = this.toggleSign.bind(this);
  }

  componentDidMount() {
    const { dateFrom, dateTo, orderId, trackingNumber, status, locId } = this.props.searchOptions;


    const dateFromString = dateFrom ? dateFrom : datePreviousMonthString;
    const dateToString = dateTo ? dateTo : dateNowString;

    this.setState({
      dateFrom: dateFromString,
      dateTo: dateToString,
      dateNow: dateNowString,
      orderId: orderId,
      trackingNumber: trackingNumber,
      status: status,
      locId: locId
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const searchOptions = this.state;
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
      dateNow: dateNowString,
      orderId: "",
      status: "",
      locId: "",
      trackingNumber: ""
    };

    //Reset search form
    this.setState(searchOptions);

    this.props.onUpdateSearchOrdersOptions(searchOptions);
    this.props.onToggleLoadOrdersFlag();
  };

  toggleSign() {
    if(this.state.sign === "fas fa-minus") {
      this.setState({ sign: "fas fa-plus" });      
    } else {
      this.setState({ sign: "fas fa-minus"})
    }
  }
  render() {

    let dateFrom = this.state.dateFrom ? new Date(this.state.dateFrom) : new Date();
    let dateTo = this.state.dateTo ? new Date(this.state.dateTo) : new Date();
    let dateNow = this.state.dateNow ? new Date(this.state.dateNow) : new Date();
    //alert('dateFrom: ' +dateFrom+', dateTo: '+dateTo+', dateNow: '+dateNow)
    const status = this.props.status || [];
    let fixedStatus = [];
    for(var i = 0; i < status.length; i++){
      let keyValue = status[i];
      if( keyValue === 'In Progress' ) {
        keyValue = "InProgress";
      }
      fixedStatus[i] = { "label" : status[i], "value" : keyValue};
    }

    return (
      <Accordion defaultActiveKey="0" >
        <Card>
          <Card.Header className="card-header-account text-light p-1">
            <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={this.toggleSign}  className="text-dark">
              <i className={this.state.sign}/>
            </Accordion.Toggle>
            Search Form
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className = "card-accordion">
              <Form onSubmit={this.handleSubmit}>
              <DatePickerForm dateFrom={dateFrom} dateTo={dateTo} dateNow={dateNow} handleDateFrom={this.handleDateFrom} handleDateTo={this.handleDateTo} />
              <Form.Group as={Row}>
                <Form.Label column sm="2" className="text-right label">
                  PO#
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    className="input"
                    placeholder="PO#"
                    name="orderId"
                    onChange={this.handleChange}
                    value={decodeURIComponent(this.state.orderId)}
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
                    value={this.state.status}
                    onChange={this.handleChange} >
                    <option value="">ALL</option>
                    { fixedStatus.map((option) => ( <option value={option.value}>{option.label}</option> )) }
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Form.Label column sm="2" className="text-right label">
                  Tracking Number
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    className="input"
                    placeholder="Tracking Number"
                    name="trackingNumber"
                    onChange={this.handleChange}
                    value={decodeURIComponent(this.state.trackingNumber)}
                  />
                </Col>
              </Form.Group>

              {
                /*
              <Form.Group as={Row}>
                <Form.Label column sm="2" className="text-right label">
                  Location
                </Form.Label>
                <Col sm="9">
                  <Form.Control
                    as="select"
                    className="input"
                    value={this.state.locId}
                    name="locId"
                    onChange={this.handleChange}
                  >
                    <option>ALL</option>
                    {locations.map((locId, index) => <option key={index} value={index + 1}>{locId}</option>)}
                  </Form.Control>
                </Col>
              </Form.Group>
              */}
              <Row>
                <Col sm={2} />
                <Col sm={9}>
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
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

    );
  }
}

const mapStateToProps = state => (
  {
    searchOptions: state.searchOrdersOption.searchOptions,
    locations: state.options.locations,
    status: state.options.order
  }
);

const mapDispatchToProps = dispatch => ({
  onToggleLoadOrdersFlag: () => dispatch(doToggleLoadOrders()),
  onUpdateSearchOrdersOptions: searchOptions => dispatch(doUpdateSearchOrdersOptions(searchOptions))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);
