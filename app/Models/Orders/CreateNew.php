<?php

namespace App\Models\Orders;

use App\Models\AddressValidation;
use App\Models\Base;
use App\Models\OrderLocation;
use App\Models\Orders;

class CreateNew extends Base
{
    private $_request;
    private $_xmlObject;
    private $_token;
    private $_orderObject;
    private $_parsedRequest;
    private $_productCodeArray;
    private $_numberOfItems;
    private $_shippingPriceByProduct;
    private $_wholeSale;
    private $_errorPrepareItemMsg;
    private $_assignedCarrier;
    private $_assignedLocId;
    const DEFAULT_COUNTRY = "US";
    const DEFAULT_ORDER_STATUS = 0;
    const DEFAULT_STATUS_ID = 0;
    const DEFAULT_ORDER_STATUS_NAME = "RECEIVED";

    /**
     * CreateNew constructor.
     * @param $request
     */
    function __construct($request)
    {
        $this->_request = $request;
        $this->_xmlObject = convertXmlStringToObject(trim($request['xml']));
        $this->_token = $request['token'];
        $this->_productCodeArray = array();
        $this->_numberOfItems = 0;
        $this->_errorPrepareItemMsg = '';
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function createNewOrder()
    {
        $results = $this->_simpleValidate();
        if ($results['success']) {
            $this->_parsedRequest = $this->_parseOrderRequest();
            $results = $this->_validateParsedRequest();
            if ($results['success']) {
                $results = $this->_doCreateNewOrder();
            }
        }

        return $results;
    }

    /**
     * @throws \Exception
     */
    private function _doCreateNewOrder()
    {
        $success = FALSE;
        $message = '';

        $request = $this->_parsedRequest;
        $clientInfo = $this->_getClientInfo();
        $userName = $clientInfo["userName"];
        $newOrderId = '';

        $calculateTax = ($request["third_party_tax_collected"] == "");
        $assignedLocId = $this->_assignLocation();
        $this->_assignedLocId = $assignedLocId;

        $totalQuotePrice = $this->_calculateTotalQuotePrice($clientInfo, $assignedLocId);
        //Could not generalize shipping rates
        if (!$totalQuotePrice) {
            $message = "Could not find generalized Shipping Price for " . $request["shippingType"] . " Shipping Type sent by $userName";
        }
        //Prepare to insert new order and items
        else {
            $tax = ($calculateTax) ? $this->_calculateFreightTax($totalQuotePrice) : 0;
            $totalQuotePrice += $tax;

            if (($request["storeId"] == "001" or $request["storeId"] == "006") and
                $request["shippingType"] == "RTW" and $userName == "costcoPrintCopy") {
                $this->_parsedRequest["frontSticker"] = "https://s3.amazonaws.com/live-costcoprintcopy/static/printcopy-sticker.jpg";
            }

            //Prepare insert items
            $preparedInsertItems = $this->_prepareInsertItems($clientInfo, $assignedLocId, $tax, $totalQuotePrice);

            if ($this->isNotEmptiedArray($preparedInsertItems)) {
                //Insert order
                $newOrderId = $this->_insertOrder($assignedLocId, $totalQuotePrice, $tax);
                if (ctype_digit(strval($newOrderId))) {
                    //Insert items
                    $success = $this->_insertItems($preparedInsertItems, $newOrderId);

                }
                else {
                    $message = "Failed to create new order, please try again!";
                }
            }
            else {
                $message = $this->_errorPrepareItemMsg;
            }
        }

        return
            array(
                'success' => $success,
                'errorMsg' => $message,
                'userName' => $userName,
                'orderId'  => $newOrderId
            );
    }

    /**
     * @param $clientInfo
     * @param $assignedLocId
     * @param $tax
     * @param $totalQuotePrice
     * @return array|false
     * @throws \Exception
     */
    private function _prepareInsertItems($clientInfo, $assignedLocId, $tax, $totalQuotePrice)
    {
        $request = $this->_parsedRequest;
        $productList = $this->_getProductsDetails($assignedLocId, $this->_productCodeArray);
        $itemArray = $request['items'];
        $userName = $clientInfo["userName"];
        $itemGrossPriceFlag = $this->_checkXmlPermission("itemGrossPrice", $userName);
        $itemDiscountFlag = $this->_checkXmlPermission("itemDiscount", $userName);
        $locShortName = $this->_getLocationAbbreviation($assignedLocId);
        $sourceCountry = self::DEFAULT_COUNTRY;
        $totalQty = $this->_calculateTotalQty();

        //Initial for default
        $imageStatus = "-2";
        $customerId = '';
        $restoration = 0;
        $kitSku = 0;
        $kitType = "";
        $tychSize = '';

        $itemIndex = 0;
        $counter = 0;
        $numImages = 0;
        $packageItemId = 0;
        $foundProductWrongSetting = false;
        //Prepare insert item array
        $prepareInsertItems = array();
        foreach ($itemArray as $item) {
            //Initial for default and kit
            $piece = 1;
            $numberOfComponents = 0;
            $in = $itemIndex + 1;

            $itemCode = $item["code"];
            $productActive = $productList[$itemCode]["active"];
            //Testing
            //$productActive = "N";
            if ($productActive != "Y") {
                $foundProductWrongSetting = TRUE;
                $this->_errorPrepareItemMsg = "Product Error: Product ID: " . $itemCode . " not available.";
                break;
            }
            else {
                $itemGrossPrice = ($itemGrossPriceFlag) ? $item["itemGrossPrice"] : "";
                if (!$itemDiscountFlag) {
                    $item["itemDiscount"] = "";
                }
                $x = $productList[$itemCode]["x"];
                $y = $productList[$itemCode]["y"];
                $sku = $productList[$itemCode]["sku"];

                //Pricing
                $price = ($itemGrossPrice == "") ? $this->_getLocationSpecificPrice($locShortName, $itemCode) : $itemGrossPrice;
                //Price needs to be changed to the discounted price, when applicable
                if ($clientInfo["discountPercent"] != "" and $clientInfo["discountPercent"] != 0) {
                    $price = $clientInfo["discountPercent"] * $price;
                }

                //For now
                $productTax = 0;
                $tax += $productTax * $item["qt"];

                //Whole sale
                if (!isset($item['dynamicItems'])) {
                    $this->_wholeSale += ($price * $item["qt"]) + $tax;
                }

                //retail frame workflow
                $framingArray = $this->_getFraming($productList, $itemCode);
                $framed = $framingArray['framed'];
                $framedColor = $framingArray['framedColor'];
                $frameCode = $framingArray['frameCode'];

                //Back print
                $backPrintLine1 = (isset($item["backPrintLine1"]) ? sanitizeMyString($item["backPrintLine1"]) : "");
                $backPrintLine2 = (isset($item["backPrintLine2"]) ? sanitizeMyString($item["backPrintLine2"]) : "");
                $prepareInsertItems[$itemIndex]["backPrintLine1"] = $backPrintLine1;
                $prepareInsertItems[$itemIndex]["backPrintLine2"] = $backPrintLine2;

                $prepareInsertItems[$itemIndex]["qt"] = $item["qt"];
                $prepareInsertItems[$itemIndex]["itemNumber"] = ($item["itemNumber"] == "" ? $itemIndex : $item["itemNumber"]);
                $item["customerId"] = (isset($item['isFirst'])) ? $this->_getImageGroupId() : "";

                //Calculate shipping item
                $prepareInsertItems[$itemIndex]["shipping"] = 0;
                if ($totalQuotePrice > 0) {
                    $prepareInsertItems[$itemIndex]["shipping"] = 0;
                    $shippingPriceByProduct = $this->_shippingPriceByProduct;
                    if ($this->isNotEmptiedArray($shippingPriceByProduct)) {
                        $prepareInsertItems[$itemIndex]["shipping"] = $shippingPriceByProduct[$itemCode] * $item["qt"];
                    }
                    else {
                        $prepareInsertItems[$itemIndex]["shipping"] = ($totalQuotePrice / $totalQty) * $item["qt"];
                    }
                }
                else {
                    $prepareInsertItems[$itemIndex]["shipping"] = 0;
                }

                //KIT:Piece > 1
                if ($productList[$itemCode]["piece"] > 1) {
                    $productCodesArr = explode("|", $productList[$itemCode]["productCodes"]);
                    //Testing
                    //$productCodesArr = array();
                    if (count($productCodesArr) != count($item["imageLocation"])) {
                        $foundProductWrongSetting = TRUE;
                        $this->_errorPrepareItemMsg = "Image Location Error: Incorrect number of Image Location";
                        break;
                    }

                    // Components with single image
                    if (!is_array($item["imageLocation"])) {
                        $item["imageLocation"] = array(0 => $item["imageLocation"]);
                    }
                    $numItemsInKit = count($item["imageLocation"]);
                    $kitItemPrice = round($prepareInsertItems[$itemIndex]["shipping"] / $numItemsInKit, 2);
                    $firstInGroup = 0;
                    $i = 0;
                    foreach ($item["imageLocation"] as $imageLocation) {
                        if ($i == $numItemsInKit) {
                            $in++;
                        }
                        $currProductCode = $productCodesArr[$i];
                        //get the product details specific to this location
                        $productDetailsArray = $this->_getProductsDetails($locShortName, array($currProductCode));

                        $currentProductId = $productDetailsArray[$currProductCode]["productId"];
                        $current_price = (isset($itemGrossPrice) && $itemGrossPrice != "" && $itemGrossPrice != 0) ?
                            $current_price = moneyFormat($itemGrossPrice) :
                            $current_price = moneyFormat($productDetailsArray[$currProductCode]["price"]);
                        $current_x = $productDetailsArray[$currProductCode]["x"];
                        $current_y = $productDetailsArray[$currProductCode]["y"];
                        $current_retailPrice = $productDetailsArray[$currProductCode]["retailPrice"];
                        $current_tychSize = $current_x . "x" . $current_y;
                        $current_gwSize = $productDetailsArray[$currProductCode]["gwSize"];
                        $current_gwType = $productDetailsArray[$currProductCode]["gwType"];
                        $current_tSize = $productDetailsArray[$currProductCode]["tSize"];
                        $current_tColor = $productDetailsArray[$currProductCode]["tColor"];
                        $current_sku = $productDetailsArray[$currProductCode]["sku"];
                        $current_kitSku = $productDetailsArray[$currProductCode]["kitSku"];
                        $current_kitType = $productDetailsArray[$currProductCode]["kitType"];
                        $current_psTitle = $productDetailsArray[$currProductCode]["psTitle"];
                        $current_framing = $productDetailsArray[$currProductCode]["framing"];
                        $current_framedColor = $productDetailsArray[$currProductCode]["framedColor"];
                        $current_piece = $productList[$itemCode]["piece"];
                        $current_componentType = $productDetailsArray[$currProductCode]["componentType"];
                        $current_frameCode = $this->getSYNExactOne('framingCodes', 'frameCode', 'framing', $current_framing);

                        $prepareInsertItems[$itemIndex]["locId"] = $assignedLocId; //for now just passing order leve locId
                        $prepareInsertItems[$itemIndex]["x"] = $current_x;
                        $prepareInsertItems[$itemIndex]["y"] = $current_y;
                        $prepareInsertItems[$itemIndex]["fileLabel"] = $current_tychSize;
                        $prepareInsertItems[$itemIndex]["sku"] = $current_sku;
                        $prepareInsertItems[$itemIndex]["psTitle"] = ($item["itemDescription"] == "" ? $current_psTitle : $item["itemDescription"]);
                        $prepareInsertItems[$itemIndex]["title"] = "Image " . $counter;

                        $prepareInsertItems[$itemIndex]["retailPrice"] = $current_retailPrice;
                        $prepareInsertItems[$itemIndex]["price"] = $current_price;
                        $prepareInsertItems[$itemIndex]["tax"] = $productTax;
                        $prepareInsertItems[$itemIndex]["discountPrice"] = $item["itemDiscount"];

                        $prepareInsertItems[$itemIndex]["qt"] = $item["qt"];
                        $prepareInsertItems[$itemIndex]["itemNumber"] = $item["itemNumber"];
                        $prepareInsertItems[$itemIndex]["imageLocation"] = $imageLocation;
                        $prepareInsertItems[$itemIndex]["copy_img_loc"] = $imageLocation;
                        $prepareInsertItems[$itemIndex]["imageStatus"] = $imageStatus;

                        $prepareInsertItems[$itemIndex]["customerId"] = $item["customerId"];

                        $prepareInsertItems[$itemIndex]["itemCode"] = $productCodesArr[$i];
                        $prepareInsertItems[$itemIndex]["customerItemCode"] = $currentProductId;
                        $prepareInsertItems[$itemIndex]["componentType"] = $current_componentType;
                        $prepareInsertItems[$itemIndex]["numberOfComponents"] = $numberOfComponents;

                        $prepareInsertItems[$itemIndex]["_gwSize"] = $current_gwSize;
                        $prepareInsertItems[$itemIndex]["_gwType"] = $current_gwType;
                        $prepareInsertItems[$itemIndex]["_framed"] = $current_framing;
                        $prepareInsertItems[$itemIndex]["_framedColor"] = $current_tColor;
                        $prepareInsertItems[$itemIndex]["frameCode"] = $current_frameCode;
                        $prepareInsertItems[$itemIndex]["matted"] = $productList[$itemCode]["matted"];
                        //$prepareInsertItems[$itemIndex]["tSize"] = $productList[$itemCode]["tSize"];
                        $prepareInsertItems[$itemIndex]["color"] = $productList[$itemCode]["tColor"];
                        $prepareInsertItems[$itemIndex]["_restoration"] = $restoration;
                        $prepareInsertItems[$itemIndex]["_corbis"] = $clientInfo["corbis"];

                        $prepareInsertItems[$itemIndex]["kitSku"] = $current_kitSku;
                        $prepareInsertItems[$itemIndex]["kitType"] = $current_kitType;
                        $prepareInsertItems[$itemIndex]["tychSize"] = $current_tychSize;
                        $prepareInsertItems[$itemIndex]["piece"] = $current_piece;

                        $selectedItemCode = isset($item["selectedItemCode"]) ? $item["selectedItemCode"] : '';
                        $prepareInsertItems[$itemIndex]["selectedItemCode"] = $selectedItemCode;

                        $prepareInsertItems[$itemIndex]["shipping"] = $kitItemPrice;
                        $prepareInsertItems[$itemIndex]["shippingTemplateId"] = $productList[$itemCode]["shippingTemplateId"];

                        $prepareInsertItems[$itemIndex]["costcoItemCode"] = "";
                        $prepareInsertItems[$itemIndex]["apiTime"] = time();

                        //Prepare components
                        if (!is_null($productDetailsArray[$currProductCode]["componentType"]) &&
                            $productDetailsArray[$currProductCode]["componentType"] != "") {
                            $productCodes = $productDetailsArray[$currProductCode]["productCodes"];
                            $componentCodesArr = explode("|", $productCodes);
                            $numberOfComponents = count($componentCodesArr);
                            $prepareInsertItems[$itemIndex]["numberOfComponents"] = $numberOfComponents;
                            //Create component array
                            $componentIndexCounts = 0;
                            foreach ($componentCodesArr as $keyCom => $component) {
                                if (!isset($componentCodesArr[$componentIndexCounts])) {
                                    break;
                                }
                                $productComponentDetailsArray = $this->_getProductComponentDetails($component);
                                $current_id = $productComponentDetailsArray["id"];
                                $current_x = $productComponentDetailsArray["x"];
                                $current_y = $productComponentDetailsArray["y"];
                                $current_tychSize = $current_x . "x" . $current_y;
                                $current_psTitle = $productComponentDetailsArray["psTitle"];
                                $current_componentSku = $productComponentDetailsArray["skuComponent"];
                                $current_componentType = $productComponentDetailsArray["componentType"];
                                $current_name = $productComponentDetailsArray["name"];

                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["productComponentId"] = $current_id;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["x"] = $current_x;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["y"] = $current_y;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["skuComponent"] = $current_componentSku;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["componentType"] = $current_componentType;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["psTitle"] = $current_psTitle;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["imageLocation"] = $imageLocation;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["fileLabel"] = $current_tychSize;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["copy_img_loc"] = $imageLocation;
                                $prepareInsertItems[$itemIndex]["components"][$componentIndexCounts]["packItemId"] = $packageItemId;

                                $componentIndexCounts++;
                            }
                        }//Prepare components

                        $itemIndex++;
                        $counter++;
                        $i++;
                        $numImages++;
                        $firstInGroup++;
                    }//foreach image location
                }
                //Default single item
                else {
                    if ($productList[$itemCode]["piece"] != count((array)$item["imageLocation"])) {
                        $foundProductWrongSetting = TRUE;
                        $this->_errorPrepareItemMsg = "Image Location Error: Incorrect number of Image Location";
                        break;
                    }

                    $prepareInsertItems[$itemIndex]["locId"] = $assignedLocId; //for now just passing order leve locId
                    $prepareInsertItems[$itemIndex]["x"] = $x;
                    $prepareInsertItems[$itemIndex]["y"] = $y;
                    $prepareInsertItems[$itemIndex]["fileLabel"] = $x . "x" . $y;
                    $prepareInsertItems[$itemIndex]["sku"] = $sku;
                    $prepareInsertItems[$itemIndex]["psTitle"] = ($item["itemDescription"] == "" ?
                        $productList[$itemCode]["psTitle"] : $item["itemDescription"]);
                    $prepareInsertItems[$itemIndex]["title"] = "Image " . $counter;

                    $prepareInsertItems[$itemIndex]["retailPrice"] = $item["retailPrice"];
                    $prepareInsertItems[$itemIndex]["price"] = $price;
                    $prepareInsertItems[$itemIndex]["tax"] = $productTax;
                    $prepareInsertItems[$itemIndex]["discountPrice"] = $item["itemDiscount"];

                    $prepareInsertItems[$itemIndex]["qt"] = $item["qt"];
                    $prepareInsertItems[$itemIndex]["itemNumber"] = $item["itemNumber"];
                    $prepareInsertItems[$itemIndex]["imageLocation"] = $item["imageLocation"];
                    $prepareInsertItems[$itemIndex]["copy_img_loc"] = $item["imageLocation"];
                    $prepareInsertItems[$itemIndex]["imageStatus"] = $imageStatus;
                    $prepareInsertItems[$itemIndex]["customerId"] = $item["customerId"];;
                    $prepareInsertItems[$itemIndex]["itemCode"] = $itemCode;
                    $prepareInsertItems[$itemIndex]["customerItemCode"] = $productList[$itemCode]["customerItemCode"];

                    $prepareInsertItems[$itemIndex]["componentType"] = $productList[$itemCode]["componentType"];

                    $prepareInsertItems[$itemIndex]["numberOfComponents"] = $numberOfComponents;
                    $prepareInsertItems[$itemIndex]["_gwSize"] = $productList[$itemCode]["gwSize"];
                    $prepareInsertItems[$itemIndex]["_gwType"] = $productList[$itemCode]["gwType"];

                    $prepareInsertItems[$itemIndex]["_framed"] = $framed;
                    $prepareInsertItems[$itemIndex]["_framedColor"] = $framedColor;
                    $prepareInsertItems[$itemIndex]["frameCode"] = $frameCode;

                    $prepareInsertItems[$itemIndex]["matted"] = $productList[$itemCode]["matted"];
                    //$prepareInsertItems[$itemIndex]["tSize"] = $productList[$itemCode]["tSize"];
                    $prepareInsertItems[$itemIndex]["color"] = $productList[$itemCode]["tColor"];
                    $prepareInsertItems[$itemIndex]["_restoration"] = $restoration;
                    $prepareInsertItems[$itemIndex]["_corbis"] = $clientInfo["corbis"];

                    $prepareInsertItems[$itemIndex]["kitSku"] = $kitSku;
                    $prepareInsertItems[$itemIndex]["kitType"] = $kitType;
                    $prepareInsertItems[$itemIndex]["tychSize"] = $tychSize;
                    $prepareInsertItems[$itemIndex]["piece"] = $piece;

                    $selectedItemCode = isset($item["selectedItemCode"]) ? $item["selectedItemCode"] : '';
                    $prepareInsertItems[$itemIndex]["selectedItemCode"] = $selectedItemCode;

                    $prepareInsertItems[$itemIndex]["costcoItemCode"] = "";
                    $prepareInsertItems[$itemIndex]["apiTime"] = time();

                    $counter++;
                    $numImages++;
                    $itemIndex += 1;
                }
            }//else item is active
        }//Prepare insert item array

        if ($foundProductWrongSetting) {
            $prepareInsertItems = array();
        }
        else {
            $this->_numberOfItems = $numImages;
        }

        return $prepareInsertItems;
    }

    /**
     * @param $preparedInsertItems
     * @param $newOrderId
     * @return bool
     * @throws \Exception
     */
    private function _insertItems($preparedInsertItems, $newOrderId)
    {
        $itemCodeArray = array();
        $success = TRUE;

        foreach ($preparedInsertItems as $itemData) {
            $itemData['orderId'] = $newOrderId;
            $newItemId = $this->getResource(SYN_DB)->insert('orderItems', $itemData);
            if( $newItemId ) {
                array_push($itemCodeArray, $itemData['itemCode']);
            }
            else {
                $success = false;
                break;
            }
        }//foreach

        $this->_cleanUp($newOrderId, $itemCodeArray);

        return $success;
    }

    /**
     * @param $newOrderId
     * @param $itemCodeArray
     * @throws \Exception
     */
    private function _cleanUp($newOrderId, $itemCodeArray)
    {
        $locId =  $this->_assignedLocId;
        $itemCodeInStmt = implode(",", $itemCodeArray);
        $cleanupSql = "DELETE FROM orderItems 
                       WHERE 
                        itemCode NOT IN ($itemCodeInStmt) AND
                        locId <> $locId AND imageStatus <> '-2' AND
                        orderId = $newOrderId";
        $this->rawSYNQuery($cleanupSql);
    }

    /**
     * @param $assignedLocId
     * @param $totalQuotePrice
     * @param $tax
     * @return bool
     * @throws \Exception
     */
    private function _insertOrder($assignedLocId, $totalQuotePrice, $tax)
    {
        $request = $this->_parsedRequest;
        $customerInfoArray = $request["customerInfo"];
        $clientInfo = $this->_getClientInfo();
        $premiumArray = $this->_premiumComponentsPrice();

        $userName = $clientInfo["userName"];
        $orderType = ($request["shippingType"] == "RTS" || $request["shippingType"] == "RTW") ? "returnToStore" : "retail";
        $thirdPartyERPTransferred = $this->_thirdTransfer($clientInfo, $assignedLocId);
        $orderComments = "(" . $userName . ") - " . $orderType . ", Ships via " . $request["shippingType"];
        $adminComments = "Current QuoteId: " . $request["quoteId"];
        $testMode = ($clientInfo["clientStatus"] != "ENABLED" or $request["wpTool"] != 0) ? 1 : 0;

        $premium = $premiumArray["premium"];
        $brandingPrice = $premiumArray["brandingPrice"];
        $extraChargeReason = $premiumArray["extraChargeReason"];

        $thirdPtyTaxCollected = ($request["third_party_tax_collected"] == '') ? 0 : $request["third_party_tax_collected"];

        $reqTime = time();

        $data = array(
            'owner' => $userName,
            'poNumber' => $request['poNumber'],
            'originalPoNumber' => $request['originalPoNumber'],
            'orderReferenceId' => $request['poNumber'],

            'orderTime' => $reqTime,
            'orderDate' => friendlyDateNow(),
            //Initial 0 and wait for cron to update status
            'active' => self::DEFAULT_ORDER_STATUS,
            'statusId' => self::DEFAULT_STATUS_ID,
            '_orderType' => $orderType,

            'adminComments' => $adminComments,
            'comments' => $orderComments,
            'testMode' => $testMode,

            'firstName' => $request['firstName'],
            'lastName' => $request['lastName'],
            'company' => $request['company'],
            'address' => $request['address'],
            'address2' => $request['address2'],
            'aptNumber' => $request['aptNumber'],
            'city' => $request['city'],
            'state' => $request['state'],
            'zip' => $request['zip'],
            'urbanizationCode' => $request['urbanizationCode'],
            'country' => $request['destinationCountry'],
            'email' => $request['email'],
            'phone' => $request['phoneNumber'],
            'memberPhone' => $request['phoneNumber'],

            'quoteId' => $request['quoteId'],
            'shipping' => $totalQuotePrice,
            '_shipCostTotal' => $totalQuotePrice,
            'shippingModelId' => $clientInfo["shippingModelId"],
            'shippingZoneId' => $clientInfo["shippingZoneId"],
            'shippingType' => $request['shippingType'],
            'shippingService' => "generic",
            'carrier' => $this->_assignedCarrier,

            'subTotal' => $this->_wholeSale,
            'total' => $this->_wholeSale,
            'tax' => $tax,
            'numImages' => $this->_numberOfItems,
            'storeId' => $request['storeId'],
            'orderOrigin' => $request["orderOrigin"],
            'locId' => $assignedLocId,

            'premium' => $premium,
            'brandingPrice' => $brandingPrice,
            'extraChargeReason' => $extraChargeReason,
            'frontPackingSlip' => $request["frontPackingSlip"],
            'backPackingSlip' => $request["backPackingSlip"],
            'templatePackingSlip' => $request["templatePackingSlip"],
            'outsideInsertCard' => $request["outsideInsertCard"],
            'insideInsertCard' => $request["insideInsertCard"],
            'frontSticker' => $request["frontSticker"],
            'customLogo' => $request["customLogo"],

            'thirdPartyERPTransferred' => $thirdPartyERPTransferred,
            'third_party_trans_id' => $request["third_party_trans_id"],
            'third_party_total_collected' => $request["third_party_total_collected"],
            'totalDiscount' => $request["third_party_total_discount"],
            'third_party_tax_collected' => $thirdPtyTaxCollected,
            'third_party_id' => $customerInfoArray['third_party_id'],
            'third_party_cust_id' => $customerInfoArray['third_party_cust_id'],
            'third_party_company_name' => $customerInfoArray['third_party_company_name'],
            'third_party_company_website' => $customerInfoArray['third_party_company_website'],
            'third_party_contact_first_name' => $customerInfoArray['third_party_contact_first_name'],
            'third_party_contact_last_name' => $customerInfoArray['third_party_contact_last_name'],
            'third_party_billing_street' => $customerInfoArray['third_party_billing_street'],
            'billingIsReturnAddress' => $customerInfoArray['third_party_billing_is_return_address'],
            'third_party_billing_city' => $customerInfoArray['third_party_billing_city'],
            'third_party_billing_state' => $customerInfoArray['third_party_billing_state'],
            'third_party_billing_zip' => $customerInfoArray['third_party_billing_zip'],
            'third_party_billing_country' => $customerInfoArray['third_party_billing_country'],
            'third_party_billing_phone' => $customerInfoArray['third_party_billing_phone'],
            'third_party_billing_email' => $customerInfoArray['third_party_billing_email'],

            'couponCode' => $customerInfoArray['couponCode'],
            'noColorCorrect' => $clientInfo["noColorCorrect"],
            'isRedo' => "N",
            'redoCode' => "",
            'redoWithChanges' => "N",
            'noCharge' => '',
            'jondoTool' => $request["wpTool"],
            'orderStatus' => self::DEFAULT_ORDER_STATUS_NAME,
            'zoneId' => NULL,
            'pricingGroupId' => $clientInfo["pricingGroupId"],
            'statusUrl' => $request['statusUrl'],
            'locationPriority' => 1,
            'packingSlipFooterText' => $request['footerText'],
            '_customerOrderId' => $request['orderReferenceId']
        );
        //$this->dumpVar($data, "insert_order_data");

        $newOrderId = $this->getResource(SYN_DB)->insert('orders', $data);
        //$newOrderId = 123;
        if ($newOrderId) {
            return $newOrderId;
        }

        return FALSE;
    }

    /**
     * @return false|string
     * @throws \Exception
     */
    private function _getCarrier()
    {
        $request = $this->_parsedRequest;
        $carrierArray = $this->_getShippingTypeInfo($request["shippingType"]);

        if ($this->isNotEmptiedArray($carrierArray)) {
            $carrier = $carrierArray["carrier"];
            $isPoBoxAllowed = $carrierArray["isPoBoxAllowed"];

            if (isPoBoxAddress($request["address"]) || isPoBoxAddress($request["city"])) {
                if (strtoupper($isPoBoxAllowed) == "N") {
                    return false;
                }
            }

            if ($carrierArray["shippingType"] != "") {
                $this->_parsedRequest["shippingType"] = $carrierArray["shippingType"];
            }

            if ($carrier == '') {
                $carrier = "FEDEX"; //Default!
            }

            $this->_assignedCarrier = strtoupper($carrier);

            return strtoupper($carrier);
        }

        return FALSE;
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    private function _getImageGroupId()
    {
        $sql = "SELECT MAX( CAST( customerId AS UNSIGNED ) ) AS imageGroup FROM orderItems";
        $data = $this->rawSYNQuery($sql);

        return isset($data[0]) ? $data[0]['imageGroup'] : "";
    }

    /**
     * @param $shippingType
     * @return array|string
     * @throws \Exception
     */
    private function _getShippingTypeInfo($shippingType)
    {
        $sql = "SELECT 
                    id, carrier, isPoBoxAllowed, shippingType, 
                    sensariaProvider, sensariaShipMethod, transitMin, transitMax
                FROM shippingTypes 
                WHERE shippingType = ?";
        $data = $this->rawSYNQuery($sql, array($shippingType));

        return isset($data[0]) ? $data[0] : array();
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _premiumComponentsPrice()
    {
        $premium = 0;
        $brandingPrice = "";
        $extraChargeReason = "";
        $request = $this->_parsedRequest;

        if ((isset($request["frontPackingSlip"]) && $request["frontPackingSlip"] != "") or
            (isset($request["backPackingSlip"]) && $request["backPackingSlip"] != "") or
            (isset($request["outsideInsertCard"]) && $request["outsideInsertCard"] != "") or
            (isset($request["insideInsertCard"]) && $request["insideInsertCard"] != "") or
            (isset($request["frontSticker"]) && $request["frontSticker"] != "") or
            (isset($request["footerText"]) && $request["footerText"] != "") or
            (isset($request["templatePackingSlip"]) && $request["templatePackingSlip"] != "0" && $request["templatePackingSlip"] != "") or
            (isset($request["customLogo"]) && $request["customLogo"] != "")) {
            $premium = 1;
            $brandFees = $this->_getBrandFees($request["userId"]);

            // Total branding price for premium packaging
            $brandingPrice = 0;

            // charge fees for packing slip
            if ((isset($request["frontPackingSlip"]) && $request["frontPackingSlip"] != "") or
                (isset($request["backPackingSlip"]) && $request["backPackingSlip"] != "")) {
                // if brand price for packaging slip is not null, update the total branding price
                if (isset($brandFees["packingSlip"]) and $brandFees["packingSlip"] != "") {
                    $brandingPrice += $brandFees["packingSlip"];
                    $extraChargeReason .= "Packing Slip Charge: " . $brandFees["packingSlip"] . " <br/> ";
                }
            }

            if (isset($request["footertext"]) && $request["footertext"] != "") {
                if (isset($brandFees["footertext"]) and $brandFees["footertext"] != "") {
                    $brandingPrice += $brandFees["footertext"];
                    $extraChargeReason .= "Packing Slip Footer Text Charge: " . $brandFees["footertext"] . " <br/> ";
                }
            }

            // charge fees for insert card
            if ((isset($request["outsideInsertCard"]) && $request["outsideInsertCard"] != "") or
                (isset($request["insideInsertCard"]) && $request["insideInsertCard"] != "")) {
                // if brand price for insert card is not null, update the total branding price
                if (isset($brandFees["insertCard"]) and $brandFees["insertCard"] != "") {
                    $brandingPrice += $brandFees["insertCard"];
                    $extraChargeReason .= "Insert Card Charge: " . $brandFees["insertCard"] . " <br/> ";
                }
            }

            // charge fees for sticker
            if (isset($request["frontSticker"]) && $request["frontSticker"] != "") {
                // if brand price for sticker is not null, update the total branding price
                if (isset($brandFees["sticker"]) and $brandFees["sticker"] != "") {
                    $brandingPrice += $brandFees["sticker"];
                    $extraChargeReason .= "Sticker Charge: " . $brandFees["sticker"] . " <br/> ";
                }
            }

            // charge fees for customLogo
            if (isset($request["customLogo"]) && $request["customLogo"] != "") {
                // if brand price for customLogo is not null, update the total branding price
                if (isset($brandFees["customLogo"]) and $brandFees["customLogo"] != "") {
                    $brandingPrice += $brandFees["customLogo"];
                    $extraChargeReason .= "Custom Logo Charge: " . $brandFees["customLogo"] . " <br/> ";
                }
            }

            $extraChargeReason .= "Total Extra Charge: $brandingPrice";
        }

        return array(
            "premium" => $premium,
            "brandingPrice" => $brandingPrice,
            "extraChargeReason" => $extraChargeReason
        );
    }

    /**
     * @param $userId
     * @return array
     * @throws \Exception
     */
    private function _getBrandFees($userId)
    {
        $sql = "SELECT brandPrice, brandType FROM brandingFees WHERE userId = ?";
        $data = $this->rawSYNQuery($sql, array($userId));
        $infoArray = array();

        if ($this->isNotEmptiedArray($data)) {
            foreach ($data as $row) {
                $brandType = $row['brandType'];
                $infoArray[$brandType] = $row['brandPrice'];
            }
        }

        return $infoArray;
    }

    /**
     * @param $componentId
     * @return bool|mixed|string
     * @throws \Exception
     */
    private function _getProductComponentDetails($componentId)
    {
        $sql = "SELECT *
                FROM productComponents 
                WHERE id = ? LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($componentId));

        return isset($data[0]) ? $data[0] : '';
    }

    /**
     * @param $productList
     * @param $itemCode
     * @return array
     * @throws \Exception
     */
    private function _getFraming($productList, $itemCode)
    {
        if ($productList[$itemCode]["type"] == "framed") {
            $framed = $productList[$itemCode]["framing"];
            $frameCode = $this->getSYNExactOne('framingCodes', 'frameCode', 'framing', $framed);

            if ($productList[$itemCode]["matted"] == "1") {
                $frameCode .= "M";
            }
            elseif ($productList[$itemCode]["matted"] == "2") {
                $frameCode .= "M-2";
            }

            $framedColor = $productList[$itemCode]["color"];
        }
        else {
            $framed = "0";
            $framedColor = "";
            $frameCode = "";
        }

        return
            array(
                'framed' => $framed,
                'framedColor' => $framedColor,
                'frameCode' => $frameCode
            );

    }

    /**
     * @param $locShortName
     * @param $productId
     * @return mixed|string
     * @throws \Exception
     */
    private function _getLocationSpecificPrice($locShortName, $productId)
    {
        $sql = "SELECT wholeSalePrice$locShortName AS wholeSalePrice 
                FROM products 
                WHERE id='$productId'";

        $data = $this->rawSYNQuery($sql);

        return isset($data[0]) ? $data[0]['wholeSalePrice'] : '';
    }

    /**
     * @return int|mixed
     */
    private function _calculateTotalQty()
    {
        $itemArray = $this->_parsedRequest['items'];
        $totalQty = 0;
        foreach ($itemArray as $item) {
            $totalQty += $item["qt"];
        }

        return $totalQty;
    }

    /**
     * @param $assignedLocId
     * @param string $targetProductArray
     * @return array
     * @throws \Exception
     */
    private function _getProductsDetails($assignedLocId, $targetProductArray)
    {
        $locShortName = $this->_getLocationAbbreviation($assignedLocId);
        $prdInStmt = implode(",", $targetProductArray);
        $sql = "SELECT 
                  id, id AS productId, x, y, wholeSalePrice" . $locShortName . " AS price, retailPrice, _gwSize AS gwSize, _gwType AS gwType ,
                  tSize, tColor, sku, kitSku, kitType, psTitle, framing, color, color AS framedColor ,piece, matted, customerItemCode, componentType,
                  type, shipping, framingType, productCodes, oneImageMultiPiece, isPricePerInch, isDynamic, dynamicModel, 
                  shippingTemplateId, active
                FROM products 
                WHERE id IN (" . $prdInStmt . ")";

        $data = $this->rawSYNQuery($sql);
        $productInfo = array();
        foreach ($data as $row) {
            $id = $row['id'];
            $productInfo[$id] = $row;
        }

        return $productInfo;
    }

    /**
     * @param $assignedLocId
     * @return mixed|string
     * @throws \Exception
     */
    private function _getLocationAbbreviation($assignedLocId)
    {
        if ($assignedLocId == 0) {
            $locAbb = "All Locations";
        }
        else {
            $locAbb = $this->getHDExactOne('locations', 'locationShortName', 'id', $assignedLocId);
        }

        if ($locAbb == '') {
            $locAbb = "AHH";
        }

        return $locAbb;
    }

    /**
     * @param $basePrice
     * @return float|int
     * @throws \Exception
     */
    private function _calculateFreightTax($basePrice)
    {
        $taxPercent = $this->getSYNExactOne('taxes', 'freightTax', 'sourceCountryCode', $this->_parsedRequest['country']);
        if ($taxPercent != '' && $taxPercent > 0) {
            return ($basePrice * $taxPercent) / 100;
        }

        return 0;
    }

    /**
     * @param $clientInfo
     * @param $assignedLocId
     * @return int|mixed
     * @throws \Exception
     */
    private function _calculateTotalQuotePrice($clientInfo, $assignedLocId)
    {
        $request = $this->_parsedRequest;
        $userName = $clientInfo["userName"];
        $accountBilled = strtolower($clientInfo["accountBilled"]);
        $useGeneralShippingRates = $clientInfo["useGeneralShippingRates"];
        $shippingZoneId = $clientInfo["shippingZoneId"];
        $pricingGroupId = $clientInfo["pricingGroupId"];

        $totalQuotePrice = 0;
        $permission = $this->_checkXmlPermission("freightPrice", $userName);

        if ($permission) {
            $totalQuotePrice = $request["freightPrice"];
        }
        else {
            if ($accountBilled == "customer") {

            }
            //west print
            else {
                $shippingType = $this->_parsedRequest['shippingType'];
                $request = array(
                    "zip" => $this->_parsedRequest['zip'],
                    "state" => $this->_parsedRequest['state'],
                    "country" => $this->_parsedRequest['country'],
                    "userName" => $userName,
                    'locId' => $assignedLocId,
                    'productFeed' => $this->_productCodeArray,
                    'useGeneralShippingRates' => $useGeneralShippingRates,
                    'shippingZoneId' => $shippingZoneId,
                    'pricingGroupId' => $pricingGroupId,
                    'shippingType' => $shippingType
                );

                $orderHdl = new Orders($request);
                $totalQuotePrice = $orderHdl->calculateShippingRate();
                $this->_shippingPriceByProduct = $orderHdl->getShippingPriceByProduct();

                //Check for available shipping rates
                if ($useGeneralShippingRates == 'Y') {
                    $counts = $this->_checkForInvalidShippingType($userName, $shippingType);
                    if ($counts == 0) {
                        $totalQuotePrice = FALSE;
                    }
                }
            }
        }

        return $totalQuotePrice;
    }

    /**
     * @param $userName
     * @param $shippingType
     * @return mixed
     * @throws \Exception
     */
    private function _checkForInvalidShippingType($userName, $shippingType)
    {
        $sql = "SELECT count(1) myCount FROM generalShippingRates WHERE  userName = ? AND shippingType = ?";

        $data = $this->rawSYNQuery($sql, array($userName, $shippingType));

        return $data[0]['myCount'];
    }

    /**
     * @param $tagName
     * @param $userName
     * @return bool
     * @throws \Exception
     */
    private function _checkXmlPermission($tagName, $userName)
    {
        $sql = "SELECT id 
                FROM xmlPermissions 
                WHERE userName = ? AND $tagName = 1 LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($userName));

        return isset($data[0]);
    }

    /**
     * @param $clientInfo
     * @param $locId
     * @return string
     */
    private function _thirdTransfer($clientInfo, $locId)
    {
        $thirdPartyERPTransferred = "NA";
        if ($locId == 4 and isset($clientInfo["thirdPartyERPApi"]) and !is_null($clientInfo["thirdPartyERPApi"]) and $clientInfo["thirdPartyERPApi"] != "") {
            $thirdPartyERPTransferred = "N";
        }
        if ($clientInfo["useHD"] == 'Y') {
            $thirdPartyERPTransferred = "NA";
        }

        return $thirdPartyERPTransferred;
    }

    /**
     * @return int|mixed|string
     * @throws \Exception
     */
    private function _assignLocation()
    {
        $clientInfo = $this->_getClientInfo();

        $request = array(
            "address1" => $this->_parsedRequest['address'],
            "address" => $this->_parsedRequest['address'],
            "address2" => $this->_parsedRequest['address2'],
            "city" => $this->_parsedRequest['city'],
            "zip" => $this->_parsedRequest['zip'],
            "state" => $this->_parsedRequest['state'],
            "country" => $this->_parsedRequest['country'],
            "productFeed" => $this->_productCodeArray,
            "userName" => $clientInfo["userName"]
        );
        $locationHdl = new OrderLocation($request);

        return $locationHdl->assignLocation();
    }

    /**
     * @param $poNumber
     * @param $userName
     * @return bool
     * @throws \Exception
     */
    private function _isPOExist($poNumber, $userName)
    {
        $sql = "SELECT poNumber FROM orders WHERE poNumber = ? AND owner = ? LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($poNumber, $userName));
        $currPoNumber = isset($data[0]) ? $data[0]['poNumber'] : '';

        return is2StringsIdentical($poNumber, $currPoNumber, true);
    }

    /**
     * @throws \Exception
     */
    private function _validateParsedRequest()
    {
        $success = FALSE;
        $message = '';
        $clientInfo = $this->_getClientInfo();

        //If valid client info
        if ($this->isNotEmptiedArray($clientInfo)) {
            $clientStatus = $clientInfo["clientStatus"];
            $userName = $clientInfo["userName"];
            $poNumber = $this->_parsedRequest['poNumber'];
            $isPOExist = $this->_isPOExist($poNumber, $userName);
            $resultAddress = $this->_validateAddress();
            $carrier = $this->_getCarrier();

            if (strtoupper($clientStatus) === "DISABLED") {
                $message = "Cannot log in. User is disabled.";
            }
            else if ($this->_parsedRequest['shippingType'] == '') {
                $message = "Shipping Type Error: Shipping Type Missing.";
            }
            else if ($this->_parsedRequest['poNumber'] == '') {
                $message = "Invalid PO Number: Missing.";
            }
            else if ($isPOExist) {
                $message = "Invalid PO Number: Already Exists.";
            }
            else if (!$this->isNotEmptiedArray($this->_parsedRequest['items'])) {
                $message = "Item quantity must be greater than 0";
            }
            else if (
                $this->_parsedRequest['address'] == "" || $this->_parsedRequest['city'] == '' ||
                $this->_parsedRequest['postalCode'] == "" || $this->_parsedRequest['country'] == ''
            ) {
                $message = "Address Error: Address is not completed or missing.";
            }
            else if (!$resultAddress['success']) {
                $errorCode = $resultAddress['errorCode'];
                $message = "Address Error: " . ERROR_CODE[$errorCode];
            }
            else if (!$carrier) {
                $message = "Shipping type is not supported, please choose a different shipping method!";
            }
            else {
                $resultItems = $this->_validateItems($clientInfo);
                if (!$resultItems['success']) {
                    $message = $resultItems['errorMsg'];
                }
                else {
                    $success = TRUE;
                }
            }
        }
        else {
            $message = "Cannot log in. Invalid user or password.";
        }

        return
            array(
                'success' => $success,
                'errorMsg' => $message
            );
    }

    /**
     * @param $clientInfo
     * @return array
     * @throws \Exception
     */
    private function _validateItems($clientInfo)
    {
        $request = $this->_parsedRequest;
        $success = FALSE;
        $message = "";
        $userName = $clientInfo["userName"];
        $itemNumberIds = array();
        $itemArray = $request['items'];
        //use map product SKU
        $mapProductUsingSKU = $clientInfo["mapProductUsingSKU"];
        $orderOrigin = strtolower($request["orderOrigin"]);
        if ($orderOrigin == "jondoConnect" or $orderOrigin == "mediaClip") {
            $mapProductUsingSKU = "Y";
        }

        if ($this->isNotEmptiedArray($itemArray)) {
            foreach ($itemArray as $item) {
                $productCode = $item["code"];
                $productDetails = $this->_getFewProductDetails($productCode, $userName, $mapProductUsingSKU);
                array_push($itemNumberIds, $item["itemNumber"]);

                if ($item["qt"] == "" || $item["qt"] <= 0) {
                    $message = "Quantity must be greater than 0";
                    break;
                }
                else if ($productCode == "") {
                    $message = "Product Code Error: Value can't be NULL";
                    break;
                }
                else if (isset($item["dynamicItems"])) {
                    foreach ($item["dynamicItems"] as $dynamicItem) {
                        if ($dynamicItem["imageLocation"] == "") {
                            $message = "Image Location Missing";
                            break;
                        }
                    }
                }
                else if ($item["imageLocation"] == "" || $item["imageLocation"] == "404") {
                    $message = "Image Location Missing or Inaccessible";
                    break;
                }
                else if (isset($item["coverSheet"]) and $item["coverSheet"] == "") {
                    $message = "Cover Sheet: Image Location Missing";
                    break;
                }
                else if (!$this->isNotEmptiedArray($productDetails)) {
                    $message = "Product Code Error: Invalid Product Code - Product code $productCode has no details";
                    break;
                }
                else if (!empty(array_diff_assoc($itemNumberIds, array_unique($itemNumberIds)))) {
                    $message = "Duplicated Item Number: Item number used in another node, it should be unique per item node";
                    break;
                }
                else {
                    $success = TRUE;
                    array_push($this->_productCodeArray, $productCode);
                    $this->_numberOfItems += $item["qt"];
                }
            }//foreach
        }//if

        return
            array(
                'success' => $success,
                'errorMsg' => $message
            );
    }

    /**
     * @param $productCode
     * @param $userName
     * @param $mapProductUsingSKU
     * @return array|mixed
     * @throws \Exception
     */
    private function _getFewProductDetails($productCode, $userName, $mapProductUsingSKU)
    {
        $fieldName = ($mapProductUsingSKU == "Y") ? "sku" : "id";
        $sql = "SELECT id, x, y, productCodes, `type`, piece, componentType, oneImageMultiPiece, isDynamic, dynamicModel, _gwSize as gwSize, customerItemCode  
                FROM products 
                WHERE `name` = ? AND $fieldName = ?";
        $data = $this->rawSYNQuery($sql, array($userName, $productCode));

        return isset($data[0]) ? $data[0] : array();
    }

    /**
     * @return array
     * @throws \SoapFault
     */
    private function _validateAddress()
    {
        $requestAddress = array(
            "address1" => $this->_parsedRequest['address'],
            "address2" => $this->_parsedRequest['address2'],
            "city" => $this->_parsedRequest['city'],
            "zip" => $this->_parsedRequest['zip'],
            "state" => $this->_parsedRequest['state'],
            "country" => $this->_parsedRequest['country']
        );
        $testAddHdl = new AddressValidation($requestAddress);

        return $testAddHdl->validateAddress();
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    private function _getClientInfo()
    {
        $userId = $this->_parsedRequest['userId'];
        $sql = "SELECT
                    u.userName, u.discountPercent, u.level, u.thirdPartyERPApi, u.orderOrigin, u.clientStatus,
                    u.shippingModelId, s.accountBilled, u.useGeneralShippingRates, u.shippingZoneId, u.pricingGroupId, u.mapProductUsingSKU,
                    P.noColorCorrect, P.corbis, P.skipDpqRequoting, P.useImageValidation, P.respectDPI, P.useThirdPartyShipment, 
                    P.useThirdPartyCarrier, P.useHD                    
                FROM users u
                    INNER JOIN shippingModels s ON u.shippingModelId = s.id
                    INNER JOIN permissions P ON P.userName = u.userName
                WHERE u.id = ?
                LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($userId));

        return isset($data[0]) ? $data[0] : array();
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _parseOrderRequest()
    {
        $requestArray = array();
        $orderRequest = $this->_orderObject;

        $requestArray["userId"] = trim($orderRequest->userId);
        $requestArray["userKey"] = trim($orderRequest->apiKey);
        $requestArray["testMode"] = trim($orderRequest->testMode);

        //Contact
        $requestArray["firstName"] = str_replace("'", "''", trim($orderRequest->firstName));
        $requestArray["lastName"] = str_replace("'", "''", trim($orderRequest->lastName));
        $requestArray["company"] = (isset($orderRequest->company)) ? str_replace("'", "''", trim($orderRequest->company)) : '';
        $requestArray["phoneNumber"] = trim($orderRequest->phoneNumber);
        $requestArray["email"] = trim($orderRequest->email);

        //Address
        $address = str_replace("'", "''", trim($orderRequest->address));
        $requestArray["address"] = $address;
        $requestArray["address1"] = $address;
        $requestArray["address2"] = (isset($orderRequest->address2)) ? str_replace("'", "''", trim($orderRequest->address2)) : '';
        $requestArray["aptNumber"] = "";
        if (isset($orderRequest->aptNumber)) {
            $requestArray["aptNumber"] = $orderRequest->aptNumber;
        }
        if ($requestArray["aptNumber"] != "") {
            $requestArray["address2"] .= " " . $requestArray["aptNumber"];
        }
        $requestArray["city"] = trim($orderRequest->city);
        $requestArray["postalCode"] = trim($orderRequest->zip);
        $requestArray["zip"] = trim($orderRequest->zip);
        $requestArray["urbanizationCode"] = "";
        if (isset($orderRequest->urbanizationCode)) {
            $requestArray["urbanizationCode"] = trim($orderRequest->urbanizationCode);
        }
        $country = (string)strtoupper($orderRequest->country);
        $requestArray["destinationCountry"] = ($country == "") ? "US" : $country;
        $state = trim(strtoupper($orderRequest->state));
        $requestArray["state"] = $state;
        if ($country == "US" && in_array($country, US_TERITORY)) {
            $requestArray["destinationCountry"] = $state;
        }
        $requestArray["country"] = $requestArray["destinationCountry"];

        //STORE
        $requestArray["shippingType"] = str_replace("\\n", "", trim($orderRequest->shippingType));
        $requestArray["statusUrl"] = (isset($orderRequest->statusUrl)) ? trim($this->myEscape(urldecode($orderRequest->statusUrl))) : '';
        $requestArray["quoteId"] = (int)trim($orderRequest->quoteId);
        $requestArray["poNumber"] = trim($orderRequest->poNumber);
        $requestArray["originalPoNumber"] = $requestArray["poNumber"];
        if (isset($orderRequest->originalPoNumber)) {
            $requestArray["originalPoNumber"] = trim($orderRequest->originalPoNumber);
        }
        $requestArray["orderReferenceId"] = trim($orderRequest->orderReferenceId);
        $requestArray["freightPrice"] = (float)trim($orderRequest->freightPrice);
        $requestArray["tax"] = (float)trim($orderRequest->tax);
        $requestArray["storeId"] = trim($orderRequest->storeId);
        $requestArray["orderOrigin"] = trim($orderRequest->orderOrigin);
        if ($requestArray["orderOrigin"] == "") {
            $requestArray["orderOrigin"] = "Online";
        }

        // Premium Branding
        $packingSlip = isset($orderRequest->services->branding->packingSlip) ? $orderRequest->services->branding->packingSlip : '';
        $frontImage = '';
        $backImage = '';
        $footerText = '';
        if ($packingSlip !== '') {
            $frontImage = isset($packingSlip->frontImage) ? $packingSlip->frontImage : '';
            $backImage = isset($packingSlip->backImage) ? $packingSlip->backImage : '';
            $footerText = isset($orderQuotedRequest->services->branding->packingSlip->footerText) ? substr($orderQuotedRequest->services->branding->packingSlip->footerText, 0, 600) : '';
        }
        $requestArray["frontPackingSlip"] = $this->myEscape($frontImage);
        $requestArray["backPackingSlip"] = $this->myEscape($backImage);
        $requestArray["footerText"] = $footerText;  // As per Aparna request, we're not going to escape the footer text

        $template = isset($packingSlip->template) ? $packingSlip->template : '';
        $requestArray["templatePackingSlip"] = ($template == '') ? "" : $this->myEscape(urldecode($template));
        if ($requestArray["templatePackingSlip"] == "") {
            $request["templatePackingSlip"] = 0;
        }

        $insertCard = isset($orderRequest->services->branding->insertCard) ? $orderRequest->services->branding->insertCard : '';
        $outsideImage = '';
        $insideImage = '';
        if ($insertCard !== '') {
            $outsideImage = isset($insertCard->outsideImage) ? $insertCard->outsideImage : '';
            $insideImage = isset($insertCard->insideImage) ? $insertCard->insideImage : '';
        }
        $requestArray["outsideInsertCard"] = $this->myEscape($outsideImage);
        $requestArray["insideInsertCard"] = $this->myEscape($insideImage);

        $sticker = isset($orderRequest->services->branding->sticker) ? $orderRequest->services->branding->sticker : '';
        $requestArray["frontSticker"] = (is_object($sticker)) ? $this->myEscape($sticker->frontImage) : '';

        $customerLogo = $orderRequest->customerInfo->custLogo;
        $requestArray["customLogo"] = ($customerLogo == '') ? '' : $this->myEscape(urldecode($customerLogo));

        $transId = $orderRequest->transId;
        $requestArray["third_party_trans_id"] = ($transId == '') ? '' : $this->myEscape(urldecode($transId));

        $taxCollected = $orderRequest->taxCollected;
        $requestArray["third_party_tax_collected"] = ($taxCollected == '') ? '' : $this->myEscape(urldecode($taxCollected));

        $totalCollected = $orderRequest->totalCollected;
        $requestArray["third_party_total_collected"] = ($totalCollected == '') ? '' : $this->myEscape(urldecode($totalCollected));

        $discountApplied = $orderRequest->discountApplied;
        $requestArray["third_party_total_discount"] = ($discountApplied == '') ? '' :
            str_replace(",", "", $this->myEscape($discountApplied));

        $requestArray["debug"] = false;
        if (isset($orderRequest->debug) and $orderRequest->debug != "" and $orderRequest->debug != 0) {
            $requestArray["debug"] = true;
            $requestArray["testMode"] = 1;
        }

        if (isset($orderRequest->jondoTool) and $orderRequest->jondoTool == 1) {
            $requestArray["wpTool"] = 1;
            $requestArray["testMode"] = 1;
        }
        else {
            $requestArray["wpTool"] = 0;
        }

        $customerInfo = $orderRequest->customerInfo;

        $thirdPartyId = isset($customerInfo->thirdPartyId) ? $customerInfo->thirdPartyId : '';
        $requestArray["customerInfo"]["third_party_id"] = (int)$this->myEscape(urldecode($thirdPartyId));

        $custId = isset($customerInfo->custId) ? $customerInfo->custId : '';
        $requestArray["customerInfo"]["third_party_cust_id"] = (int)$this->myEscape(urldecode($custId));

        $companyName = $customerInfo->companyName;
        $requestArray["customerInfo"]["third_party_company_name"] = ($companyName == '') ? "" :
            str_replace("'", "''", $this->myEscape(urldecode($companyName)));

        $companyWebsite = $customerInfo->companyWebsite;
        $requestArray["customerInfo"]["third_party_company_website"] = ($companyWebsite == '') ? "" :
            str_replace("'", "''", $this->myEscape(urldecode($companyWebsite)));

        $contactFirstName = $customerInfo->contactFirstName;
        $requestArray["customerInfo"]["third_party_contact_first_name"] = ($contactFirstName == '') ? "" :
            str_replace("'", "''", $this->myEscape(urldecode($contactFirstName)));

        $contactLastName = $customerInfo->contactLastName;
        $requestArray["customerInfo"]["third_party_contact_last_name"] = ($contactLastName == '') ? "" :
            str_replace("'", "''", $this->myEscape(urldecode($contactLastName)));

        $billingStreet = $customerInfo->billingStreet;
        $requestArray["customerInfo"]["third_party_billing_street"] = ($billingStreet == '') ? "" :
            str_replace("'", "''", $this->myEscape(urldecode($billingStreet)));

        $billingStreet2 = isset($customerInfo->billingStreet2) ? $customerInfo->billingStreet2 : '';
        $requestArray["customerInfo"]["third_party_billing_street2"] =
            str_replace("'", "''", $this->myEscape(urldecode($billingStreet2)));

        if ($requestArray["customerInfo"]["third_party_billing_street"] != "" and $requestArray["customerInfo"]["third_party_billing_street2"] != "") {
            $requestArray["customerInfo"]["third_party_billing_street"] =
                $requestArray["customerInfo"]["third_party_billing_street"] . ", " . $requestArray["customerInfo"]["third_party_billing_street2"];
        }
        $requestArray["customerInfo"]["third_party_billing_is_return_address"] = "N";
        if (isset($customerInfo->billingIsReturnAddress) and trim($customerInfo->billingIsReturnAddress) != "") {
            $requestArray["customerInfo"]["third_party_billing_is_return_address"] = $this->myEscape(urldecode($customerInfo->billingIsReturnAddress));
        }

        $billingCity = isset($customerInfo->billingCity) ? $customerInfo->billingCity : '';
        $requestArray["customerInfo"]["third_party_billing_city"] = $this->myEscape(urldecode($billingCity));

        $billingState = isset($customerInfo->billingState) ? $customerInfo->billingState : '';
        $requestArray["customerInfo"]["third_party_billing_state"] = $this->myEscape(urldecode($billingState));

        $billingZip = isset($customerInfo->billingZip) ? $customerInfo->billingZip : '';
        $requestArray["customerInfo"]["third_party_billing_zip"] = $this->myEscape(urldecode($billingZip));

        $billingCountry = isset($customerInfo->billingCountry) ? $customerInfo->billingCountry : '';
        $requestArray["customerInfo"]["third_party_billing_country"] = $this->myEscape(urldecode($billingCountry));

        $billingPhone = isset($customerInfo->billingPhone) ? $customerInfo->billingPhone : '';
        $requestArray["customerInfo"]["third_party_billing_phone"] = $this->myEscape(urldecode($billingPhone));

        $billingEmail = isset($customerInfo->billingEmail) ? $customerInfo->billingEmail : '';
        $requestArray["customerInfo"]["third_party_billing_email"] = $this->myEscape(urldecode($billingEmail));

        $couponCode = isset($customerInfo->couponCode) ? $customerInfo->couponCode : '';
        $requestArray["customerInfo"]["couponCode"] = $this->myEscape(urldecode($couponCode));

        //Get order items
        $requestArray["items"] = $this->_getOrderItems();

        return $requestArray;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getOrderItems()
    {
        $orderRequest = $this->_orderObject;
        $orderItemNode = $orderRequest->orderItems;
        $orderItems = $orderItemNode->orderItem;
        $orderItemArray = array();

        $i = 0;
        //For orderItems
        foreach ($orderItems as $item) {
            $orderItemArray[$i]['code'] = trim($item->code);
            $orderItemArray[$i]["qt"] = trim($item->qt);
            $orderItemArray[$i]["itemNumber"] = ($item->itemNumber == '') ? (generateRandomInteger()).$i : $item->itemNumber;
            $orderItemArray[$i]["itemGrossPrice"] = floatval(trim($item->itemGrossPrice));
            $orderItemArray[$i]["itemDiscount"] = isset($item->itemDiscount) ? floatval(trim($item->itemDiscount)) : '';
            $orderItemArray[$i]["retailPrice"] = floatval(trim($item->retailPrice));
            $orderItemArray[$i]["itemDescription"] = isset($item->itemDescription) ? $this->myEscape(trim($item->itemDescription)) : "";

            //Back print line 1
            if (isset($item->backPrintLine1)) {
                $bk1Value = trim($item->backPrintLine1);
                $bk1Value = preg_replace("/\r|\n|\t/", "", $bk1Value);
                $orderItemArray[$i]["backPrintLine1"] = $bk1Value;
            }
            else {
                $orderItemArray[$i]["backPrintLine1"] = '';
            }

            //Back print line2
            if (isset($item->backPrintLine2)) {
                $bk2Value = trim($item->backPrintLine2);
                $bk2Value = preg_replace("/\r|\n|\t/", "", $bk2Value);
                $orderItemArray[$i]["backPrintLine2"] = $bk2Value;
            }
            else {
                $orderItemArray[$i]["backPrintLine2"] = '';
            }

            //Face X and Y
            if (isset($item->faceX) and isset($item->faceY)) {
                $orderItemArray[$i]["faceX"] = trim($item->faceX);
                $orderItemArray[$i]["faceY"] = trim($item->faceY);
            }

            //Dynamic
            if (isset($item->dynamicItem)) {
                $j = 0;
                foreach ($item->dynamicItem as $dynamicItem) {
                    $orderItemArray[$i]["dynamicItems"][$j]['qt'] = trim($dynamicItem->qt);
                    $orderItemArray[$i]["dynamicItems"][$j]['imageLocation'] = htmlspecialchars_decode(trim($dynamicItem->imageLocation));
                    $orderItemArray[$i]["dynamicItems"][$j]['finalX'] = trim($dynamicItem->finalX);
                    $orderItemArray[$i]["dynamicItems"][$j]['finalY'] = trim($dynamicItem->finalY);
                    $orderItemArray[$i]["dynamicItems"][$j]['psTitle'] = trim($dynamicItem->psTitle);
                    $j++;
                }
            }
            //Cover sheet
            else if (isset($item->coverSheet)) {
                $orderItemArray[$i]["coverSheet"] = trim($item->coverSheet->frontImage);
                $k = 0;
                foreach ($item->imageLocation as $image) {
                    $orderItemArray[$i]["imageLocation"][$k] = htmlspecialchars_decode(trim($image));
                    $k += 1;
                }
            }
            //Image location array
            else {
                if (count($item->imageLocation) > 1) {
                    $k = 0;
                    foreach ($item->imageLocation as $image) {
                        $imgUrl = htmlspecialchars_decode(trim($image));
                        $orderItemArray[$i]["imageLocation"][$k] = urlExist($imgUrl) ?
                            htmlspecialchars_decode(trim($image)) : "404";
                        $k += 1;
                    }//foreach
                }
                else {
                    //Single Item
                    $imageUrl = htmlspecialchars_decode(trim($item->imageLocation));
                    $orderItemArray[$i]["imageLocation"] = urlExist($imageUrl) ? $imageUrl : "404";
                }
            }

            $i++;
        }//foreach

        return $orderItemArray;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _simpleValidate()
    {
        $success = false;

        if (is_object($this->_xmlObject)) {
            $this->_orderObject = $this->_xmlObject->orderRequest;
            $tokenResult = $this->verifyAccessToken($this->_orderObject->userId, $this->_token);
            if ($tokenResult) {
                $errorMsg = '';
                $success = TRUE;
            }
            else {
                $errorMsg = "Token expired or invalid user credentials";
            }
        }
        else {
            $errorMsg = "Invalid XML format";
        }

        return
            array(
                'success' => $success,
                'errorMsg' => $errorMsg
            );
    }

}//End of class