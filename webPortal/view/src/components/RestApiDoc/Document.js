import React, {Component} from "react"
import AceEditor from "react-ace";

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Table from 'react-bootstrap/Table'

import {Link} from 'react-router-dom';

import {create, createResp, createRespError} from '../../constants/xml'
import {
    cancel,
    cancelRespBefore,
    cancelRespAfter,
    cancelRespError,
    cancelItem,
    cancelItemResp,
    cancelItemRespError,
    cancelItemRespPartial,
    statusUpdateItemized,
    statusUpdateItemizedCancel,
    statusUpdateItemizeAccepted,
    statusUpdateItemizeRejected,
    statusUpdateItemizedHold,
    statusUpdateItemizeProcessing
} from '../../constants/xml';
import {redoAsIs, redoWithChanges, redoResp, redoRespError} from '../../constants/xml'
import {statusUpdateAck, statusUpdateAckError} from '../../constants/xml'
import {cancelled, accepted, onHold, processing, shipped, cancelledByCustomer} from '../../constants/statusArrays'

/*
* Huynh - 08/19/2021
* https://app.clickup.com/t/9mjank
* Under public/jondoApi/Update directory
*/
import {
    shippingType,
    shippingTypeResp,
    shippingTypeRespError,
    updateAddress,
    updateAddressResp,
    updateAddressRespError
} from '../../constants/xml'

import "./RestApiDoc.css"

const format = require('xml-formatter');
const options = {collapseContent: true};

