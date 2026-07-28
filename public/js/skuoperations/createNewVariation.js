/* 
    Note: JS/JQUERY functions for the Create New SKU Variation page.

    Created on : May 19, 2021
    Author     : Jenny Nguyen
*/

$(document).ready(function(){
    //////////////// FORM FEATURES ////////////////
    $("form").on("submit", function(e) { e.preventDefault(); });    // Disable auto form submission
    
    //////////////// NAVIGATION FEATURES (Timeline header & footer) ////////////////
    function updateReviewForm(active) {
        var totalSections = $("[id^='section-']").length;
        //Validate data of current active form before moving on
        if( (active == 1 && !reviewVariation()) ||
            (active == 2 && !reviewDimensions()) ||
            (active == 3 && !reviewPrinting()) ||
            (active == 4 && !reviewFinishing()) ||
            (active == 5 && !reviewBarcode()) ||
            (active == 6 && !reviewPackaging()) ) return false;
        //Check if the current timeline is the review page and submit
        if(active + 1 > totalSections) {
            openConfirm(
                "A new SKU Variation will be added along with any new data \
                items to be created. Note that this action cannot be undone \
                and, by continuing, you are confident that the information \
                to be submitted is correct to the best of your knowledge. \
                Select OK to continue. Once the new SKU Variation has been \
                successfully added, you will be redirected back to the SKU \
                List webpage.",
                function() { /* Do nothing if user cancels */ },
                function() { submitFormData(); }
            );
        }
        return true;
    }

    function setActiveSectionForm(active, selected) {
        //Hide current active form and change timeline progress
        $("#section-" + active).removeClass("arrow-active").addClass("arrow-inactive");
        $("#form-" + active).removeClass("activeSection").addClass("inactiveSection");
        //Set previous active timeline section and form
        $("[data-active-section]").data("active-section", selected);
        $("#section-" + selected).removeClass("arrow-inactive").addClass("arrow-active");
        $("#form-" + selected).removeClass("inactiveSection").addClass("activeSection");
    }
    
    // TIMELINE ARROW FUNCTIONS //
    $("[id^='section-']").click(function() {
        var active = parseInt(($(".arrow-active")[0].id).slice(-1));
        var selected = parseInt(this.id.slice(-1));
        if(active < selected) $("#next").trigger("click", [selected]);
        else $("#prev").trigger("click", [selected]);
    });

    // PAGE NAVIGATION BUTTON FUNCTIONS //
    $("#prev").click(function(event, prev) {
        var active = parseInt($(this).data("active-section"));
        if(prev == null) prev = active - 1;

        setActiveSectionForm(active, prev);
        //Adjust PREVIOUS button visibility based on section
        if(prev < 2) $("#prev").css("visibility", "hidden");
        else $("#prev").css("visibility", "visible");
        //Adjust NEXT button based on section
        if(prev <= 6) {
            if(prev === 6) $("#nextSectionTxt").text("CONTINUE TO REVIEW");
            else $("#nextSectionTxt").html("NEXT&nbsp;");
            
            $(".right").css("display", "inline-block");
        }
    });
    
    $("#next").click(function(event, next) {
        var active = parseInt($(this).data("active-section"));
        if(!updateReviewForm(active)) return;

        if(next != null && !updateReviewForm(next - 1)) {
            openAlert("Preceding sections must be completed and validated before selection can be made.");
            return;
        }
        else if(next == null) next = active + 1;

        if(next > 7) return;    //No section change on SUBMIT
        setActiveSectionForm(active, next);
        //Adjust visibility for PREVIOUS button based on section
        if(next >= 2) $("#prev").css("visibility", "visible");
        //Adjust NEXT button text based on section
        if(next >= 7) {
            $("#nextSectionTxt").text("SUBMIT");
            $(".right").css("display", "none");
        }
        else {
            if(next === 6) $("#nextSectionTxt").text("CONTINUE TO REVIEW");
            else $("#nextSectionTxt").html("NEXT&nbsp;");

            $(".right").css("display", "inline-block");
        }
    });
    
    //////////////// SHARED ////////////////
    // On load - used for color options
    $(function() {
        $.widget("custom.selectmenu", $.ui.selectmenu, {
            _renderItem: function(ul, item) {
                var li = $("<li>"), wrapper = $("<div>");

                if(item.disabled) li.addClass("ui-state-disabled");

                $("<span>", {
                    style: "background-color: rgb(" + item.value + ")",
                    "class": "ui-color-chip"
                }).appendTo(wrapper);
                
                wrapper.append(item.label);
                return li.append(wrapper).appendTo(ul);
            }
        });
        
        //Need to populate selectmenu() for each item
        var colorIDs = ["#barColor", "#attrColor1", "#attrColor2", "#attrColor3"];
        $.each(colorIDs, function(i, val) {
            $(val).selectmenu().selectmenu("menuWidget").addClass("ddOverflow");
        });
        
        for(let i = 0; i < colors.length; i++) {
            $(colorIDs.join()).append($("<option/>").val(colors[i].rgb).text(colors[i].name));
        }
        $(colorIDs.join()).val("na");
        
        //Hack method to enable/disable attribute color drop down
        $("span[id^='attrColor']").addClass("disableColorSpan");
    });
    
    function toggleAddBtn(obj, display) {
        if(obj.hasClass("activeSubForm")) $(display).slideUp("fast", function() { obj.text("+"); });
        else {
            $(display).slideDown({
                start: function() {
                    obj.text("-");
                    $(this).css({display: "grid"});
                }
            });
        }
        obj.toggleClass("activeSubForm");
    }
    
    function subFormDDChange(obj, selectForm, inputIDs="", ddIDs="") {
        let createForm = $("#createNew" + selectForm);
        let formID = "#" + obj.id + "Form";
        
        if(obj.value === "add" || createForm.hasClass("activeSubForm")) 
            toggleAddBtn(createForm, formID);
        
        if(obj.value !== "add") {
            if(inputIDs !== "") $(inputIDs).val("").revertError();
            if(ddIDs !== "") $(ddIDs).val("na").revertError();
            return false;
        }
        return true;
    }
    
    function validateNamingDups(obj, arr, errorMsg="") {
        if(jQuery.inArray(obj.value.toLowerCase().replace(/\s/g, ""), arr) !== -1 || obj.value === "") {
            $(obj).setError();
            
            if(errorMsg !== "" && obj.value !== "") openAlert(errorMsg);
            return false;
        }
        $(obj).revertError();
        return true;
    }

    function updateVariation(data, callback=null) {
        $.ajax({
            type: "POST",
            url: site_root + "ajax/reports/sku_list/getSkuOrigins.php",
            dataType: "json",
            data: {
                columnType: data.columnType,
                product: data.product,
                finishing: data.finishing,
                variation: data.variation,
                kitSku: data.kitSku,
                orderBy: data.orderBy
            },
            success: function(response) {
                updateVariationDropDown(response, data);
                if(callback !== null) callback();
            },
            error: function(response) { console.log(response); }
        });
    }

    function toggleOptionalOptions(ele, name) {
        if($(ele).prop("checked")) {
            $("#" + name + "Checkbox").css("background", "var(--navyBlue)");
            $("#" + name + "Checkmark").css("display", "block");
        }
        else {
            $("#" + name + "Checkbox").css("background", "var(--white)"); 
            $("#" + name + "Checkmark").css("display", "none");
        }
        toggleAddBtn($("#" + name), "#" + name + "Form");
    }
    
    $(".addNewBtn").click(function() {
        var type = $(this).data("create-type");
        //Added condition for Variation sub form
        if(type.indexOf("variation") !== -1) {
            let code = type.slice(-1);
            if(code == 1 || (code > 1 && $("#variation" + (code - 1)).val() !== "na"))
                $("#" + type).val("add").trigger("change");
        }
        else {
            $("#" + type).val("add");
            $("#" + type).trigger("change");
        }
    });
    
    //////////////// PRELOAD FORM DATA ////////////////
    function resetPreloadVariations(child) {
        for(let i = child; i <= 4; i++) {
            if(i + 1 <= 4) {
                if($("#preloadVariation" + (i + 1)).hasError())
                    $("#preloadVariation" + (i + 1)).revertError();

                $("#preloadVariation" + (i + 1)).find("option").remove().end()
                    .append($("<option/>").val("na").text("N/A"))
                    .prop("disabled", true);
            }
        }
    }

    $("#preloadBtn").click(function() { $("#preloadModal").css("display", "block"); });

    $("#preloadVariation1").change(function() {
        $(this).revertError();
        resetPreloadVariations(2);
        updateVariation({
            columnType: "finishingType",
            product: $(this).val(),
            finishing: "",
            variation: "",
            kitSku: "N",
            orderBy: "finishingTypeDescription",
            next: "preloadVariation2",
            optionKey: "na",
            optionValue: "Select Variation II...",
            maxCount: true,
            hidePrepend: true,
            resetAddNew: false,
            reset: ["preloadVariation3", "preloadVariation4"]
        });
    });

    $("#preloadVariation2").change(function() {
        $(this).revertError();
        resetPreloadVariations(3);
        updateVariation({
            columnType: "variationType",
            product: $("#preloadVariation1").val(),
            finishing: $(this).val(),
            variation: "",
            kitSku: "N",
            orderBy: "variationTypeDescription",
            next: "preloadVariation3",
            optionKey: "na",
            optionValue: "Select Variation III...",
            maxCount: true,
            hidePrepend: true,
            resetAddNew: false,
            reset: ["preloadVariation4"]
        });
    });
    
    $("#preloadVariation3").change(function() {
        $(this).revertError();
        resetPreloadVariations(4);
        updateVariation({
            columnType: "subVariationType",
            product: $("#preloadVariation1").val(),
            finishing: $("#preloadVariation2").val(),
            variation: $(this).val(),
            kitSku: "N",
            orderBy: "subVariationTypeDescription",
            next: "preloadVariation4",
            optionKey: "na",
            optionValue: "Select Variation IV...",
            maxCount: true,
            hidePrepend: true
        });
    });
    
    $("#preloadVariation4").change(function() { $(this).revertError(); });

    $("#preloadCancel").click(function() {
        resetPreloadVariations(1);
        $("#preloadVariation1").val("na").revertError();
        $("#preloadModal").css("display", "none");
    });

    $("#preloadConfirm").click(function() {
        for(let i = 1; i <= 4; i++) {
            if($("#preloadVariation" + i).val() == "na") {
                $("#preloadVariation" + i).setError();
                return;
            }
        }
        
        $.ajax({
            type: "POST",
            url: site_root + "ajax/reports/sku_list/getSkuVariationData.php",
            dataType: "json",
            data: {
                productCode: $("#preloadVariation1").val(),
                finishingType: $("#preloadVariation2").val(),
                variationType: $("#preloadVariation3").val(),
                subVarType: $("#preloadVariation4").val()
            },
            success: function(response) {
                if(response.status) {
                    $("#loader").css("display", "block");
                    $("#preloadModal").css("display", "none");
                    
                    preloadData = response.data;
                    // Start preloading all applicable values //
                    //Variation Section
                    $("#variation1").val($("#preloadVariation1").val()).trigger("change");
                    $("#productCodeTitle").val(preloadData.productCodeTitle).setError();
                    if(preloadData.category != "") $("#category").val(preloadData.category).trigger("change");
                    $("input.selectLocation").each(function(i, val) {
                        if(preloadData[val.id] == 1) {
                            $("#" + val.id).prop("checked", true);
                            $("img.selectLocation[data-loc-name='" + val.id + "']").css("visibility", "visible");
                        }
                    });
                    //Dimension Section
                    if(preloadData.xMul != "") $("#xMul").val(preloadData.xMul);
                    if(preloadData.yMul != "") $("#yMul").val(preloadData.yMul);
                    //Printing Section
                    if(preloadData.printer != "") $("#printer").val(preloadData.printer);
                    if(preloadData.substrate != "") $("#substrate").val(preloadData.substrate);
                    if(preloadData.galleryWrap != "") $("#gw").val(preloadData.galleryWrap);
                    if(preloadData.borders != "") $("#borders").val(preloadData.borders);
                    if(preloadData.useCba != "") $("[data-cba-option='" + preloadData.useCba + "']").addClass("activeOption").removeClass("inactiveOption");
                    if(preloadData.useCbaPlus != "") $("[data-cba-plus-option='" + preloadData.useCbaPlus + "']").addClass("activeOption").removeClass("inactiveOption");
                    //Finishing Section
                    if(preloadData.crop != "") $("#crop").val(preloadData.crop);
                    if(preloadData.stretching != "") $("#stretching").val(preloadData.stretching);
                    if(preloadData.hardware != "") $("#hardware").val(preloadData.hardware);
                    if(preloadData.framing != "") $("#framing").val(preloadData.framing);
                    if(preloadData.attributeCodeId != "") $("#attribute").val(preloadData.attributeCodeId);
                    if(preloadData.edgeCutPath != "") $("#edgeCutPath").val(preloadData.edgeCutPath);
                    if(preloadData.outline != "") $("#outline").val(preloadData.outline);
                    if(preloadData.staticCutPathTemplate != "") $("#staticCutPathTemplate").val(preloadData.staticCutPathTemplate);
                    //Barcode Section
                    if(preloadData.xBarcodePosition != "") $("#xBarcodePosition").val(preloadData.xBarcodePosition);
                    if(preloadData.barcodeHeight != "") $("#barcodeHeight option:contains(" + preloadData.barcodeHeight + ")").attr("selected", "selected");
                    if(preloadData.barcodeWidth != "") $("#barcodeWidth option:contains(" + preloadData.barcodeWidth + ")").attr("selected", "selected");
                    if(preloadData.barcodeLabelPlacement != "") $("#barcodeLabelPlacement").val(preloadData.barcodeLabelPlacement);
                    if(preloadData.separateBarcode != "") $("#separateBarcode").val(preloadData.separateBarcode);
                    //Packaging Section
                    if(preloadData.packageSku != "") $("#packageName").val(preloadData.packageSku);
                    if(preloadData.inventoryType != "") $("#inventoryType").val(preloadData.inventoryType);

                    setTimeout(function() {
                        preloadData = {};
                        $("#loader").css("display", "none");
                    }, 5000);
                }
                else openAlert(response.message, { hideModal: "preloadModal" });
            },
            error: function(response) { console.log(response); }
        });
    });

    //////////////// FORM 1: VARIATION ////////////////
    function resetVariations(parent, child) {
        var romans = ["I", "II", "III", "IV"];
        //Reset the parent
        subFormDDChange(parent, "Variation" + parent.id.slice(-1), "#variation" + parent.id.slice(-1) + "Name");
        $(parent).prop("disabled", false).revertError();
        //Reset all children DDs and Inputs
        for(let i = child; i <= 4; i++) {
            if(i + 1 <= 4)
                $("#variation" + (i + 1)).find("option").remove().end().prop("disabled", true).revertError();
            updateDropDown("variation" + i, { add: "Add New Variation " + romans[i - 1] + "..." }, true, true);
            
            if($("#createNewVariation" + i).text() !== "+") 
                toggleAddBtn($("#createNewVariation" + i), "#variation" + i + "Form");
            
            $("#variation" + i + "Name").val("").revertError();
            $("[data-variation" + i + "-max]").attr("data-variation" + i + "-max", 0);
        }
    }
        
    // VARIATION DROP DOWNS //
    $("#variation1").change(function() {
        //Reset all subsequent values
        resetVariations(this, 2);
        $("#variationError").css("display", "none");
        //Update subsequent values if applicable
        if($(this).val() !== "add") {
            updateVariation({
                columnType: "finishingType",
                product: $(this).val(),
                finishing: "",
                variation: "",
                kitSku: "N",
                orderBy: "finishingTypeDescription",
                appendOptions: {
                    value: "add",
                    text: "Add New Variation II..."
                },
                next: "variation2",
                optionKey: "na",
                optionValue: "Select Variation II...",
                maxCount: true,
                hidePrepend: true,
                reset: ["variation3", "variation4"]
            }, function() {
                if(Object.keys(preloadData).length && $("#preloadVariation1").val() != "na")
                    $("#variation2").val($("#preloadVariation2").val()).trigger("change");
            });
        }
    });
    
    $("#variation2").change(function() {
        //Reset all subsequent values
        resetVariations(this, 3);
        $("#variationError").css("display", "none");
        //Update subsequent values if applicable
        if($(this).val() !== "add") {
            updateVariation({
                columnType: "variationType",
                product: $("#variation1").val(),
                finishing: $(this).val(),
                variation: "",
                kitSku: "N",
                orderBy: "variationTypeDescription",
                appendOptions: {
                    value: "add",
                    text: "Add New Variation III..."
                },
                next: "variation3",
                optionKey: "na",
                optionValue: "Select Variation III...",
                maxCount: true,
                hidePrepend: true,
                reset: ["variation4"]
            }, function() {
                if(Object.keys(preloadData).length && $("#preloadVariation2").val() != "na")
                    $("#variation3").val($("#preloadVariation3").val()).trigger("change");
            });
        }
    });
    
    $("#variation3").change(function() {
        //Reset all subsequent values
        resetVariations(this, 4);
        $("#variationError").css("display", "none");
        //Update subsequent values if applicable
        if($(this).val() !== "add") {
            updateVariation({
                columnType: "subVariationType",
                product: $("#variation1").val(),
                finishing: $("#variation2").val(),
                variation: $(this).val(),
                kitSku: "N",
                orderBy: "subVariationTypeDescription",
                appendOptions: {
                    value: "add",
                    text: "Add New Variation IV..."
                },
                next: "variation4",
                optionKey: "na",
                optionValue: "Select Variation IV...",
                maxCount: true,
                hidePrepend: true,
                reset: []
            }, function() {
                if(Object.keys(preloadData).length && $("#preloadVariation3").val() != "na")
                    $("#variation4").val($("#preloadVariation4").val());
            });
        }
    });

    $("#variation4").change(function () {
        subFormDDChange(this, "Variation4", "#variation4Name");
        if($(this).val() === "add") {
            $(this).prop("disabled", false).revertError();
            $("#variationError").css("display", "none");
        }
        else $("#variationError").css("display", "grid");
    });
    
    // VARIATION NAME INPUTS //
    function checkSkuTitleDuplicates(arr, obj) {
        $.ajax({
            type: "POST",
            url: site_root + "ajax/reports/sku_list/checkforSkuTitleDuplicates.php",
            dataType: "json",
            data: arr,
            success: function(response) {
                if(response.status) {
                    openAlert(response.message);
                    $(obj).setError();
                }
                else $(obj).revertError();
            },
            error: function(response) { console.log(response); }
        });
    }
    
    $("#variation1Name").change(function() {
        if(jQuery.inArray(this.value.toLowerCase(), productCodeDesc) !== -1) {
            $(this).setError();
            openAlert("Exact <b>Variation</b> name already exist for this combination.");
        }
        else $(this).revertError();
    });
    
    $("#variation2Name").change(function() {
        checkSkuTitleDuplicates({
            productCode: $("#variation1").val(),
            finishingType: "",
            variationType: "",
            name: this.value
        }, this);
    });
    
    $("#variation3Name").change(function() {
        checkSkuTitleDuplicates({
            productCode: $("#variation1").val(),
            finishingType: $("#variation2").val(),
            variationType: "",
            name: this.value
        }, this);
    });
    
    $("#variation4Name").change(function() {
        checkSkuTitleDuplicates({
            productCode: $("#variation1").val(),
            finishingType: $("#variation2").val(),
            variationType: $("#variation3").val(),
            name: this.value
        }, this);
    });
    
    // PRODUCT CODE TITLE FUNCTIONS //
    $("#productCodeTitle")
        .on("keydown", function() { $(this).attr("list", "productTitles"); })
        .on("change", function() { validateNamingDups(this, productTitles, "Exact <b>Product Code Title</b> already exists."); });
    
    // CATEGORY & SUB-CATEGORY //
    $("#category").change(function() {
        $(this).revertError();
        var status = subFormDDChange(this, "Category", "#categoryName");
        //Grab sub-category only for existing categories
        if(status) updateDropDown("subCategory", {add: "Add New Sub-Category..."}, false, true);
        else {
            $.ajax({
                type: "POST",
                url: site_root + "ajax/reports/sku_list/getSkuCategories.php",
                dataType: "json",
                data: {
                    type: "subCategory",
                    category: $("#category option:selected").text()
                },
                success: function(response) {
                    skuSubCategories = response.names;
                    
                    response.data["add"] = "Add New Sub-Category...";
                    updateDropDown("subCategory", response.data, false, true);

                    if(Object.keys(preloadData).length && preloadData.subCategory != "")
                        $("#subCategory").val(preloadData.subCategory);
                },
                error: function(response) { console.log(response); }
            });
        }
        $("#subCategory, [data-create-type='subCategory']").prop("disabled", false);
        $("#subCategory").trigger("change");
    });
    $("#categoryName").change(function() {
        var status = validateNamingDups(this, skuCategories, "Exact <b>Category</b> name already exists."); 
        
        if(status)
            $("#substrateGroup").append($("<option/>").val("add").text(this.value + " [New Category]"));
        else {
            $("#substrateGroup").val("na");
            $("#substrateGroup option[value='add']").remove();
        }
    });
    
    $("#subCategory").change(function() { 
        $(this).revertError();
        subFormDDChange(this, "SubCategory", "#subCategoryName");
    });
    $("#subCategoryName").change(function() { validateNamingDups(this, skuSubCategories, "Exact <b>Sub-Category</b> name already exists under the selected Category."); });
    
    // EXTERNAL VARIATION //
    $("#extVariation").change(function() {
        toggleOptionalOptions(this, "extVariation");
        // Reset all options and error highlighting
        $("div#extVariationForm div[data-etv-row]:not(:last-child)").remove();
        $(".extVariationEntity").val("na").revertError();
        $(".extVariationType, .extVariationValue").find("option:not([value='na'])").remove().end().val("na").prop("disabled", true).revertError();
    });

    $("#extVariationForm").on("change", ".extVariationEntity", function() {
        $(this).revertError();
        
        var rowId = $(this).parents(":eq(1)").data("etv-row");
        var rowEle = "div#extVariationForm div[data-etv-row='" + rowId + "']";
        
        // Reset external variation type and value
        $(rowEle + " .extVariationType," + rowEle + " .extVariationValue")
            .find("option:not([value='na'])").remove().end()
            .val("na").revertError();
        
        $(rowEle + " .extVariationValue").prop("disabled", true);

        // Load external variation type drop down
        let selected = $(this).find("option:selected").text();
        $.each(Object.keys(extVariations[selected]), function(i, key) {
            $(rowEle + " .extVariationType").append($("<option/>").val(i).text(key));
        });
        $(rowEle + " .extVariationType").prop("disabled", false);
    })
    .on("change", ".extVariationType", function() {
        $(this).revertError();
        var rowId = $(this).parents(":eq(1)").data("etv-row");
        var rowEle = "div#extVariationForm div[data-etv-row='" + rowId + "']";

        $(rowEle + " .extVariationValue")
            .find("option:not([value='na'])").remove().end()
            .val("na").revertError();

        // Load external variation type drop down
        let entity = $(rowEle + " .extVariationEntity").find("option:selected").text();
        let selected = $(this).find("option:selected").text();
        $.each(extVariations[entity][selected], function(i, key) {
            $(rowEle + " .extVariationValue").append($("<option/>").val(i).text(key));
        });
        $(rowEle + " .extVariationValue").prop("disabled", false);
    })
    .on("change", ".extVariationValue", function() { $(this).revertError(); })
    .on("click", "button.extVariationAdd", function() {
        var rowId = parseInt($(this).parent().data("etv-row"));
        var rowEle = $("div#extVariationForm div[data-etv-row='" + rowId + "']");
        var currBtn = rowEle.find("button.extVariationAdd");

        if(currBtn.text() == "-") {
            rowEle.remove();
            return;
        }

        // Add the new row first before changing the previous row button
        let i = 0;
        let entityOptions = "<option value='na' selected hidden>N/A</option>";
        $.each(extVariations, function(key) {
            entityOptions += "<option value='" + i + "'>" + key + "</option>";
        });

        let html = "<div class='grid grid-template grid-sub-row' data-etv-row='" + (rowId + 1) + "'> \
                        <div class='row subInfo extVariationEtv'> \
                            <select class='extVariationEntity'>" + entityOptions + "</select> \
                            <select class='extVariationType' disabled><option value='na' selected hidden>N/A</option></select> \
                            <select class='extVariationValue' disabled><option value='na' selected hidden>N/A</option></select> \
                        </div> \
                        <button class='addBtn-base incrementBtn extVariationAdd'>+</button> \
                    </div>";
        $("#extVariationForm").append(html);

        currBtn.text("-");
    });

    // KIT TYPE //
    $(".kitType").click(function() { $("#kitTypeError").css("display", "block"); });
    
    // LOCATION SELECTION FUNCTIONS //
    $("input.selectLocation").click(function() {
        $("#locationError").css("display", "none");
        if($(this).prop("checked"))
            $("img.selectLocation[data-loc-name='" + this.id + "']").css("visibility", "visible");
        else
            $("img.selectLocation[data-loc-name='" + this.id + "']").css("visibility", "hidden");
    });

    //////////////// FORM 2: DIMENSIONS ////////////////
    // DIMENSIONS //
    $("#dimX, #dimY").change(function() {
        validateNumericalInputs(this, 0);
        let x = $("#dimX");
        let y = $("#dimY");
        
        //Since inputs have been validated, swap (x,y) if applicable
        if((x.val() > 0 && y.val() > 0) && parseFloat(x.val()) > parseFloat(y.val())) {
            let tmp = x.val();
            x.val(y.val());
            y.val(tmp);
        }
    });
    
    // MULTIPLIERS //
    $("#xMul, #yMul").change(function() { 
        if(!validateNumericalInputs(this, 0, 1, 10, 0)) $(this).setError();
        else $(this).revertError();
    });
    
    //////////////// FORM 3: PRINTING ////////////////
    // PRINTER //
    $("#printer").change(function() { subFormDDChange(this, "Printer", "#printerName"); });
    $("#printerName").change(function() { 
        var status = validateNamingDups(this, printer, "Exact <b>Printer</b> name already exists.");
        
        if(status) 
            $("#substratePrinter").append($("<option/>").val("add").text(this.value + " [New Printer]"));
        else {
            $("#substratePrinter").val("na");
            $("#substratePrinter option[value='add']").remove();
        }
    });
    
    // SUBSTRATE //
    $("#substrate").change(function() { subFormDDChange(this, "Substrate", "#substrateName", "#substratePrinter, #substrateGroup, #printBarcodesSeparately"); });
    $("#substrateName").change(function() { validateNamingDups(this, substrate, "Exact <b>Substrate</b> name already exists."); });
    $("#substratePrinter, #printBarcodesSeparately").change(function() { $(this).revertError(); });
    $("#substrateGroup").change(function() { subFormDDChange(this, "SubstrateGroup", "#substrateGroupName"); });
    $("#substrateGroupName").change(function() { validateNamingDups(this, substrateGroup, "Exact <b>Substrate Group</b> already exists."); });
    $("#substrateRollWidth").change(function() {
        var userInput = this.value.replace(/[\s]{1,}/g, "").replace(/(,+$)/g, "");

        if(!$("#substrateRollWidth").val().match(/[^0-9,\s]/)) {
            userInput = userInput.split(",");
            $(this).val(userInput);

            var temp = [];
            $.each(userInput, function(i, val) {
                if(parseInt(val) == 0 || jQuery.inArray(parseInt(val), temp) !== -1) {
                    $("#substrateRollWidth").setError();
                    openAlert("<b>Error:</b> Roll width(s) cannot be 0 and cannot have duplicates.");
                    return false;
                }
                else {
                    temp.push(parseInt(val));
                    $("#substrateRollWidth").revertError();
                }
            });
        }
        else {
            $("#substrateRollWidth").setError();
            openAlert("<b>Error:</b> Undefined characters found in input. Numbers separated with comma delimiters only.");
        }
    });
    
    // GALLERY WRAP (GW) //
    $("#gw").change(function() { subFormDDChange(this, "Gw", "#gwName, #gwSize", "#barSymbolID"); });
    $("#gwName").change(function() { validateNamingDups(this, gw, "Exact <b>Gallery Wrap</b> name/combination already exists."); });
    $("#gwSize").change(function() { validateNumericalInputs(this, 0); });
    
    // BAR SYMBOL //
    $("#bar").change(function() { 
        subFormDDChange(this, "Bar", "#barSymbol, #barDesc");
        //Annoying hack to reset color option
        if(this.value !== "add") {
            $("#barColor").val("na");
            $("#barColor-button").trigger("click").trigger("click");
        }
    });
    $("#barColor").on("selectmenuchange", function(){ $("#" + this.id + "-button").revertError(); });
    $("#barSymbol").change(function() { validateNamingDups(this, barSymbol, "Exact <b>Bar Symbol</b> already exists."); });
    $("#barColor").change(function() { $(this).revertError(); });
    $("#barDesc").change(function() {
        if(this.value === "") $(this).setError();
        else $(this).revertError();
    });

    // BORDERS //
    $("#borders").change(function() { subFormDDChange(this, "Borders", "#bordersName, [id^='borders_']"); });
    $("#bordersName").change(function() { validateNamingDups(this, borders, "Exact <b>Border</b> name/combination already exists."); });
    $("[id^='borders_']").change(function() {
        if(this.value === "") $(this).setError();
        else $(this).revertError();
    });

    // CBA //
    $(".cba").click(function() {
        var code = $(this).data("cba-code");
        //Reset all options
        $(".cba div").removeClass("activeOption").addClass("inactiveOption");
        $("#cbaError").css("display", "none");
        //Set new active and check status of CBA PLUS
        if(code == "Y") {
            if($(".cbaPlus [data-cba-plus-option='Y']").hasClass("activeOption"))
                $("#cbaError").css("display", "block").html("CBA cannot be selected as Y when <b>CBA PLUS</b> is Y.");
            else 
                $("[data-cba-option='Y']").addClass("activeOption").removeClass("inactiveOption");
        }
        else $("[data-cba-option='N']").addClass("activeOption").removeClass("inactiveOption");
    });

    // CBA PLUS //
    $(".cbaPlus").click(function() {
        var code = $(this).data("cba-plus-code");
        //Reset all options
        $(".cbaPlus div").removeClass("activeOption").addClass("inactiveOption");
        $("#cbaPlusError").css("display", "none");
        //Set new active and check status of CBA
        if(code == "Y") {
            if($(".cba [data-cba-option='Y']").hasClass("activeOption"))
                $("#cbaPlusError").css("display", "block").html("CBA PLUS cannot be selected as Y when <b>CBA</b> is Y.");
            else 
                $("[data-cba-plus-option='Y']").addClass("activeOption").removeClass("inactiveOption");
        }
        else $("[data-cba-plus-option='N']").addClass("activeOption").removeClass("inactiveOption");
    });

    //////////////// FORM 4: FINISHING ////////////////
    // STRETCHING //
    $("#stretching").change(function() { subFormDDChange(this, "Stretching", "#stretchingName"); });
    $("#stretchingName").change(function() { validateNamingDups(this, stretching, "Exact <b>Stretching</b> name already exists."); });
    
    // HARDWARE //
    $("#hardware").change(function() { subFormDDChange(this, "Hardware", "#hardwareName"); });
    $("#hardwareName").change(function() { validateNamingDups(this, hardware, "Exact <b>Hardware</b> name already exists."); });

    // FRAMING //
    $("#framing").change(function() { subFormDDChange(this, "Framing", "#framingCode, #framingColor, #framingDesc"); });
    $("#framingCode").change(function() { validateNamingDups(this, framing, "Exact <b>Framing</b> code already exists."); });
    $("#framingColor, #framingDesc").change(function() {
        if(this.value == "") $(this).setError();
        else $(this).revertError();
    });

    // ATTRIBUTE //
    $("#attribute").change(function() {
        var status = subFormDDChange(this, "Attribute", "[id^='attrCode'], #attrMessage", "#level, [id^='attrShape'], [id^='attrFillOrStroke']");
        
        if(!status) {
            $(".attrNumber div").removeClass("activeOption").addClass("inactiveOption");
            $("[id^='attrCode'], [id^='attrShape'], [id^='attrFillOrStroke']").prop("disabled", true);
            $("span[id^='attrColor']").removeClass("enableColorSpan").addClass("disableColorSpan");
            //Annoying hack to reset color option
            if(this.value !== "add") {
                $("select[id^='attrColor']").val("na");
                $("span[id^='attrColor']").trigger("click").trigger("click");
            }
        };
    });
    
    $(".attrNumber").click(function() {
        var code = $(this).data("attr-code");
        //Reset all options and set new active
        $(".attrNumber div").removeClass("activeOption").addClass("inactiveOption");
        $(".attrNumber:nth-child(" + code + ") div").addClass("activeOption").removeClass("inactiveOption");
        //Re-disable all inputs and drop downs
        $("[id^='attrCode'], [id^='attrShape'], [id^='attrFillOrStroke']").prop("disabled", true);
        $("span[id^='attrColor']").removeClass("enableColorSpan").addClass("disableColorSpan");
        //Re-enable applicable actives
        $(`[id^='attrCode']:lt(${code}), [id^='attrShape']:lt(${code}), [id^='attrFillOrStroke']:lt(${code})`).prop("disabled", false);
        $(`span[id^='attrColor']:lt(${code})`).removeClass("disableColorSpan").addClass("enableColorSpan");
    });
    
    // CODE (ATTRIBUTE) //
    $("[id^='attrCode']").change(function() {
        var codes = jQuery.map($("[id^='attrCode']"), function(val, i) {
            return (val.value !== "") ? val.value.toLowerCase() : null;
        });
        var combination = codes.join("|");
        
        if(jQuery.inArray(combination, attrCodes) !== -1 && $("[id^='attrCode']:enabled").length == codes.length) {
            $("[id^='attrCode']:lt(" + codes.length + ")").setError();
            openAlert("Exact <b>Attribute Code</b> combination already exists.");
            return false;
        }
        else if(this.value === "") {
            $(this).setError();
            return false;
        }
        else $("[id^='attrCode']:lt(" + codes.length + ")").revertError();
    });
    
    // MESSAGE //
    $("#attrMessage").change(function() {
        if(this.value === "") $(this).setError();
        else $(this).revertError();
    });
    
    // LEVEL (ATTRIBUTE) //
    $("#level").change(function() {
        $(this).revertError();
        
        if(this.value === "component") {
            $("#attributeNotes").css("display", "grid");
            $(".attrContentCol select[id^='attrColor']").trigger("selectmenuchange");
            $(".attrContentCol select[id^='attrShape']").revertError();
            $(".attrContentCol select[id^='attrFillOrStroke']").revertError();
        }
        else $("#attributeNotes").css("display", "none");
    });
    
    // EDGE CUT PATH, COLOR (ATTRIBUTE) //
    $("#edgeCutPath").change(function() { $(this).revertError(); });
    $(".attrContentCol select[id^='attrColor']").on("selectmenuchange", function(){ $("#" + this.id + "-button").revertError(); });
    
    //////////////// FORM 5: BARCODE ////////////////
    $("#barcodeWidth, #barcodeHeight").change(function() {
        if(this.id.indexOf("Width") !== -1) $("#barcodeHeight").val(this.value);
        else $("#barcodeWidth").val(this.value);
    });
    
    //////////////// FORM 6: PACKAGING ////////////////
    function getShippingException(arr, callback) {
        return $.ajax({
            type: "POST",
            url: site_root + "ajax/reports/sku_list/getSkuShippingException.php",
            dataType: "json",
            data: arr,
            success: function(response) {
                if(response.status) callback(response);
                else openAlert(response.message + " Please try your selection again or contact your manager if the problem persists.");
            },
            error: function(response) { console.log(response); }
        });
    }
    
    $("#weight, #productPrice, #deliveredPrice").change(function() { validateNumericalInputs(this, 0); });
    
    $("#exception").change(function() {
        toggleOptionalOptions(this, "exception");
        $("#exceptionMap").val("na").revertError();
        $("#exceptionPriceGroup, #exceptionPriceList").find("option:not([value='na'])").remove().end().val("na").prop("disabled", true).revertError();
    });
    
    $("#exceptionMap").change(function() {
        //Reset price group and price list
        $("#exceptionPriceGroup, #exceptionPriceList").find("option:not([value='na'])").remove().end().val("na").revertError();
        $("#exceptionPriceList").prop("disabled", true);
        //Load price group drop down
        getShippingException({
            type: "group",
            zone: this.value
        }, function(response) {
            $.each(response.data, function(i, val) {
                $("#exceptionPriceGroup").append($("<option/>").val(val.key).text(val.value));
            });
            $("#exceptionPriceGroup").prop("disabled", false);
        });
    });
    
    $("#exceptionPriceGroup").change(function() {
        //Reset price group and price list
        $("#exceptionPriceList").find("option:not([value='na'])").remove().end().val("na").revertError();
        //Load price list drop down
        getShippingException({
            type: "list",
            zone: $("#exceptionMap").val(),
            price: this.value
        }, function(response) {
            $.each(response.data, function(i, val) {
                $("#exceptionPriceList").append($("<option/>").val(val.key).text(val.value));
            });
            $("#exceptionPriceList").prop("disabled", false);
        });
    });
    
    //////////////// FORM 7: REVIEW ////////////////
    $("[id^=form-]:not('#form-1, #form-2') select").change(function() { $(this).revertError(); });
    
    $(".inactiveReviewTab").click(function() {
        var section = $(this).data("review-id");
        
        if($(this).hasClass("activeReviewTab")) {
            $("[data-review-section='" + section + "']").slideUp("fast", function () {
                $("[data-review-id='" + section + "']").toggleClass("activeReviewTab");
            });
        }
        else {
            $("[data-review-section='" + section + "']").slideDown({
                duration: "fast",
                start: function() { $(this).css("display", "inline-flex"); },
                complete: function() { $("[data-review-id='" + section + "']").toggleClass("activeReviewTab"); }
            });
        }
    });
});

