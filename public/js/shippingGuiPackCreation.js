/* 
 * For Shipping GUI in Workorder:
 *  Method to dynamically create pack objects in shipping GUI.
 *  
 *  Notes:
 *      shippingGUIPack()               --> Parent
 *      standardPack(), customPack()    --> Child
 * 
 * Created By: Jenny Nguyen (AUGUST 2020)
 */

/* ----------------- shippingGUIPack METHODS ----------------- */
// Default Constructor
function shippingGUIPack(type) {
    this.type = type;
    this.boxID = '';
    this.boxName = '';
    this.weight = '';
    this.baseCost = '';
    this.surchargeCost = '';
    this.totalCost = '';
    this.trackingNum = '';
    this.itemsInPack = '';
    this.currIDsInPack = '';    // main id values
    this.currIDsRemoved = '';
    this.newIDsInPack = '';     // adjust id values (temp)
    this.newIDsRemoved = '';
}

shippingGUIPack.prototype.updateData = function(dataObj) {
    this.boxID = dataObj.boxID;
    this.boxName = dataObj.boxName;
    this.weight = dataObj.weight;
    this.baseCost = dataObj.baseCost;
    this.surchargeCost = dataObj.surchargeCost;
    this.totalCost = dataObj.totalCost;
    this.trackingNum = dataObj.trackingNum;
    this.itemsInPack = dataObj.itemsInPack;
};

shippingGUIPack.prototype.createHtmlObj = function(id, boxData, currency, disabled) {
    var htmlData = "<div class='formContainer' id='" + this.type + "Pack_" + this.packID + "'>";
    
    if(this.type == 'custom') {
        htmlData += "<div class='row formHeader'> \
                        <span class='formTitle'>Custom Pack &nbsp;</span> \
                        <span class='customPackCount'></span></div> \
                    <div class='formBody'> \
                    \
                    <div class='inputRow' data-std-box='0'> \
                        <div class='custom_left'><b>Standard Box:</b></div> \
                        <div class='right stdBoxData' data-std-data='0'> \
                            <select class='customPackBoxes' " + disabled + ">" + boxData + "</select> \
                            <input type='number' class='customPackQuantity' placeholder='Qty...' " + disabled + "> \
                        </div> \
                    </div> \
                    \
                    <div class='inputRow' data-std-box='1'> \
                        <div class='custom_left'><button class='yellowBtn' id='addStdBox_" + this.packID + "'>Add Standard Box</button></div> \
                        <div class='right stdBoxData' data-std-data='1'> \
                            <select class='customPackBoxes' " + disabled + ">" + boxData + "</select> \
                            <input type='number' class='customPackQuantity' placeholder='Qty...' " + disabled + "> \
                        </div> \
                    </div> \
                    \
                    <div class='inputRow'> \
                        <div class='custom_left'><b>Dimensions (in):</b></div> \
                        <div class='right'> \
                            <input type='number' id='" + this.type + "PackLength_" + this.packID + "' placeholder='Length...' " + disabled + "> <b>x</b> \
                            <input type='number' id='" + this.type + "PackWidth_" + this.packID + "' placeholder='Width...' " + disabled + "> <b>x</b> \
                            <input type='number' id='" + this.type + "PackHeight_" + this.packID + "' placeholder='Height...' " + disabled + "> \
                        </div> \
                    </div>";
    }
    else {
        htmlData += "<div class='row formHeader'> \
                        <span class='formTitle'>Pack &nbsp;</span> \
                        <span class='standardPackCount'></span> \
                    </div> \
                    \
                    <div class='formBody'>\
                        <div class='inputRow'> \
                            <div class='standard_left'><b>Pack:</b></div> \
                            <div class='right'><select id='" + this.type + "PackName_" + this.packID + "' " + disabled + ">" + boxData + "</select></div> \
                        </div>";
    }
    
    htmlData += "<div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Weight (lb):</b></div> \
                    <div class='right'><input type='number' id='" + this.type + "PackWeight_" + this.packID + "' placeholder='Enter weight...' " + disabled + "></div> \
                </div> \
                \
                <div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Base Cost (" + currency + "):</b></div> \
                    <div class='right'><input type='number' id='" + this.type + "PackBaseCost_" + this.packID + "' placeholder='Enter base cost...' " + disabled + "></div> \
                </div> \
                \
                <div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Surcharge Cost (" + currency + "):</b></div> \
                    <div class='right'><input type='number' id='" + this.type + "PackSurchargeCost_" + this.packID + "' placeholder='Enter surcharge cost...' " + disabled + "></div> \
                </div> \
                \
                <div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Total Cost (" + currency + "):</b></div> \
                    <div class='right'><input type='number' id='" + this.type + "PackTotalCost_" + this.packID + "' placeholder='Enter total cost...' disabled></div> \
                </div> \
                \
                <div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Tracking Number:</b></div> \
                    <div class='right'><input id='" + this.type + "PackTrackingNum_" + this.packID + "' placeholder='Enter tracking #...' " + disabled + "></div> \
                </div> \
                \
                <div class='inputRow'> \
                    <div class='" + this.type + "_left'><b>Selected Items:</b></div> \
                    <div class='right'> \
                        <input id='" + this.type + "PackSelectedItem_" + this.packID + "' size='5' value='0' disabled> \
                        <button class='yellowBtn' id='" + this.type + "PackAddItem_" + this.packID + "' " + disabled + ">Add Items</button> \
                    </div> \
                </div> \
                \
                <hr class='formDivider'> \
                <div class='row formConfirmation'> \
                    <div class='" + this.type + "_left'><button class='navyBtn' id='" + this.type + "PackViewItem_" + this.packID + "'>View Items</button></div> \
                    <div class='right' style='text-align:right;'> \
                        <button class='blueBtn' id='" + this.type + "PackEdit_" + this.packID + "'>" + ((disabled != '') ? 'Edit' : 'Submit') + "</button> \
                        <button class='redBtn' id='" + this.type + "PackDelete_" + this.packID + "'>Delete</button> \
                    </div> \
	            </div> \
                \
        </div></div>";  //closing formBody and formContainer
    
    $(id).append(htmlData);
};