const xmlCreate = format(create.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlCreateResp = format(createResp.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlCreateRespError = format(createRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)

const xmlCancel = format(cancel.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelRespBefore = format(cancelRespBefore.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelRespAfter = format(cancelRespAfter.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelRespError = format(cancelRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelItem = format(cancelItem.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelItemResp = format(cancelItemResp.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelItemRespError = format(cancelItemRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlCancelItemRespPartial = format(cancelItemRespPartial.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);

const xmlRedoAsIs = format(redoAsIs.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlRedoWithChanges = format(redoWithChanges.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlRedoResp = format(redoResp.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlRedoRespError = format(redoRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)

const xmlStatusUpdateAck = format(statusUpdateAck.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlStatusUpdateAckError = format(statusUpdateAckError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlCancelled = statusUpdateItemizedCancel
const xmlAccepted = statusUpdateItemizeAccepted
const xmlRejected = statusUpdateItemizeRejected
const xmlOnHold = statusUpdateItemizedHold
const xmlProcessing = statusUpdateItemizeProcessing
//const xmlShipped = shipped
const xmlCancelledByCustomer = cancelledByCustomer
const xmlShippedItemized = statusUpdateItemized

/*
* Huynh - 08/19/2021
* https://app.clickup.com/t/9mjank
* Under public/jondoApi/Update directory
*/
const xmlShippingType = format(shippingType.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlShippingTypeResp = format(shippingTypeResp.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlShippingTypeRespError = format(shippingTypeRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);

const xmlUpdateAddress = format(updateAddress.replace(/(\r\n|\n|\r| {2,})/gm, ""), options)
const xmlUpdateAddressResp = format(updateAddressResp.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);
const xmlUpdateAddressRespError = format(updateAddressRespError.replace(/(\r\n|\n|\r| {2,})/gm, ""), options);

////////////--- Content ---- //////

const introduction = () => (
    <div>
        <br></br>
        This document is intended for web developers or programmers with some background knowledge in a server side
        programming language. To use Jondo API you must be able to transmit an HTTP/HTTPS post to our API web URL.
        Virtually all major programming languages in use today, including ASP and PHP, can do this with ease.
    </div>
);

////
const servicesOffered = () => (
    <div>
        <br></br>
        <ul>
            <li>
                <strong>Order Placement</strong> – Customers can place their orders using this service
            </li>
            <li>
                <strong>Update Order</strong> – Customers can update the shipping address or the shipping type on the orders using this service.
            </li>
            <li>
                <strong>Cancel Order</strong> – Customers can cancel their orders using this service.
            </li>
            <li>
                <strong>Redo Order Placement</strong> – Customers can resubmit the orders as-is or with any changes
                using this service.
            </li>
            <li>
                <strong>Status Updates</strong> – Customers can receive updates from Jondo after an order is accepted,
                placed on hold, sent to production, shipped or cancelled.
            </li>
        </ul>
    </div>
)

/////
const oAuth20SendingRequest = () => (
    <div className="request pt-3">

        <p>Our web services include Order Placement, Cancel Order and Redo Order Placement. All these services require a
            valid Access Token. Access Tokens are generated by submitting a POST request with user credentials to the
            URL mentioned in "Where to Send Your Post Request" section.</p>

    </div>
)

const oAuth20RequestData = () => (
    <div className="request pt-3">

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
            </tbody>
        </Table>
        <br></br>

    </div>
)

const oAuth20WhereToSendYourPostRequest = () => (
    <div className="request pt-3">

        <p className="request-url p-2">https://jondohd.com/jondoApi/generateToken.php</p>
        <br></br>

    </div>
)

const oAuth20Response = () => (
    <div className="request pt-3">

        <p>Once a valid access token has been obtained, we recommend you store it in a safe place and begin using it for
            placing, cancelling, or resubmitting orders by sending it in the header as a bearer token shown below.</p>
        <p>Example:</p>
        <p>Authorization: Bearer 9b238596775fe9956f655d24a23693abb10ad411</p>
        <p>Please note that your access token will be expired within one hour.</p>

    </div>
)

const oAuth20ResponseData = () => (
    <div className="request pt-3">

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>access_token</td>
                    <td>String (256)</td>
                    <td>Access Token string is used in header while submitting any request to the API</td>
                </tr>
                <tr>
                    <td>expires_in</td>
                    <td>Number (5)</td>
                    <td>Seconds value that represents the lifespan of the access token. Please note that expired token
                        cannot be used for placing any requests.
                    </td>
                </tr>
                <tr>
                    <td>token_type</td>
                    <td>String (32)</td>
                    <td>Bearer token type</td>
                </tr>
            </tbody>
        </Table>
    </div>
)


//////
const createSendingRequest = () => (
    <div className="request pt-3">
        {/*
	  <p>Simply passing a name/value pair is all that is required to create an order, weâ€™ll handle everything else.  This method is just like doing a form POST where the name would be â€œxmlâ€ and the value would be the free form XML in a string data type.</p>
	 */}
        <p>Simply passing the request XML in the body, we’ll handle everything else.</p>
        <p>Preparing your post request is easy. Exactly how you transmit your post data depends on the programming
            language you use. For PHP, cURL is a popular choice. In ASP.Net, there is a WebRequest class.</p>

        <p>Since Jondo's production process is extremely automated, we require that all our customers submit print-ready
            images to our API.</p>
        <p>Print ready images are images that <b className="color-red">must match exactly</b> with our given product
            specs in terms of final image size and DPI. Final image size is calculated based on Face Size + Bleed (if
            applicable) and DPI is validated based on the given DPI range.</p>
        <p>Final image size is found under the <b>X"+</b> and <b>Y"+</b> columns and DPI is found under the <b>DPI
            Range</b> column. For more information on our product specs and data columns please check under the Catalog
            -> Products page.</p>
        <p><b>Example (Face Size: 12" x 16" Canvas):</b></p>
        <p>With 1.5" Bleed: Final Size (Print Ready Size) = 15" x 19" Canvas</p>
        <p>To ensure a quick and quality print of your product(s), please follow the required product specs when
            submitting your order(s). Any order that does <b>NOT</b> include print-ready images will be rejected.</p>

        <p>Below is a sample of the xml value:</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCreate}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'850px'}
        />
        <br></br>

    </div>
)

const createRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>thirdPartyId</td>
                    <td>Number (15)</td>
                    <td>A reference number to identify the order on your side. This could be your Order Id.</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>billingIsReturnAddress</td>
                    <td>Enum (Y,N)</td>
                    <td>Set this to Y to use Company name as Return Company Name on the shipping label</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>companyName</td>
                    <td>String (75)</td>
                    <td>Return Company Name - will be printed on Shipping Label</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>custLogo</td>
                    <td>String (255)</td>
                    <td>Dynamic custom logo printed on the back of the product that can be changed order to order</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>firstName</td>
                    <td>String (80)</td>
                    <td>The ship-to first name</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>lastName</td>
                    <td>String (60)</td>
                    <td>The ship-to last name</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>company</td>
                    <td>String (60)</td>
                    <td>The ship-to company name</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>address</td>
                    <td>String (128)</td>
                    <td>The ship-to address (e.g. 123 Fake St.)</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>address2</td>
                    <td>String (128)</td>
                    <td>The ship-to address line 2 (e.g. Near fake lane)</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>aptNumber</td>
                    <td>String (12)</td>
                    <td>The ship-to apartment number or suite number</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>city</td>
                    <td>String (60)</td>
                    <td>The ship-to city or town</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>state</td>
                    <td>String (50)</td>
                    <td>The ship-to state, region, or province. Some countries do not require a state.</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>String (2)</td>
                    <td>The ship-to country (If blank defaults to US, any specified country must be the 2 character code
                        defined by ISO 3166-1 alpha-2)
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>zip</td>
                    <td>String (20)</td>
                    <td>The ship-to zip code, some countries do not require a zip. If the request is for an address that
                        does not require a zip, an error response will be returned
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>urbanizationCode</td>
                    <td>String (30)</td>
                    <td>Required mostly for some of the Puerto Rico addresses.</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>phoneNumber</td>
                    <td>String (20)</td>
                    <td>The ship-to phone number. This is required for shipping purposes.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>email</td>
                    <td>String (70)</td>
                    <td>The ship-to email address</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>shippingType</td>
                    <td>String (20)</td>
                    <td>Specifies the shipping service for an order. Values are:
                        <p></p>
                        <p>
                            &bull;    "Basic" – estimated transit of 5-7 business days.
                        </p>
                        <p>
                            &bull;    "Premium" – guaranteed transit of 2 business days.
                        </p>
                        <p>
                            &bull;    "Premium Plus" – guaranteed transit of 1 business day.
                        </p>
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>A reference number that appears on the order and identifies the order. It is highly recommended to
                        use an order number that the recipient will recognize. PO numbers must be unique per order, or an
                        error response will be returned. Character limit for a valid poNumber is 50 characters.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>packingSlip</td>
                    <td>Text</td>
                    <td>A custom, branded color Packing Slip with 1 image on the front and 1 image on the back. Image URLs
                        should be provided for the 2 images. If left blank, a generic packing slip will be produced. Set the
                        template tag to 1 to use the templated packing slip. Refer to the premium branding documentation for
                        image specifications.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>insertCard</td>
                    <td>Text</td>
                    <td>A custom, branded color Insert Card with 1 image on the front and 1 image on the back. Image URLs
                        should be provided for the 2 images. If left blank, an insert cart will not be produced. Refer to
                        the premium branding documentation for image specifications.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>sticker</td>
                    <td>Text</td>
                    <td>A custom, branded color Sticker with 1 image on 1 page. Image URL should be provided for the image.
                        If left blank a sticker will not be produced. Refer to the premium branding documentation for image
                        specifications.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>qt</td>
                    <td>Number (5)</td>
                    <td>Quantity value corresponding to each product code</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Decimal(9,2)</td>
                    <td>Identifies the item ordered. Products codes will be provided separately from this document.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>retailPrice</td>
                    <td>Decimal(9,2)</td>
                    <td>Retail price of each product offered by the Customer/Client. Example: if a product costing $5 is
                        ordered with qt 2 in a single orderItem node, a retailPrice node should have a unit price for single
                        product i.e. $5. This price will be used on Commercial Invoices for International Shipments.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>itemNumber</td>
                    <td>String (50)</td>
                    <td>Reference number that identifies the item in the request XML. Item numbers must be unique per item
                        node within an order or an error response will be returned. These item numbers can be used later to
                        identify a specific item on an order you would like to cancel.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>coverSheet</td>
                    <td>String (255)</td>
                    <td>A custom branded color Cover Sheet with 1 background image on 1 page. This is available only for
                        certain products like Photobook, Photoprints, etc. Image URL should be provided for the image. If
                        left blank, there will be no background image for the cover sheet. Refer to the premium branding
                        documentation for image specifications.
                    </td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>imageLocations</td>
                    <td>Text</td>
                    <td>File locations as an HTTP URL:
                        <p></p>
                        <p>
                            http://www.example.com/images/123.jpg.
                        </p>
                        <p>
                            URLs should follow these guidelines:
                        </p>
                        <p>
                            1. Only one HTTP or HTTPS tag in the string.
                        </p>
                        <p>
                            2. No redirects.
                        </p>
                        <p>
                            3. The URL ends with a file extension.
                        </p>
                        <p>
                            4. Images oriented with top of content as top of file.
                        </p>
                        <p>
                            Products like Photobook, Photoprints, etc. would require multiple imageLocations.
                        </p>
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>testMode</td>
                    <td>Number (1)</td>
                    <td>This is only relevant once your account has completed the integration process and is in a LIVE
                        state. Set
                        this to "1" to flag an order as a test order. A test order will not be charged or produced. Set this
                        to "0" to
                        flag an order as LIVE order. A LIVE order will be produced, shipped, and billed.
                    </td>
                    <td>N</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const createWhereToSendYourPostReuqest = () => (
    <div className="request pt-3">
        <br></br>
        <p>When you are ready to send to our testing environment transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CREATE_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const createResponse = () => (
    <div className="request pt-3">
        <br></br>
        <p>The response is a XML String which needs to be parsed by the recipient.</p>
        <p>Below is a sample of xml where the Order Request has succeeded:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCreateResp}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'215px'}
        />
        <br></br>
        <p>When the Order Request succeeds, the code field contains the actual Order Id of the order requested. If the
            Order Request fails the code field will contain a particular error code.</p>
        <p>Below is a sample of xml where the Order Request has failed:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCreateRespError}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'250px'}
        />
        <br></br>
    </div>
)

const createResponseData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>Code can either be the error code or the Order Id depending on failure or success.</td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code.</td>
                </tr>
                <tr>
                    <td>timestamp</td>
                    <td>Timestamp (ISO-8601 format)</td>
                    <td>Timestamp is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our
                        facility. When in error, value given is NA
                    </td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>Reference number that appears on the order and identifies the order.</td>
                </tr>
                <tr>
                    <td>city</td>
                    <td>String (40)</td>
                    <td>City of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>zip</td>
                    <td>String (15)</td>
                    <td>Zipcode of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>state</td>
                    <td>String (40)</td>
                    <td>State of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>String (20)</td>
                    <td>Country of the fulfillment location the order will be shipped from.</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const createErrorCodes = () => (
    <div>
        <b className="errCodes">
            If your Request failed, you should see one of the following error codes
            in the Response XML. Please fix the error reported and resubmit your
            order.</b>
        <br></br>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01</td>
                    <td>Cannot log in. Invalid user or password.</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Street Address missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: City missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: State missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Zip Code missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Phone Number missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: State Invalid!</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Zip Code Invalid!</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Country Code Invalid!</td>
                </tr>
                <tr>
                    <td>03</td>
                    <td>Incomplete Billing Address: Company name missing</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Shipping Type Missing</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Invalid Shipping Type!</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Shipping type given is not allowed for countryCode: [countryCode]</td>
                </tr>
                <tr>
                    <td>05</td>
                    <td>Invalid PO Number: Already Exists</td>
                </tr>
                <tr>
                    <td>05</td>
                    <td>Invalid PO Number: Missing</td>
                </tr>
                <tr>
                    <td>06</td>
                    <td>Quantity must be greater than 0</td>
                </tr>
                <tr>
                    <td>07</td>
                    <td>Product Code Error: Value can't be NULL</td>
                </tr>
                <tr>
                    <td>07</td>
                    <td>Product Code Error: Invalid Product Code</td>
                </tr>
                <tr>
                    <td>07</td>
                    <td>Product Code Error: Order Items Missing</td>
                </tr>
                <tr>
                    <td>08</td>
                    <td>Image Location Error: Value can't be NULL</td>
                </tr>
                <tr>
                    <td>08</td>
                    <td>Image Location Error: Invalid URL</td>
                </tr>
                <tr>
                    <td>08</td>
                    <td>Image Location Error: DPI out of range</td>
                </tr>
                <tr>
                    <td>08</td>
                    <td>Image Location Error: Invalid Aspect Ratio</td>
                </tr>
                <tr>
                    <td>08</td>
                    <td>Image Location Error: Incorrect number of Image Location</td>
                </tr>
                <tr>
                    <td>09</td>
                    <td>Unknown Error Occurred</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>API Under Maintenance! Please try after a while...</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for frontImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for backImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for frontImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for backImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for frontImage of sticker</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid URL for frontImage of coversheet in orderItems tag</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Value can't be NULL for frontImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Value can't be NULL for backImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Value can't be NULL for frontImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Value can't be NULL for backImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Value can't be NULL for frontImage of coverSheet in orderItems tag</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: DPI out of range for frontImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: DPI out of range for backImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: DPI out of range for frontImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: DPI out of range for backImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: DPI out of range for frontImage of coverSheet in orderItems tag</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of packingSlip</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid Aspect Ratio for backImage of insertCard</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Branding Image Error: Invalid Aspect Ratio for frontImage of coverSheet in orderItems tag</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>Retail Price Error: Value can't be NULL for an International Order</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>Duplicate Item Number: Item number used in another node, it should be unique per item node</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>Duplicate Order Items: Order Items used in another node, only one Order Items node allowed</td>
                </tr>
                <tr>
                    <td>14</td>
                    <td>Your account is disabled, due to non-payment. To arrange payment, please contact
                        accountsreceivable@jondo.com
                    </td>
                </tr>
                <tr>
                    <td>15</td>
                    <td>Redo comment error: Missing redo comment</td>
                </tr>
                <tr>
                    <td>16</td>
                    <td>Redo code error: Missing redo code</td>
                </tr>
                <tr>
                    <td>16</td>
                    <td>Redo code error: Invalid redo code</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>Invalid PO Box: PO Boxes are not supported for Shipping Type/Destination</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const createImageFileRequirements = () => (
    <div className="request pt-3">
        <ul>
            <li>Images must be either in a JPEG or PNG format.</li>
            <li>JPEGs should be saved with maximum image quality and minimum compression (i.e.: no sub sampling,
                etc.).
            </li>
            <li>JPEGs must be saved in the RGB color space or mode. All files will be assessed in the sRGB IEC61966-2.1
                color space. If a JPEG is submitted in another color space, the RGB color profile for the image will be
                referenced.
            </li>
            <li>All images provided must comply with the specs (X"+, Y"+, DPI Range columns) defined in the products
                sheet. Products sheet can be exported to excel from <Link to="/orders/skus"
                                                                          className="link text-nowrap"> here</Link></li>
            <li>The image files provided must be made available for a minimum of 7 days after the order is placed.</li>
            <li>The image provided should be oriented so that the image top is top, bottom is bottom, left is left and
                right is right. In short, the image orientation should be submitted exactly (without any rotation) as a
                customer would hang it on their wall.
            </li>
            <li>Image Units should be either PixelsPerCentimeter or PixelsPerInches. Undefined Units is not allowed.
            </li>
            <li>We highly recommend images sent for print be saved in the RGB color space or mode rather than CMYK. The
                ICC profile embedded in a file for print will be referenced throughout the production process. In the
                absence of an ICC profile, a RGB image will reference "sRGB IEC61966-2.1" and a CMYK image will
                reference "US Web Coated (SWOP) v2".
            </li>
            <li>Note that X and Y are arbitrary.</li>

        </ul>
    </div>
)


//////////////
const cancelRequest = () => (
    <div className="request pt-3">
        <br></br>
        {/*
	<p>Just like order request, cancel order request can be submitted by passing a name/value pair to cancel an order. This method is like doing a form post where the name would be "xml" and the value would be the "xml string".</p>
    */}
        <p>Just like order request, for cancel order pass the request XML in the body, we’ll handle everything else.</p>
        <p>Below is a sample of the xml value:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancel}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'120px'}
        />
        <br></br>

    </div>
)

const cancelRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <p>Below is a table of XML fields that must be transmitted with every cancel order request. These fields include
            all basic information required to cancel the order, so failing to transmit these fields will result in an
            error, unless the field is marked as optional.</p>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>Reference number that appears on an order and identifies the order. It is highly recommended to use
                        an order number that the recipient will recognize. PO numbers must be unique per order, or an error
                        response will be returned. Character limit for poNumber is 50 characters.
                    </td>
                    <td>Y</td>
                </tr>
            </tbody>
        </Table>

    </div>
)

const cancelWhereToSendYourPostReuqest = () => (
    <div className="request pt-3">
        <br></br>
        <p>For testing purposes, transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const cancelResponse = () => (
    <div className="request pt-3">
        <br></br>
        <p>Below is a sample XML where the Cancel Order Request succeeded:</p>
        <p>Order was cancelled before the production started.</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelRespBefore}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'120px'}
        />
        <br></br>
        <p>Order was cancelled after the production started.</p>


        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelRespAfter}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'120px'}
        />
        <br></br>
        <p>If the Cancel Order Request failed, the code field will contain an error code that corresponds to the error
            message.</p>
        <p>Below is a sample of xml where the Cancel Order Request has failed:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelRespError}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'130px'}
        />
        <br></br>

    </div>
)

const cancelResponseData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>If successful, code returns 0. If false, code will return a number corresponding to the type of
                        error. All Error Codes and their corresponding description can be viewed on the next page.
                    </td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code. In case of success, value would be either “Cancelled Before
                        Production Commenced” if an order gets cancelled before entering production or “Cancelled After
                        Production Commenced” if an order gets cancelled after the production has started. Once the order
                        enters production it becomes billable. Hence its advisable to look up the status of the order before
                        cancelling it.
                    </td>
                </tr>
                <tr>
                    <td>date</td>
                    <td>Date (ISO-8601 format)</td>
                    <td>Date is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our
                        facility. When in error, value given is NA
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const cancelErrorCodes = () => (
    <div>
        <b className="errCodes">
            If your Request failed, you should see one of the following error codes
            in the Response XML. Please fix the error reported and resubmit your
            order.</b>
        <br></br>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>6</td>
                    <td>Connection error</td>
                </tr>
                <tr>
                    <td>100</td>
                    <td>Login Error. Invalid userId or apiKey.</td>
                </tr>
                <tr>
                    <td>201</td>
                    <td>Order does not exist</td>
                </tr>
                <tr>
                    <td>202</td>
                    <td>Order is Complete! Order cannot be cancelled</td>
                </tr>
                <tr>
                    <td>203</td>
                    <td>Order is already cancelled</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const cancelItemRequest = () => (
    <div className="request pt-3">
        <br></br>
        {/*
	<p>Just like a cancel order request, the cancel item request can be submitted by passing a name/value pair to cancel items on the order. This method is like doing a form post where the name would be "xml" and the value would be the "xml string".</p>
    */}
        <p>Just like a cancel order request, for cancel item pass the request XML in the body, we’ll handle everything
            else.</p>
        <p>Below is a sample of the xml value:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelItem}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'250px'}
        />
        <br></br>

    </div>
)

const cancelItemRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>Reference number that appears on an order and identifies the order. It is highly recommended to use
                        an order number that the recipient will recognize. PO numbers must be unique per order, or an error
                        response will be returned. Character limit for poNumber is 50 characters.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>itemNumber</td>
                    <td>String (50)</td>
                    <td>The reference number that identifies the item in the order & cancel item request XML. Item numbers
                        must be unique per item node within an order or an error response will be returned. These item
                        numbers can be used to identify a specific item on an order you would like to cancel.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>qt</td>
                    <td>Number (5)</td>
                    <td>Represents the item amount to be cancelled.</td>
                    <td>Y</td>
                </tr>
            </tbody>
        </Table>

    </div>
)

const cancelItemWhereToSendYourPostReuqest = () => (
    <div className="request pt-3">
        <br></br>
        <p>For testing purposes, transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_CANCEL_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const cancelItemResponse = () => (
    <div className="request pt-3">
        <br></br>
        <p>The response is a XML String which needs to be parsed by the recipient.</p>
        <p>Below is a sample XML where the Cancel Item Request succeeded:</p>
        <p>Referring to the Cancel Item Request submitted in the Cancel Item Request section, the itemNumber 457896 with
            qt 2, was requested to be cancelled. However, since only one of the two was in production, the itemNumber
            was mentioned twice in the following response because both quantities have a separate message values.</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelItemResp}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'440px'}
        />
        <br></br>

        <p>If the Cancel Item Request failed, the code field will contain an error code that corresponds to the error
            message.</p>
        <p>Below is a sample XML of a failed Cancel Item Request:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelItemRespError}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'130px'}
        />
        <br></br>

        <p>Sample of xml where a partial Cancel Item Request has failed and a partial succeeded:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelItemRespPartial}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'330px'}
        />
        <br></br>

    </div>
)

