import React, { Component } from "react"
import { connect } from 'react-redux'
import axios from "axios"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip'
import { Link } from "react-router-dom"

import "../Create.css"

const checkForSkip = async (userName, jwt) => {
    const section = 'create' 
    const searchParams = `?userName=${userName}&sectionName=${section}`;
  
    return await axios.get(
      process.env.REACT_APP_WESTPRINT_API +
      process.env.REACT_APP_CHECK_FOR_SKIP +
      searchParams,  {headers: {'Authorization': 'Bearer '+jwt}}
    );
};

const title = "Order Placement"
const p1 = "Simply passing a name/value pair is all that is required to create an order, we’ll handle everything else.  This method is just like doing a form POST where the name would be “xml” and the value would be the free form XML in a string data type."
const p2 = "Preparing your post request is easy. Exactly how you transmit your post data depends on the programming language you use. For PHP, cURL is a popular choice. For ASP.Net, there is a WebRequest class.";
//const p3 = "Below is a sample of the xml value:"
const p4 = "When you are ready to send to our testing environment transmit your post request to the following URL:"
//const p5 = "Once tests have been completed the production URL, your production userId, and your production apiKey will be provided to you.  Be sure to set test mode equal to 1 before sending test orders to the production server to avoid fulfillment and billing of the order.  "
const p5 = "Should you wish to send additional test orders once testing is completed, be sure to set <testMode> to 1 to avoid the fulfillment and billing of the order."
const p6 = "The response is a XML String which needs to be parsed by the recipient."
//const p7 = "Below is a sample of xml where the Order Request has succeeded:"
const p8 = "When the Order Request succeeds, the code field contains the actual Order ID of the order requested. If the Order Request fails the code field will contain a particular error code."
//const p9 = "Below is a sample of xml where the Order Request has failed:"
//const p10 = "One can tell that the order request for the above reply had an invalid username or password. Please refer to the Error Codes section of the COF API for the complete list."
const p11 = "Each order placement is a two-step process: Order is Received & Order is Accepted.";
const p12 = " - Successfully submitted orders will return an immediate response XML string (more info listed below) with a Success! message.\n\
                This is to notify you that JONDO has successfully received your request XML for further validation.";
const p13 = " - This status is used to notify you that your order request has been officially validated and accepted into our system for further production.\n\
                Section D of the API Onboarding Process will allow you to test Accepted Order Statuses to ensure that you are able to receive our updates.\n\
                For further information about status updates, please view the Status Update section of the JONDO API Documentation.";

class Request extends Component {
   

    constructor(props) {
        
        super(props);
    
        this.state = {
            skip: false                   
        }
      
    }


    // update the table when submit search form
    async componentDidMount() {
                  
        const { userName, jwt } = this.props;
        
        const response = await checkForSkip(userName, jwt)
        
        if (response.data) {    
            //console.log("response.data", response.data)          
            //console.log("response.data.isAllow", response.data.isAllow)
            this.setState({ skip: response.data.isAllow});
        }
               
    }


    componentDidUpdate() {
        window.scrollTo(0, 0);
    }