/* ----------------- standardPack METHODS ----------------- */
// Default Constructor Closure Method for counting new Packs
var standardPack = (function() {
    var packID = 0;
    
    return function standardPack() {
        shippingGUIPack.call(this, 'standard');
        this.packID = packID++;
    };
})();

// Allows access to parent methods
standardPack.prototype = Object.create(shippingGUIPack.prototype);
Object.defineProperty(standardPack.prototype, 'constructor', { 
    value: standardPack, 
    enumerable: false,
    writable: true
});

/* ----------------- customPack METHODS ----------------- */
// Default Constructor Closure Method for counting new Custom Packs
var customPack = (function() {
    var packID = 0;
    
    return function customPack() {
        shippingGUIPack.call(this, 'custom');
        this.packID = packID++;
        this.stdBoxes = null;
        this.length = '';
        this.width = '';
        this.height = '';
    };
})();

// Allows access to parent methods
customPack.prototype = Object.create(shippingGUIPack.prototype);
Object.defineProperty(customPack.prototype, 'constructor', {
    value: customPack, 
    enumerable: false,
    writable: true 
});

customPack.prototype.updateData = function(dataObj) {
    shippingGUIPack.prototype.updateData.call(this, dataObj);
    this.stdBoxes = dataObj.stdBoxes;
    this.length = dataObj.length;
    this.width = dataObj.width;
    this.height = dataObj.height;
};

/* ----------------- Group Shipment Pack METHODS ----------------- */
function groupShipmentPack() {
    shippingGUIPack.call(this, 'groupShipment');
    this.length = '';
    this.width = '';
    this.height = '';
}

// Allows access to parent methods
groupShipmentPack.prototype = Object.create(shippingGUIPack.prototype);
Object.defineProperty(groupShipmentPack.prototype, 'constructor', { 
    value: groupShipmentPack, 
    enumerable: false,
    writable: true 
});

///////////////////// Main logic for Workorder Shipping GUI /////////////////////
function getObjID(id) { return id.substring(id.indexOf('_') + 1); }

function getItems(dataArr, callBack) {
    $("#loader").show();

    $.ajax({
        type: 'POST',
        url: site_root + 'ajax/workorder/getItemsofPackage.php',
        dataType: 'json',
        data: dataArr,
        error: function (response) { console.log(response); },
        complete: function (response) {
            $("#loader").hide();
            // If the status is FALSE, set array to empty regardless of return data
            if(response.responseJSON.status)
                callBack(response.responseJSON.data);
            else
                callBack({});
        }
    });
}

function updateItems(dataArr, callback=null) {
    $.ajax({
        type: 'POST',
        url: site_root + 'ajax/workorder/updateItemsToPackage.php',
        data: dataArr,
        error: function (response) { console.log(response); },
        complete: function () {
            if(callback != null && typeof callback == 'function') callback();
        }
    });
}

function loadItemView(dataArr, check=false, userInput=false) {
    var html = '';
    if(Object.keys(dataArr).length > 0) {
        html = '<div class="grid grid-row-gap-10" id="modalGrid">';
        
        $.each(dataArr, function (key, val) {
            html += modalGridItemHtml(key, val, check);
        });
        html += '</div>';
    }
    else html = '<b>No item to display.</b>';

    return html;
}

/**
 *  Quickly validates the user input for add items to pack on large orders.
 *  Easier and faster than dealing with a dedicated selector.
 *  This is such a long function name but I really couldn't think of a better one :<
 * 
 *  @param {object} input 
 *  @param {int}    max 
 */
function validateLargeOrderItemsInput(ele, max) {
    if(ele.value > max) $(ele).val(max);
    else if(ele.value <= 0) $(ele).val(0);
}

function loadGroupView(data, check=false, userInput=false) {
    var html = '';
    if (Object.keys(data).length > 0) {
        html += '<div class="grid grid-row-gap-10" id="modalGrid">';

        $.each(data, function (key, val) {
            // For large orders - allow users to type in quantity
            let numberOfItems = '';
            if(userInput) {
                numberOfItems = '<input class="addItemsToPack" type="number" value="0" \
                                        data-max-pack-items="' + val['numOfItems'] + '" \
                                        onchange="validateLargeOrderItemsInput(this,' + val['numOfItems'] + ');"> / ';
            }
            numberOfItems += val['numOfItems'];

            let cell = '<div class="tableRowDisplay"> \
                            <span class="tableCellLeft"><b>Items:</b></span> \
                            <span class="tableCellRight">' + numberOfItems + '</span> \
                        </div>';

            // html += modalGridItemHtml(key, val, check, cell);
            // let limit = (val.apiIdList.length > 50) ? val.apiIdList.substring(0, 45) + "..." : val.apiIdList;
            html += modalGridItemHtml(key, val, check, cell);
        });
        html += '</div>';
    }
    else html = '<b>No item to display.</b>';

    return html;
}

