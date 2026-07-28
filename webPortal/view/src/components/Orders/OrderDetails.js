import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar/NavBar";
import OrderInfo from "./OrderInfo";
import Items from "./Items";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Orders.css";
import Accordion from "react-bootstrap/Accordion";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import ReactDOMServer from 'react-dom/server'

const getOrders = async (userName, orderId) => {

    const searchParams = `?userName=${userName}&orderId=${orderId}`

    return await axios.get(process.env.REACT_APP_WESTPRINT_API + process.env.REACT_APP_GET_ORDER_INFO + searchParams);
};

class RecentOrders extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderId: this.props.match.params.orderId,
            error: "",
            orderInfo: {},
            dataReady: false
        };

        this.handleClickItemEvent = this.handleClickItemEvent.bind(this);
    }

    async componentDidMount() {
        const {userName} = this.props;
        const {orderId} = this.state;
        const response = await getOrders(userName, orderId);

        if (response.data.error) {
            this.setState({error: response.data.error.text});
        }
        else {
            this.setState({orderInfo: response.data, dataReady: true});
        }
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

    miniRender(selector, htmlContent) {
        this.miniJQ(selector).innerHTML = htmlContent;
    }

    countItemChecked() {
        let itemCounts = this.state.orderInfo.itemCounts;
        let itemCheckedCounts = 0;

        for (let i = 0; i < itemCounts; i++) {
            let currIndex = 'index_' + i;
            if (this.miniJQ(currIndex).checked) {
                itemCheckedCounts++;
            }
        }//for

        return (itemCheckedCounts)
    }

    getSelectedValues(selector) {
        let e = document.getElementById(selector);
        let hash = {};

        hash['value'] = e.value;
        hash['text'] = e.options[e.selectedIndex].text;

        return hash;
    }

    calculateRequestUniqueItemArray() {
        let orderInfo = this.state.orderInfo;
        let itemCounts = orderInfo.itemCounts;
        let uniqueItemArray = [];

        for (let i = 0; i < itemCounts; i++) {
            let id = 'index_' + i;
            try {
                let isChecked = this.miniJQ(id).checked;
                if (isChecked) {
                    let inputValue = this.miniJQ(id).value;
                    if (inputValue != "NA") {
                        uniqueItemArray.push(inputValue);
                    }
                }
            }
            catch (e) {
            }
        }//for

        //Get unqiue itemId
        uniqueItemArray = uniqueItemArray.filter(function (item, pos) {
            return uniqueItemArray.indexOf(item) == pos;
        })

        return uniqueItemArray;
    }

    recordBtnClick(selector) {
        let btnClickCounts = this.miniJQ(selector).value;
        btnClickCounts++;
        this.miniJQ(selector).value = btnClickCounts;
    }

    getReasonCollection(cancelType) {
        let orderInfo = this.state.orderInfo;
        let cancelCollection = [];
        let cancelReasonArray = (cancelType == "order") ?
            orderInfo.editReasonCancelOrderCollection : orderInfo.editReasonCancelItemCollection;
        let k = 0;

        cancelCollection[k] = { "reasonName" : "Select Reason", "reasonId" : "", "require" : "" }
        for(let i in cancelReasonArray) {
            let editReason = cancelReasonArray[i];
            let reason = editReason.reason;
            let reasonGroup = editReason.reasonGroup;
            let editSubGroup = editReason.editSubGroup;
            let internalValue = reasonGroup + '-' + editSubGroup +  '-' + reason;
            k = i + 1;
            cancelCollection[k] = { "reasonName" : reason, "reasonId" : internalValue, "require" : editReason.detailsRequired};
        }

        return cancelCollection;
    }

    inputHasSpecialChar(postData) {
        let specialChar = /[Â£{}~@:%|$&^<>\*+=;?`())[\]]/;
        let counts = 0;
        for (let key of Object.keys(postData)) {
            let value = postData[key];
            if(specialChar.test(value)) {
                counts++;
            }
        }
        return counts;
    }

    validateSubmitData(postData, cancelType) {
        let errorMsg = '';
        let selectedReason = postData['reason'];
        let specialCharCounts = this.inputHasSpecialChar(postData);

        if( specialCharCounts > 0 ) {
            errorMsg = "Special characters not allowed!";
        }
        else if( selectedReason == '' ) {
            errorMsg = "Please select a reason!";
        }
        else if( selectedReason != '' && !this.isOtherReason(selectedReason) && this.isRequiredDetails(selectedReason, cancelType) ) {
            errorMsg = "Please provide some details!";
        }
        else if( (this.isOtherReason(selectedReason) && postData['details'] == '' ) ) {
            errorMsg = 'Please provide some details!';
        }

        return errorMsg;
    }

    /**
     * @param reason
     * @returns {boolean}
     */
    isOtherReason(reason) {
        let otherReasonArray = ['Customer Issues-Cancel Order-Other', 'Customer Issues-Cancel Item-Other' ];
        let resultIndex = otherReasonArray.indexOf(reason);

        return (resultIndex >= 0);
    }

    isRequiredDetails(selectedReason, cancelType) {
        let result = false;
        let orderInfoObj = this.state.orderInfo;
        let editReasonCollection = (cancelType == "order") ?
            orderInfoObj.editReasonCancelOrderCollection : orderInfoObj.editReasonCancelItemCollection;

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

    //Cancel Order //

    handleCancelOrderModalEvent() {
        const cancelOrderModal = this.miniJQ("cancel-order-modal"); //main div
        const openCancelOrderModal = this.miniJQ("cancel-order-link"); // [Cancel order link]
        const closeCancelOrderModal = this.miniJQ("closeCancelOrderModal"); //[Close]

        if (cancelOrderModal) {
            //Handle open
            openCancelOrderModal &&
            openCancelOrderModal.addEventListener("click", () => {
                //Now rendering cancel order html
                this.miniRender('cancel-order-div-body', '');
                cancelOrderModal.showModal()
            });

            //Handle close
            closeCancelOrderModal &&
            closeCancelOrderModal.addEventListener("click", () => {
                let btnClickCounts = this.miniJQ('cancelItemBtnClickCounts').value;
                if (btnClickCounts > 0) {
                    window.location.reload();
                }
                else {
                    cancelOrderModal.close();
                }
            });
        }
    };

    getCancelOrderSubmitData() {
        let postData = {};
        let orderInfo = this.state.orderInfo;
        let orderId = orderInfo.orderId;
        let selectedReason = this.getSelectedValues('cancelOrderCollection');

        postData['orderId'] = orderId;
        postData['reason'] = selectedReason.value;
        postData['modifierUser'] = this.props.userName;
        postData['details'] = this.miniJQ('cancel-order-details').value;

        return postData;
    }

    /**
     * Cancel whole order
     * @param event
     */
    handleCancelOrder = event => {
        event.preventDefault();
        let postData = this.getCancelOrderSubmitData();
        let errorMsg = this.validateSubmitData(postData, 'order');

        if( errorMsg != '' ) {
            alert(errorMsg);
        }
        else {
            let confirmBox = window.confirm( "Do you really want to cancel this order?" )
            //Test
            //confirmBox = false;
            if(confirmBox) {
                this.miniJQ('cancellingOrderSpinner').style.display = 'block';
                this.miniJQ('cancelOrderButtonId').style.display = 'none';
                this.miniJQ('order-info-grid').innerHTML = 'Canceling order...';
                this.recordBtnClick('cancelItemBtnClickCounts');

                axios.post(this.state.orderInfo.cancelOrderUrl, postData)
                    .then(response => {
                        this.miniJQ('cancellingOrderSpinner').style.display = 'none';
                        this.miniRender('cancelOrderCollectionDiv', '');
                        this.miniRender('reason-order-details-div', '');
                        let returnMsg = "Order#" + this.state.orderInfo.orderId + ': ' + response.data.message;
                        this.miniRender('cancel-order-div-body', returnMsg);
                    })
                    .catch(error => {
                        console.error(error);
                        window.location.reload();
                    });
            }
        }
    };

    //Cancel Items ///
    handleOnMouseOutCancelItems() {
        const inputs = document.querySelectorAll('.cancel-item-div-body input')
        inputs.forEach(el => {
            el.addEventListener('input', function (ev) {
                const { target } = ev
                const { type, checked, id, value } = target
                let idParts = id.split('_');

                if( idParts[0] === 'indexQty' ) {
                    let mouseDownId = id+ '_maxQty';
                    let maxQty = parseInt(this.miniJQ(mouseDownId).value);

                    if( parseInt(value) == 0 ) {
                        this.miniJQ(id).style.border = "1px solid red";
                        this.miniRender(mouseDownId + '_ErrorMsg', 'Minimum Require 1');
                    }
                    else if ( parseInt(value) > maxQty ) {
                        this.miniJQ(id).style.border = "1px solid red";
                        let errorMsg = ( maxQty == 1 ) ? "Max Value Allowed is 1" : "Please enter 1 to " + maxQty ;
                        this.miniRender(mouseDownId + '_ErrorMsg', errorMsg);
                    }
                    else {
                        this.miniJQ(id).style.border = "";
                        this.miniRender(mouseDownId + '_ErrorMsg', '');
                    }
                }
            }.bind(this))
        })
    }

    /**
     * Handle Cancel Item modal
     */
    handleCancelItemModalEvent() {
        const cancelItemModal = this.miniJQ("cancel-item-modal"); //div
        const openCancelItemModal = this.miniJQ("openCancelItemModal"); // [Cancel Item link]
        const closeCancelItemModal = this.miniJQ("closeCancelItemModal"); //[x]

        if (cancelItemModal) {
            //Handle open
            openCancelItemModal &&
            openCancelItemModal.addEventListener("click", () => {
                //Now rendering cancel item html
                let html = this.createCancelItemsBodyDiv();
                this.miniRender('cancel-item-div-body', html);
                cancelItemModal.showModal()

                //On mouse out
                this.handleOnMouseOutCancelItems();
            });

            //Handle close
            closeCancelItemModal &&
            closeCancelItemModal.addEventListener("click", () => {
                let btnClickCounts = this.miniJQ('cancelItemBtnClickCounts').value;

                if (btnClickCounts > 0) {
                    window.location.reload();
                }
                else {
                    cancelItemModal.close();
                }
            });

            //Handle click event
            this.handleClickItemEvent();
        }
    };

    handleClickAllItemsEvent = event => {
        let selectedIndex = event.target.id;
        let selectedCheckedAction = this.miniJQ(selectedIndex).checked;
        let checkAll = selectedCheckedAction ? "checked" : "";
        let chkList = document.getElementsByClassName("item-indv-checkbox");

        for (let i = 0; i < chkList.length; ++i) {
            chkList[i].checked = checkAll;
        }
    };

    countNAItems() {
        let orderInfo = this.state.orderInfo;
        let naCounts = 0;
        
        try {
            let orderItems = orderInfo.items;
            let itemCounts = orderItems.length;

            for (let i = 0; i < itemCounts; i++) {
                let currItemNumber = orderItems[i].itemNumber;
                if (currItemNumber.toUpperCase() == "NA" || currItemNumber == '') {
                    naCounts++;
                    break;
                }
            }
        }
        catch (e) { }

        return naCounts;
    }

    /**
     * Handle item click event
     * @param event
     */
    handleClickItemEvent = event => {
        let diagLog = document.getElementsByClassName('cancel-item-div-body')[0];

        diagLog.addEventListener('click', function (event) {
            try {
                let orderInfo = this.state.orderInfo;
                let orderItems = orderInfo.items;
                let itemCounts = orderItems.length;
                let naCounts = 0;
                let action = 'none';
                let selectedItemNumber = event.target.value;
                let selectedItemIndex = event.target.id;
                let selectedItemCheckAction = this.miniJQ(selectedItemIndex).checked;
                //Taking care kit item check box
                let siblingAction = selectedItemCheckAction ? "checked" : "";
                let itemCheckedCounts = 0;

                //Finally check if order has all NA items
                //This will override the cancelItem button display
                for (let i = 0; i < itemCounts; i++) {
                    let currItemNumber = orderItems[i].itemNumber;
                    if(currItemNumber.toUpperCase() == "NA" || currItemNumber == '') {
                        naCounts++;
                    }
                }
                //If order has all NA items
                if(naCounts == itemCounts) {
                    action = 'none';
                    this.miniJQ('select-all-div').style.display = action;
                }
                //There are eligible items for cancel
                else {
                    //Handle select All check box
                    if( selectedItemIndex == 'clickAllItemChk' ) {
                        this.handleClickAllItemsEvent(event);
                    }
                    //Individual item check  -> turn off select all
                    else if(!selectedItemCheckAction) {
                        this.miniJQ('clickAllItemChk').checked = false;
                    }
                }

                //If there are eligible items for cancel
                if( naCounts < itemCounts && selectedItemIndex != 'clickAllItemChk') {
                    for (let i = 0; i < itemCounts; i++) {
                        let currIndex = 'index_' + i;
                        try {
                            let currItem = this.miniJQ(currIndex);
                            //check all item check box with the same item number - for kit sku item
                            if (currItem.value == selectedItemNumber) {
                                currItem.checked = siblingAction;
                            }

                            if(currItem.checked) {
                                itemCheckedCounts++;
                            }
                        }
                        catch (e) {
                        }
                    }//for
                }

                //Override
                if ( selectedItemIndex == 'clickAllItemChk' ) {
                    itemCheckedCounts = (selectedItemCheckAction) ? itemCounts : 0;
                }

                action = (itemCheckedCounts > 0) ? 'block' : 'none';
                this.miniJQ('cancelItemButtonId').style.display = action;
            } catch (e) {
            }
        }.bind(this))
    };

    calculateTotalRequestCancelItems() {
        let orderInfo = this.state.orderInfo;
        let itemCounts = orderInfo.itemCounts;
        let totalRequestImages = 0;

        for (let i = 0; i < itemCounts; i++) {
            let id = '#index_' + i;
            let isChecked = document.querySelectorAll(id)[0].checked;

            if (isChecked == true) {
                let inputValue = document.querySelectorAll(id)[0].value;
                if (inputValue != "NA") {
                    let itemSelectedQty = this.miniJQ('indexQty_' + inputValue);
                    totalRequestImages +=  parseInt(itemSelectedQty.value)
                }
            }
        }//for

        return totalRequestImages;
    }

    createItemQtySelection(itemId, qty) {
        let html =
            '<div style="float: left" class="item-qty-input">' +
            '<input style="text-align: right;" type="integer" max="' +qty+ '" min="1" ' +
            'class="form-control total-qty-input" value="1" ' +
            'onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))"' +
            'id="indexQty_' + itemId + '">' +
            '<input id="indexQty_' + itemId + '_maxQty" type="hidden" value="' + qty + '"/>' +
            '</div>' +
            '<div class="total-qty"> /' + qty + '</div>' +
            '<div id="indexQty_' + itemId + '_maxQty_ErrorMsg" class="error-msg"></div>';

        return html;
    }

    createCancelAllItemCheckBox() {
        let clickAllItemChk =
            <Form as={Row} id="select-all-div">
                <Form.Label column sm="2" className="text-left label">
                    Select All
                </Form.Label>
                <div className="check-all-item">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="clickAllItemChk"
                        name="clickAllItemChk"
                    />
                </div>
            </Form>

        return clickAllItemChk;
    }

    sortByKey(array, key) {
        return array.sort(function(a, b) {
            let x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    countItemNumberOccurrence(sortedItemArray, targetItem) {
        let occCounts = 0;

        for (let i in sortedItemArray) {
            let itemInfo = sortedItemArray[i];
            let itemNumber = itemInfo.itemNumber;
            if(targetItem == itemNumber) {
                occCounts++;
            }
        }

        return occCounts;
    }

    /**
     * Create cancel item DIV
     */
    createCancelItemsBodyDiv() {
        let orderInfo = this.state.orderInfo;
        let sortedItemArray = this.sortByKey(orderInfo.items, 'itemNumber');
        let imagePerRow = 5;
        let html = '';
        let k = 0;
        let printCounts = {};

        for (let i in sortedItemArray) {
            let itemNumber = sortedItemArray[i].itemNumber;
            printCounts[itemNumber] = 0;
        }

        for (let i in sortedItemArray) {
            let itemInfo = sortedItemArray[i];
            let itemNumber = itemInfo.itemNumber;
            let occCounts = this.countItemNumberOccurrence(sortedItemArray, itemNumber);
            let prevItemNumber = '';
            let displayChkBox = "block";

            try {
                let prevItemInfo = sortedItemArray[k-1];
                prevItemNumber = prevItemInfo.itemNumber;
            }
            catch (e) { }

            //Beginning of the row
            if (k == 0 || k % imagePerRow  == 0 ) {
                html +=
                    '<div class="itemCancelRow">';
            }

            //If it is a kit
            let classKit = '';
            let customMargin_left = '';
            let customWidth = '';
            let customPsTitle = ' style="margin-top: 0px !important;" ';
            let cellWidth = 180;
            let psWidth = 160;
            let coE = 1;
            let maxMultiple = ( occCounts > imagePerRow) ? imagePerRow : occCounts;

            //console.log("max multiple = " + maxMultiple);
            if(itemNumber != "NA" && occCounts > 1) {
                //Beginning
                if( prevItemNumber != itemNumber ) {
                    classKit = 'border-beginning';
                    /*
                    //Auto overflow
                    let rem = k % imagePerRow;
                    coE = maxMultiple - rem;
                    if(k <= imagePerRow) {
                        coE = imagePerRow - rem;
                        if( coE ==  imagePerRow) {
                            coE = maxMultiple;
                        }
                    }
                    */

                    //Sitting at the last row
                    if( (k+1) % imagePerRow  == 0 ) {
                        classKit = 'border-right-dot';
                    }

                    psWidth = cellWidth * coE;
                    customPsTitle = ' style="width: ' + psWidth + 'px !important;margin-top: 0px !important;" ';
                }
                //Middle
                else if(printCounts[itemNumber] != (occCounts -1) ) {
                    classKit = 'border-middle';
                    displayChkBox = "none";
                    if( k > 0 ) {
                        //Sitting at the last row
                        if( (k+1) % imagePerRow  == 0 ) {
                            classKit = 'border-middle-right-dot';
                        }
                        //Sitting at front of row
                        else if(k % imagePerRow == 0) {
                            //if last member and is in front of the new row
                            classKit = 'border-middle-left-dot';
                        }
                    }
                }

                //Last
                if(printCounts[itemNumber] == (occCounts -1) ) {
                    customWidth = ' style="width: 145px !important; margin-right:40px" ';
                    displayChkBox = "none";

                    //Sitting in front of the new row
                    if(k % imagePerRow == 0) {
                        classKit = 'border-left-dot';
                    }
                    else {
                        classKit = 'border-last-mgr-45';
                    }
                }

                console.log(k+' '+classKit + "\n");
            }//kit

            html +=
                '<div '+ customWidth +' class="itemCell ' + classKit + '" id="itemCell_' + itemNumber + '">' +
                '<div class ="itemImageCell">';
            if(itemNumber != "NA") {
                html +=
                    '<div ' + customMargin_left + ' class="itemCheckBoxCell">' +
                    '<input style="display: '+ displayChkBox +'" class="item-indv-checkbox" id="index_' + k + '" type="checkbox" value="' + itemNumber + '"/>' +
                    '<input id="itemNumber_' + k + '" type="hidden" value="' + itemNumber + '"/>' +
                    '</div>';
            }

            let brokenImageUrl =  (orderInfo.siteUrl) + 'public/images/broken_image_gray.png';
            let imgUrl = ( itemInfo.thumbLocation == null ) ? brokenImageUrl : itemInfo.thumbLocation;
            html +=
                '<div class="imgContainer">' +
                    '<img class="mr-1" src="' + imgUrl + '" />' +
                '</div>' +
                '</div>';

            //If rendered then plus 1
            printCounts[itemNumber] += 1;

            if(itemNumber != "NA") {
                //If next item is not related to the previous
                if( prevItemNumber != itemNumber ) {
                    let itemQty = itemInfo.qt;
                    let itemQtySelHtml = this.createItemQtySelection(itemNumber, itemQty);
                    html +=
                        '<div class="input-item-cancel-qty">Item ID: ' + itemNumber + '</div>' +
                        '<div' + customPsTitle +' class="input-item-cancel-qty">' +
                        itemInfo.psTitle +
                        '</div>' +
                        '<div class="input-item-cancel-qty">' + itemQtySelHtml + '</div>' ;

                }
            }
            html += '</div>';

            //End of the row
            if ( k > 0 && ((k+1) % imagePerRow == 0) ) {
                html +=
                    '</div>';
            }

            k++;
        }//for

        let allCancelItemChkBox = this.createCancelAllItemCheckBox();

        return ReactDOMServer.renderToString(allCancelItemChkBox) + html;
    }

    getCancelItemSubmitData() {
        let orderInfo = this.state.orderInfo;
        let itemCounts = orderInfo.itemCounts;
        let itemArray = this.calculateRequestUniqueItemArray();
        let selectedReason = this.getSelectedValues('cancelItemCollection');
        let postData = {};
        let k = 0;

        for (let i in itemArray) {
            let inputValue = itemArray[i];
            let itemSelectedQty = this.miniJQ('indexQty_' + inputValue);

            postData['item_' + k] = inputValue;
            postData['itemQty_' + k] = itemSelectedQty.value;
            k++;
        }
        postData['itemCounts'] = itemCounts;
        postData['orderId'] = orderInfo.orderId;
        postData['reason'] = selectedReason.value;
        postData['modifierUser'] = this.props.userName;
        postData['details'] = this.miniJQ('details').value;

        return postData;
    }

    validateCancelItemMaxQty() {
        let itemArray = this.calculateRequestUniqueItemArray();
        let errorCount = 0;
        for (let i in itemArray) {
            let inputValue = itemArray[i];
            let itemSelectedQty = parseInt(this.miniJQ('indexQty_' + inputValue).value);
            let itemSelectedMaxQty = parseInt(this.miniJQ('indexQty_' + inputValue + '_maxQty').value);
            if( itemSelectedQty == 0 || (itemSelectedQty > itemSelectedMaxQty) ) {
                errorCount++;
            }
        }

        return errorCount;
    }

    getConfirmCancelItem() {
        let itemConfirm = '';
        let itemArray = this.calculateRequestUniqueItemArray();
        for (let i in itemArray) {
            let inputValue = itemArray[i];
            let selectedValue = this.miniJQ('indexQty_' + inputValue).value;
            itemConfirm += selectedValue + ' of Item ID ' + inputValue + "\n";
        }

        return itemConfirm.replace(/,\s*$/, "");
    }

    handleCancelItemButton = event => {
        event.preventDefault();
        let postData = this.getCancelItemSubmitData();
        let errorMsg = this.validateSubmitData(postData, 'item');
        let errorMaxQtyCounts = this.validateCancelItemMaxQty();

        if( errorMaxQtyCounts > 0 ) {
            alert("Please correct the error(s) and resubmit again!");
        }
        else if( errorMsg != '' ) {
            alert(errorMsg);
        }
        else {
            let orderInfo = this.state.orderInfo;
            let itemCounts = orderInfo.itemCounts;
            let imageCounts = orderInfo.imageCounts;
            let itemConfirm = this.getConfirmCancelItem();
            let totalRequestedQty = this.calculateTotalRequestCancelItems();
            let confirmMsg = (totalRequestedQty == imageCounts) ?
                "This will cancel the whole order, are you sure you want to do this?" :
                "Do you really want to cancel \n" + itemConfirm;
            let confirmBox = window.confirm(confirmMsg);

            //TEST
            //alert(totalRequestedQty);
            //alert(confirmMsg);
            //confirmBox = false;
            if (confirmBox) {
                this.miniJQ('cancellingItemSpinner').style.display = 'block';
                this.miniJQ('cancelItemButtonId').style.display = 'none';
                this.recordBtnClick('cancelItemBtnClickCounts');

                axios.post(orderInfo.cancelOrderUrl, postData)
                    .then(response => {
                        let resultData = (response.data);
                        let returnMultipleMsg = '';
                        //Cancelled
                        if (resultData.message) {
                            let myReturnMsg = resultData.message;
                            console.log('case 1');
                            for (let i = 0; i < itemCounts; i++) {
                                let currIndex = 'index_' + i;
                                let currItem = this.miniJQ(currIndex);
                                if (currItem.checked) {
                                    returnMultipleMsg += '<div class="returnItemMsg">' + myReturnMsg + '</div>';
                                }
                            }//for
                        }
                        else {
                            console.log('case 2');
                            for (let i in resultData) {
                                let itemInfo = resultData[i];
                                let itemNumber = itemInfo.itemNumber;
                                let itemMessage = itemInfo.itemMessage;
                                returnMultipleMsg += '<div class="returnItemMsg">' + itemMessage + '</div>';
                            }
                        }

                        this.miniRender('cancel-item-div-body', returnMultipleMsg);
                        this.resetCancelItemModal();
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }//confirm box
        }
    };

    resetCancelItemModal() {
        this.miniJQ('cancelItemButtonId').style.display = 'none';
        this.miniJQ('cancellingItemSpinner').style.display = 'none';
        this.miniRender('cancelItemCollectionDiv', '');
        this.miniRender('reason-details-div', '');
        this.miniJQ('bottom-hr').remove();
    }

    render() {
        let orderInfo = this.state.orderInfo;
        let itemNACounts = this.countNAItems();

        if (!this.props.userId) {
            return <Redirect to={"/login"}/>;
        }
        let status = orderInfo.statusFM;
        let testOrder = '';
        if ( orderInfo.testMode == "1" ) {
            testOrder = <span style={{color: "#DC143C"}}>- Test Order</span>;
        }

        //Cancel order ///
        let cancelOrderCollection = this.getReasonCollection('order');
        let cancelOrderLink =
            <a href="javascript:void(0)" style={{display: 'none'}} id="cancel-order-link">
                Cancel Order
            </a>
        let cancelOrderModal =
            <dialog id="cancel-order-modal" className="dialog" style={{width: "60%"}}>
                <p className="addressFormHeader">Cancel Order</p>
                <div id="closeCancelOrderModal" className="closeModal">Close</div>
                <Accordion defaultActiveKey="0">
                    <div id="cancel-order-div-body" className="cancel-order-div-body"></div>
                </Accordion>
                <Form.Group as={Row} id="cancelOrderCollectionDiv">
                    <Form.Label column sm="2" className="text-right label">
                        Reason
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            id="cancelOrderCollection"
                            className="input"
                            as="select"
                            name="reason">
                            { cancelOrderCollection.map((option) => (
                                <option value={option.reasonId}>{option.reasonName}</option>
                            ))
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} id="reason-order-details-div">
                    <Form.Label column sm="2" className="text-right label">More Details</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            id="cancel-order-details"
                            className="input"
                            name="details" />
                    </Col>
                </Form.Group>
                <p className="addressFormHeader"></p>
                <Row>
                    <div id="cancellingOrderSpinner" style={{display: 'none'}}>
                        <Spinner className="cancel-spinner" animation="border"/>
                    </div>
                    <input type="hidden" id="cancelOrderBtnClickCounts" value="0" />
                    <Col sm={9}>
                        <Button
                            id="cancelOrderButtonId"
                            className="mr-3"
                            variant="primary" type="submit"
                            size="sm"
                            onClick={this.handleCancelOrder}>
                            Cancel Order
                        </Button>
                    </Col>
                </Row>
            </dialog>
        this.handleCancelOrderModalEvent();

        //Cancel item//
        let cancelItemCollection = this.getReasonCollection('item');
        let cancelItemLink = <a href="javascript:void(0)" style={{display: 'none'}} id="openCancelItemModal">Cancel Item</a>;
        let cancelItemModal =
            <dialog id="cancel-item-modal" className="dialog">
                <p className="addressFormHeader">Cancel Items</p>
                <div id="closeCancelItemModal" className="closeModal">Close</div>
                <Accordion defaultActiveKey="0">
                    <Card className="dialog-card">
                        <div id="cancel-item-div-body" className="cancel-item-div-body"></div>
                    </Card>
                </Accordion>
                <p className="addressFormHeader"></p>
                <Form.Group as={Row} id="cancelItemCollectionDiv">
                    <Form.Label column sm="2" className="text-right label">
                        Reason
                    </Form.Label>
                    <Col sm="9">
                        <Form.Control
                            id="cancelItemCollection"
                            className="input"
                            as="select"
                            name="reason">
                            { cancelItemCollection.map((option) => (
                                <option value={option.reasonId}>{option.reasonName}</option>
                            ))
                            }
                        </Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} id="reason-details-div">
                    <Form.Label column sm="2" className="text-right label">More Details</Form.Label>
                    <Col sm="9">
                        <Form.Control
                            id="details"
                            className="input"
                            name="details" />
                    </Col>
                </Form.Group>
                <p className="addressFormHeader" id="bottom-hr"></p>
                <Row>
                    <div id="cancellingItemSpinner" style={{display: 'none'}}>
                        <Spinner className="cancel-spinner" animation="border"/>
                    </div>
                    <input type="hidden" id="cancelItemBtnClickCounts" value="0" />
                    <Col sm={9}>
                        <Button
                            id="cancelItemButtonId"
                            style={{display: "none"}}
                            className="mr-3"
                            variant="primary" type="submit"
                            size="sm"
                            onClick={this.handleCancelItemButton}>
                            Cancel Selected Item
                        </Button>
                    </Col>
                </Row>
            </dialog>
        this.handleCancelItemModalEvent();

        //Handle initial display
        if (status === "IN PROGRESS") {
            this.miniJQ('openCancelItemModal').style.display = '';
            this.miniJQ('cancel-order-link').style.display = '';
            this.miniJQ('pipe').style.display = '';
        }

        //If any item with NA
        if(itemNACounts > 0) {
            cancelItemLink = '';
            this.miniJQ('pipe').style.display = 'none';
        }

        return (
            <div className="my-account">
                <Navbar {...this.props} handleLogin={this.props.handleLogin}/>
                <Container>
                    <h2 className="text-monospace font-weight-bold text-left mt-3">
                        Order Details {testOrder}
                    </h2>
                    <Row className="margin-top">
                        <Col md={12} className="mx-auto">
                            <Card className="my-5 text-left">
                                <Card.Header className="card-header-account white-text">
                                    <div style={{overflow: "hidden"}}>
                                        <div className="orderPoNumber">Order# {this.state.orderInfo.orderId}</div>
                                        <div className="cancelOrderLinks">
                                            {cancelOrderLink}
                                            {cancelOrderModal}
                                            <span id="pipe" style={{display: 'none'}}>&nbsp;|&nbsp;</span>
                                            {cancelItemLink}
                                            {cancelItemModal}
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <OrderInfo {...this.props} {...this.state}  />

                                    <Items {...this.props} {...this.state} />
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default RecentOrders;