const cancelItemResponseData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>If successful, code returns 0. If false, code will return a number corresponding to the type of
                        error. All Error Codes and its description can be viewed on the next page.
                    </td>
                </tr>
                <tr>
                    <td>date</td>
                    <td>Date (ISO-8601 format)</td>
                    <td>Date is of ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our
                        facility. When in error, value given is NA
                    </td>
                </tr>
                <tr>
                    <td>itemNumber</td>
                    <td>String (50)</td>
                    <td>Unique reference number provided by you when submitting an order. This number is used to identify
                        the item that you wish to cancel.
                    </td>
                </tr>
                <tr>
                    <td>qt</td>
                    <td>Number (5)</td>
                    <td>Represents the item amount to be cancelled.</td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code. In case of success, value would be either “Cancelled Before
                        Production Commenced” if an order gets cancelled before entering production or “Cancelled After
                        Production Commenced” if an order gets cancelled after the production has started. Once the order
                        enters production it becomes billable. Hence its advisable to look up the status of the order before
                        cancelling it.
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const cancelItemErrorCodes = () => (
    <div>
        <b className="errCodes">
            If your Request failed, you should see one of the following error codes
            in the Response XML. Please fix the error reported and resubmit your
            order.</b>
        <br></br>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>204</td>
                    <td>Item does not exist</td>
                </tr>
                <tr>
                    <td>205</td>
                    <td>Order is Complete! Item cannot be cancelled</td>
                </tr>
                <tr>
                    <td>206</td>
                    <td>Item is already cancelled</td>
                </tr>
                <tr>
                    <td>207</td>
                    <td>Invalid Item Quantity</td>
                </tr>
                <tr>
                    <td>208</td>
                    <td>Item cancellation is not allowed in this location</td>
                </tr>
            </tbody>
        </Table>
    </div>
)