function enableAddPack(selector) {
    if (isStandard(selector) && Object.keys(standardPacks).length <= 9)
        $('#addNewStandardPack').prop('disabled', false).removeClass("grayBtn").addClass("yellowBtn");
    else if (!isStandard(selector) && Object.keys(customPacks).length <= 9)
        $('#addNewCustomPack').prop('disabled', false).removeClass("grayBtn").addClass("yellowBtn");
}

function disableAddPack(selector = '#addNewStandardPack, #addNewCustomPack') {
    $(selector).prop('disabled', true).removeClass("yellowBtn").addClass("grayBtn");
}

function openPacks(selector = 'Pack') {
    var updatePending = false;
    $('[id*="' + selector + 'Edit_"]').each(function () {
        if ($(this).text() == 'Submit') {
            return updatePending = true;    // exit the loop
        }
    });
    return updatePending;
}

function createNewPack(setDisabled = '') {
    let newPack = new standardPack();
    standardPacks[newPack.packID] = newPack;
    newPack.createHtmlObj('#standardPackArea', standardPackDD, shippingCurrency, setDisabled);

    if (!setDisabled)
        setInputErrors('#standardPack', newPack.packID);

    let parent = '#standardPack_' + newPack.packID;
    let size = Object.keys(standardPacks).length;
    $('#standardPackTotal, ' + parent + ' .standardPackCount').text(size);
    $(parent + ' .standardPackCount').data('count', size);

    disableAddPack();
}

function createNewCustomPack(setDisabled = '') {
    let newCustom = new customPack();
    customPacks[newCustom.packID] = newCustom;
    newCustom.createHtmlObj('#customPackArea', standardPackDD, shippingCurrency, setDisabled);

    if (!setDisabled)
        setInputErrors('#customPack', newCustom.packID);

    let parent = '#customPack_' + newCustom.packID;
    let size = Object.keys(customPacks).length;
    $('#customPackTotal, ' + parent + ' .customPackCount').text(size);
    $(parent + ' .customPackCount').data('count', size);

    disableAddPack();
}

function deleteCustomPackStdBox(packObj, boxId) {
    $('#customPack_' + packObj + ' [data-std-box="' + boxId + '"]').remove();
    if (boxId === $('#customPack_' + packObj + ' [data-std-box]').length)
        return;

    // Re-order data-* attr of the remaining optional boxes if not the last item
    let i = 2;
    $('#customPack_' + packObj + ' [data-std-box]:gt(1)').each(function () {
        $(this).attr('data-std-box', i);
        $(this).find('[data-std-data]').attr('data-std-data', i);
        i++;
    });
}

// Basic validation for additional shipping information
function basicValidation() {
    if ($('#manualShipReason').val().trim() == '' && $('#manualShipReasonCategory').val() == 'Other') {
        $('#manualShipReason').setError();
        openAlert('Manual Shipping Reason required.');
        return false;
    } 
    else if ($('#manualShipReasonCategory').val() == '') {
        $('#manualShipReasonCategory').setError();
        openAlert('Manual Shipping Category required.');
        return false;
    } 
    else if ($('#carrierShipService').val() == '') {
        $('#carrierShipService').setError();
        openAlert('Selection for <b>Set Carrier + Shipping Service<b> required.');
        return false;
    } 
    else if (openPacks()) {
        openAlert('<b>Error:</b> A pack has not been updated. Update or delete the pack to continue.');
        return false;
    }
    return true;
}

//////////////// Extra Helpers ////////////////
/**
 *  Record items that are newly added & removed for add items to pack.
 *  Shared between large and small shipping orders.
 */
function AddPackConfirmationRecord(selector, objID, checked) {
    var diff = [];
    if (isStandard(selector) && standardPacks[objID].currIDsInPack != '')
        diff = standardPacks[objID].currIDsInPack.split(',').filter(x => checked.indexOf(x) === -1);
    else if (!isStandard(selector) && customPacks[objID].currIDsInPack != '')
        diff = customPacks[objID].currIDsInPack.split(',').filter(x => checked.indexOf(x) === -1);

    // Update the count on the pack UI
    var ele = $(selector + 'SelectedItem_' + objID);
    ele.val(checked.length);

    if (ele.val() > 0) {
        ele.revertError();

        if (isStandard(selector)) {
            standardPacks[objID].newIDsInPack = checked.toString();
            standardPacks[objID].newIDsRemoved = diff.toString();
        } 
        else {
            customPacks[objID].newIDsInPack = checked.toString();
            customPacks[objID].newIDsRemoved = diff.toString();
        }
    } 
    else ele.setError();
}

/**
 *  Returns the base HTML cell content for pack items.
 *  Shared between large and small shipping orders.
 */