//////////////// FORM 7: REVIEW ////////////////
//Dynamically load data rows
function loadReviewDataDiv(arr, addNewID="") {
    var html = "";
    $.each(arr, function(key, val) {
        html += "<div class='bodyDataDiv'><span>" + key + "</span><span>" + val + "</span></div>";
    });
    
    //Set (NEW) flag status on title reviewTabNewFlag
    if(addNewID !== "") $("[data-review-id='" + addNewID + "']").addClass("reviewTabNewFlag");
    return html;
}

function reviewDropDowns(formID) {
    let status = true;
    $("#form-" + formID + " select:not(.subForm select)").each(function() {
        if((this.value === "na" && $(this).find("option:selected").text() === "N/A") 
            || $(this).find("option:selected").text() == "") {
            $(this).setError();
            return status = false;
        }
    });
    return status;
}

//Basic input validation to check for empty or falsy
function invalidInput(id) {
    if($("#" + id).val() == null || $("#" + id).val() === "" || $("#" + id).val() === "na") {
        $("#" + id).setError();
        return false;
    }
    else if($("#" + id).hasError()) return false;

    return true;
}

// Temp. - should change invalidInput() to this eventually
function checkInvalidVal(ele) {
    if(ele.val() == null || ele.val() === "" || ele.val() === "na") {
        ele.setError();
        return false;
    }
    else if(ele.hasError()) return false;

    return true;
}