/////
const redoRequest = () => (
    <div className="request pt-3">
        <br></br>
        {/*
	<p>Just like order request, redo order request can be submitted by passing a name/value pair. This method is like doing a form post where the name would be "xml" and the value would be the "xml string". We currently provide two versions of redo order.</p>
    */}
        <p>Just like order request, for redo order pass the request XML in the body, we’ll handle everything else.</p>
        <p><strong>NOTE 1:</strong> To place a redo, an order must have been created in our system first (see Order Placement step).</p>
        <p><strong>NOTE 2:</strong> Redo order testing should always be against TEST orders instead of LIVE orders. A redo placed against a LIVE order will result in a LIVE redo order which will be produced, shipped, and billed.</p>
        <h5><b>AS-IS</b></h5>
        <p>Redo orders that are AS-IS require no changes as the order needs to be made again in its entirely with no
            updated address or shipping method. In other words, the redo order will be remade exactly the same as the
            original order.</p>
        <p>Below is a sample of the xml value when redo order needs to be submitted <strong>AS-IS:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlRedoAsIs}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
        <br></br>

        <h5><b>WITH-CHANGES</b></h5>
        <p>Redo orders that are WITH-CHANGES require changes and is similar to submitting a create order request. Redo
            order changes include new images, quantity of items, change in address, etc. The only difference between
            this and a new order request is the order created via the Redo Order request will be tied to the original
            order for reference reasons.</p>
        <p>Below is a sample of xml value when redo order needs to be submitted <strong>WITH-CHANGES:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlRedoWithChanges}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'820px'}
        />
        <br></br>


    </div>
)

const redoRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <p>Below is a table of XML fields that must be transmitted with every redo order request. These fields include
            all basic information required to redo an order. Failing to transmit all required fields will result in an
            error.</p>

        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>Reference number that appears on the order and identifies the order. It is highly recommended to use
                        an order number that the recipient will recognize. PO numbers must be unique per order, or an error
                        response will be returned. Character limit for a valid poNumber is 50 characters.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>redoCode</td>
                    <td>Number (3)</td>
                    <td>Code to determine why you need to resubmit the order.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>redoComment</td>
                    <td>Text</td>
                    <td>Short comment for additional context about why a redo order was submitted (image was too dark,
                        incorrect address, etc.). Note that this is different from the Message column on the table shown in
                        the Error Codes page. Also note instructions placed here will not be followed, this field is just
                        for reference. Any changes need should be specified in the request itself via other fields.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>changesRequired</td>
                    <td>Enum (Y,N)</td>
                    <td>Used to validate redo orders WITH-CHANGES. Any other value submitted for this flag will be
                        considered as an AS-IS redo order.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td colSpan="4"><strong>All the other tags are just the same as order request.</strong></td>

                </tr>
            </tbody>
        </Table>

    </div>
)

const redoCodesAndTheirDescription = () => (
    <div>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2</td>
                    <td>Incorrect Qty Received</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Incorrect Order Received</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Customer Request</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Customer Updated Image</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Customer Update Text</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Order Didn't Arrive</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Product Damage</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>Quality Concern</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Shipping Damage</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Other</td>
                </tr>

            </tbody>
        </Table>
    </div>
)

const redoWhereToSendYourPostRequest = () => (
    <div className="request pt-3">
        <br></br>
        <p>For testing purposes, transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_JONDO_API + process.env.REACT_APP_REDO_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const redoResponse = () => (
    <div className="request pt-3">
        <br></br>
        <p>The response is a XML String which needs to be parsed by the recipient.</p>
        <p>Below is a sample of xml where the Order Request has succeeded:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlRedoResp}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'180px'}
        />
        <br></br>

        <p>When the Order Request succeeds, the code field contains the actual Order Id of the order requested. If the
            Order Request fails the code field will contain a particular error code.</p>

        <p>Below is a sample of xml where the Order Request has failed:</p>

        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlRedoRespError}
            editorProps={{$blockScrolling: true}}
            width={'500px'}
            height={'220px'}
        />
        <br></br>

    </div>
)
/*
const redoResponseDataAndErrorCodes = () => (

  <div className="request pt-3">
    <br></br>
    <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className = "width100" >Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>Code can either be the error code or the order ID depending on failure or success.</td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code.</td>
                </tr>
                <tr>
                    <td>city</td>
                    <td>String (40)</td>
                    <td>Zipcode of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>zip</td>
                    <td>String (15)</td>
                    <td>Zipcode of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>state</td>
                    <td>String (40)</td>
                    <td>State of the fulfillment location the order will be shipped from.</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>String (20)</td>
                    <td>Country of the fulfillment location the order will be shipped from.</td>
                </tr>
            </tbody>
        </Table>
  </div>

)
*/

////////////////////
const statusSampleStatusUpdatePayloads = () => (
    <div className="request pt-3">

        <p>Any time an order's status changes our system will send the status update to the client. We will be using
            POST method to send the following XML payloads to a URL that client provided us. Please note that Shipped
            status update provides the item level details and the other status updates are on the order level.</p>

        <ul>
            <li>Accepted - Image validation has passed and the order is accepted for production</li>
            <li>Rejected - Image validation has failed and the order has been removed from the system. Images should be
                fixed and the order should be sent again.
            </li>
            <li>On Hold - Order is held in production due to some issue</li>
            <li>Processing - Order is in production</li>
            <li>Shipped - Order is shipped</li>
            <li>Cancelled - Order is cancelled due to customer's request</li>
        </ul>

        <p><b>Sample Payloads</b></p>
        <p>Rejected (in Image Validation process)</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlRejected}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'150px'}
        />
        <br></br>

        <p>Accepted</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlAccepted}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'150px'}
        />
        <br></br>

        <p>On Hold</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlOnHold}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'140px'}
        />
        <br></br>

        <p>Processing</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlProcessing}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'135px'}
        />
        <br></br>
        {/*
    <p>Shipped</p>
    <AceEditor
      className="response-editor"
      mode="javascript"
      theme="monokai"
      showGutter={false}
      setOptions={{
          showLineNumbers: false
      }}
      readOnly={true}
      value={xmlShipped}
      editorProps={{ $blockScrolling: true }}
      width={'500px'}
      height={'230px'}
    />
    <br></br>
    */}

        <p>Shipped</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlShippedItemized}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'340px'}
        />
        <br></br>

        <p>Cancelled (by Customer / Location)</p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlCancelled}
            editorProps={{$blockScrolling: true}}
            width={'550px'}
            height={'145px'}
        />
        <br></br>

        {/*
    <p>Cancelled (by Customer / Location)</p>
    <AceEditor
      className="response-editor"
      mode="javascript"
      theme="monokai"
      showGutter={false}
      setOptions={{
          showLineNumbers: false
      }}
      readOnly={true}
      value={xmlCancelledByCustomer}
      editorProps={{ $blockScrolling: true }}
      width={'500px'}
      height={'210px'}
    />
    <br></br>
    */}
        <h5><b>Post Data</b></h5>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and can be used in conjunction with the apiKey to
                        authenticate (optional).
                    </td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and can be used in conjunction with the userID to authenticate
                        (optional).
                    </td>
                </tr>
                <tr>
                    <td>poNumber</td>
                    <td>String (50)</td>
                    <td>The purchase Order number you originally submitted with your order.</td>
                </tr>
                <tr>
                    <td>orderId</td>
                    <td>Number (12)</td>
                    <td>The unique Order Id# in the synergize system, returned after every successful order is placed</td>
                </tr>
                <tr>
                    <td>trackingUrl</td>
                    <td>Text</td>
                    <td>Tracking link that can be used to track the package</td>
                </tr>
                <tr>
                    <td>trackingUrlSecondary</td>
                    <td>Text</td>
                    <td>Tracking link that can be used to track the package</td>
                </tr>
                <tr>
                    <td>tracking</td>
                    <td>Text</td>
                    <td>A pipe delimited list of tracking numbers used to ship the order. Normally, there will only be one
                        tracking number.
                    </td>
                </tr>
                <tr>
                    <td>trackingSecondary</td>
                    <td>Text</td>
                    <td>Secondary tracking number will be populated in this field when an original carrier uses secondary
                        carrier for delivery
                    </td>
                </tr>
                <tr>
                    <td>carrier</td>
                    <td>String (20)</td>
                    <td>Carrier the order was shipped with.</td>
                </tr>
                <tr>
                    <td>carrierSecondary</td>
                    <td>String (20)</td>
                    <td>Secondary carrier will be populated in this field when an original carrier uses secondary carrier
                        for delivery
                    </td>
                </tr>
                <tr>
                    <td>packages/package/carrier</td>
                    <td>String (20)</td>
                    <td>Carrier the item was shipped with.</td>
                </tr>
                <tr>
                    <td>packages/package/tracking</td>
                    <td>Text</td>
                    <td>Tracking number will be populated in this field.</td>
                </tr>
                <tr>
                    <td>packages/package/trackingUrl</td>
                    <td>Text</td>
                    <td>Tracking link that can be used to track the package</td>
                </tr>
                <tr>
                    <td>packages/package/carrierSecondary</td>
                    <td>String (20)</td>
                    <td>Carrier the item was shipped with.</td>
                </tr>
                <tr>
                    <td>packages/package/trackingSecondary</td>
                    <td>Text</td>
                    <td>Tracking number will be populated in this field.</td>
                </tr>
                <tr>
                    <td>packages/package/trackingUrlSecondary</td>
                    <td>Text</td>
                    <td>Tracking link that can be used to track the package</td>
                </tr>
                <tr>
                    <td>packages/package/items/itemNumber</td>
                    <td>String (50)</td>
                    <td>This is the exact value that represents the itemNumber we received from you in the order request
                        XML.
                    </td>
                </tr>
                <tr>
                    <td>status</td>
                    <td>String (20)</td>
                    <td>Indicates whether the order is “Accepted”, "Rejected", “On Hold”, “Processing”, “Shipped”, or
                        “Cancelled”.<br></br>
                        <strong>NOTE:</strong> For “Cancelled” statuses, orders cancelled before production started won’t be
                        billed and will have the [tracking] as “Cancelled Before Production Commenced”. Orders cancelled
                        after production started will be billed and will have the [tracking] as “Cancelled After Production
                        Commenced”.
                    </td>
                </tr>
                <tr>
                    <td>statusMessage</td>
                    <td>Text</td>
                    <td>Reason for placing the order on hold. Ex: Address Issue</td>
                </tr>
                <tr>
                    <td>statusDate</td>
                    <td>Date (ISO-8601 format)</td>
                    <td>Date is of ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was shipped /
                        cancelled from our facility. When in error, value given is NA.
                    </td>
                </tr>
            </tbody>
        </Table>
        {/*<p>*These fields are only applicable if your endpoint is capable of accepting the XML payload for Shipped status</p>*/}
    </div>
)

