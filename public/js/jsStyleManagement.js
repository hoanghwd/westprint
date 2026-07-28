/* 
    Management for all shared JS/JQuery functions across all webpages.
    This file should only host functions that are shared across multiple
    types of pages (i.e. reports, assembly management, etc.). If a function
    is only used for 1 type (ex: reports), put it into its own file.
    If this file gets too long (over 1k lines, or over 20 functions) 
    make another one. If JQuery methods become a norm, make a separate
    file for them.

    Created on : Mar 10, 2020
    Author     : Jenny Nguyen
*/

//////////////// Global Shared Variables ////////////////
//Master Regex Key to validate inputs
const regexCode = {
    "default": /.*/,
    "alphaAll": /^[a-zA-Z]+$/,
    "alphaLow": /^[a-z]+$/,
    "alphaHigh": /^[A-Z]+$/,
    "numeric": /^[0-9]+$/,
    "alphaNumAll": /^[a-zA-Z0-9]+$/,
    "alphaNumLow": /^[a-z0-9]+$/,
    "alphaNumHigh": /^[A-Z0-9]+$/,
    "filePath" : /^[a-zA-Z\_\/]+$/,
    "userName": /^[a-zA-Z0-9\_\.]+$/,
    "ignoreSpecialChars": /([^a-zA-Z0-9,\_\.\s-\|]+)|(\s{2,})/g,
    "passwords": /^[a-zA-z0-9 \~\!\@\#\$\%\^\&\*\_\-\+\=\`\|\(\)\{\}\[\]\:\;\"\'\<\>\,\.\?\/]{8,}$/
};

//////////////// Dynamic Form Creation ////////////////
/* Dynamically create a POST/GET form with n numbers of data entries based on 
 * key -> value pair.
 * 
 * @param {array object} dataArr
 * Ex:
 *  var dataArr = {
        "key": "val",
        "int": 0
    };
 */
function submitForm(dataArr, action="", formMethod="POST") {
    var form = document.createElement("form");
    form.id = "postForm";
    form.method = formMethod;
    
    if(action != "") form.action = action;
    
    for(var ele in dataArr) {
        var formData = document.createElement("input");
        formData.setAttribute("type", "hidden");
        formData.name = ele;
        formData.value = dataArr[ele];
        form.appendChild(formData);
    }
    
    document.body.appendChild(form);
    form.submit();
}

/* Reset form attributes to unified values. Any custom reset/revert per item
 * should be done in its respective file, not this one.
 * 
 * @param {array object} ids: Array object of attributes to reset. Grouped by
 *                            attribute type then id as key and value as val.
 * Ex:
 *  var ids = {
        'input': {
            'id1': 'sample',
            'id2': ''
        },
        'span': {
            'id1': 'sample',
        }
    };
 */
function resetFormFields(ids) {
    $.each(ids, function(attr) {
        $.each(ids[attr], function(key, val) {
            $("#" + key + " " + attr).val(val);
        });
    });
}

//////////////// Helper Functions ////////////////
function recordUserAction(data, callback=null) {
    return $.ajax({
        type: "POST",
        url: data.root + "ajax/recordIntoHistoryUsers.php",
        dataType: "json",
        data: {
            bulkInsert: (data.bulkInsert != null && data.bulkInsert) ? 1 : 0,
            bulkData: (data.bulkData && Object.keys(data.bulkData).length) ? data.bulkData : {},
            applicationId: data.applicationId,
            actionId: data.actionId,
            notes: (data.notes != null) ? data.notes : "",
            misc: (data.misc != null) ? data.misc : ""
        },
        success: function(response) {
            if(response.status && data.redirect != null) window.location.href = data.redirect;
            else if(response.status && data.reload) location.reload();
            else if(response.status && callback != null) callback();
            else console.log(response.message);

            return response.status;
        },
        error: function(response) { console.log(response); }
    });
}

// To deprecate
function getSelectedTxt(selectedId) {
    var selected = document.getElementById(selectedId);
    return selected.options[selected.selectedIndex].text;
}

// To deprecate
function getSelectedVal(selectedId) {
    var selected = document.getElementById(selectedId);
    return selected.options[selected.selectedIndex].value;
}

/*
 * Basic method to trim ints/floats.
 * @param {int} num -> number to be trimmed
 * @param {int} precision -> decimal limit; default 5
 * @returns {int} trimmed number on success, 0 on empty, -1 on undef
 */
function beautifyNumbers(num, precision=5) {
    if(num != null && num != "" && num >= 0)
        return parseFloat(parseFloat(num).toFixed(precision).match(/[0-9]+(.[0-9]+)?/)[0]);
    else if(num == "") return 0;
    else return -1;
}

/*
 * Basic method to validate if numnbers are within range.
 * @param (int/float) num -> number to be checked
 * @param {int/float} low -> lowest range
 * @param {int/float} high -> highest range
 * @param {boolean} equality -> true to include range of comparison (>= or <=)
 * @returns {boolean} true if within range, false otherwise
 */
function isWithinRange(num, low, high, equality=true) {
    if(equality && (low <= num && num <= high)) return true;
    else if(!equality && (low < num && num < high)) return true;
    else return false;
}

/*
 * Basic method to validate if numnbers are out of range.
 * @param (int/float) num -> number to be checked
 * @param {int/float} low -> lowest range
 * @param {int/float} high -> highest range
 * @param {boolean} equality -> true to include range of comparison (>= or <=)
 * @returns {boolean} true if within range, false otherwise
 */
function isOutOfRange(num, low, high, equality=true) {
    if(equality && (low >= num || num >= high)) return true;
    else if(!equality && (low > num || num > high)) return true;
    else return false;
}

/*  Basic method to update dropdowns of key => value pair array objects.
 *  Will return a single N/A option if data array is null or undefined.
 *  Additional condition include disabling the drop down and adding an N/A
 *  option if there is none present after all options have been populated.
*/
function updateDropDown(id, dataArr=null, setDisabled=false, setNA=false) {
    if(setDisabled) $("#" + id).prop('disabled', true);
    else $("#" + id).prop('disabled', false);
    $("#" + id).find("option").remove();
    
    if(dataArr == null || dataArr.length === 0) 
        $("#" + id).append($("<option/>").val("na").text("N/A"));
    else if(Object.keys(dataArr).length === 1) {
        let key = Object.keys(dataArr)[0];
        $("#" + id).append($("<option/>").val(key).text(dataArr[key]));
        
        if(setNA && $("#" + id + " option[value='na']").length === 0)
            $("#" + id).prepend("<option value='na' selected hidden>N/A</option>");
    }
    else {
        $.each(dataArr, function(key, val) {
            $("#" + id).append($("<option/>").val(key).text(val));
        });

        if(setNA && $("#" + id + " option[value='na']").length === 0)
            $("#" + id).prepend("<option value='na' selected hidden>N/A</option>");
    }
}

/**
 *  Simple HTML table header for text output when no data is found.
 *  Nothing special. Just didn't want to keep rewriting the table header each time.
 * 
 *  @param   {string} text : Custom text for table header.
 *  @returns {string}
 */
function loadTableTextHeader(text="") {
    let temp = (text != "") ? text : "No data found.";

    return `<thead class='dataHeader'> \
                <tr><th>${temp}</th></tr> \
            </thead>`;
}

//////////////// General Alert Functions ////////////////
/** 
 * Pass the optional IDs in as an array object.
 * If no new ID is given, function will use the default Alert IDs from
 * the createCustomModal(...) function from searchFilterManagement.inc.php
 * 
 *  @param msg      : modal body message
 *  @param param    : Optional IDs associated with a custom style
 */
function openAlert(msg, param={}) {
    // Hide current modal
    if(!$.isEmptyObject(param.hideModal)) $("#" + param.hideModal).hide();
    // Get the appropriate modal (default or custom)
    if($.isEmptyObject(param.modalObjId)) param["modalObjId"] = "modalAlert";
    if($.isEmptyObject(param.formTxtId)) param["formTxtId"] = "msgAlert";
    if($.isEmptyObject(param.confirmId)) param["confirmId"] = "acceptAlert";
    
    // Preload the header and its custom text if applicable
    if(!$.isEmptyObject(param.headerTxtId)) {
        let headerId = ($.isEmptyObject(param.headerTxtId.id)) ? "alertHeaderTxtId" : param.headerTxtId.id;
        let headerText = ($.isEmptyObject(param.headerTxtId.text)) ? "Note" : param.headerTxtId.text;
        $("#" + headerId).text(headerText);
    }
    
    // Preload modal info and open modal
    $("#" + param.formTxtId).html(msg);
    $("#" + param.modalObjId).show().css("overflow-y", "auto");
    $("body").css("overflow-y", "hidden");

    $("#" + param.confirmId).unbind("click").bind("click", function() {
        $("#" + param.modalObjId).hide();
        $("body").css("overflow-y", "auto");
        if(!$.isEmptyObject(param.hideModal)) $("#" + param.hideModal).show();
    });
}

/* Pass the optional IDs in as an array object.
 * If no new ID is given, function will use the default Confirmation IDs from
 * the createCustomModal(...) function from searchFilterManagement.inc.php
 */
function openConfirm(msg, cancel, confirm, id={}) {
    if(!("modalObjId" in id)) id["modalObjId"] = "modalConfirm";
    if(!("formTxtId" in id)) id["formTxtId"] = "msgConfirm";
    if(!("cancelId" in id)) id["cancelId"] = "cancelConfirm";
    if(!("confirmId" in id)) id["confirmId"] = "acceptConfirm";
    if("hideModal" in id) $("#" + id["hideModal"]).css("display", "none");
    
    $("#" + id["formTxtId"]).html(msg);
    $("#" + id["modalObjId"]).css({
        "display": "block",
        "overflow-y": "auto"
    });
    $("body").css("overflow-y", "hidden");

    $("#" + id["cancelId"]).unbind("click").bind("click", function() {
        $("body").css("overflow-y", "auto");
        $("#" + id["modalObjId"]).css("display", "none");
        if("hideModal" in id) $("#" + id["hideModal"]).css("display", "block");
        cancel();
    });
    $("#" + id["confirmId"]).unbind("click").bind("click", function() {
        $("body").css("overflow-y", "auto");
        $("#" + id["modalObjId"]).css("display", "none");
        confirm();
    });
}

//////////////// EXTENDED METHODS ////////////////
jQuery.fn.extend({
    isError: function() { //Do not use. Use hasError instead
        if($(this["selector"]).css("background-color") == "rgb(255, 153, 153)") return true; 
        else return false;
    },
    setError: function() { $(this).css("background-color", "rgb(255, 153, 153)"); },
    hasError: function() {
        if($(this).length > 1) {
            let status = false;
            $.each($(this), function(i, val) {
                if($("#" + val.id).css("background-color") == "rgb(255, 153, 153)") return status = true;
            });
            return status;
        }
        else if(($(this).length == 1) && $(this).css("background-color") == "rgb(255, 153, 153)") 
            return true;
        else 
            return false;
    },
    revertError: function() { $(this).css("background-color", ""); },
    toggleCheckmarkImg: function(checked, selector) {
        if(checked) $(selector).css("visibility", "visible");
        else $(selector).css("visibility", "hidden");
    },
    // Do not use. "Name" is deprecated in new HTML so use 'serializeCheckboxInputToBinary' instead.
    serializeCheckmarkstoBinary: function() {
        return $(this).map(function(i, ele) {
            if(!this.disabled) 
                return { name: ele.name, value: (ele.checked ? 1 : 0) };
        }).get();
    },
    /**
     *  Returns a map of binary values: 0 - unchecked, 1 - checked.
     *  Key item 'dataRef' is for mapData type 'data' to reference data-* name.
     *  Default return name will return the index of the item.
     * 
     *  @param   {map}   mapData : {type: [data-/id], dataRef: [data- name]}
     *  @returns {array}
     */
    serializeCheckboxInputToBinary: function(mapData={}) {
        return $(this).map(function(i, ele) {
            if(!this.disabled) {
                if(mapData.type == "id") {
                    return { name: ele.id, value: (ele.checked ? 1 : 0) };
                }
                else if(mapData.type == "data") {
                    return { name: $(ele).data(mapData.dataRef), value: (ele.checked ? 1 : 0) };
                }
                else return { name: i, value: (ele.checked ? 1 : 0) };
            }
        }).get();
    },
    enableProperty: function() { $(this).prop("disabled", false); },
    disableProperty: function() { $(this).prop("disabled", true); },
    toggleDisabilityProperty: function() {
        $(this).prop("disabled", function(i, type) {
            return (type) ? false : true;
        });
    },
    visible: function() { $(this).css("visibility", "visible"); },
    invisible: function() { $(this).css("visibility", "hidden"); },
    toggleVisibility: function() {
        $(this).css("visibility", function(i, type) {
            return (type === "visible") ? "hidden" : "visible";
        });
    },
    toggleDisplay: function() { return ($(this).is(":hidden")) ? $(this).show() : $(this).hide(); },
    loadModal: function() {
        $(this).show().css({
            "overflow-y": "auto"
        }).scrollTop(0);
        $("body").css("overflow-y", "hidden");
    },
    closeModal: function() {
        $(this).hide();
        $("body").css("overflow-y", "auto"); 
    }
});

//////////////// INIT JQUERY ////////////////
$(document).ready(function() {
    $("body").on("keypress", "input", function(e) {
        if(e.keyCode === 13) {
            e.preventDefault();
            $(this).blur();
        }
    });

    //////////////// EXTENDED FUNCTIONS - $.foo(bar) ////////////////

    // Basic method of formatting numbers to USD format ($_,__.00)
    jQuery.defaultUSAPrice = function(num) {
        let temp = 0;

        if(typeof parseFloat(num) == "number" && !isNaN(num))
            temp = parseFloat(num).toLocaleString('en-US', { minimumFractionDigits : 2, maximumFractionDigits: 2 });

        // Since toLocaleString() returns a negative sign by default, we need to absolute value it and add our own
        if(parseFloat(temp) >= 0)
            return "&#36; " + temp;
        else
            return "- &#36; " + Math.abs(temp);
    };
});