function reviewVariation() {
    // Variation
    var variation = false;
    $("select[id^='variation']").each(function() {
        if(this.value === "add") return variation = true;
    });
    if(!variation) {
        $("#variationError").css("display", "grid");
        return false;
    }
    // Product Code Title
    if(!invalidInput("productCodeTitle")) return false;
    // Category
    if(!invalidInput("category")) return false;
    else if($("#category").val() === "add") {
        if(!invalidInput("categoryName")) return false;
        //Add to Form Data & DB entry and update Category Review section
        formData.skuOrigins["category"] = formData.sku["category"] = $("#category").val();
        dbs["category"] = { name: $("#categoryName").val() };
        $("#categoryReview").html(loadReviewDataDiv({ "Name:": dbs.category.name }, "categoryReview"));
    }
    else {
        formData.skuOrigins["category"] = formData.sku["category"] = $("#category option:selected").text();
        $("#categoryReview").text(formData.skuOrigins.category);
        $("[data-review-id='categoryReview']").removeClass("reviewTabNewFlag");
    }
    // Sub-Category
    if(!invalidInput("subCategory")) return false;
    else if($("#subCategory").val() === "add") {
        if(!invalidInput("subCategoryName")) return false;
        //Add to Form Data & DB entry and update Category Review section
        formData.skuOrigins["subCategory"] = formData.sku["subCategory"] = $("#subCategory").val();
        dbs["subCategory"] = { name: $("#subCategoryName").val() };
        $("#subCategoryReview").html(loadReviewDataDiv({ "Name:": dbs.subCategory.name }, "subCategoryReview"));
    }
    else {
        formData.skuOrigins["subCategory"] = formData.sku["subCategory"] = $("#subCategory option:selected").text();
        $("#subCategoryReview").text(formData.skuOrigins.subCategory);
        $("[data-review-id='subCategoryReview']").removeClass("reviewTabNewFlag");
    }
    // Locations
    if($("input.selectLocation:checked").length === 0) {
        $("#locationError").css("display", "block");
        return false;
    }
    // External Variations
    if($("#extVariation").prop("checked")) {
        let extVariationData = [];
        let outputText = "";

        // Just validate and add at the same time; as long as it's in sets of 3 then record the data
        let entityEle = null,  typeValEle = null, valueValEle = null;
        let entityText = "",  typeValText = "", valueValText = "";
        let error = false;
        $("div#extVariationForm div[data-etv-row]").each(function(i, row) {
            entityEle = $(row).find(".extVariationEntity");
            typeValEle = $(row).find(".extVariationType");
            valueValEle = $(row).find(".extVariationValue");
            
            if(!checkInvalidVal(entityEle) || !checkInvalidVal(typeValEle) || !checkInvalidVal(valueValEle)) 
                return error = true;

            entityText = entityEle.find("option:selected").text();
            typeValText = typeValEle.find("option:selected").text();
            valueValText = valueValEle.find("option:selected").text();

            extVariationData.push({
                entity: entityText,
                type: typeValText,
                value: valueValText
            });

            outputText += entityText + "_" + typeValText + "_" + valueValText + "<br>";
        });
        if(error) return false;

        formData.skuOrigins["externalVariation"] = JSON.stringify(extVariationData);
        $("#extVariationReview").html(loadReviewDataDiv({
            "Entity_Key_Value:":  outputText
        }));
    }
    else {
        formData.skuOrigins["externalVariation"] = "";
        $("#extVariationReview").text("N/A");
    }
    // KIT - hard code for now
    $("#kitReview").text("NO");
   
    var variationData = {};
    var newVariationCode = "";
    var strLocations = "", allLocations = $("input.selectLocation").serializeCheckmarkstoBinary();
    // Add to Form Data //
    $.each(["I", "II", "III", "IV"], function(i, val) {
        //Use the proper names on assignment
        let names = ["productCode", "finishingType", "variationType", "subVariationType"];
        let selector = "variation" + (i + 1);
        
        if($("#" + selector).val() === "add") {
            let max = $("[data-" + selector + "-max]").data(selector + "-max");
            //Add 1 to the max, if applicable
            if(max === -1) formData.skuOrigins[names[i] + "Number"] = "00";
            else if(max < 9) formData.skuOrigins[names[i] + "Number"] = "0" + (max + 1);
            else formData.skuOrigins[names[i] + "Number"] = max + 1;
            //If variation name is empty then set default N/A
            formData.skuOrigins[names[i] + "Description"] = ($("#" + selector + "Name").val() == "") ? "N/A" : $("#" + selector + "Name").val();
        }
        else if ($("#" + selector).val() === "na") {
            formData.skuOrigins[names[i] + "Number"] = "00";
            formData.skuOrigins[names[i] + "Description"] = "N/A";
        }
        else {
            formData.skuOrigins[names[i] + "Number"] = $("#" + selector).val();
            formData.skuOrigins[names[i] + "Description"] = $("#" + selector + " option:selected").text();
        }
        newVariationCode += formData.skuOrigins[names[i] + "Number"];
        variationData["Variation " + val + ":"] = formData.skuOrigins[names[i] + "Description"];
    });
    formData.sku["id"] = newVariationCode + "001";
    formData.skuOrigins["productCodeTitle"] = $("#productCodeTitle").val();
    formData.skuOrigins["kitSku"] = "N";  //default value until feature is added
    $.each(allLocations, function(i, loc) {
        formData.skuOrigins.location[loc.name] = formData.sku.location[loc.name] = loc.value;
        if(loc.value) strLocations += loc.name.toUpperCase() + ", ";
    });
    formData.sku["title"] = formData.skuOrigins.productCodeTitle + ": " + $("#dimX").val() + "x" + $("#dimY").val();
    formData.sku["label"] = formData.sku.title;
    // Update Review form data output //
    $("#variationReview").html(loadReviewDataDiv(variationData, "variationReview"));
    $("#productCodeTitleReview").text(formData.skuOrigins.productCodeTitle);
    $("#skuCodeDisplayInfo").text(formData.sku.id);
    $("#locationReview").text(strLocations.slice(0, -2));
    $("#skuTitleDisplayInfo").text(formData.sku.title);
    return true;
}