const statusUpdateAcknowledgement = () => (
    <div className="request pt-3">
        <br></br>

        <p>To ensure that status updates are successfully received, responses to any status update post will be
            monitored.</p>
        <p>HTTP Response – only the HTTP response code will be monitored. Any response code other than 200 will be
            considered as a failure and status updates will be retried. If a retry is not needed please respond with a
            HTTP 200.</p>
        <p>If no response is recorded within 60 seconds, the status update attempt will be treated as a failure.</p>
        <p>Failures will be re-attempted thrice before it is escalated via email.</p>
        <p>To utilize the ship notifications, please provide a URL to post this data to.</p>

    </div>
)

////
const support = () => (
    <div>
        <br></br>
        If you have any questions, comments, or concerns, please contact us by e-mail
        at <strong>apiSupport@jondo.com</strong>
    </div>
)

/*
 * Huynh - 08/19/2021
 * https://app.clickup.com/t/9mjank
 */

/////--- Update Order -> Shipping type --- /////

const updateOrderShippingTypeIntro = () => (
    <div className="request pt-3">
        <br></br>
        <p>Update Order - Shipping type Introduction here text here.</p>
    </div>
)

const updateOrderShippingTypeRequest = () => (
    <div className="request pt-3">
        <br></br>
        <p>Just like order request, for update shipping type pass the request XML in the body, we’ll handle everything
            else.</p>
        <h5><b>Request</b></h5>
        <p>Sample XML <strong>REQUEST:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlShippingType}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
    </div>
)

const updateOrderShippingTypeRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>orderId</td>
                    <td>String (20)</td>
                    <td>Unique Order Id passed by Jondo in the Order Placement response. This unique id will help us identify the exact order to be updated.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>shippingType</td>
                    <td>String (20)</td>
                    <td>Specifies the shipping service for an order. Values are:
                        <p></p>
                        <p>
                            &bull;    "Basic" – estimated transit of 5-7 business days.
                        </p>
                        <p>
                            &bull;    "Premium" – guaranteed transit of 2 business days.
                        </p>
                        <p>
                            &bull;    "Premium Plus" – guaranteed transit of 1 business day.
                        </p>
                    </td>
                    <td>Y</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const updateOrderShippingTypeRequestWhereToSendRequest = () => (
    <div className="request pt-3">
        <br></br>
        <p>For testing purposes, transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_JONDO_API + process.env.REACT_APP_UPDATE_SHIPPING_TYPE_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const updateOrderShippingTypeResponseData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>Code can either be the error code or the Order Id depending on failure or success.</td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code.</td>
                </tr>
                <tr>
                    <td>timestamp</td>
                    <td>Timestamp (ISO-8601 format)</td>
                    <td>Timestamp is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our
                        facility. When in error, value given is NA.
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const updateOrderShippingTypeResponse = () => (
    <div className="request pt-3">
        <br></br>
        <h5><b>Success</b></h5>
        <p>Below is a sample XML where Update Shipping Type Request succeeded:</p>
        <p>Sample XML <strong>SUCCESS:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlShippingTypeResp}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
        <br></br>

        <h5><b>Error</b></h5>
        <p>Below is a sample of xml where Update Shipping Type Request has failed:.</p>
        <p>Sample XML <strong>ERROR:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlShippingTypeRespError}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
        <br></br>

    </div>
)

const updateOrderShippingTypeResponseErrorCodes = () => (
    <div className="request pt-3">
        <br></br>
        <b className="errCodes">
            If your Request failed, you should see one of the following error codes
            in the Response XML. Please fix the error reported and resubmit your request.
        </b>
        <br></br>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01</td>
                    <td>Cannot log in. Invalid user or password</td>
                </tr>
                <tr>
                    <td>01</td>
                    <td>Cannot log in. User is disabled</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Shipping Type Missing</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Invalid Shipping Type</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Error while updating</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Requested shipping type already exists in the order, no update is needed</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Shipping type given is not allowed for countryCode: XX</td>
                </tr>
                <tr>
                    <td>18</td>
                    <td>Order Id Error: Invalid Order Id</td>
                </tr>
                <tr>
                    <td>18</td>
                    <td>Order Id Error: Order Id Missing</td>
                </tr>
                <tr>
                    <td>202</td>
                    <td>Order Error: Order is already completed</td>
                </tr>
                <tr>
                    <td>203</td>
                    <td>Order Error: Order is already deleted / cancelled</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

/////--- Update Order -> Shipping Address --- /////

const updateOrderShippingAddressIntro = () => (
    <div className="request pt-3">
        <br></br>
        <p>Update Order - Shipping Address Introduction here text here.</p>
    </div>
)

const updateOrderShippingAddressRequest = () => (
    <div className="request pt-3">
        <br></br>
        <p>Just like order request, for update shipping address pass the request XML in the body, we’ll handle
            everything else.</p>
        <h5><b>Request</b></h5>
        <p>Sample XML <strong>REQUEST:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlUpdateAddress}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'280px'}
        />
    </div>
)

