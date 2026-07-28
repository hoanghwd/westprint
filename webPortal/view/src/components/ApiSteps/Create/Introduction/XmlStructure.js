import React, { Component } from "react"
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Skip from '../../Shared/Skip'

const p1 = "Below is a table of XML fields that must be transmitted with every order. These fields include all basic information required to produce the order, so failing to transmit these fields will result in an error, unless the field is marked as optional. "
const p2 = "Below is a table of xml tags and values that will be passed with every order response."

class XmlStructure extends Component {
    
    componentDidUpdate() {
        window.scrollTo(0, 0);
    }
    
    render() {
        const skipButton = (this.props.skipped || this.props.approved) ? '' : (<Skip nextStage='cancel' score={25} />);

        var increasePercentage = this.props.asUser? 0 : 2 ;

        return (
            <div className="ErrorCodes  p-3">
            <h5><b>Request Data</b></h5>
            
            <p>{p1}</p>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className = "width100" >Data Type</th>
                        <th>Value Description</th>
                        <th>Required?</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>userId</td>
                        <td>Number (5)</td>
                        <td>Your user account ID will be provided to you and must be passed with every order</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>apiKey</td>
                        <td>String (30)</td>
                        <td>Your api key will be provided to you and must be passed with each order so that your identity can be validated</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>companyName</td>
                        <td>String (75)</td>
                        <td>String (75)</td>
                        <td>N</td>
                    </tr>
                    <tr>
                        <td>custLogo</td>
                        <td>String (255)</td>
                        <td>Dynamic custom logo printed on the back of the product that can be changed order to order</td>
                        <td>N</td>
                    </tr>
                    <tr>
                        <td>billingIsReturnAddress</td>
                        <td>Enum (Y,N)</td>
                        <td>Set this to Y to use Company name as Return Company Name on the shipping label</td>
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
                        <td>The ship-to zip code, some countries do not require a zip.  *If the request is for a address that does require a zip a error respone will be returned</td>
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
                        <td>The ship-to phone number, note that this is required for shipping purposes (Ex: 123-456-1234)</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>shippingType</td>
                        <td>String (20)</td>
                        <td>Specifies the shipping service for an order.  Values are: 
                        <p></p>
                        <p>
                            &bull;	“Basic” – estimated transit of 5-7 business days.
                        </p>
                        <p>
                            &bull;	“Premium” –  guaranteed transit of 2 business days.
                        </p>
                        <p>
                            &bull;	“Premium Plus” –  guaranteed transit of 1 business day.
                        </p>
                    </td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>poNumber</td>
                        <td>String (50)</td>
                        <td>Reference number that appears on order and identifies the order.  Its highly recommended to use a order number the order recipient will recognize.  Provided PO numbers must be unique or an error response will be returned. Character limit for poNumber is 40 characters.</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>packingSlip</td>
                        <td>Text</td>
                        <td>A custom branded color packingslip with 1 image on the front and 1 image on the back. Image URLs should be provided for the 2 images.  If left blank a generic packingslip will be produced. Toggle the template tag to 1 to use the tempalated packingslip.  Refer to the premium branding docuementation for image specifications.</td>
                        <td>N</td>
                    </tr>
                    <tr>
                        <td>insertCard</td>
                        <td>Text</td>
                        <td>A custom branded color Insert Card with 1 image on the front and 1 image on the back. Image URLs should be provided for the 2 images.  If left blank an insert cart will not be produced.  Refer to the premium branding docuementation for image specifications.</td>
                        <td>N</td>
                    </tr>
                    <tr>
                        <td>sticker</td>
                        <td>Text</td>
                        <td>A custom branded color Sticker with 1 images on 1 page. Image URL should be provided for the image.  If left blank a sticker will not be produced.  Refer to the premium branding docuementation for image specifications.</td>
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
                        <td>Identifies the item ordered.  Products codes will be provided separately from this document.</td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>retailPrice</td>
                        <td>Decimal(9,2)</td>
                        <td>Retail price of each product offered by the Customer/Client. Example: if a product costing $5 is ordered with qt 2  in a single orderItem node, a retailPrice node should have a unit price for single product i.e. $5. This price will be used on Commercial Invoices for International Shipments.</td>
                        <td>N</td>
                    </tr>
                    <tr>
                        <td>itemNumber</td>
                        <td>String (50)</td>
                        <td>Reference number that identifies the item.  Provided item numbers must be unique for the order or an error response will be returned. Character limit for itemNumber is 40 characters.</td>
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
                            <p>
                            http://www.example.com/images/123.jpg
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
                            Products like Photobook, Photoprints, etc. would have multiple imageLocations as shown in the sample XML above.  
                            </p>
                        </td>
                        <td>Y</td>
                    </tr>
                    <tr>
                        <td>testMode</td>
                        <td>Number (1)</td>
                        <td>Set this to “1” to flag an order as a test order. A test order will not be charged or produced and will be automatically deleted. Set this to “0” to flag an order as Live order. A live order will be produced and charged.</td>
                        <td>N</td>
                    </tr>
                    


                </tbody>
            </Table>

            <br></br>
            <h5><b>Response Data</b></h5>
                <p>{p2}</p>

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
                        <td>Status 0 determines failure and 1 determines success.</td>
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
 


            <div className="d-flex justify-content-end mt-5 mb-3">
                <Button 
                    size="lg" 
                    variant="primary" 
                    onClick={() => this.props.handleNext('errors_create', increasePercentage)}
                >
                    NEXT
                </Button>
                {skipButton} 
            </div>
        </div>
        );
    }
}

export default XmlStructure;