function reviewDimensions() {
    //(x, y) dimension validation
    if(!validateNumericalInputs($("#dimX"), 0)) return false;
    if(!validateNumericalInputs($("#dimY"), 0)) return false;
    //(x, y) multiplier validation
    if(!validateNumericalInputs($("#xMul"), 0, 1, 10)) return false;
    if(!validateNumericalInputs($("#yMul"), 0, 1, 10)) return false;
    
    // Add to form data //
    formData.sku["x"] = $("#dimX").val();
    formData.sku["y"] = $("#dimY").val();
    formData.sku["xMul"] = $("#xMul").val();
    formData.sku["yMul"] = $("#yMul").val();
    formData.sku["title"] = formData.skuOrigins.productCodeTitle + ": " + formData.sku.x + "x" + formData.sku.y;
    formData.sku["label"] = formData.sku.title;
    // Update Review section data output //
    $("#dimXReview").text($("#dimX").val());
    $("#dimYReview").text($("#dimY").val());
    $("#xMulReview").text(formData.sku.xMul);
    $("#yMulReview").text(formData.sku.yMul);
    $("#skuTitleDisplayInfo").text(formData.sku.title);
    return true;
}

function reviewPrinting() {
    if(!reviewDropDowns(3)) return false;
    //Printer
    if($("#printer").val() === "add") {
        if(!invalidInput("printerName")) return false;
        //Add to DB entry and update printing Review section
        dbs["printer"] = { name: $("#printerName").val() };
        $("#printerReview").html(loadReviewDataDiv({ "Name:": dbs.printer.name }, "printerReview"));
    }
    else {
        $("#printerReview").text($("#printer option:selected").text());
        $("[data-review-id='printerReview']").removeClass("reviewTabNewFlag");
    }
    //Substrate
    if($("#substrate").val() === "add") {
        if(!invalidInput("substrateName") || !invalidInput("substratePrinter") 
            || !invalidInput("substrateRollWidth") || !invalidInput("printBarcodesSeparately")) return false;
        //Group
        var group = "";
        if(!invalidInput("substrateGroup")) return false;
        else if($("#substrateGroup").val() === "add") {
            if(!invalidInput("substrateGroupName")) return false;
            group = $("#substrateGroupName").val();
        }
        else group = $("#substrateGroup option:selected").text();
        
        //Add substrate to DB entry
        dbs["substrate"] = {
            name: $("#substrateName").val(),
            printer: $("#substratePrinter").val(),
            substrateGroup: group,
            rollWidth: $("#substrateRollWidth").val(),
            addedBy: "baseSkus",
            printBarcodesSeparately: $("#printBarcodesSeparately").val()
        };

        let substrateGroup = dbs.substrate.substrateGroup 
            + (($("#substrateGroup").val() !== "add") ? "" : " <span style='color:var(--red)'>(NEW)</span>");
        //Update substrate Review section
        $("#substrateReview").html(loadReviewDataDiv({ 
            "Name:": dbs.substrate.name,
            "Printer:": $("#substratePrinter option:selected").text(),
            "Substrate Group:": substrateGroup,
            "Roll Width:": dbs.substrate.rollWidth,
            "Print Barcodes Separately:": $("#printBarcodesSeparately option:selected").text()
        }, "substrateReview"));
    }
    else {
        $("#substrateReview").text($("#substrate option:selected").text());
        $("[data-review-id='substrateReview']").removeClass("reviewTabNewFlag");
    }
    //Gallery Wrap
    if($("#gw").val() === "add") {
        if(!invalidInput("gwName")) return false;
        if(!validateNumericalInputs($("#gwSize"), 0)) return false;
        //Bar Symbol for new Bar IDs
        if(!invalidInput("bar")) return false;
        else if($("#bar").val() === "add") {
            if(!invalidInput("barSymbol") || !invalidInput("barColor") || !invalidInput("barDesc")) return false;
            // Add to DB entry
            dbs["barSymbol"] = {
                name: $("#barSymbol").val(),
                color: $("#barColor option:selected").text(),
                description: $("#barDesc").val()
            };
            // Update bar symbol Review section data output
            $("#barReview").html(loadReviewDataDiv({
                "Symbol:": dbs.barSymbol.name,
                "Color:": dbs.barSymbol.color,
                "Description:": dbs.barSymbol.description
            }, "barReview"));
            $("[data-review-id='barReview']").parent().show();
        }
        else $("[data-review-id='barReview']").hide();    //hide if selections have been changed
        
        //Add GW to DB entry since Bar Symbol is validated
        dbs["galleryWrap"] = {
            name: $("#gwName").val(),
            size: $("#gwSize").val(),
            barID: $("#bar").val()
        };
        // Update gw Review section data output
        $("#gwReview").html(loadReviewDataDiv({
            "Name:": dbs.galleryWrap.name,
            "Size:": dbs.galleryWrap.size,
            "Bar Symbol ID:": (dbs.galleryWrap.barID !== "add") ? dbs.galleryWrap.barID : "<span style='color:var(--red)'>(NEW)</span>"
        }, "gwReview"));
    }
    else $("#gwReview").text($("#gw option:selected").text());
    //Borders
    if($("#borders").val() === "add") {
        if(!invalidInput("bordersName")) return false;
        let dims = true;
        $("[id^='borders_']").each(function(i, obj) {
            if(obj.id.value === "") return dims = false;
        });
        if(!dims) return false;
        
        //Add borders to DB entry
        dbs["borders"] = {
            name: $("#bordersName").val(),
            dims: $("#borders_top").val() + "|" + $("#borders_right").val() + "|" 
                + $("#borders_bottom").val() + "|" + $("#borders_left").val()
        };
        // Update borders Review section data output
        $("#bordersReview").html(loadReviewDataDiv({ 
            "Name:": dbs.borders.name,
            "Dims": dbs.borders.dims + " (Top | Right | Bottom | Left)"
        }, "bordersReview"));
    }
    else {
        $("#bordersReview").text($("#borders option:selected").text());
        $("[data-review-id='bordersReview']").removeClass("reviewTabNewFlag");
    }
    //CBA & CBA PLUS
    let cba = $(".cba .activeOption").data("cba-option");
    let cbaPlus = $(".cbaPlus .activeOption").data("cba-plus-option");

    if(cba == null) {
        $("#cbaError").css("display", "block").html("CBA must have a selection to continue.");
        return false;
    }
    else if(cbaPlus == null) {
        $("#cbaPlusError").css("display", "block").html("CBA PLUS must have a selection to continue.");
        return false;
    }
    else if($(".cbaPlus [data-cba-plus-option='Y']").hasClass("activeOption") 
        && $(".cba [data-cba-option='Y']").hasClass("activeOption")) {
        return false;
    }
    else {
        $("#cbaReview").html(cba);
        $("#cbaPlusReview").html(cbaPlus);
    }
    
    // Add to form data //
    formData.sku["printer"] = $("#printer").val();
    formData.sku["substrate"] = $("#substrate").val();
    formData.sku["galleryWrap"] = $("#gw").val();
    formData.sku["borders"] = $("#borders").val();
    formData.sku["useCba"] = cba;
    formData.sku["useCbaPlus"] = cbaPlus;
    return true;
}