const updateOrderShippingAddressRequestData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                    <th>Required?</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>userId</td>
                    <td>Number (5)</td>
                    <td>Your user account ID will be provided to you and must be passed with every request</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>apiKey</td>
                    <td>String (30)</td>
                    <td>Your api key will be provided to you and must be passed with each request so that your identity can
                        be validated
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>orderId</td>
                    <td>String (50)</td>
                    <td>The Order Id is required to validate your order.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>firstName</td>
                    <td>String (80)</td>
                    <td>The ship-to first name (using tag is optional, but if used, tag cannot be empty).</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>lastName</td>
                    <td>String (60)</td>
                    <td>The ship-to last name (using tag is optional, but if used, tag cannot be empty).</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>company</td>
                    <td>String (60)</td>
                    <td>The ship-to company name</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>address</td>
                    <td>String (128)</td>
                    <td>The ship-to address (e.g. 123 Fake St.)</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>address2</td>
                    <td>String (128)</td>
                    <td>The ship-to address line 2 (e.g. Near fake lane)</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>aptNumber</td>
                    <td>String (12)</td>
                    <td>The ship-to apartment number or suite number</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>city</td>
                    <td>String (60)</td>
                    <td>The ship-to city or town</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>state</td>
                    <td>String (50)</td>
                    <td>The ship-to state, region, or province. Some countries do not require a state.</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>zip</td>
                    <td>String (20)</td>
                    <td>The ship-to zip code, some countries do not require a zip. If the request is for an address that
                        does not require a zip, an error response will be returned.
                    </td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>urbanizationCode</td>
                    <td>String (30)</td>
                    <td>Required mostly for some of the Puerto Rico addresses.</td>
                    <td>N</td>
                </tr>
                <tr>
                    <td>country</td>
                    <td>String (2)</td>
                    <td>The ship-to country (country must be the 2 character code defined by ISO 3166-1 alpha-2).</td>
                    <td>Y</td>
                </tr>
                <tr>
                    <td>phoneNumber</td>
                    <td>String (20)</td>
                    <td>The ship-to phone number. This is required for shipping purposes and should be formatted as 123-456-1234 (using tag is optional, but if used, tag cannot be empty).</td>
                    <td>N</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const updateOrderShippingAddressWhereToSendRequest = () => (
    <div className="request pt-3">
        <br></br>
        <p>For testing purposes, transmit your post request to the following URL:</p>

        <p className="request-url p-2">{process.env.REACT_APP_JONDO_API + process.env.REACT_APP_UPDATE_ADDRESS_API}</p>

        <h5 className="pb-2 my-4 border-bottom"><b>Headers</b></h5>

        <Row className="mb-2">
            <Col sm={3}><b>Content-Type</b></Col>
            <Col sm={9}>application/xml</Col>
        </Row>

        <Row>
            <Col sm={3}><b>Authorization</b></Col>
            <Col sm={9}>bearer 47555ddbab1e36c525f0c8ae66039fb9a33954e0</Col>
        </Row>
    </div>
)

const updateOrderShippingAddressResponse = () => (
    <div className="request pt-3">

        <h5><b>Success</b></h5>
        <br></br>
        <p>Below is a sample XML where Update Shipping Address Request succeeded:</p>
        <p>Sample XML <strong>SUCCESS:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlUpdateAddressResp}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
        <br></br>

        <h5><b>Error</b></h5>
        <p>Below is a sample of xml where Update Shipping Address Request has failed:.</p>
        <p>Sample XML <strong>ERROR:</strong></p>
        <AceEditor
            className="response-editor"
            mode="javascript"
            theme="monokai"
            showGutter={false}
            setOptions={{
                showLineNumbers: false
            }}
            readOnly={true}
            value={xmlUpdateAddressRespError}
            editorProps={{$blockScrolling: true}}
            width={'530px'}
            height={'140px'}
        />
        <br></br>
    </div>
)

const updateOrderShippingAddressResponseData = () => (
    <div className="request pt-3">
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Name</th>
                    <th className="width100">Data Type</th>
                    <th>Value Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>status</td>
                    <td>Number (1)</td>
                    <td>Status 0 indicates failure and 1 indicates success.</td>
                </tr>
                <tr>
                    <td>code</td>
                    <td>Number (8)</td>
                    <td>Code can either be the error code or the Order Id depending on failure or success.</td>
                </tr>
                <tr>
                    <td>message</td>
                    <td>Text</td>
                    <td>Message is the description of the code.</td>
                </tr>
                <tr>
                    <td>timestamp</td>
                    <td>Timestamp (ISO-8601 format)</td>
                    <td>Timestamp is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex:
                        2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our
                        facility. When in error, value given is NA.
                    </td>
                </tr>
            </tbody>
        </Table>
    </div>
)

const updateOrderShippingAddressResponseErrorCodes = () => (
    <div className="request pt-3">
        <br></br>
        <b className="errCodes">
            If your Request failed, you should see one of the following error codes
            in the Response XML. Please fix the error reported and resubmit your request.
        </b>
        <br></br>
        <br></br>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>01</td>
                    <td>Cannot log in. Invalid user or password</td>
                </tr>
                <tr>
                    <td>01</td>
                    <td>Cannot log in. User is disabled</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Phone Number Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Street Address Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: City Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: State Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: State Invalid</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Zip Code Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Zip Code Invalid</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Country Missing</td>
                </tr>
                <tr>
                    <td>02</td>
                    <td>Incomplete Shipping Address: Country Code Invalid</td>
                </tr>
                <tr>
                    <td>04</td>
                    <td>Shipping Type Error: Shipping type given is not allowed for countryCode: XX</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>First Name and Last name are missing.</td>
                </tr>
                <tr>
                    <td>17</td>
                    <td>Invalid PO Box: PO Boxes are not supported for Shipping Type/Destination</td>
                </tr>
                <tr>
                    <td>18</td>
                    <td>Order Id Error: Invalid Order Id</td>
                </tr>
                <tr>
                    <td>18</td>
                    <td>Order Id Error: Order Id Missing</td>
                </tr>
                <tr>
                    <td>19</td>
                    <td>Update Error: Production Commenced and order cannot be moved to a new fulfillment location</td>
                </tr>
                <tr>
                    <td>19</td>
                    <td>Update Error: Shipping Address is the same</td>
                </tr>
                <tr>
                    <td>202</td>
                    <td>Order Error: Order is already completed</td>
                </tr>
                <tr>
                    <td>203</td>
                    <td>Order Error: Order is already deleted / cancelled</td>
                </tr>
            </tbody>
        </Table>
    </div>
)

////---------  Rendering ---------

