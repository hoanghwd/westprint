import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Orders.css";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

class OrderInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: "",
            isDataReady : false,
            selectedCountry: ""
        };
    }

    /**
     * Get selector object
     * @param selector
     * @returns {Element}
     */
    miniJQ(selector) {
        return (
            document.querySelector("#" + selector)
        )
    }

    miniEleId(selector) {
        return (
            document.getElementById(selector)
        )
    }

    setDefaultValueSelect(selector, defaultValue) {
        this.miniEleId(selector).value = defaultValue;
    }

    miniRender(selector, htmlContent) {
        this.miniJQ(selector).innerHTML = htmlContent;
    }

    getSelectedValues(selector) {
        let e = document.getElementById(selector);
        let hash = {};

        hash['value'] = e.value;
        hash['text'] = e.options[e.selectedIndex].text;

        return hash;
    }

    /**
     * @param reason
     * @returns {boolean}
     */
    isOtherReason(reason) {
        let otherReasonArray = [
            'Customer Issues-shippingAddress-Other', 'Jondo Issues-shippingAddress-Other',
            'Customer Issues-shippingType-Other', 'Jondo Issues-shippingType-Other'
        ];
        let resultIndex = otherReasonArray.indexOf(reason);

        return (resultIndex >= 0);
    }

    isRequiredDetails(selectedReason, collectionSource) {
        let result = false;
        let editReasonCollection = collectionSource;

        for(let i in editReasonCollection) {
            let editReason = editReasonCollection[i];
            let reason = editReason.reason;
            let reasonGroup = editReason.reasonGroup;
            let editSubGroup = editReason.editSubGroup;
            let isRequired = editReason.detailsRequired;
            let internalValue = reasonGroup + '-' + editSubGroup +  '-' + reason;

            if( (internalValue == selectedReason) && isRequired == "Y" ) {
                result = true;
                break;
            }
        }

        return result;
    }

    updateSubmitCount(selector) {
        let btnClickCounts = this.miniJQ(selector).value;
        btnClickCounts++;
        this.miniJQ(selector).value = btnClickCounts;
    }

    inputHasSpecialChar(postData) {
        let specialChar = /[Â£{}~@:%|$&^<>\*+=;?`())[\]]/;
        let specialCountsArray = {};
        let counts = 0;
        for (let key of Object.keys(postData)) {
            let value = postData[key];
            if( key == 'email' ) {
                let emailCounts = 0;
                let emailParts = value.split('@');
                for(let i in emailParts) {
                    let partValue = emailParts[i];
                    if(specialChar.test(partValue)) {
                        emailCounts++;
                        counts++;
                        specialCountsArray['email'] = 'email';
                    }
                }
            }
            else if(specialChar.test(value)) {
                specialCountsArray[key] = key;
                counts++;
            }
        }

        return specialCountsArray;
    }

    validateSubmitData(postData, collectionSource) {
        let errorMsg = '';
        let selectedReason = postData['reason'];
        let specialCountsArray = this.inputHasSpecialChar(postData);
        let specialCounts = Object.keys(specialCountsArray).length;

        if( specialCounts > 0 ) {
            for (let i in specialCountsArray) {
                errorMsg += "Special characters not allowed in " + (specialCountsArray[i]) + "\n";
            }
        }

        if( selectedReason == '' ) {
            errorMsg += "Please select a reason! \n";
        }

        if(
            selectedReason != '' &&
            !this.isOtherReason(selectedReason) &&
            this.isRequiredDetails(selectedReason, collectionSource) ) {
            errorMsg += "Please provide some details! \n";
        }

        if( (this.isOtherReason(selectedReason) && postData['details'] == ''  ) ) {
            errorMsg += "Please provide some details! \n";
        }

        try {
            if (postData['phone'] == '') {
                errorMsg += "Incomplete Shipping Address: Phone Number missing \n";
            }
        } catch (e) { }

        try {
            if( postData['firstName'] == '' && postData['lastName'] == ''  )  {
                errorMsg += "Incomplete Shipping Address: Both First name and Last name cannot be missing! \n";
            }
        }
        catch (e) { }

        return errorMsg;
    }

    //Edit Address//

    /**
     * Get country collection
     * @returns {[]}
     */
    getCountryCollection() {
        let orderInfoObj = this.props.orderInfo;
        let countryCollection = [];
        let countryArray = (orderInfoObj.countryCollection);
        for(let i in countryArray) {
            let country = countryArray[i];
            countryCollection[i] = { "countryName" : country.countryName, "countryCode" : country.countryCode};
        }

        return countryCollection;
    }

    /**
     *
     * @param country
     * @returns {[]}
     */
    getStateCollection(country) {
        let orderInfoObj = this.props.orderInfo;
        let stateCollection = [];
        let stateArray = [];

        if(country == "US") {
            stateArray = orderInfoObj.usSatesCollection;
        }
        else if( country == 'CA') {
            stateArray = orderInfoObj.CASatesCollection;
        }

        for(let i in stateArray) {
            let state = stateArray[i];
            stateCollection[i] = { "stateName" : state.name, "stateCode" : state.code};
        }

        return stateCollection;
    }

    handleCountryChange= event  => {
        let selectedCountryObj = this.getSelectedValues('countryCollection');
        let country = selectedCountryObj.value;
        let html = '';

        if( country == "US" || country == "CA") {
            let stateCollection = this.getStateCollection(country);
            html = '<select name="stateCollection" id="stateCollection" class="input form-control">';
            for(let i in stateCollection) {
                let stateInfo = stateCollection[i];
                html += '<option value="' + stateInfo.stateCode +'">'+ stateInfo.stateName +'</option>';
            }
            html += '</select>';
        }
        else {
            html = '<input class="input form-control" name="state" id="state"/>';
        }
        this.miniJQ('stateDiv').innerHTML = html;
    };

    /**
     * Render state html
     * @param country
     * @returns {JSX.Element}
     */
    renderStateHtml(country) {
        let stateCollection = this.getStateCollection(country);
        let orderInfoObj = this.props.orderInfo;
        let stateHtml = '';

        if(country == "US" || country == "CA") {
            stateHtml =
                <Form.Control
                    id="stateCollection"
                    className="input"
                    as="select"
                    name="state">
                    {stateCollection.map((option) => (
                        <option value={option.stateCode}>{option.stateName}</option>
                    ))
                    }
                </Form.Control>
        }
        else {
            stateHtml =
                <Form.Control
                    className="input"
                    placeholder = {orderInfoObj.state}
                    name="state"
                    id="stateCollection"
                    defaultValue = {orderInfoObj.state}
                />
        }

        return stateHtml;
    }

    renderReasonCollection() {
        let orderInfoObj = this.props.orderInfo;
        let editReasonCollection = orderInfoObj.editReasonCollection;
        let lastGroup = '';
        let html =
            '<select id="editOrderShippingReason" name="editOrderShippingReason" class="input form-control">' +
            '<option value="">Select Reason</option>';
        for(let i in editReasonCollection) {
            let editReason = editReasonCollection[i];
            let reason = editReason.reason;
            let reasonGroup = editReason.reasonGroup;
            let editSubGroup = editReason.editSubGroup;
            let internalValue = reasonGroup + '-' + editSubGroup +  '-' + reason;

            if( lastGroup !=  reasonGroup) {
                if(lastGroup != '') {
                    html += "</optgroup>";
                }
                html += '<optgroup label="' + reasonGroup + '">';
                lastGroup = reasonGroup;
            }

            html += '<option value="' + internalValue + '">' + reason + '</option>';
        }
        html +=
            '</select>';

        this.miniJQ('editOrderShippingReasonDiv').innerHTML = html;
    }

    /**
     * Handle address modal
     */
    handleAddressModalEvent() {
        const addressModal = this.miniJQ("address-modal"); //div
        const openAddressModal = this.miniJQ("openAddressModal"); // [Edit]
        const closeAddressModal = this.miniJQ("closeAddressModal"); //[x]
        if (addressModal) {
            openAddressModal &&
            openAddressModal.addEventListener("click", () => {
                addressModal.showModal();
                //Render reason
                this.renderReasonCollection();
            });

            closeAddressModal &&
            closeAddressModal.addEventListener("click", () => {
                    let btnClickCounts = this.miniJQ('updateAddressBtnClickCounts').value;
                    if (btnClickCounts > 0) {
                        window.location.reload();
                    }
                    else {
                        addressModal.close();
                        this.addressInfoRestore();
                    }
                }
            );
        }
    };

    addressInfoRestore() {
        let orderInfoObj = this.props.orderInfo;
        let companyValue = (orderInfoObj.company == "NA") ? "" : orderInfoObj.company;

        this.miniJQ('firstName').value = orderInfoObj.firstName;
        this.miniJQ('lastName').value = orderInfoObj.lastName;
        this.miniJQ('company').value = companyValue;
        this.miniJQ('address1').value = orderInfoObj.address;
        this.miniJQ('address2').value = orderInfoObj.address2;
        this.miniJQ('city').value = orderInfoObj.city;
        this.miniJQ('zip').value = orderInfoObj.zip;
        let stateIsSel = false;
        try {
            stateIsSel = true;
            this.setDefaultValueSelect('stateCollection', orderInfoObj.state);
        }
        catch (e) { }
        if(!stateIsSel) {
            this.miniJQ('state').value = orderInfoObj.state;
        }
        this.setDefaultValueSelect('countryCollection', orderInfoObj.country);
        this.miniJQ('email').value = orderInfoObj.email;
        this.miniJQ('phone').value = orderInfoObj.phone;
        this.miniJQ('details').value = '';
    }

    getAddressSubmitData(orderInfoObj) {
        let inputs = document.getElementById('address-modal').getElementsByTagName('input');
        let selectedCountry = this.getSelectedValues("countryCollection");
        let selectedReason = this.getSelectedValues("editOrderShippingReason");
        let postData = {};

        postData['orderId'] = orderInfoObj.orderId;
        postData['country'] = selectedCountry['value'];
        postData['reason'] = selectedReason['value'];
        postData['modifierUser'] = this.props.userName;
        postData['hdRequest'] = "N";

        for (const input of inputs){
            if(input.name != '') {
                postData[input.name] = input.value;
            }
        }
        if(selectedCountry.value == "US" || selectedCountry.value == "CA") {
            let selectedState = this.getSelectedValues("stateCollection");
            postData['state'] = selectedState['value'];
        }

        return postData;
    }

    /**
     * Handle update shipping address
     * @param event
     */
    handleUpdateShippingAddressSubmit= event => {
        event.preventDefault();
        let orderInfoObj = this.props.orderInfo;
        let postData = this.getAddressSubmitData(orderInfoObj);
        let errorMsg = this.validateSubmitData(postData, orderInfoObj.editReasonCollection);

        if(errorMsg != '') {
            alert(errorMsg);
        }
        else {
            this.miniJQ('updateShippingAddressSpinner').style.display = 'block';
            this.updateSubmitCount('updateAddressBtnClickCounts');

            axios.post(orderInfoObj.updateAddressUrl, postData)
                .then(response => {
                    let responseData = response.data;
                    let returnMsg = responseData.message;
                    if(returnMsg == "Success!" && parseInt(responseData.status) == 1 && responseData.code === this.props.orderInfo.orderId) {
                        returnMsg = "Successfully updated address!";
                    }
                    this.miniRender('updateShippingAddress-dialog', returnMsg);
                    this.miniJQ('updateShippingAddressSpinner').style.display = 'none';
                })
                .catch(error => {
                    console.error(error);
                    //alert(error);
                    window.location.reload();
                });
        }
    };

    //Update shipping type //

    renderShippingTypeReasonCollection() {
        let orderInfoObj = this.props.orderInfo;
        let editReasonCollection = orderInfoObj.editReasonShippingTypeCollection;
        let lastGroup = '';
        let html =
            '<select id="editShippingTypeReason" name="editShippingTypeReason" class="input form-control">' +
            '<option value="">Select Reason</option>';
        for(let i in editReasonCollection) {
            let editReason = editReasonCollection[i];
            let reason = editReason.reason;
            let reasonGroup = editReason.reasonGroup;
            let editSubGroup = editReason.editSubGroup;
            let internalValue = reasonGroup + '-' + editSubGroup +  '-' + reason;

            if( lastGroup !=  reasonGroup) {
                if(lastGroup != '') {
                    html += "</optgroup>";
                }
                html += '<optgroup label="' + reasonGroup + '">';
                lastGroup = reasonGroup;
            }

            html += '<option value="' + internalValue + '">' + reason + '</option>';
        }
        html +=
            '</select>';

        this.miniJQ('updateOrderShippingTypeReasonDiv').innerHTML = html;
    }

    /**
     * Handle shipping type modal
     */
    handleUpdateShippingTypeModalEvent() {
        const shippingTypeModal = this.miniJQ("shippingtype-modal"); //div
        const openShippingTypeModal = this.miniJQ("openShippingTypeModal"); // [Edit]
        const closeShippingTypeModal = this.miniJQ("closeShippingTypeModal"); //[x]
        if (shippingTypeModal) {
            shippingTypeModal &&
            openShippingTypeModal.addEventListener("click", () => {
                shippingTypeModal.showModal();
                //Render reason
                this.renderShippingTypeReasonCollection();
            });

            closeShippingTypeModal &&
            closeShippingTypeModal.addEventListener("click", () => {
                    let btnClickCounts = this.miniJQ('updateShippingTypeBtnClickCounts').value;
                    if (btnClickCounts > 0) {
                        window.location.reload();
                    }
                    else {
                        shippingTypeModal.close();
                    }
                }
            );
        }
    };

    getUpdateShippingTypeSubmitData(orderInfoObj) {
        let inputs = document.getElementById('shippingtype-modal').getElementsByTagName('input');
        let selectedReason = this.getSelectedValues("editShippingTypeReason");
        let selectShippingType = this.getSelectedValues("shippingTypeCollection");
        let postData = {};

        postData['userId'] = orderInfoObj.userId;
        postData['orderId'] = orderInfoObj.orderId;
        postData['shippingType'] = selectShippingType['value'];
        postData['reason'] = selectedReason['value'];
        postData['modifierUser'] = this.props.userName;
        postData['hdRequest'] = "N";

        for (const input of inputs){
            if(input.name != '') {
                postData[input.name] = input.value;
            }
        }

        return postData;
    }

    handleUpdateShippingTypeSubmit= event => {
        event.preventDefault();
        let orderInfoObj = this.props.orderInfo;
        let postData = this.getUpdateShippingTypeSubmitData(orderInfoObj);
        let errorMsg = this.validateSubmitData(postData, orderInfoObj.editReasonShippingTypeCollection);

        if(errorMsg != '') {
            alert(errorMsg);
        }
        else {
            this.miniJQ('updateShippingTypeSpinner').style.display = 'block';
            this.updateSubmitCount('updateShippingTypeBtnClickCounts');

            axios.post(orderInfoObj.updateShippingTypeOrderUrl, postData)
                .then(response => {
                    let responseData = response.data;
                    let returnMsg = responseData.message;
                    if(returnMsg == "Success!" && parseInt(responseData.status) == 1 ) {
                        returnMsg = "Successfully updated shipping type!";
                    }
                    this.miniRender('updateShippingType-dialog', returnMsg);
                    this.miniJQ('updateShippingTypeSpinner').style.display = 'none';
                })
                .catch(error => {
                    console.error(error);
                    window.location.reload();
                });
        }
    };

    getShippingCollection() {
        let shippingCollection = [];
        let shippingTypeArray = this.props.orderInfo.shippingCollection;

        for(let i in shippingTypeArray) {
            let name = shippingTypeArray[i];
            shippingCollection[i] = { "shippingName" : name, "shippingCode" : name};
        }

        return shippingCollection;
    }

    createAddressDialog() {
        let orderInfoObj = this.props.orderInfo;
        let countryCollection = this.getCountryCollection();
        let defaultCountry = orderInfoObj.country;
        let stateHtml = this.renderStateHtml(defaultCountry);
        let companyValue = (orderInfoObj.company == "NA") ? "" : orderInfoObj.company;
        let addressDialog =
            <dialog id="address-modal" className="dialog">
                <p className="addressFormHeader">Update Shipping Address</p>
                <div id="closeAddressModal" className="closeModal">Close</div>
                <Accordion defaultActiveKey="0" >
                    <Card className="dialog-card">
                        <Accordion.Collapse eventKey="0">
                            <div id="updateShippingAddress-dialog">
                                <Form onSubmit={this.handleUpdateShippingAddressSubmit}>
                                    <Form.Group as={Row}>
                                        <Col sm={6} >
                                            <div className="input-group">
                                                <Form.Label column sm="4" className="text-right label">First Name</Form.Label>
                                                <Form.Control
                                                    className="input"
                                                    placeholder={orderInfoObj.firstName}
                                                    name="firstName"
                                                    id="firstName"
                                                    defaultValue = {orderInfoObj.firstName}
                                                />
                                            </div>
                                        </Col>
                                        <Col sm={5} >
                                            <div className="input-group">
                                                <Form.Label column sm="4" className="text-right label">Last Name</Form.Label>
                                                <Form.Control
                                                    className="input"
                                                    placeholder={orderInfoObj.lastName}
                                                    name="lastName"
                                                    id="lastName"
                                                    defaultValue = {orderInfoObj.lastName}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">Company</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder={companyValue}
                                                name="company"
                                                id="company"
                                                defaultValue = {companyValue}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">Address</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder={orderInfoObj.address}
                                                name="address1"
                                                id="address1"
                                                defaultValue = {orderInfoObj.address}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">Address 2</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder="Address 2"
                                                name="address2"
                                                id="address2"
                                                defaultValue = {orderInfoObj.address2}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">City</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder = {orderInfoObj.city}
                                                name="city"
                                                id="city"
                                                defaultValue = {orderInfoObj.city}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Col sm={6} >
                                            <div className="input-group">
                                                <Form.Label column sm="4" className="text-right label">State</Form.Label>
                                                <div id="stateDiv">{stateHtml}</div>
                                            </div>
                                        </Col>
                                        <Col sm={5}>
                                            <div className="input-group">
                                                <Form.Label column sm="2" className="text-right label">Zip</Form.Label>
                                                <Form.Control
                                                    className="input"
                                                    placeholder = {orderInfoObj.zip}
                                                    name="zip"
                                                    id="zip"
                                                    defaultValue = {orderInfoObj.zip}
                                                />
                                            </div>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">
                                            Country
                                        </Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                id="countryCollection"
                                                className="input"
                                                as="select"
                                                name="country"
                                                onChange={this.handleCountryChange} >
                                                { countryCollection.map((option) => (
                                                    <option value={option.countryCode}>{option.countryName}</option>
                                                ))
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">Email</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder = {orderInfoObj.email}
                                                name="email"
                                                id="email"
                                                defaultValue = {orderInfoObj.email}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">Phone</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                placeholder = {orderInfoObj.phone}
                                                name="phone"
                                                id="phone"
                                                defaultValue = {orderInfoObj.phone}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">
                                            Reason
                                        </Form.Label>
                                        <Col sm="9">
                                            <div id="editOrderShippingReasonDiv"></div>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">More Details</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                name="details"
                                                id="details"
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Row>
                                        <Col sm={2} />
                                        <Col sm={9}>
                                            <Button className="mr-3" variant="primary" type="submit" size="sm">
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <p className="addressFormHeader"></p>
                <div id="updateShippingAddressSpinner" style={{display: 'none'}}>
                    <Spinner style={{width: '22px', height: '22px'}} animation="border"/>
                </div>
                <input type="hidden" id="updateAddressBtnClickCounts" value="0" />
            </dialog>;

        return addressDialog;
    }

    render() {
        let orderInfoObj = this.props.orderInfo;
        let trackingNum;
        if( orderInfoObj.trackingUrl != "" ) {
            trackingNum = <a href={this.props.orderInfo.trackingUrl} target="_blank">{this.props.orderInfo.trackingNumber}</a>;
        }
        else {
            trackingNum = "N/A";
        }

        //Edit Address/////
        let editAddressLink =
            <a href="javascript:void(0)" style={{display:'none'}} id="openAddressModal" onClick={this.handleEditAddress}>[Edit]</a>;
        //To disable the link
        //editAddressLink = <span id="openAddressModal"></span>

        let addressDialog = this.createAddressDialog();
        this.handleAddressModalEvent();

        //Update shipping type////
        let currShippingType = orderInfoObj.shippingType;
        let updateShippingTypeLink =
            <a href="javascript:void(0)" style={{display:'none'}} id="openShippingTypeModal" onClick={this.handleUpdateShippingType}>[Edit]</a>;
        let shippingTypeCollection = this.getShippingCollection();

        let shippingTypeDialog =
            <dialog id="shippingtype-modal" className="dialog">
                <p className="addressFormHeader">Update Shipping</p>
                <div id="closeShippingTypeModal" className="closeModal">Close</div>
                <Accordion defaultActiveKey="0" >
                    <Card className="dialog-card">
                        <Accordion.Collapse eventKey="0">
                            <div id="updateShippingType-dialog">
                                <Form onSubmit={this.handleUpdateShippingTypeSubmit}>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">
                                            Shipping Type
                                        </Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                id="shippingTypeCollection"
                                                className="input"
                                                as="select"
                                                name="shippingType">
                                                { shippingTypeCollection.map((option) => (
                                                    <option value={option.shippingName}>
                                                        {option.shippingCode}
                                                    </option>
                                                ))
                                                }
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">
                                            Reason
                                        </Form.Label>
                                        <Col sm="9">
                                            <div id="updateOrderShippingTypeReasonDiv"></div>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="2" className="text-right label">More Details</Form.Label>
                                        <Col sm="9">
                                            <Form.Control
                                                className="input"
                                                name="details"
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Row>
                                        <Col sm={2} />
                                        <Col sm={9}>
                                            <Button className="mr-3" variant="primary" type="submit" size="sm">
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
                <p className="addressFormHeader"></p>
                <div id="updateShippingTypeSpinner" style={{display: 'none'}}>
                    <Spinner style={{width: '22px', height: '22px'}} animation="border"/>
                </div>
                <input type="hidden" id="updateShippingTypeBtnClickCounts" value="0" />
            </dialog>;
        this.handleUpdateShippingTypeModalEvent();
        if( parseInt(orderInfoObj.shippingCollectionSize) == 0 ) {
            updateShippingTypeLink = <span id="openShippingTypeModal"></span>
        }

        //To disable the link
        //updateShippingTypeLink = <span id="openShippingTypeModal"></span>
        let shippingPrice = (this.props.orderInfo.shippingMFT) + " USD";

        //Display
        if( orderInfoObj.statusFM === "IN PROGRESS" ) {
            this.miniJQ('openAddressModal').style.display = '';
            this.miniJQ('openShippingTypeModal').style.display = '';
        }

        return (
            <Container className="order-info-back-color marging-bottom" id="order-info-grid">
                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold" >PO#</Col>
                    <Col xs={8} sm={4} >{this.props.orderInfo.poNumber}</Col>
                    <Col xs={4} sm={2} className="text-bold">Status</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.statusFM}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Order Date</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.orderTimeHuman}</Col>
                    <Col xs={4} sm={2} className="text-bold">Ship Date</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.completeTimeHuman}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Recipient</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.firstName} {this.props.orderInfo.lastName} </Col>
                    <Col xs={4} sm={2} className="text-bold">Tracking Number</Col>
                    <Col xs={8} sm={4}>{trackingNum}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Company</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.company}</Col>
                    <Col xs={4} sm={2} className="text-bold">Carrier</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.carrier}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Address</Col>
                    <Col xs={8} sm={4}>
                        {this.props.orderInfo.address}
                        &nbsp;&nbsp;
                        {editAddressLink}
                        <div id="addressDialog-masterdiv">{addressDialog}</div>
                    </Col>
                    <Col xs={4} sm={2} className="text-bold">Shipping Type</Col>
                    <Col xs={8} sm={4}>
                        {currShippingType}
                        &nbsp;&nbsp;
                        {updateShippingTypeLink}
                        {shippingTypeDialog}
                    </Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Address 2</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.address2}</Col>
                    <Col xs={4} sm={2} className="text-bold">Order Total</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.totalMFT} USD</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">City</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.city}</Col>
                    <Col xs={4} sm={2} className="text-bold">Total Shipping</Col>
                    <Col xs={8} sm={4}>{shippingPrice}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">State</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.state}</Col>
                    <Col xs={4} sm={2} className="text-bold">Email</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.email}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Zip</Col>
                    <Col xs={8} sm={4} >{this.props.orderInfo.zip}</Col>
                    <Col xs={4} sm={2} className="text-bold">Phone</Col>
                    <Col xs={8} sm={4} >{this.props.orderInfo.phone}</Col>
                </Row>

                <Row className="my-2">
                    <Col xs={4} sm={2} className="text-bold">Country</Col>
                    <Col xs={8} sm={4}>{this.props.orderInfo.country}</Col>
                </Row>
            </Container>
        );
    }
}

export default OrderInfo;