function reviewFinishing() {
    if(!reviewDropDowns(4)) return false;
    //Stretching
    if($("#stretching").val() === "add") {
        if(!invalidInput("stretchingName")) return false;
        //Add to DB entry and update stretching Review section
        dbs["stretching"] = { name: $("#stretchingName").val() };
        $("#stretchingReview").html(loadReviewDataDiv({ "Name:": dbs.stretching.name }, "stretchingReview"));
    }
    else {
        $("#stretchingReview").text($("#stretching option:selected").text());
        $("[data-review-id='stretchingReview']").removeClass("reviewTabNewFlag");
    }
    //Hardware
    if($("#hardware").val() === "add") {
        if(!invalidInput("hardwareName")) return false;
        //Add to DB entry and update hardware Review section
        dbs["hardware"] = { name: $("#hardwareName").val() };
        $("#hardwareReview").html(loadReviewDataDiv({ "Name:": dbs.hardware.name }, "hardwareReview"));
    }
    else {
        $("#hardwareReview").text($("#hardware option:selected").text());
        $("[data-review-id='hardwareReview']").removeClass("reviewTabNewFlag");
    }
    //Framing
    if($("#framing").val() === "add") {
        if(!invalidInput("framingCode") || !invalidInput("framingColor") || !invalidInput("framingDesc")) return false;
        //Add to DB entry and update framing Review section
        dbs["framing"] = {
            code: $("#framingCode").val().toUpperCase(),
            color: $("#framingColor").val().toLowerCase().replace(/\b[a-z]/g, function(e) { return e.toUpperCase(); }),
            desc: $("#framingDesc").val().toLowerCase().replace(/\b[a-z]/g, function(e) { return e.toUpperCase(); })
        };
        $("#framingReview").html(loadReviewDataDiv({
            "Code:": dbs.framing.code,
            "Color:" : dbs.framing.color,
            "Description:" : dbs.framing.desc
        }, "framingReview"));
    }
    else {
        $("#framingReview").text($("#framing option:selected").text());
        $("[data-review-id='framingReview']").removeClass("reviewTabNewFlag");
    }
    //Attribute
    if($("#attribute").val() === "add") {
        if($("#level").val() === "na") {
            $("#level").setError();
            return false;
        }
        if($("#attrMessage").val() === "") {
            $("#attrMessage").setError();
            return false;
        }
        //Number of Attribute codes and properties
        var valid = true;
        var codes = "", colors = "", shapes = "", fillOrStrokes = "";
        var numOfCodes = $(".attrNumber .activeOption").data("attr-option");
        
        if(numOfCodes == null) valid = false;
        else {
            for(let i = 1; i <= parseInt(numOfCodes); i++) {
                let code = $("#attrCode" + i), color = $("#attrColor" + i),
                    shape = $("#attrShape" + i), fillOrStroke = $("#attrFillOrStroke" + i);

                //Validate properties
                if(code.val() === "" || code.hasError()) {
                    code.setError();
                    return valid = false;
                }
                if($("#level").val() === "item") {
                    if(color.val() == null) {
                        $("#attrColor" + i + "-button").setError();
                        return valid = false;
                    }
                    if(shape.val() === "na") {
                        shape.setError();
                        return valid = false;
                    }
                    if(fillOrStroke.val() === "na") {
                        fillOrStroke.setError();
                        return valid = false;
                    }
                }
                //Pipeline data
                codes += code.val() + "|";
                colors += $("#attrColor" + i + " option:selected").text() + "|";
                shapes += shape.val() + "|";
                fillOrStrokes += fillOrStroke.val() + "|";
            }
        }
        
        if(!valid) {
            $("#attributeError").css("display", "block");
            return valid;
        }
        else $("#attributeError").css("display", "none");
        
        //Trim pipline strings
        codes = codes.slice(0, -1);
        colors = colors.slice(0, -1);
        shapes = shapes.slice(0, -1);
        fillOrStrokes = fillOrStrokes.slice(0, -1);
        //Component is optional so only take in values if all are filled out
        let colorMatch = colors.replace(/(na)/g, "").match(/([a-zA-Z]+)/g);
        let shapeMatch = shapes.replace(/(na)/g, "").match(/([a-zA-Z]+)/g);
        let fillOrStrokeMatch = fillOrStrokes.replace(/(na)/g, "").match(/([a-zA-Z]+)/g);

        if(colorMatch == null || colorMatch.length !== $("[id^='attrCode']:enabled").length) colors = "";
        if(shapeMatch == null || shapeMatch.length !== $("[id^='attrCode']:enabled").length) shapes = "";
        if(fillOrStrokeMatch == null || fillOrStrokeMatch.length !== $("[id^='attrCode']:enabled").length) fillOrStrokes = "";
        
        //Add to DB entry and update attribute Review section
        dbs["attribute"] = {
            attributeCode: codes,
            color: colors,
            shape: shapes,
            fillOrStroke: fillOrStrokes,
            message: $("#attrMessage").val(),
            level: $("#level").val()
        };
        $("#attributeReview").html(loadReviewDataDiv({
            "Level:": dbs.attribute.level,
            "Message:": dbs.attribute.message,
            "Number of Codes:": numOfCodes,
            "Attribute Code(s):": dbs.attribute.attributeCode.replace(/[|]/g, " | "),
            "Color(s):": dbs.attribute.color.replace(/[|]/g, " | "),
            "Shape(s):": dbs.attribute.shape.toUpperCase().replace(/[|]/g, " | ").replace(/(NA)/g, "N/A"),
            "Fill(s) or Stroke(s):": dbs.attribute.fillOrStroke.toUpperCase().replace(/[|]/g, " | ").replace(/(NA)/g, "N/A")
        }, "attributeReview"));
    }
    else {
        $("#attributeReview").text($("#attribute option:selected").text());
        $("[data-review-id='attributeReview']").removeClass("reviewTabNewFlag");
    }
    
    // Add to form data //
    formData.sku["crop"] = $("#crop").val();
    formData.sku["stretching"] = $("#stretching").val();
    formData.sku["hardware"] = $("#hardware").val();
    formData.sku["framing"] = $("#framing").val();
    formData.sku["attributeCodeId"] = $("#attribute").val();
    formData.sku["edgeCutPath"] = $("#edgeCutPath option:selected").text();
    formData.sku["outline"] = $("#outline").val();
    formData.sku["staticCutPathTemplate"] = $("#staticCutPathTemplate").val();
    // Update Review form data output //
    $("#cropReview").text($("#crop option:selected").text());
    $("#edgeCutPathReview").text(formData.sku.edgeCutPath);
    $("#outlineReview").text($("#outline option:selected").text());
    $("#staticCutPathTemplateReview").text($("#staticCutPathTemplate option:selected").text());
    return true;
}