class Document extends Component {

    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {
        let doc, title;

        switch (this.props.id) {
            ////
            case "introduction":
                title = "OAuth 2.0: INTRODUCTION";
                doc = introduction();
                break;

            ////
            case "servicesOffered":
                title = "Services Offered";
                doc = servicesOffered();
                break;

            ////
            case "oAuth20":
                title = "OAuth 2.0: Sending Request";
                doc = oAuth20SendingRequest();
                break;

            case "oAuth20SendingRequest":
                title = "OAuth 2.0: Sending Request";
                doc = oAuth20SendingRequest();
                break;

            case "oAuth20RequestData":
                title = "OAuth 2.0: Request Data";
                doc = oAuth20RequestData();
                break;

            case "oAuth20WhereToSendYourPostRequest":
                title = "OAuth 2.0: Where To Send Your Post Request";
                doc = oAuth20WhereToSendYourPostRequest();
                break;

            case "oAuth20Response":
                title = "OAuth 2.0: Response";
                doc = oAuth20Response();
                break;

            case "oAuth20ResponseData":
                title = "OAuth 2.0: Response Data";
                doc = oAuth20ResponseData();
                break;

            ////
            case "orderPlacement":
                title = "Order Placement: Sending Request";
                doc = createSendingRequest();
                break;

            case "createSendingRequest":
                title = "Order Placement: Sending Request";
                doc = createSendingRequest();
                break;

            case "createRequestData":
                title = "Order Placement: Request Data";
                doc = createRequestData();
                break;

            case "createWhereToSendYourPostReuqest":
                title = "Order Placement: Where to Send Your Post Request";
                doc = createWhereToSendYourPostReuqest();
                break;

            case "createResponse":
                title = "Order Placement: Response";
                doc = createResponse();
                break;

            case "createResponseData":
                title = "Order Placement: Response Data";
                doc = createResponseData();
                break;

            case "createErrorCodes":
                title = "Order Placement: Error Codes";
                doc = createErrorCodes();
                break;

            case "createImageFileRequirements":
                title = "Order Placement: Image File Requirements";
                doc = createImageFileRequirements();
                break;

            ////
            case "cancelOrder":
                title = "Cancel Order / Item: Request";
                doc = cancelRequest();
                break;

            case "cancelRequest":
                title = "Cancel Order / Item: Request";
                doc = cancelRequest();
                break;

            case "cancelRequestData":
                title = "Cancel Order / Item: Request Data";
                doc = cancelRequestData();
                break;

            case "cancelWhereToSendYourPostReuqest":
                title = "Cancel Order / Item: Where to Send Your Post Request";
                doc = cancelWhereToSendYourPostReuqest();
                break;

            case "cancelResponse":
                title = "Cancel Order / Item: Response";
                doc = cancelResponse();
                break;

            case "cancelResponseData":
                title = "Cancel Order / Item: Response Data";
                doc = cancelResponseData();
                break;

            case "cancelErrorCodes":
                title = "Cancel Order / Item: Error Codes";
                doc = cancelErrorCodes();
                break;

            case "cancelItemRequest":
                title = "Cancel Order / Item: Cancel Item Request";
                doc = cancelItemRequest();
                break;

            case "cancelItemRequestData":
                title = "Cancel Order / Item: Cancel Item Request Data";
                doc = cancelItemRequestData();
                break;

            case "cancelItemWhereToSendYourPostReuqest":
                title = "Cancel Order / Item: Where to Send Your Post Request";
                doc = cancelItemWhereToSendYourPostReuqest();
                break;

            case "cancelItemResponse":
                title = "Cancel Order / Item: Cancel Item Response";
                doc = cancelItemResponse();
                break;

            case "cancelItemResponseData":
                title = "Cancel Order / Item: Cancel Item Response Data";
                doc = cancelItemResponseData();
                break;

            case "cancelItemErrorCodes":
                title = "Cancel Order / Item: Error Codes";
                doc = cancelItemErrorCodes();
                break;

            ////
            case "redoOrder":
                title = "Redo Order: Request";
                doc = redoRequest();
                break;

            case "redoRequest":
                title = "Redo Order: Request";
                doc = redoRequest();
                break;

            case "redoRequestData":
                title = "Redo Order: Request Data";
                doc = redoRequestData();
                break;

            case "redoCodesAndTheirDescription":
                title = "Redo Order: Redo Codes and Their Description";
                doc = redoCodesAndTheirDescription();
                break;

            case "redoWhereToSendYourPostRequest":
                title = "Redo Order: Where to Send Your Post Request";
                doc = redoWhereToSendYourPostRequest();
                break;

            case "redoResponse":
                title = "Redo Order: Response";
                doc = redoResponse();
                break;

            case "redoResponseData":
                title = "Redo Order: Response Data";
                doc = createResponseData();
                break;

            case "redoErrorCodes":
                title = "Redo Order: Error Codes";
                doc = createErrorCodes();
                break;

            ////
            case "statusUpdate":
                title = "Status Update: Sample Payloads";
                doc = statusSampleStatusUpdatePayloads();
                break;

            case "statusSampleStatusUpdatePayloads":
                title = "Status Update: Sample Payloads";
                doc = statusSampleStatusUpdatePayloads();
                break;

            case "statusUpdateAcknowledgement":
                title = "Status Update: Response";
                doc = statusUpdateAcknowledgement();
                break;

            ////
            case "support":
                title = "Support";
                doc = support();
                break;

            /// ----- Update Order - Shipping type --------////
            /*
             * Huynh - 08/19/2021
             * https://app.clickup.com/t/9mjank
             */

            case "updateOrderShippingTypeIntro":
                title = "Update Order - Shipping Type: Intro";
                doc = updateOrderShippingTypeIntro();
                break;

            case "updateOrderShippingTypeRequest":
                title = "Update Shipping Type: Request";
                doc = updateOrderShippingTypeRequest();
                break;

            case "updateOrderShippingTypeRequestData":
                title = "Update Shipping Type: Request Data";
                doc = updateOrderShippingTypeRequestData();
                break;

            case "updateOrderShippingTypeRequestWhereToSendRequest":
                title = "Update Shipping Type: Where to Send Your Post Request";
                doc = updateOrderShippingTypeRequestWhereToSendRequest();
                break;

            case "updateOrderShippingTypeResponse":
                title = "Update Shipping Type: Response";
                doc = updateOrderShippingTypeResponse();
                break;

            case "updateOrderShippingTypeResponseData":
                title = "Update Shipping Type: Response Data";
                doc = updateOrderShippingTypeResponseData();
                break;

            case "updateOrderShippingTypeResponseErrorCodes":
                title = "Update Shipping Type: Error codes";
                doc = updateOrderShippingTypeResponseErrorCodes();
                break;

            /// ----- Update Order - Shipping Address --------////
            /*
            * Huynh - 08/19/2021
            * https://app.clickup.com/t/9mjank
            */

            case "updateOrderShippingAddressIntro":
                title = "Update Order - Shipping Address: Intro";
                doc = updateOrderShippingAddressIntro();
                break;

            case "updateOrderShippingAddressRequest":
                title = "Update Shipping Address: Request";
                doc = updateOrderShippingAddressRequest();
                break;

            case "updateOrderShippingAddressRequestData":
                title = "Update Shipping Address: Request Data";
                doc = updateOrderShippingAddressRequestData();
                break;

            case "updateOrderShippingAddressWhereToSendRequest":
                title = "Update Shipping Address: Where To Send Your Request";
                doc = updateOrderShippingAddressWhereToSendRequest();
                break;

            case "updateOrderShippingAddressResponse":
                title = "Update Shipping Address: Response";
                doc = updateOrderShippingAddressResponse();
                break;

            case "updateOrderShippingAddressResponseData":
                title = "Update Shipping Address: Response data";
                doc = updateOrderShippingAddressResponseData();
                break;

            case "updateOrderShippingAddressResponseErrorCodes":
                title = "Update Shipping Address: Error Codes";
                doc = updateOrderShippingAddressResponseErrorCodes();
                break;

            ///
            default:
                title = "Introduction";
                doc = introduction();
        }//switch

        return (
            <div className="Introduction">
                <div className="title">{title}</div>
                <p>{doc}</p>
            </div>
        );
    }
}

export default Document;