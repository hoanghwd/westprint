import React, {Component} from "react";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import {Link} from "react-router-dom";
import "./RestApiDoc.css";

const list = [
    {
        name: "Introduction",
        id: "introduction"
    },
    {
        name: "Services Offered",
        id: "servicesOffered"
    },
    {
        name: "OAuth 2.0",
        id: "oAuth20",
        children: [
            {
                name: "Sending Request",
                id: "oAuth20SendingRequest"
            },
            {
                name: "Request Data",
                id: "oAuth20RequestData"
            },
            {
                name: "Where To Send Your Post Request",
                id: "oAuth20WhereToSendYourPostRequest"
            },
            {
                name: "Response",
                id: "oAuth20Response"
            },
            {
                name: "Response Data",
                id: "oAuth20ResponseData"
            }
        ]
    },
    {
        name: "Order Placement",
        id: "orderPlacement",
        children: [
            {
                name: "Sending Request",
                id: "createSendingRequest"
            },
            {
                name: "Request Data",
                id: "createRequestData"
            },
            {
                name: "Where to Send Your Post Request",
                id: "createWhereToSendYourPostReuqest"
            },
            {
                name: "Response",
                id: "createResponse"
            },
            {
                name: "Response Data",
                id: "createResponseData"
            },
            {
                name: "Error Codes",
                id: "createErrorCodes"
            },
            {
                name: "Image File Requirements",
                id: "createImageFileRequirements"
            }
        ]
    },
    /*
     * Huynh - 08/19/2021
     * https://app.clickup.com/t/9mjank
     */
    {
        name: "Update Order",
        children: [
            {
                name: "Shipping Type",
                id: "updateOrderShippingTypeIntro",
                children: [
                    {
                        name: "Request",
                        id: "updateOrderShippingTypeRequest"
                    },
                    {
                        name: "Request Data",
                        id: "updateOrderShippingTypeRequestData"
                    },
                    {
                        name: "Where to Send Your Request",
                        id: "updateOrderShippingTypeRequestWhereToSendRequest"
                    },
                    {
                        name: "Response",
                        id: "updateOrderShippingTypeResponse"
                    },
                    {
                        name: "Response Data",
                        id: "updateOrderShippingTypeResponseData"
                    },
                    {
                        name: "Error Codes",
                        id: "updateOrderShippingTypeResponseErrorCodes"
                    }
                ]
            },
            {
                name: "Shipping Address",
                id: "updateOrderShippingAddressIntro",
                children: [
                    {
                        name: "Request",
                        id: "updateOrderShippingAddressRequest"
                    },
                    {
                        name: "Request Data",
                        id: "updateOrderShippingAddressRequestData"
                    },
                    {
                        name: "Where to Send Your Request",
                        id: "updateOrderShippingAddressWhereToSendRequest"
                    },
                    {
                        name: "Response",
                        id: "updateOrderShippingAddressResponse"
                    },
                    {
                        name: "Response Data",
                        id: "updateOrderShippingAddressResponseData"
                    },
                    {
                        name: "Error Codes",
                        id: "updateOrderShippingAddressResponseErrorCodes"
                    }
                ]
            },
        ]
    },
    {
        name: "Cancel Order / Item",
        id: "cancelOrder",
        children: [
            {
                name: "Request",
                id: "cancelRequest"
            },
            {
                name: "Request Data",
                id: "cancelRequestData"
            },
            {
                name: "Where to Send Your Post Request",
                id: "cancelWhereToSendYourPostReuqest"
            },
            {
                name: "Response",
                id: "cancelResponse"
            },
            {
                name: "Response Data",
                id: "cancelResponseData"
            },
            {
                name: "Error Codes",
                id: "cancelErrorCodes"
            },
            {
                name: "Cancel Item Request",
                id: "cancelItemRequest"
            },
            {
                name: "Cancel Item Request Data",
                id: "cancelItemRequestData"
            },
            {
                name: "Where to Send Your Post Request",
                id: "cancelItemWhereToSendYourPostReuqest"
            },
            {
                name: "Cancel Item Response",
                id: "cancelItemResponse"
            },
            {
                name: "Cancel Item Response Data",
                id: "cancelItemResponseData"
            },
            {
                name: "Error Codes",
                id: "cancelItemErrorCodes"
            },
        ]
    },
    {
        name: "Redo Order",
        id: "redoOrder",
        children: [
            {
                name: "Request",
                id: "redoRequest"
            },
            {
                name: "Request Data",
                id: "redoRequestData"
            },
            {
                name: "Redo Codes and Their Description",
                id: "redoCodesAndTheirDescription"
            },
            {
                name: "Where to Send Your Post Request",
                id: "redoWhereToSendYourPostRequest"
            },
            {
                name: "Response",
                id: "redoResponse"
            },
            {
                name: "Response Data",
                id: "redoResponseData"
            },
            {
                name: "Error Codes",
                id: "redoErrorCodes"
            }

        ]
    },
    {
        name: "Status Update",
        id: "statusUpdate",
        children: [
            {
                name: "Sample Payloads",
                id: "statusSampleStatusUpdatePayloads"
            },
            {
                name: "Response",
                id: "statusUpdateAcknowledgement"
            }
        ]
    },
    {
        name: "Support",
        id: "support"
    },
];