function modalGridItemHtml(title, content, addCheckbox, addCells='') {
    var checked = (content['packageName'] !== 'N/A') ? 'checked' : '';
    // To-do: eventually deprecate and remove the name tag.
    var checkbox = (addCheckbox) ? '<input type="checkbox" class="markImg cursorPointer" name="' + title + '" ' + checked + '>' : '';

    let limit = (content.apiIdList.length > 50) ? content.apiIdList.substring(0, 45) + "..." : content.apiIdList;
    let html = '<div class="modalGridItem tableDisplay" data-item-cell-id="' + title + '"> \
                    <div class="tableRowDisplay"> \
                        <span class="tableCellLeft">' + checkbox + '</span> \
                        <span class="tableCellRight"><img src="' + content['img'] + '"></span> \
                    </div> \
                    <div class="tableRowDisplay"> \
                        <span class="tableCellLeft"><b>Image ID:</b></span> \
                        <span class="tableCellRight" style="word-break:break-all;">' + limit + '</span> \
                    </div> \
                    <div class="tableRowDisplay"> \
                        <span class="tableCellLeft"><b>Label:</b></span> \
                        <span class="tableCellRight">' + content['label'] + '</span> \
                    </div> \
                    <div class="tableRowDisplay"> \
                        <span class="tableCellLeft"><b>Package:</b></span> \
                        <span class="tableCellRight">' + content['packageName'] + '</span> \
                    </div>' +
                    addCells +
                '</div>';
    
    return html;
}

