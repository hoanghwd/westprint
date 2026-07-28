import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DatePickerForm = ({dateFrom = new Date(), dateTo = new Date(), dateNow = new Date(), handleDateFrom, handleDateTo}) =>
    <Form.Row>
        <DateFromLabel/>
        <DateFrom dateFrom={dateFrom} dateTo={dateTo} dateNow={dateNow} handleDateFrom={handleDateFrom}/>
        <DateTo dateFrom={dateFrom} dateTo={dateTo} dateNow={dateNow} handleDateTo={handleDateTo}/>
    </Form.Row>

const DateFromLabel = () =>
    <Form.Label
        column
        sm={2}
        className="text-right label"
        id="date-label-1"
    >
        Order Date From
    </Form.Label>

const DateToLabel = () =>
    <Form.Label
        column
        sm={2}
        className="text-right label"
        id="date-label-2"
    >
        To
    </Form.Label>

const DateFrom = ({dateFrom, dateTo, dateNow, handleDateFrom}) =>
    <Col sm={3} id="date-picker-1">
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text prepend" id="basic-addon1">
                    <i className="far fa-calendar-alt"/>
                </span>
            </div>
            <DatePicker
                className="form-control input"
                selected={dateFrom}
                onChange={handleDateFrom}
                maxDate={dateTo}
                name="dateFrom"
                id="dateFrom"
            />
        </div>
    </Col>

const DateTo = ({dateFrom, dateTo, dateNow, handleDateTo}) =>
    <Col sm={4}>
        <Row>
            <DateToLabel/>
            <Col id="date-picker-2">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text prepend" id="basic-addon1">
                            <i className="far fa-calendar-alt"/>
                        </span>
                    </div>
                    <DatePicker
                        className="form-control input"
                        selected={dateTo}
                        name="dateTo"
                        onChange={handleDateTo}
                        maxDate={dateNow}
                        id="dateTo"
                    />
                </div>
            </Col>
        </Row>
    </Col>

export default DatePickerForm
export {DatePickerForm};