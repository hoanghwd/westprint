import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "../Navbar/NavBar";
import axios from "axios";
import Response from './Response';
import Request from './Request';
import {Redirect} from "react-router-dom";
import {
    create,
    createResp,
    cancel,
    cancelResp,
    cancelItem,
    cancelItemResp,
    redo,
    redoAsIs,
    redoResp,
    /**
     * Huynh - 08/27/2021
     * https://app.clickup.com/t/9mjank
     * Under public/jondoApi/Update directory
     */
        shippingType,
    shippingTypeResp,
    updateAddress,
    updateAddressResp
} from '../../constants/xml';

import "./ApiSampleTool.css";

const format = require('xml-formatter');
const options = {collapseContent: true};
const options2 = {collapseContent: true, indentation: '    ',lineSeparator: '\n'};
let renderReqlXml = '';

class ApiSampleTool extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqXml: format(create, options2),
            respXml: format(createResp, options),
            respContentType: 'text/html; charset=UTF-8',
            respStatus: '200',
            token: "",
            modalShow: false,
            id: this.props.userId,
            apiKey: this.props.apiKey,
            endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API,
            httpMethod: "POST"
        };

        this.handleClear = this.handleClear.bind(this);
        this.handleRequestXml = this.handleRequestXml.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmitToken = this.handleSubmitToken.bind(this);
        this.handlePreXml = this.handlePreXml.bind(this);
        let submitted = false;
    }

    handleClear(e) {
        this.setState({
            reqXml: "",
            respXml: "",
            respContentType: '',
            respStatus: '',
            token: "",
            modalShow: false,
            id: "",
            apiKey: "",
            endpoint: "",
            httpMethod: ""
        });
    }

    handleRequestXml(reqXml) {

        this.setState({
            //reqXml: format(e, options2)
            reqXml: reqXml
        });

    }

    handleBlur(reqXml) {
        reqXml = reqXml.replace(/(\r\n|\n|\r)/gm, "");
        reqXml = reqXml.replace(/\s+/g, '');
        reqXml = reqXml.replace(/\>\s+\</g, '><');
        reqXml = reqXml.replace(/\\/g, "")
        //console.log(reqXml)

        this.setState({
            reqXml: format(reqXml, options2)
        });

    }

    handleChange(e) {

        this.setState({
            [e.target.name]: e.target.value
        });

    }

    handlePreXml(e) {
        switch (e.target.value) {
            case 'create':
                this.setState({
                    reqXml: format(create, options),
                    respXml: format(createResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API,
                    httpMethod: "POST"
                });
                break;

            case 'cancel':
                this.setState({
                    reqXml: format(cancel, options),
                    respXml: cancelResp,
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API,
                    httpMethod: "DELETE"
                });
                break;

            case 'cancelItem':
                this.setState({
                    reqXml: format(cancelItem, options),
                    respXml: cancelItemResp,
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API,
                    httpMethod: "DELETE"
                });
                break;

            case 'redo':
                this.setState({
                    reqXml: format(redo, options),
                    respXml: format(redoResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_REDO_API,
                    httpMethod: "POST"
                });
                break;

            case 'redoAsIs':
                this.setState({
                    reqXml: format(redoAsIs, options),
                    respXml: format(redoResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_REDO_API,
                    httpMethod: "POST"
                });
                break;

            /*
             * Huynh - 08/19/2021
             * https://app.clickup.com/t/9mjank
             */
            case 'updateShippingType':
                this.setState({
                    reqXml: format(shippingType, options),
                    respXml: format(shippingTypeResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_SHIPPING_TYPE_API,
                    httpMethod: "POST"
                });
                break;

            case 'updateAddress':
                this.setState({
                    reqXml: format(updateAddress, options),
                    respXml: format(updateAddressResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_UPDATE_ADDRESS_API,
                    httpMethod: "POST"
                });
                break;

            default:
                this.setState({
                    reqXml: format(create, options),
                    respXml: format(createResp, options),
                    endpoint: process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API,
                    httpMethod: "POST"
                });
        }
    }

    handleShow(e) {
        this.setState({modalShow: true})
    }

    async handleSubmit(e) {

        e.preventDefault();

        this.setState({
            respXml: 'loading...'
        });

        const res = await axios
            .post(
                process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_API_SAMPLE,
                {
                    endpoint: this.state.endpoint,
                    httpMethod: (this.state.httpMethod),
                    reqXml: (this.state.reqXml).replace(/\r\n/g, '').replace(/\>\s+\</g, '><'),
                    token: this.state.token
                }
            );

        let respXml = res.data.respXml ? res.data.respXml.replace(/\r?\n/g, '') : "";
        let jsonReqXml = res.data.reqXml ? res.data.reqXml.replace(/\r?\n/g, '') : "";
        jsonReqXml = jsonReqXml.replace(/(\r\n|\n|\r)/gm, "")
        jsonReqXml = jsonReqXml.replace(/\>\s+\</g, '><')
        jsonReqXml = jsonReqXml.replace(/\\/g, "")
        this.state.reqXml = format(jsonReqXml, options2);

        try {
            respXml = respXml.replace(/(\r\n|\n|\r)/gm, "")
            respXml = respXml.replace(/\>\s+\</g, '><')
            respXml = respXml.replace(/\\/g, "")
            respXml = format(respXml, options2);
        } catch (e) {
            respXml = res.data.respXml;
        }
        this.setState({
            respXml: respXml,
            respContentType: res.data.contentType,
            respStatus: res.data.status
        });
    }

    async handleSubmitToken(e) {
        e.preventDefault();

        const searchParams = "?id=" + this.state.id + "&apiKey=" + this.state.apiKey;

        const res = await axios.get(
            process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_TOKEN + searchParams
        );

        let rawData = res.data.rawData;
        try {
            rawData = format(rawData, options);
        } catch (e) {
            console.log(e);
        }
        if (!res.data.error) {
            this.setState({
                token: res.data.token,
                rawData: rawData,
                error: '',
            });
        } else {
            this.setState({
                error: res.data.error,
                rawData: rawData
            });
        }
    }

    render() {
        if (!this.props.userId) {
            return <Redirect to={"/login"}/>;
        }

        return (
            <div className="my-account">
                <Navbar {...this.props} handleLogin={this.props.handleLogin}/>
                <Container>
                    <h2 className="text-monospace font-weight-bold text-left mt-3">
                        API Sample Tool
                    </h2>

                    <Row>
                        <Col className="mb-5" sm={6}>
                            <Request
                                token={this.state.token}
                                handleChange={this.handleChange}
                                handleShow={this.handleShow}
                                handleSubmit={this.handleSubmit}
                                handleRequestXml={this.handleRequestXml}
                                handleBlur={this.handleBlur}
                                modalClose={() => this.setState({modalShow: false})}
                                modalShow={this.state.modalShow}
                                handleSubmitToken={this.handleSubmitToken}
                                rawData={this.state.rawData}
                                reqXml={this.state.reqXml}
                                handlePreXml={this.handlePreXml}
                                endpoint={this.state.endpoint}
                                httpMethod={this.state.httpMethod}
                                id={this.state.id}
                                apiKey={this.state.apiKey}
                                error={this.state.error}
                            />
                        </Col>
                        <Col className="mb-5" sm={6}>
                            <Response
                                handleClear={this.handleClear}
                                respXml={this.state.respXml}
                                contentType={this.state.respContentType}
                                status={this.state.respStatus}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default ApiSampleTool;