function reviewBarcode() {
    if(!reviewDropDowns(5)) return false;
    
    // Add to form data //
    formData.sku["xBarcodePosition"] = $("#xBarcodePosition").val();
    formData.sku["barcodeHeight"] = $("#barcodeHeight option:selected").text();
    formData.sku["barcodeWidth"] = $("#barcodeWidth option:selected").text();
    formData.sku["barcodeLabelPlacement"] = $("#barcodeLabelPlacement").val();
    formData.sku["separateBarcode"] = $("#separateBarcode option:selected").text();
    // Update Review section data output //
    $("#xBarcodePositionReview").text($("#xBarcodePosition option:selected").text());
    $("#barcodeHeightReview").text(formData.sku.barcodeHeight);
    $("#barcodeWidthReview").text(formData.sku.barcodeWidth);
    $("#barcodePlacementReview").text(formData.sku.barcodeLabelPlacement.toUpperCase());
    $("#separateBarcodeReview").text(formData.sku.separateBarcode);
    return true;
}

function reviewPackaging() {
    if(!reviewDropDowns(6)) return false;
    if(!validateNumericalInputs($("#weight"), 0)) return false;
    if(!validateNumericalInputs($("#productPrice"), 0)) return false;
    if(!validateNumericalInputs($("#deliveredPrice"), 0)) return false;
    if($("#exception").prop("checked")) {
        if(!invalidInput("exceptionMap") || !invalidInput("exceptionPriceGroup") || !invalidInput("exceptionPriceList")) return false;
        // Add to DB entry //
        dbs["exception"] = {
            map: $("#exceptionMap").val(),
            group: $("#exceptionPriceGroup").val(),
            list: $("#exceptionPriceList").val()
        };
        $("#exceptionReview").html(loadReviewDataDiv({
            "Map:":  $("#exceptionMap option:selected").text(),
            "Price Group:": $("#exceptionPriceGroup option:selected").text(),
            "Price List:":  $("#exceptionPriceList option:selected").text()
        }));
    }
    else $("#exceptionReview").text("N/A");
    
    // Add to form data //
    formData.sku["packageName"] = $("#packageName option:selected").text();
    formData.sku["packageSku"] = $("#packageName").val();
    formData.sku["inventoryType"] = $("#inventoryType").val().replace("_", " ").toUpperCase();
    formData.sku["weight"] = $("#weight").val();
    formData.sku["productOnlyPrice"] = $("#productPrice").val();
    formData.sku["deliveredGlobalPrice"] = $("#deliveredPrice").val();
    formData["exception"] = ($("#exception").prop("checked")) ? 1 : 0;
    // Update Review section data output //
    $("#packageReview").html(loadReviewDataDiv({
        "Name:": formData.sku.packageName,
        "SKU:": formData.sku.packageSku
    }));
    $("#inventoryTypeReview").text($("#inventoryType option:selected").text());
    $("#weightReview").text(formData.sku.weight);
    $("#productPriceReview").text(formData.sku.productOnlyPrice);
    $("#deliveredPriceReview").text(formData.sku.deliveredGlobalPrice);
    return true;
}

function submitFormData() {
    $.ajax({
        type: "POST",
        url: site_root + "ajax/reports/sku_list/createVariationSku.php",
        dataType: "json",
        data: {
            form: formData,
            db: dbs
        },
        success: function(response) {
            if(response.status) {
                recordUserAction({
                    root: site_root,
                    redirect: parent_site,
                    applicationId: 41,
                    actionId: 184,
                    notes: "New SKU variation created. Title: " + formData.sku.title 
                            + ", Code: " + formData.sku.id + ". DB LOG __ " 
                            + JSON.stringify(response.dbRecords) + " __"
                });
            }
            else openAlert(response.message);
        },
        error: function(response) {
            console.log(response); 
            openAlert("An error has occured while creating this SKU variation. \
                Please try again or contact your manager if the problem persists.");
        }
    });
}