//////////////// Pack Object Functionalities ////////////////
$('[id$="PackArea"]').on('click', '[id*="addStdBox_"]', function () {
    let packId = getObjID(this.id);
    let stdBoxCount = $('#customPack_' + packId + ' .customPackBoxes').length;

    if (stdBoxCount >= 5) {
        openAlert('The current limit allowed for adding Standard Boxes is 5. \
            Please either contact the administrator if you need a limit increase, \
            or <b>edit/delete</b> an existing Standard Pack to continue.');
        return;
    }

    var html = "<div class='inputRow' data-std-box='" + stdBoxCount + "'> \
                    <div class='custom_left'> \
                        <button class='redBtn deleteStdBox' data-ref-id='" + packId + "'>Delete Standard Box</button> \
                    </div> \
                    <div class='right stdBoxData' data-std-data='" + stdBoxCount + "'> \
                        <select class='customPackBoxes'>" + standardPackDD + "</select> \
                    <input type='number' class='customPackQuantity' placeholder='Qty...'> \
                    </div> \
                </div>";

    $('#customPack_' + packId + ' [data-std-box="' + (stdBoxCount - 1) + '"]').after(html);
})
.on('click', '.deleteStdBox', function () {
    deleteCustomPackStdBox($(this).data('ref-id'), $(this).parents(':eq(1)').data('std-box'));
})
.on('click', '[id*="PackAddItem_"]', function () {
    var selector = getSelector(this.id);
    var objID = getObjID(this.id);
    // var boxNameObj = $(selector + 'Name_' + objID + ' option:selected');
    var boxNameObj = '';

    if(isStandard(selector)) {
        boxNameObj = $(selector + 'Name_' + objID + ' option:selected');

        if(boxNameObj.val() == 0) {
            openAlert('Edit the pack information and select a package name for the pack before continuing.');
            return;
        }
    }
    else if(!isStandard(selector)) {
        // First box is always mandatory
        boxNameObj = $(selector + '_' + objID + ' .stdBoxData[data-std-data="0"] .customPackBoxes option:selected');

        if(boxNameObj.val() == 0) {
            openAlert('Edit the pack information and select at least the first standard box name for the custom pack before continuing.');
            return;
        }
    }

    $('#addItemHeader').text('Select Items for Package - ' + boxNameObj.text());
    var items = (isStandard(selector)) ? standardPacks[objID].currIDsInPack : customPacks[objID].currIDsInPack;

    // Get all items and total to select for the pack
    getItems({
        orderID: orderId,
        itemID: items,
        largeOrder: isLargeOrder,
        searchEmpty: 1
    }, function (response) {
        packGroupData = response;
        // To-do: fix the drop down styling since it's only temporary
        let selectAllHtml = '<div> \
                                <input type="checkbox" class="markImg cursorPointer" id="selectAll"> \
                            </div>\
                            <div style="padding-left:10px; font-weight:600;">Select All Items</div>';

        // To-do: add this in later
        // let temp = '<div class="searchContainer" id=""> \
        //                 <div class="searchItem"> \
        //                     <div> \
        //                         <span>Group By:</span> \
        //                         <div id=""> \
        //                             <span id="itemsSearchPlaceholder"> \
        //                                 Select the button below in the order you want to aggregate the data. \
        //                                 Not all selections are required.\
        //                             </span> \
        //                             <button class="blueBtn btnOptions"><span class="minusOption" data-aggregate-id="category">Category</span></button> \
        //                             <button class="blueBtn btnOptions"><span class="minusOption" data-aggregate-id="subCategory">Sub-Category</span></button> \
        //                         </div> \
        //                     </div> \
        //                     <button class="searchBtn" id="">Go</button> \
        //                     <div id=""> \
        //                         <button class="blueBtn btnOptions"><span class="addOption" data-aggregate-id="department">Department</span></button> \
        //                         <button class="blueBtn btnOptions"><span class="addOption" data-aggregate-id="apiId">Image ID</span></button> \
        //                         <button class="blueBtn btnOptions"><span class="addOption" data-aggregate-id="title">SKU</span></button> \
        //                     </div> \
        //                 </div> \
        //             </div>';


        // $('#addItemSubHeader').html(
        //     '<div><input type="checkbox" class="markImg cursorPointer" id="selectAll"></div>\
        //     <div style="padding-left:10px; font-weight:600;">Select All Items</div>'
        // );
        // $('#addItemSubHeader').html(html);

        if(isLargeOrder) {
            let html = '<div style="width:100%; display:flex; align-items:center; margin-bottom:20px;"> \
                            <b>Group By:</b> \
                            <select id="addItemSearchFilter" style="margin-left:10px; margin-right:10px;"> \
                                <option value="os_apiId" selected>Image ID</option> \
                                <option value="os_sku">SKU</option> \
                                <option value="s_category">Category</option> \
                                <option value="s_subCategory">Sub-category</option> \
                            </select> \
                            <button class="searchBtn" id="addItemsSearchGo">Go</button> \
                        </div>' + selectAllHtml;
            $('#addItemSubHeader').html(html);

            // Load modal and process new data on confirmation
            openConfirm(loadGroupView(response, true, true),
                function () { /* Do nothing if user cancels */ },
                function () {
                    response = packGroupData;   // on submit, data might be changed from new filters

                    var checked = [];
                    // Foreach checked items in Add Items to Pack...
                    $('#addItemModal input.markImg:not(#selectAll)').each(function (i) {
                        if ($(this).prop('checked')) {
                            let parent = $(this).closest("div.modalGridItem");
                            let apiId = parent.data('item-cell-id');
                            // ...convert the string of IDs into an array of int and push it into checked
                            let temp = response[apiId].items.split(',');
                            let userCount = parent.find('div.tableRowDisplay:last-child input.addItemsToPack').val();
                            // Grab the # of Ids based on user input
                            let selectIds = (userCount != temp.length) ? temp.slice(0, userCount) : temp;

                            $.merge(checked, selectIds);
                        }
                    });
                    // Get item that is newly unchecked
                    AddPackConfirmationRecord(selector, objID, checked);
                }, {
                formTxtId: 'addItemForm',
                modalObjId: 'addItemModal',
                cancelId: 'addItemCancel',
                confirmId: 'addItemConfirm'
            });

            // Grab the number of items linked to the pack name - used for "Edit" pack items
            getItems({
                orderID: orderId,
                largeOrder: isLargeOrder,
                name: boxNameObj.text()
            }, function(response) {
                $.each(response, function(key, val) {
                    let item = $('#addItemModal #addItemForm #modalGrid > .modalGridItem[data-item-cell-id="' + key + '"]')
                                .find('.tableRowDisplay:last-child input.addItemsToPack');

                    $(item).val(val.numOfItems);
                });
            });
        }
        else {
            $('#addItemSubHeader').html(selectAllHtml);

            openConfirm(loadItemView(response, true),
                function () { /* Do nothing if user cancels */ },
                function () {
                    var checked = [];
                    $('#addItemModal input:not(#selectAll)').each(function (i) {
                        if ($(this).prop('checked'))
                            checked.push($(this).prop('name'));
                    });
                    // Get item that is newly unchecked
                    AddPackConfirmationRecord(selector, objID, checked);
                }, {
                formTxtId: 'addItemForm',
                modalObjId: 'addItemModal',
                cancelId: 'addItemCancel',
                confirmId: 'addItemConfirm'
            });
        }
    });
})
.on('click', '[id*="PackViewItem_"]', function () {
    var objID = getObjID(this.id);

    if (isStandard(getSelector(this.id))) {
        var items = standardPacks[objID].currIDsInPack;
        var boxName = standardPacks[objID].boxName;
    }
    else {
        var items = customPacks[objID].currIDsInPack;
        var boxName = customPacks[objID].boxName;
    }

    getItems({
        orderID: orderId,
        itemID: items,
        largeOrder: isLargeOrder,
        searchItem: 1
    }, function (response) {
        $('#viewItemHeader').text('Item in Package ' + boxName);
        if(isLargeOrder) {
            openAlert(loadGroupView(response), {
                formTxtId: 'viewItemForm',
                modalObjId: 'viewItemModal',
                confirmId: 'viewItemConfirm'
            });
        }
        else {
            openAlert(loadItemView(response), {
                formTxtId: 'viewItemForm',
                modalObjId: 'viewItemModal',
                confirmId: 'viewItemConfirm'
            });
        }
    });
})
.on('click', '[id*="PackEdit_"]', function () {
    var objID = getObjID(this.id);
    var selector = getSelector(this.id);
    var parentID = selector + '_' + objID;

    if ($(this).text() == 'Edit') {
        if (openPacks()) // Restrict multiple pack edits
            openAlert('<b>Error:</b> Only 1 pack can be edited at a time. Delete or Submit an open pack before continuing.');
        else {
            $(this).text('Submit');
            $(parentID + ' *:disabled:not([id*="SelectedItem_"], [id*="TotalCost_"])').prop('disabled', false);
            setInputErrors(selector, objID);
            disableAddPack();
        }
        return;
    }

    var error = false;
    // Don't update if there are errors remaining
    $(parentID + ' input').each(function (i, val) {
        if ($('#' + val.id).isError()) return error = true;
    });
    if(error) return;

    // Don't update if there are repeating Tracking Numbers in Standard/Custom packs
    var trackNum = $(selector + 'TrackingNum_' + objID).val();
    $.each(standardPacks, function (key) {
        if (isStandard(selector) && key == objID)
            return;
        else if (standardPacks[key]['trackingNum'] == trackNum) {
            openAlert('<b>Error:</b> This tracking number already exists in a Pack.');
            $(selector + 'TrackingNum_' + objID).setError();
            return error = true;
        }
    });
    if(error) return;

    $.each(customPacks, function (key) {
        if (!isStandard(selector) && key == objID)
            return;
        else if (customPacks[key]['trackingNum'] == trackNum) {
            openAlert('<b>Error:</b> This tracking number already exists in a Custom Pack.');
            $(selector + 'TrackingNum_' + objID).setError();
            return error = true;
        }
    });
    if(error) return;

    // Custom Pack Only! Don't update if there isn't at least 2 standard boxes
    if (!isStandard(selector)) {
        var setToDelete = [];
        var stdNamesArr = [];
        var stdBoxObj = {};
        /* We need to mimic a 'shift' effect of deleting rows with invalid
         * (name, qty) pairs by copying the data of the next available
         * data row into the empty rows on top and deleting the old row. */
        $(parentID + ' .stdBoxData').each(function () {
            var stdName = $(this).find('select');
            var stdQty = $(this).find('input');

            if (stdName.val() !== '0' && isValidRange(stdQty.val())) {
                stdNamesArr.push(stdName.find(':selected').text());
                stdBoxObj[stdName.find(':selected').val()] = stdQty.val();
            }
            else {
                var shifts = false;
                for (var i = $(this).data('std-data') + 1; i < $(parentID + ' [data-std-data]').length; i++) {
                    let next = $(parentID + ' [data-std-data="' + i + '"]');
                    let nextName = next.find('select');
                    let nextQty = next.find('input');

                    if (nextName.val() !== '0' && isValidRange(nextQty.val())) {
                        stdName.val(nextName.val()).removeClass('setError');
                        stdQty.val(nextQty.val()).removeClass('setError');
                        // Record fixed (name, qty) pair
                        stdNamesArr.push(stdName.find(':selected').text());
                        stdBoxObj[stdName.find(':selected').val()] = stdQty.val();
                        // Erase old (name, qty) pair and exit inner loop
                        nextName.val('0');
                        nextQty.val('');
                        shifts = true;
                        break;
                    }
                }
                if (shifts) return;  // Next outer loop iteration

                // If no shifts take place, mark the extras for deletion
                if ($(this).data('std-data') === 0) {
                    if ($(parentID + ' [data-std-box="0"] select').val() === '0') {
                        $(parentID + ' [data-std-box="0"] select').addClass('setError');
                        openAlert('<b>Error:</b> A valid Standard Box Name is required.');
                        return error = true;
                    }
                    if (!isValidRange($(parentID + ' [data-std-box="0"] input').val())) {
                        $(parentID + ' [data-std-box="0"] input').addClass('setError');
                        openAlert('<b>Error:</b> A valid Standard Box Quantity is required for the selection.');
                        return error = true;
                    }
                } 
                else if ($(this).data('std-data') === 1) {
                    stdName.val('0');
                    stdQty.val('');
                } 
                else setToDelete.push($(this).data('std-data'));
            }
        });

        // Delete invalid standard boxes before continuing
        for (let i of setToDelete.reverse()) {
            deleteCustomPackStdBox(objID, i); 
        }
    }
    if(error) return;

    // Disable edit abilities to submit & update data
    $(this).text('Edit');
    $(parentID + ' *:enabled:not(.formDivider~div button)').prop('disabled', true);

    if (selector.indexOf('gs') !== -1) return;

    var dataObj = {
        'boxID': $(selector + 'Name_' + objID + ' option:selected').val(),
        'weight': $(selector + 'Weight_' + objID).val(),
        'baseCost': $(selector + 'BaseCost_' + objID).val(),
        'surchargeCost': $(selector + 'SurchargeCost_' + objID).val(),
        'totalCost': $(selector + 'TotalCost_' + objID).val(),
        'trackingNum': trackNum,
        'itemsInPack': $(selector + 'SelectedItem_' + objID).val()
    };

    if (isStandard(selector)) {
        dataObj.boxName = $(selector + 'Name_' + objID + ' option:selected').text();
        standardPacks[objID].updateData(dataObj);
        standardPacks[objID].currIDsInPack = standardPacks[objID].newIDsInPack;
        standardPacks[objID].currIDsRemoved = standardPacks[objID].newIDsRemoved;
    }
    else {
        dataObj.boxName = stdNamesArr.join(', ');
        dataObj.length = $(selector + 'Length_' + objID).val();
        dataObj.width = $(selector + 'Width_' + objID).val();
        dataObj.height = $(selector + 'Height_' + objID).val();
        dataObj.stdBoxes = stdBoxObj;
        customPacks[objID].updateData(dataObj);
        customPacks[objID].currIDsInPack = customPacks[objID].newIDsInPack;
        customPacks[objID].currIDsRemoved = customPacks[objID].newIDsRemoved;
    }

    updateItems({
        addItems: (isStandard(selector)) ? standardPacks[objID].currIDsInPack : customPacks[objID].currIDsInPack,
        deleteItems: (isStandard(selector)) ? standardPacks[objID].currIDsRemoved : customPacks[objID].currIDsRemoved,
        name: dataObj.boxName
    }, function () {
        // Allow users to add more packs if there's still remaining items
        getItems({
            orderID: orderId,
            largeOrder: isLargeOrder,
            searchEmpty: 1
        }, function (response) {
            if (Object.keys(response).length > 0) {
                if (!openPacks('standardPack'))
                    enableAddPack('standardPack');
                if (!openPacks('customPack'))
                    enableAddPack('customPack');
            }
        });
    });
})
.on('click', '[id*="PackDelete_"]', function () {
    var objID = getObjID(this.id);
    var selector = getSelector(this.id);

    // Delete package name associated with selected items
    updateItems({
        deleteItems: (isStandard(selector)) ? standardPacks[objID].currIDsInPack : customPacks[objID].currIDsInPack
    });

    // Delete HTML object & array pointer reference, & update pack count
    $(selector + '_' + objID).remove();
    if (isStandard(selector)) {
        // No need to update pack count if last pack is to be deleted
        let size = Object.keys(standardPacks).length;
        if (size != $('.standardPackCount').last().data()) {
            $('.standardPackCount').each(function (i) {
                $(this).text(i + 1).data('count', i + 1);
            });
        }

        delete standardPacks[objID];
        $('#standardPackTotal').text(Object.keys(standardPacks).length);
    }
    else {
        // No need to update pack count if last pack is to be deleted
        let size = Object.keys(customPacks).length;
        if (size != $('.customPackCount').last().data()) {
            $('.customPackCount').each(function (i) {
                $(this).text(i + 1).data('count', i + 1);
            });
        }

        delete customPacks[objID];
        $('#customPackTotal').text(Object.keys(customPacks).length);
    }

    // Toggle Add New button on standard and custom pack
    if (!openPacks('standardPack'))
        enableAddPack('standardPack');
    if (!openPacks('customPack'))
        enableAddPack('customPack');
})
.on('change', '[id*="Name_"]', function () {
    var ele = $('#' + this.id);

    if (ele.val() > 0) ele.revertError();
    else ele.setError();
})
.on('change', '.customPackBoxes', function () {
    if ($(this).val() > 0) $(this).removeClass('setError');
    else $(this).addClass('setError');

    let parent = $(this);
    let parentData = $(this).parent().data('std-data');
    $('.customPackBoxes').each(function () {
        if ($(this).val() != '0' && $(this).val() === parent.val() && $(this).parent().data('std-data') !== parentData) {
            openAlert('There is already a <b>Standard Box</b> with the selected name. \
                Please update the quantity of the existing box or contact an \
                administrator if you need a limit increase.');

            parent.val('0');
            return false;
        }
    });
})
.on('change', '.customPackQuantity', function () {
    var userVal = Math.round($(this).val());

    if (isValidRange(userVal)) 
        $(this).val(userVal).removeClass('setError');
    else if (userVal > maxStdBoxQty) {
        openAlert('<b>Error:</b> Maximum limit allowed for quantity is ' + maxStdBoxQty + '. Please contact an administrator if you need a limit increase.');
        $(this).addClass('setError');
    } 
    else {
        openAlert('<b>Error:</b> Minimum limit allowed for quantity is ' + minStdBoxQty + '.');
        $(this).addClass('setError');
    }
})
.on('change', '[id*="Length_"], [id*="Width_"], [id*="Height_"], [id*="Weight_"]', function () {
    var ele = $('#' + this.id);

    if (beautifyNumbers(ele.val(), 3) > 0) {
        ele.revertError();
        ele.val(beautifyNumbers(ele.val(), 3));
    }
    else ele.setError();
})
.on('change', '[id*="BaseCost_"], [id*="SurchargeCost_"]', function () {
    var baseCostEle = $(getSelector(this.id) + 'BaseCost_' + getObjID(this.id));
    var surchargeCostEle = $(getSelector(this.id) + 'SurchargeCost_' + getObjID(this.id));
    // Cost variables
    var totalCost = 0.0;
    var baseCost = parseFloat(beautifyNumbers(baseCostEle.val(), 2)) || 0;
    var surchargeCost = parseFloat(beautifyNumbers(surchargeCostEle.val(), 2)) || 0;

    // Verify Base Cost
    if (baseCost >= 0 && baseCost <= baseCostLimit) {
        totalCost += baseCost;
        baseCostEle.val(baseCost).revertError();
    }
    else baseCostEle.setError();

    // Verify Surcharge Cost
    if (surchargeCost >= 0 && surchargeCost <= surchargeCostLimit) {
        totalCost += surchargeCost;
        surchargeCostEle.val(surchargeCost).revertError();
    }
    else surchargeCostEle.setError();

    // Verify that Total Cost doesn't exceed charge limit
    if(totalCost > totalCostLimit) {
        baseCostEle.setError();
        surchargeCostEle.setError();
        openAlert("<b>Total Cost</b> exceed the total charge limit. \
            Please review and adjust the <b>Base Cost</b> and <b>Surcharge Cost</b> before proceeding.");
        $(getSelector(this.id) + 'TotalCost_' + getObjID(this.id)).val("");
    }
    else $(getSelector(this.id) + 'TotalCost_' + getObjID(this.id)).val(totalCost);
})
.on('change', '[id*="TrackingNum_"]', function () {
    var ele = $('#' + this.id);
    var matched = ele.val().match(/^[a-zA-Z0-9]+$/);

    if (matched == null) ele.setError();
    else ele.revertError();
});

