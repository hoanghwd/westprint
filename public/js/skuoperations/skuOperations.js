/* 
    Shared JS/JQUERY functions for any SKU Operations page.
    Dependent on jsStyleManagement.js

    Created on : May 7, 2021
    Author     : Jenny Nguyen
*/
function updateVariationDropDown(response, data) {
    $("#" + data.next).find("option").remove().end().prop("disabled", false);
    //Update drop down data based on response data and order
    if(response.order.length > 1) {
        $.each(response.order, function(i, val) {
            $("#" + data.next).append($("<option/>").val(val).text(response.data[val]));
        });
    }
    else if(response.order.length === 1) {
        let key = response.order[0];
        $("#" + data.next).append($("<option/>").val(key).text(response.data[key]));
    }
    else $("#" + data.next).append($("<option/>").val("na").text("N/A"));
    
    //Append additional options at the end of drop down
    if(!jQuery.isEmptyObject(data.appendOptions)) 
        $("#" + data.next).append($("<option/>").val(data.appendOptions.value).text(data.appendOptions.text));
    //Update data-max count of subsequent variation
    if(data.maxCount)
        $("[data-" + data.next + "-max]").attr("data-" + data.next + "-max", response.max);
    //Update subsequent drop down data based on size of response data
    if(Object.keys(response.data).length > 1) {
        let hidden = (data.hidePrepend) ? "hidden" : "";
        $("#" + data.next).prepend("<option value='" + data.optionKey + "' selected " + hidden + ">" + data.optionValue + "</option>");
        //Reset subsequent drop downs
        if(data.resetAddNew) {
            var romans = ["I", "II", "III", "IV"];
            
            for(var i = 0; i < data.reset.length; i++) {
                let code = parseInt(data.reset[i].slice(-1)) - 1;
                updateDropDown(data.reset[i], { add: "Add New Variation " + romans[code] + "..." }, true, true);
            }
        }
        else if(!jQuery.isEmptyObject(data.reset)) {
            for(var i = 0; i < data.reset.length; i++) {
                updateDropDown(data.reset[i], null, true);
            }
        }
    }
    else $("#" + data.next).trigger("change");
}

function validateNumericalInputs(obj, defaultVal, low=0, high=99999.99999, precision=5) {
    var num = beautifyNumbers($(obj).val(), precision);
    
    if(num == 0) $(obj).val(defaultVal).setError();
    else if(/(.[^\s])+(X|Y)/.test(obj.id) && isOutOfRange(num, 0, 999.99999, false)) $(obj).val(defaultVal).setError();
    else if(/(.[^\s])*(weight)/i.test(obj.id) && isOutOfRange(num, 0, 9999.99999, false)) $(obj).val(defaultVal).setError();
    else if(isOutOfRange(num, low, high, false)) $(obj).val(defaultVal).setError();
    else {
        $(obj).val(num).revertError();
        return num;
    }
    return false;
}