const intro = [
    {
        name: "Services offered",
        id: "servicesOffered",
        parent: "Introduction"
    },
    {
        name: "OAuth 2.0",
        id: "oAuth20",
        parent: "Introduction"
    }
];

const jondoApi = [
    {
        name: "Order Request",
        id: "orderRequest",
        parent: "Jondo API"
    },
    {
        name: "Order Request Data",
        id: "orderRequestData",
        parent: "Jondo API"
    },
    {
        name: "Where to Send Your Post Request",
        id: "wherePostRequest",
        parent: "Jondo API"
    },
    {
        name: "Order Response",
        id: "orderResponse",
        parent: "Jondo API"
    },
    {
        name: "Order Response Data",
        id: "orderResponseData",
        parent: "Jondo API"
    },
    {
        name: "Error Codes",
        id: "errorCodes",
        parent: "Jondo API"
    },
    {
        name: "Receiving Status Updates",
        id: "receiveStatus",
        parent: "Jondo API"
    },
    {
        name: "Status Update Acknowledgement",
        id: "statusAck",
        parent: "Jondo API"
    },
    {
        name: "Image File Requirements",
        id: "imageReq",
        parent: "Jondo API"
    },
    {
        name: "Cancel Order Request",
        id: "cancelOrder",
        parent: "Jondo API"
    },
    {
        name: "Cancel Order Request Data",
        id: "cancelOrderData",
        parent: "Jondo API"
    }
];

class Navigation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: intro,
            list: list,
            /*
            child: {
              intro: 'intro',
              jondoApi: jondoApi
            }
            */
        };

        this.handleChange = this.handleChange.bind(this);
        this.addActiveClass = this.addActiveClass.bind(this);
    }

    addActiveClass(event) {
        this.setState({
            active: event.target.id
        });
    }

    handleChange(event) {
        let term = event.target.value.toLowerCase();
        if (term !== "") {
            this.setState({
                child: {
                    intro: intro.filter(item => item["name"].toLowerCase().includes(term) || item["parent"].toLowerCase().includes(term)),
                    jondoApi: jondoApi.filter(item => item["name"].toLowerCase().includes(term) || item["parent"].toLowerCase().includes(term))
                },
                list: list.filter(
                    item =>
                        (item["name"].toLowerCase().includes(term)) ||
                        (item["children"] && item["children"].filter(c => c["name"].toLowerCase().includes(term) ).length !== 0)
                )
            });
        }
        else {
            this.setState({
                child: {
                    jondoApi: jondoApi
                },
                list: list
            });
        }
    }

    render() {
        return (
            <Col sm={3} id="col-left">
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1" className="prepend">
                            <i className="fas fa-search"/>
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        className="input"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        onChange={this.handleChange}
                    />
                </InputGroup>

                <h3 className="title"> Content </h3>
                <ul className="nav flex-column">
                    {this.state.list.map(item => (
                        <li key={item.id}>
                            {
                                //First level: ITEM DOES NOT HAVE CHILDREN
                                !item.children ?
                                (
                                    <Link
                                        to={"/docs/api/" + item.id}
                                        id={item.id}
                                        className={this.state.active === item.id ? "activeDoc linkDoc" : "tabDoc linkDoc"}
                                        onClick={ this.addActiveClass } >
                                        {item.name}
                                    </Link>
                                )
                                :
                                (
                                    //First level: ITEM DOES HAVE CHILDREN
                                    <samp className="tabDoc">{item.name}</samp>
                                )
                            }
                            {
                                item.children ?
                                    //First Level
                                    item.children.map(firstLevel => (
                                        <ul>
                                            <li key={firstLevel.id}>
                                                {
                                                    firstLevel.children ?
                                                        <samp className="tabDoc">{firstLevel.name}</samp>
                                                        :
                                                        (
                                                            <Link
                                                                to={"/docs/api/" + firstLevel.id}
                                                                id={firstLevel.id}
                                                                className={ this.state.active === firstLevel.id ? "activeDoc linkDoc" : "tabDoc linkDoc" }
                                                                onClick={this.addActiveClass}>
                                                                {firstLevel.name}
                                                            </Link>
                                                        )
                                                }
                                                <ul>
                                                {
                                                    firstLevel.children ?
                                                        //Second level
                                                        firstLevel.children.map(secondLevel => (
                                                            <li key={secondLevel.id}>
                                                                <Link
                                                                    to={"/docs/api/" + secondLevel.id}
                                                                    id={secondLevel.id}
                                                                    className={ this.state.active === secondLevel.id ? "activeDoc linkDoc" : "tabDoc linkDoc" }
                                                                    onClick={this.addActiveClass}>
                                                                    {secondLevel.name}
                                                                </Link>
                                                            </li>
                                                        ))
                                                    :
                                                    ""
                                                }
                                                </ul>
                                            </li>
                                        </ul>
                                    ))
                                    :
                                    ""
                            }
                        </li>
                    ))}
                </ul>
            </Col>
        );
    }
}

export default Navigation;