//////////////// Add Items to Pack ////////////////
$('#addItemModal').on('change', 'input[id=selectAll]', function () {
    var selector = '#addItemModal input[type="checkbox"]';

    if ($(this).prop('checked'))
        $(selector).prop('checked', true);
    else
        $(selector).prop('checked', false);

    // For large orders, set all items count to max on checked, 0 on unchecked
    if(isLargeOrder) {
        let checkedItems = $(selector + ':checked:not(#selectAll)');

        if(checkedItems.length > 0) {
            $.each(checkedItems, function() {
                let ele = $(this).closest('div.tableDisplay').find('input.addItemsToPack');
                ele.val(ele.data('max-pack-items'));
            });
        }
        else $('#addItemModal div.tableDisplay input.addItemsToPack').val(0);
    }
}).on('change', 'div#modalGrid input.markImg', function() {
    // Update item count for large orders only
    if(!isLargeOrder) return;

    var ele = $(this).closest('div.tableDisplay').find('input.addItemsToPack');
    // On checked item, change value to max; 0 otherwise
    if($(this).prop('checked')) ele.val(ele.data('max-pack-items'));
    else ele.val(0);
});

$('div#addItemModal').on('click', 'button#addItemsSearchGo', function() {
    getItems({
        orderID: orderId,
        largeOrder: isLargeOrder,
        largeOrderGroup: $('#addItemSearchFilter').val(),
        searchEmpty: 1
    }, function(response) {
        packGroupData = response;
        
        let groupView = loadGroupView(response, true, true);
        $('div#addItemModal #addItemForm').html(groupView);
    });
});

