/* 
    Note: 
        General JS/JQuery for similar management page styles.
        (Ex: Manage ADE Packages, Manage Shipping Accounts, etc.)
        A separate styling file is used to reduce repetition for shared 
        functionalities between pages, meaning re-using the same id/class name
        is highly recommended (at your own discretion).

    Created on : Feb 20, 2020
    Author     : Jenny Nguyen
*/

//////////////// Helper Functions ////////////////
function setAndCheckBox(id) {
    var ele = (id).substring(id.indexOf('_') + 1);
    $("[name='" + ele + "']").prop("checked", true);
    $("#img_" + ele).css("display", "block");
}
        
function getCheckedBoxes(unInclude) {
    var checked = [];
    var checkBoxes = $(".checkedItem:checked:not(" + unInclude + ")");

    for (var i = 0; i < checkBoxes.length; i++) {
        checked.push(checkBoxes[i].name);
    }
    return checked;
}

//////////////// Custom Confirmation Functions ////////////////
function openConfirmation(msg, cancelConfirm, acceptConfirm) {
    $("#msgConfirm").html(msg);
    $("#modalConfirm").css({
        'display': 'block',
        'overflow-y': 'auto'
    });
    $("body").css('overflow-y', 'hidden');
    
    $("#cancelConfirm").unbind('click').bind('click', function() { 
        $("body").css('overflow-y', 'auto');
        $("#modalConfirm").css("display", "none");
        cancelConfirm(); 
    });
    $("#acceptConfirm").unbind('click').bind('click', function() {
        $("body").css('overflow-y', 'auto');
        $("#modalConfirm").css("display", "none");
        acceptConfirm(); 
    });
}

//////////////// EXTENDED METHODS ////////////////
jQuery.fn.extend({
    toggleSingle: function(e) {
        if(e) $("#img_" + e).css("display", "block");
    },
    unToggleSingle: function(e) {
        if(e) $("#img_" + e).css("display", "none");
    },
    toggleAll: function(e) {
        if(e) $("[id^='img_']").css("display", "block");
        else $("[id^='img_']").css("display", "none");
    },
    setError: function() {
        $(this["selector"]).css('background-color', 'rgb(255, 153, 153)');
    },
    revertErr: function() {
        $(this["selector"]).css('background', 'white');
    }
});

//////////////// INIT JQUERY ////////////////
//$(document).ready(function() {});