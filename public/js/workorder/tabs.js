//////Handle tabs

$("#infoTabWrapper li.infoTabs").click(function (e) {
    e.preventDefault();

    // Set current active tab to inactive and hide contents
    $("li.infoTabs.active").toggleClass("active inactive");
    $(".tab_content").hide();

    // Set selected tab to active and show contents of the selected tab
    $(this).toggleClass("inactive active");
    $($(this).find("a").attr("href")).fadeIn();
});

$("#itemDetailsTab").on("click", ".imgMenuBtn", function () {
    let row = $(this).closest("tr").data("row-id");

    // Pre-load menu options based on holding status
    if ($("[data-row-id='" + row + "']").hasClass("activeHolding")) {
        $("#holdImgStatus").html("Updating...").show();   // Set an unholding update text while the AJAX runs
        $("#holdLock").show();
        $("#unholdLock").hide();
        $("#unholdImgTab").trigger("click");

        // Grab the default drop down option for hold reason
        $.ajax({
            type: "POST",
            url: baseUrl + "ajax/workorder/itemholding",
            dataType: "json",
            data: {itemId: row},
            success: function (response) {
                if (response.status) {
                    // I know that this is lazy styling but since the db records the damn html into its data,
                    // lazy styling is what's going to happen >:V
                    let html =
                        "Order Item is on <b>HOLD</b> status.<br> \
                        <b>Hold date:</b>" + response.data.holdDate + "<br>" +
                        response.data.holdReason +
                        "<span id='resetSLA' style='display:none;'><br><br><b>Note:</b> SLA will reset when this item is removed from holding.</span>";

                    $("#holdImgStatus").html(html);
                    $("#unholdImgItem select").val(response.data.holdReasonId);
                    $("[data-row-id='" + row + "']").data("row-sla", response.data.slaReset);

                    // Temp solution
                    try {
                        if (response.data.slaReset.toLowerCase() == "y") {
                            $("#resetSLA").show();
                        }
                    } catch (e) {
                    }
                }
                else {
                    openAlert("Error retrieving holding information for item. Try again or contact your supervisor.", {hideModal: "imgMenuModal"});
                }
            },
            error: function (response) {
                console.log(response.message);
            }
        });
    }
    else {
        $("#holdLock").hide();
        $("#unholdLock").show();
        $("#moveImgTab").trigger("click");  // default it to move since it's 1st on the list
    }

    //Pre-load basic item info
    $("#imgMenuImgSrc").attr("src", $("[data-row-id='" + row + "'] .imgMenuBtn img").attr("src"));
    $("#imgMenuItemNum").text(row);
    $("#imageMenuDept").text($(this).closest("tr").data("row-dept"));
    $("#imageMenuTitle").text($(this).closest("tr").data("row-internal-name"));
    $("#imgMenuModal").loadModal();
});

//////Handle Image events

$("#closeImgMenu").click(function () {
    $("#imgMenuModal").closeModal();
    // Reset everything to make my life easier
    $("#moveImgItem select").val("None");
    $("#imgMenuModal textarea").val("").revertError();
    $("#holdImgStatus").hide().html("");
});

$("#submitImgMenu").click(function () {
    // Redirect the actions based on the tab and deal with the validations there
    let active = $("#imgMenuModal .modalTabsContainer .imgMenuTab.active").attr("id");
    let id = $("#imgMenuItemNum").text();
    let userInput = $("#imgMenuModal textarea");

    // Note: the order is just based on how it's listed on the modal.
    if (active == "unholdImgTab") {
        handleUnholdImageItem(id, userInput);
    }
    //else if(active == "moveImgTab") moveImageItem(id, userInput);
    //else if(active == "holdImgTab") holdImageItem(id, userInput);
    //else if(active == "reprintImgTab") reprintImageItem(id, userInput);
});

/**
 * Unhold item tab
 * @param itemId
 * @param textEle
 */
function handleUnholdImageItem(itemId, textEle) {
    let row = $("[data-row-id='" + itemId + "']");
    let unhold = $("#unholdImgItem select").val();
    let optionText = $("#holdImgItem select option:selected").text().split("-");

    // If user decides to not enter anything at all before submit
    if (unhold == "None" || textEle.hasError() || textEle.val() == "") {
        textEle.setError();
        openAlert("<b>Unhold reason</b> and <b>details</b> are required in order to perform this operation.", {hideModal: "imgMenuModal"});
        return;
    }
    else {
        $.ajax({
            type: "GET",
            url: baseUrl + "ajax/workorder/itemholding?itemId=" + itemId + "&order=" + HDorderId + "&unhold=1",
            dataType: "json",
            data: {
                reasonId: unhold,
                reasonGroup: $.trim(optionText[0]),
                reasonType: $.trim(optionText[1]),
                reason: textEle.val(),
                resetSLA: ($("#resetSLA").css("display") == "none") ? 0 : 1
            },
            error: function (response) {
                location.reload();
            },
            complete: function () {
            }
        });
    }
}

////// Highlight and change image menu tab

$(".imgMenuTab").click(function () {
    let selected = this.id;
    // Toggle the active menu tab
    $(".imgMenuTab.active").toggleClass("active inactive");
    $(this).toggleClass("inactive active");
    // Reset all actives -> inactive and update to new active tab
    $("[data-tab-status]").attr("data-tab-status", "inactive");

    if (selected == "unholdImgTab")
        $("#unholdImgItem").attr("data-tab-status", "active");
    else if (selected == "moveImgTab")
        $("#moveImgItem").attr("data-tab-status", "active");
    else if (selected == "holdImgTab")
        $("#holdImgItem").attr("data-tab-status", "active");
    else if (selected == "reprintImgTab")
        $("#reprintImgItem").attr("data-tab-status", "active");
});

$("#imgMenuModal textarea, #moveBulkItemsText").change(function () {
    let text = $.trim(this.value);

    if (text != "") {
        $(this).val(text);  // Update the current text without extra whitespace
        $(this).revertError();
    }
    else $(this).setError();
});

//Handle instruction event
function confirmDeleteInstruction(id) {
    openConfirm(
        "This action will remove the current instruction. Are you sure you want to proceed?",
        function () { /* Do nothing if user cancels */
        },
        function () {
            $("tr[data-row-id='" + id + "'] .deleteInstrBtn").html('Deleting...');
            $.ajax({
                type: "POST",
                url: baseUrl + "ajax/workorder/removeInstruction",
                dataType: "json",
                data: {
                    "itemId": id,
                    "orderId": HDorderId,
                    "userName": simpleOrderObject.userName
                },
                success: function (response) {
                    if (response.success) {
                        location.href = baseUrl + "workorder?orderId=" + HDorderId;
                    }
                },
                error: function (response) {
                    console.log(response);
                }
            });
        }
    );
}