//////////////// View All Item(s) in Pack ////////////////
$('#viewAllItems').click(function () {
    getItems({ 
            orderID: orderId,
            largeOrder: isLargeOrder
        },
        function (response) {
            if(isLargeOrder) {
                openAlert(loadGroupView(response), {
                    formTxtId: 'viewAllForm',
                    modalObjId: 'viewAllModal',
                    confirmId: 'viewAllConfirm'
                });
            }
            else {
                openAlert(loadItemView(response), {
                    formTxtId: 'viewAllForm',
                    modalObjId: 'viewAllModal',
                    confirmId: 'viewAllConfirm'
                });
            }
        }
    );
});

//////////////// Verify & Submit Ship Order ////////////////
$("#shippingPrice").change(function() {
    let val = beautifyNumbers(this.value, 2);
    if(val < 0 || val > totalCostLimit) {
        $(this).val(shippingPrice);
        openAlert("Shipping Price value cannot be less than 0 or greater than " + totalCostLimit + ".");
    }
    else if(this.value === "") {
        $(this).val(shippingPrice);
        openAlert("Shipping Price value cannot be empty.");
    }
    else $(this).val(val);
});

$('#manualShipReason').change(function () {
    if ($(this).val().trim() == '' && $('#manualShipReasonCategory').val() == 'Other')
        $('#' + this.id).setError();
    else
        $('#' + this.id).revertError();
});