    render() {        
        
        //const skipButton = this.props.approved ? '' : (<Skip nextStage='cancel' score={25}/>);
        const skipButton = (this.props.skipped || this.props.approved || !this.state.skip) ? '' : (<Skip nextStage='cancel' score={25}/>);
        //console.log('this.props.asUser ' + this.props.asUser)
        var increasePercentage = this.props.asUser? 0 : 2 ;

         return ( 
            
            <div className="request pt-3">
                <h5><b>{title}</b></h5>
                <p>{p1}</p>
                <p>{p2}</p>
                <p>{p11}</p>
                    
                <ol>
                    <li><b>Order Received</b>{p12}</li>
                    <li><b>Accepted Order Status</b>{p13}</li>
                </ol>
                
                <p>Since Jondo's production process is extremely automated, we require that all our customers submit print-ready images to our API.</p>
                <p>Print ready images are images that <b className="color-red">must match exactly</b> with our given product specs in terms of final image size and DPI. Final image size is calculated based on Face Size + Bleed (if applicable) and DPI is validated based on the given DPI range.</p>
                {/*<p>Final image size is found under the <b>X"+</b> and <b>Y"+</b> columns and DPI is found under the <b>DPI Range</b> column. For more information on our product specs and data columns please check under the Catalog -> Products page.</p>*/}
                <p>All images provided must comply with the specs (X"+, Y"+, DPI Range columns) defined in the products sheet. Products sheet can be exported to excel from <Link to="/orders/skus" className="link text-nowrap"> here</Link></p>
                
                <p><b>Example (Face Size: 12" x 16" Canvas):</b></p>
                <p>With 1.5" Bleed: Final Size (Print Ready Size) = 15" x 19" Canvas</p>
                <p>To ensure a quick and quality print of your product(s), please follow the required product specs when submitting your order(s). Any order that does <b>NOT</b> include print-ready images will be rejected.</p>

                               
                <h5><b>Where to Send Your Post Request</b></h5>
                <p>{p4}</p>

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

                <br></br>
                <p className = "red">{p5}</p>

                <h5><b>Request Data</b></h5>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Data Type</th>
                            <th>Description</th>
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
                            <td>Your api key will be provided to you and must be passed with each request so that your identity can be validated</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>thirdPartyId</td>
                            <td>Number (15)</td>
                            <td>A reference number to identify the order on your side. This could be your order id.</td>
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
                            <td>Return Company Name – will be printed on Shipping Label. "Fulfillment Center" is used as default if no value is passed.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>custLogo</td>
                            <td>String (255)</td>
                            <td>Dynamic custom logo printed on the back of the product that can be changed order to order. Recommended image type is JPEG and image size is 2.4 x 0.8 inches at 150 DPI.</td>
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
                            <td>The ship-to state, region, or province.  Some countries do not require a state.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>country</td>
                            <td>String (2)</td>
                            <td>The ship-to country (If blank defaults to US, any specified country must be the 2 character code defined by ISO 3166-1 alpha-2)</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>zip</td>
                            <td>String (20)</td>
                            <td>The ship-to zip code or postal code. While some countries do not require a zip, an error response will be returned for any address that does require one.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>urbanizationCode</td>
                            <td>String (30)</td>
                            <td>Required for some Puerto Rico Addresses.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>phoneNumber</td>
                            <td>String (20)</td>
                            <td>The ship-to phone number. This is required for shipping purposes and should be formatted as 123-456-1234</td>
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
                            <td>Specifies the shipping service for an order.  Values are: 
                            <p></p>
                            <p>
                                &bull;	“Basic” – estimated transit time, slowest and most affordable of all ship types.
                            </p>
                            <p>
                                &bull;	“Basic Plus” – guaranteed transit time, faster than Basic, slower than all other guaranteed services.
                            </p>
                            <p>
                                &bull;	“Premium” – guaranteed transit time, faster than Basic Plus, slower than Premium Plus.
                            </p>
                            <p>
                                &bull;	“Premium Plus” – guaranteed transit time, fastest and most expensive of all ship types.
                            </p>
                        </td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>poNumber</td>
                            <td>String (50)</td>
                            <td>Reference number that appears on the order and identifies the order. It is highly recommended to use an order number that the recipient will recognize. PO numbers must be unique per order, or an error response will be returned. Character limit for a valid poNumber is 50 characters.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>packingSlip</td>
                            <td>Text</td>
                            <td>A custom, branded color Packing Slip with 1 image on the front and 1 image on the back. Image URLs should be provided for the 2 images. If left blank, a generic packing slip will be produced. Set the template tag to 1 to use the templated packing slip. Refer to the premium branding documentation for image specifications.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>insertCard</td>
                            <td>Text</td>
                            <td>A custom, branded color Insert Card with 1 image on the front and 1 image on the back. Image URLs should be provided for the 2 images. If left blank, an insert cart will not be produced. Refer to the premium branding documentation for image specifications.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>sticker</td>
                            <td>Text</td>
                            <td>A custom, branded color Sticker with 1 image on 1 page. Image URL should be provided for the image. If left blank a sticker will not be produced. <Link to="/docs/packingslip" className="link">Refer to the premium branding documentation</Link> for image specifications.</td>
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
                            <td>Identifies the item ordered. Product codes will be provided separately and can be found under Orders -> Products.</td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>retailPrice</td>
                            <td>Decimal(9,2)</td>
                            <td>Retail price (price paid by consumer) for each item on the order. Example: if the consumer ordered product costing $5 each is ordered with qt 2 in a single orderItem node, a retailPrice node should have a unit price for the single product i.e. $5. The price will be referenced on the Commercial Invoices for international shipments.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>itemNumber</td>
                            <td>String (50)</td>
                            <td>Reference number that identifies the item in the request XML. Item numbers must be unique per item node within an order or an error response will be returned.  These item numbers can be used later to identify a specific item on an order you would like to cancel.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>coverSheet</td>
                            <td>String (255)</td>
                            <td>A custom branded color Cover Sheet with 1 background image on 1 page. This is available only for certain products like Photobook, Photoprints, etc. Image URL should be provided for the image.  If left blank, there will be no background image for the cover sheet.  Refer to the premium branding documentation for image specifications.</td>
                            <td>N</td>
                        </tr>
                        <tr>
                            <td>imageLocations</td>
                            <td>Text</td>
                            <td>File locations as an HTTP URL: 
                                <p></p>
                                {/*}
                                <p>
                                http://www.example.com/images/123.jpg
                                </p>
                                */}
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
                            </td>
                            <td>Y</td>
                        </tr>
                        <tr>
                            <td>testMode</td>
                            <td>Number (1)</td>
                            <td>This is only relevant once your account has completed the integration process and is in
                                a LIVE state. Set this to "1" to flag an order as a test order. A test order will not be
                                charged or produced. Set this to "0" to flag an order as LIVE order. A LIVE order will
                                be produced, shipped, and billed.</td>
                            <td>N</td>
                        </tr>
                        
                    </tbody>
                </Table>

                <br></br>
                

                <br></br>

                <h5><b>Image File Requirements</b></h5>
                <p>1. Images oriented with top of content as top of file.</p>
                <p>2. All images provided must comply with the specs (X"+, Y"+, DPI Range columns) defined in the products sheet. Products sheet can be exported to excel from <Link to="/orders/skus" className="link text-nowrap"> here</Link></p>
                <p>3. Image Units should be either PixelsPerCentimeter or PixelsPerInches. Undefined Units is not allowed.</p>
                <p>4. We highly recommend images sent for print be saved in the RGB color space or mode rather than CMYK.  The ICC profile embedded in a file for print will be referenced throughout the production process.  In the absence of an ICC profile, a RGB image will reference "sRGB IEC61966-2.1" and a CMYK image will reference "US Web Coated (SWOP) v2".</p>
                <p>5. Note that X and Y are arbitrary.</p>

                <br></br>

                <h5><b>Response Data</b></h5>
                <p>{p6}</p>
                
                <p>{p8}</p>
               

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
                            <td>timestamp</td>
                            <td>Timestamp (ISO-8601 format)</td>
                            <td>Timestamp is in ISO-8601 format with UTC timezone offset – YYYY-MM-DDThh:mm:ssTZD (Ex: 2017-03-21T22:09:01Z). This date represents the exact date and time the order was cancelled at our facility. When in error, value given is NA</td>
                        </tr>
                        <tr>
                            <td>poNumber</td>
                            <td>String (50)</td>
                            <td>Reference number that appears on the order and identifies the order.</td>
                        </tr>
                        <tr>
                            <td>city</td>
                            <td>String (40)</td>
                            <td>City or town of the fulfillment location the order will be shipped from.</td>
                        </tr>
                        <tr>
                            <td>zip</td>
                            <td>String (15)</td>
                            <td>Zip code or postal code of the fulfillment location the order will be shipped from.</td>
                        </tr>
                        <tr>
                            <td>state</td>
                            <td>String (40)</td>
                            <td>State, region, or province of the fulfillment location the order will be shipped from.</td>
                        </tr>
                        <tr>
                            <td>country</td>
                            <td>String (20)</td>
                            <td>Country of the fulfillment location the order will be shipped from.</td>
                        </tr>
                    </tbody>
                </Table>



                <div className="d-flex mt-5 mb-3 mt-auto" style={{justifyContent:"space-between"}}>
                    <Button
                        size="lg"
                        variant="primary"
                        onClick={() => this.props.handleNext('token_create', 0) }
                    >
                        PREVIOUS
                    </Button>
                    <div style={{display:"inline-flex"}}>
                        <Button
                            size="lg"
                            variant="primary"
                            onClick={() => this.props.handleNext('errors_create', increasePercentage) }
                        >
                            NEXT
                        </Button>
                        {skipButton}
                    </div>
                </div>
             
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        userName: state.session.userName, 
        jwt: state.session.jwt
    }
)

export default connect(
    mapStateToProps
)(Request);
//export default Request;