$('#carrierShipService').change(function () {
    if ($(this).val() == '')
        $('#' + this.id).setError();
    else
        $('#' + this.id).revertError();
});

$('#manualShipReasonCategory').change(function () {
    if ($(this).val().trim() == '')
        $('#' + this.id).setError();
    else
        $('#' + this.id).revertError();
    
    if($('#manualShipReasonCategory').val() != 'Other')
        $('#manualShipReason').revertError();
});

$('#shipOrder').click(function () {
    if (!basicValidation()) return;

    getItems({
        orderID: orderId,
        searchEmpty: 1
    }, function (response) {
        if (!jQuery.isEmptyObject(response)) {
            openAlert('<b>Error:</b> Not all order items are assigned a pack. Assign each item to a pack to continue.');
            return;
        }

        openConfirm("Ensure that all pack information is accurate before submitting. Select OK to ship order.",
            function() { /* Do nothing if user cancels */},
            function() {
                $("#loader").show();

                submitForm({
                    standard: JSON.stringify(standardPacks),
                    custom: JSON.stringify(customPacks),
                    shipCost: ($("#shippingPrice").length) ? $("#shippingPrice").val() : shippingPrice,
                    shipModel: ($("#shippingModelID").length) ? $("#shippingModelID").val() : shippingModelId,
                    manualShipReason: $('#manualShipReason').val(),
                    manualShipReasonCategory: $('#manualShipReasonCategory').val(),
                    carrier_id_and_shipping_service_id: $('#carrierShipService').val(),
                    locationId: orderLocId,
                    newMethod: '1'
                }, site_root + 'actions/admin/setShipping.php?id=' + orderId + '&location=order&synId=' + synOrderId);
            }
        );
    });
});

$('#shipGroupedShipment').click(function () {
    if (!basicValidation()) return;

    submitForm({
        "orderId": orderId,
        "groupedShipmentId": groupedShipmentId,
        "shipCost": shippingPrice,
        "customLength6": $('#gsPackLength_0').val(),
        "customWidth6": $('#gsPackWidth_0').val(),
        "customHeight6": $('#gsPackHeight_0').val(),
        "customWeight6": $('#gsPackWeight_0').val(),
        "customBaseCost6": $('#gsPackBaseCost_0').val(),
        "customSurchargeCost6": $('#gsPackSurchargeCost_0').val(),
        "customTotalCost6": $('#gsPackTotalCost_0').val(),
        "customTrackingNumber6": $('#gsPackTrackingNum_0').val(),
        "carrier_id_and_shipping_service_id": $('#carrierShipService').val()
    }, site_root + 'actions/admin/setShippingForGroupedShipment.php');
});

//////////////// MAIN ////////////////
$(document).ready(function() {
    // Check if group shipment is False on document load
    if ($('#gsPackArea').length === 0) {
        createNewPack();
        getItems({ orderID: orderId }, function (response) {
            updateItems({ deleteItems: Object.keys(response).toString() });
        });
    }
    else setInputErrors('#gsPack', 0);
});