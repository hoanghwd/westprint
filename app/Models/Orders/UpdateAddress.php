<?php
namespace App\Models\Orders;
use App\Models\Base;
use App\Models\Orders;
use App\Models\User;
use App\Models\OrderLocation;
use App\Models\AddressValidation;

class UpdateAddress  extends Base
{
    /**
     * <pre>DEBUG_<br/>array(16) {
    ["orderId"]=>
    int(16562260)
    ["country"]=>
    string(2) "US"
    ["reason"]=>
    string(48) "Customer Issues-shippingAddress-Formatting issue"
    ["modifierUser"]=>
    string(12) "canvasPeople"
    ["hdRequest"]=>
    string(1) "N"
    ["firstName"]=>
    string(4) "John"
    ["lastName"]=>
    string(3) "Doe"
    ["company"]=>
    string(12) "Company Name"
    ["address1"]=>
    string(18) "115 Canongate Kirk"
    ["address2"]=>
    string(0) ""
    ["city"]=>
    string(10) "Alpharetta"
    ["zip"]=>
    string(5) "30004"
    ["email"]=>
    string(14) "test@jondo.com"
    ["phone"]=>
    string(10) "5627898767"
    ["details"]=>
    string(0) ""
    ["state"]=>
    string(2) "GA"
    }
    </pre>
     */
    private $_request;
    private $_synOrderId;
    private $_orderDetails;
    private $_shippingInfo;
    private $_synUpdateAddressArray;
    private $_HDUpdateAddressArray;
    private $_accountBilled;
    CONST BILLED_TO_CUSTOMER = "CUSTOMER";
    CONST BILLED_TO_WEST_PRINT = "WEST_PRINT";
    CONST INVENTORY = "INVENTORY";
    CONST PASS_SHIPPING = 8;
    CONST PASS_PRINTING = 2;

    /**
     * UpdateAddress constructor.
     * @param $request
     * @throws \Exception
     */
    function __construct($request) {
        $this->_request = $request;
        if( isset( $this->_request['orderId']) ) {
            $this->_request["userName"] = $this->_request["modifierUser"];
            $this->_synOrderId = $this->_request['orderId'];

            $orderDetailsHdl = new Orders($this->_request);
            $this->_orderDetails = $orderDetailsHdl->getOrderDetail();

            $this->_accountBilled = UpdateAddress::BILLED_TO_WEST_PRINT;
            $this->_shippingInfo = $this->getShippingInfoBySYNOrderId($this->_synOrderId);
        }
    }

    /**
     * @param $shippingType
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    private function _getShippingType($shippingType)
    {
        $data =
            $this->getResource(SYN_DB)
                ->where("shippingType", $shippingType)
                ->get("shippingTypes");

        return $data[0];
    }

    /**
     * @return bool
     */
    private function _isSimpleUpdateAddress()
    {
        $newAddress = $this->_request["address1"];
        $oldAddress = $this->_orderDetails['address'];
        $newCity = $this->_request["city"];
        $oldCity = $this->_orderDetails['city'];
        $newState = $this->_request["state"];
        $oldState = $this->_orderDetails['state'];
        $newZipCode = $this->_request["zip"];
        $oldZipCode = $this->_orderDetails['zip'];
        $newCountry = $this->_request["country"];
        $oldCountry = $this->_orderDetails['country'];
        $simpleUpdate = TRUE;

        /**
         * If address HAS changed from PO BOX to another different po box
         */
        if( isPoBoxAddress($newAddress) || isPoBoxAddress($newCity) ) {
            if ( !is2StringsIdentical( $newAddress, $oldAddress, TRUE) ) {
                $simpleUpdate = FALSE;
            }
        }
        /*
        * NOT a PO BOX: Just a regular address
        * If one of these address has changed City or State or Zip or Country
        */
        else if (
            ( !is2StringsIdentical( $newCity, $oldCity, TRUE) ) ||
            ( !is2StringsIdentical( $newState, $oldState, TRUE) ) ||
            ( !is2StringsIdentical( $newZipCode, $oldZipCode, TRUE) ) ||
            ( !is2StringsIdentical( $newCountry, $oldCountry, TRUE) )
        ) {
            $simpleUpdate = FALSE;
        }

        return $simpleUpdate;
    }

    /**
     * @return array
     */
    private function _addressEvaluation()
    {
        $updateNoteArray = array();

        $newFirstName = $this->_request['firstName'];
        $oldFirstName = $this->_orderDetails['firstName'];
        if( !is2StringsIdentical( $newFirstName, $oldFirstName, TRUE) ) {
            $this->_synUpdateAddressArray["firstName"] = $newFirstName;
            $this->_HDUpdateAddressArray["firstNameShipping"] = $newFirstName;
            $updateNotes = "First Name: From " . $oldFirstName . " to " .$newFirstName;
            array_push($updateNoteArray, $updateNotes);
        }

        $newLastName = $this->_request["lastName"];
        $oldLastName = $this->_orderDetails['lastName'];
        if ( !is2StringsIdentical( $newLastName, $oldLastName, TRUE) ) {
            $this->_synUpdateAddressArray["lastName"] = $newLastName;
            $this->_HDUpdateAddressArray["lastNameShipping"] = $newLastName;
            $updateNotes = "Last Name: From " . $oldLastName . " to " . $newLastName;
            array_push($updateNoteArray, $updateNotes);
        }

        $newCompany = $this->_request["company"];
        $oldCompany = $this->_orderDetails['company'];
        if ( !is2StringsIdentical( $newCompany, $oldCompany, TRUE) ) {
            $this->_synUpdateAddressArray["company"] = $newCompany;
            $this->_HDUpdateAddressArray["companyShipping"] = $newCompany;
            $updateNotes = "Company: From " . $oldCompany . " to " . $newCompany;
            array_push($updateNoteArray, $updateNotes);
        }

        $newAddress = $this->_request["address1"];
        $oldAddress = $this->_orderDetails['address'];
        if ( !is2StringsIdentical( $newAddress, $oldAddress, TRUE) ) {
            $this->_synUpdateAddressArray["address"] = $newAddress;
            $this->_HDUpdateAddressArray["addressShipping"] = $newAddress;
            $updateNotes = "Address: From " . $oldAddress . " to " . $newAddress;
            array_push($updateNoteArray, $updateNotes);
        }

        $newAddress2 = $this->_request["address2"];
        $oldAddress2 = $this->_orderDetails['address2'];
        if ( !is2StringsIdentical( $newAddress2, $oldAddress2, TRUE) ) {
            $this->_synUpdateAddressArray["address2"] = $newAddress2;
            $this->_HDUpdateAddressArray["addressShipping2"] = $newAddress2;
            $updateNotes = "Address2: From " . $oldAddress2 . " to " . $newAddress2;
            array_push($updateNoteArray, $updateNotes);
        }

        $newCity = $this->_request["city"];
        $oldCity = $this->_orderDetails['city'];
        if ( !is2StringsIdentical( $newCity, $oldCity, TRUE) ) {
            $this->_synUpdateAddressArray["city"] = $newCity;
            $this->_HDUpdateAddressArray["cityShipping"] = $newCity;
            $updateNotes = "City: From " . $oldCity . " to " . $newCity;
            array_push($updateNoteArray, $updateNotes);
        }

        $newState = $this->_request["state"];
        $oldState = $this->_orderDetails['state'];
        if ( !is2StringsIdentical( $newState, $oldState, TRUE) ) {
            $this->_synUpdateAddressArray["state"] = $newState;
            $this->_HDUpdateAddressArray["stateShipping"] = $newState;
            $updateNotes = "State: From " . $oldState . " to " . $newState;
            array_push($updateNoteArray, $updateNotes);
        }

        $newZipCode = $this->_request["zip"];
        $oldZipCode = $this->_orderDetails['zip'];
        if ( !is2StringsIdentical( $newZipCode, $oldZipCode, TRUE) ) {
            $this->_synUpdateAddressArray["zip"] = $newZipCode;
            $this->_HDUpdateAddressArray["zipShipping"] = $newZipCode;
            $updateNotes = "Zip Code: From " . $oldState . " to " . $newZipCode;
            array_push($updateNoteArray, $updateNotes);
        }

        $newCountry = $this->_request["country"];
        $oldCountry = $this->_orderDetails['country'];
        if ( !is2StringsIdentical( $newCountry, $oldCountry, TRUE) ) {
            $this->_synUpdateAddressArray["country"] = $newCountry;
            $this->_HDUpdateAddressArray["countryShipping"] = $newCountry;
            $updateNotes = "Country: From " . $oldCountry . " to " . $newCountry;
            array_push($updateNoteArray, $updateNotes);
        }

        $newPhone = $this->_request["phone"];
        $oldPhone = $this->_orderDetails['phone'];
        if ( !is2StringsIdentical( $newPhone, $oldPhone, TRUE) ) {
            $this->_synUpdateAddressArray["phone"] = $newPhone;
            $this->_HDUpdateAddressArray["phoneShipping"] = $newPhone;
            $updateNotes = "Phone: From " . $oldPhone . " to " . $newPhone;
            array_push($updateNoteArray, $updateNotes);
        }

        $newEmail = $this->_request["email"];
        $oldEmail = $this->_orderDetails['email'];
        if ( !is2StringsIdentical( $newEmail, $oldEmail, TRUE) ) {
            $this->_synUpdateAddressArray["email"] = $newEmail;
            $this->_HDUpdateAddressArray["email"] = $newEmail;
            $updateNotes = "Email: From " . $oldEmail . " to " . $newEmail;
            array_push($updateNoteArray, $updateNotes);
        }

        //$this->dumpVar($this->_synUpdateAddressArray);

        return $updateNoteArray;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _validateRequest()
    {
        $success = FALSE;
        $errorCode = 0;
        $request = $this->_request;
        $request['requirePassword'] = FALSE;
        $orderDetails = $this->_orderDetails;

        $shippingTypeArray = $this->_getShippingType($orderDetails['shippingType']);

        $addressValidationHdl = new AddressValidation($request);
        /**
         * <pre>PRINT_my_validateAddressResults<br/>array(2) {
        ["success"]=>
        bool(false)
        ["errorCode"]=>
        int(7062)
        }
         */
        $validateAddressResults = $addressValidationHdl->validateAddress();

        $userHdl = new User($request);
        $xmlPermission = $userHdl->checkXmlPermission('freightPrice');
        $updateNoteArray = $this->_addressEvaluation();
        $shippingInfo = $this->_shippingInfo;
        $lockAt = $shippingInfo['lockedAt'];
        $itemStatus = $this->_getItemStatus();

        //Invalid order
        if( !$this->isNotEmptiedArray($orderDetails) ) {
            $errorCode = 18;
        }
        //This account is billed to customer.
        else if( $xmlPermission ) {
            $errorCode = 17;
            $this->_accountBilled = UpdateAddress::BILLED_TO_CUSTOMER;
        }
        //Order is already cancelled
        else if( $orderDetails["deleted"] == 1 ) {
            $errorCode = 203;
        }
        //Order is already completed
        else if( $orderDetails["complete"] != 0 ) {
            $errorCode = 202;
        }
        //Order is locked, please unlock first.
        else if( $lockAt != '' ) {
            $errorCode = 204;
        }
        //Already in printing
        else if( isset($itemStatus['inPrinting']) && $itemStatus['inPrinting'] ) {
            $errorCode = 7011;
        }
        //Already in shipping
        else if( isset($itemStatus['inShipping']) && $itemStatus['inShipping'] ) {
            $errorCode = 7012;
        }
        //Order already completed
        if( $orderDetails["complete"] == 0 && $orderDetails["deleted"] == 1) {
            $errorCode = 202;
        }
        else if( !$validateAddressResults['success'] ) {
            $errorCode = $validateAddressResults['errorCode'];
        }
        //There's nothing to update
        else if( !$this->isNotEmptiedArray($updateNoteArray) ) {
            $errorCode = 20;
        }
        //is PO BOX
        else if( isPoBoxAddress( $orderDetails["address"]) || isPoBoxAddress( $orderDetails["city"]) ) {
            $isPoBoxAllowed = $shippingTypeArray["isPoBoxAllowed"];
            //"PO BOX is not allowed for this shipping type"
            if($isPoBoxAllowed == "N") {
                $errorCode = 4;
            }
            // We need to reject orders with PO Boxes that are not destined for: US, CA, GB, and AU and shipping types
            // are basic, standard or Amazon Basic
            else {
                $isAllowed = $addressValidationHdl->checkCountryAllowPoBoxes();
                if( !$isAllowed ) {
                    //PO Boxes are not supported for Shipping Type/Destination
                    $errorCode = 19;
                }
            }
        }
        //Success
        else {
            $success = TRUE;
        }

        return
            array(
                'success'   => $success,
                'errorCode' => $errorCode
            );
    }

    /**
     * @return array|false[]|\MysqliDb|string
     * @throws \Exception
     */
    private function _getItemStatus()
    {
        $hdOrderId = $this->_shippingInfo["hdId"];
        $data = array(
            'inPrinting' => false,
            'inShipping' => false
        );

        if($hdOrderId != '') {
            $data =
                $this->getResource(HD_DB)
                     ->where('orderId', $hdOrderId)
                     ->get('orderSkus', NULL, 'status');
            $inPrinting = false;
            $inShipping = false;

            foreach ($data AS $row) {
                $status = $row['status'];
                if ( $status === UpdateAddress::INVENTORY ||
                    ($status >= UpdateAddress::PASS_PRINTING && $status < UpdateAddress::PASS_SHIPPING) ) {
                    $data['inPrinting'] = TRUE;
                    $inPrinting = TRUE;
                }

                if ($status >= UpdateAddress::PASS_SHIPPING) {
                    //If I can spot 1 or ALL items, the order will be catogorized as "IN SHIPPING" status
                    $data['inShipping'] = TRUE;
                    $inShipping = true;
                }

                if ( $inPrinting && $inShipping ) {
                    break;
                }
            }//foreach
        }

        return $data;
    }

    /**
     * @return false
     * @throws \Exception
     */
    private function _doUpdateAddress()
    {
        $success = FALSE;

        $shippingInfo = $this->_shippingInfo;
        $hdOrderId = $shippingInfo["hdId"];
        $isSimpleUpdate = $this->_isSimpleUpdateAddress();
        $totalShippingPrice = 'SKIP';
        $sameLocation = TRUE;
        //Assume new locId is the same with current
        $newLocId = $shippingInfo['locId'];
        $orderAssignLocHdl = '';
        $orderCalculateRateHdl = '';

        //Check for changes in location and shipping
        //Not a straight forward update
        if( !$isSimpleUpdate ) {
            $oderMapHld = new Map($this->_request['orderId']);
            $productsArray = $oderMapHld->buildProductIdsFeed();
            $request = $this->_request;
            $request['productFeed'] = $productsArray;

            $orderAssignLocHdl = new OrderLocation($request);
            $newLocId = $orderAssignLocHdl->assignLocation();

            //New location is assigned
            if( $newLocId != $shippingInfo['locId'] ) {
                $sameLocation = FALSE;
                $this->_synUpdateAddressArray["locId"] = $newLocId;
                $this->_HDUpdateAddressArray["locId"] = $newLocId;
            }

            //Billed to Westprint
            if( $this->_accountBilled == UpdateAddress::BILLED_TO_WEST_PRINT && $this->isNotEmptiedArray($productsArray) ) {
                $shippingInfo['productFeed'] = $productsArray;
                /**
                 * <pre>DEBUG_my_shipping_info<br/>array(28) {
                ["synId"]=>
                int(16562285)
                ["apiKey"]=>
                string(88) "QWP+MZ4FRuFMV9xZoJJVSQIamYtOjx+VPjjMWE0/LMV563yd8STZ3aRm8UdlFHQ3xLaCga0AN7mF8o1Zfdt/WA=="
                ["userId"]=>
                int(90)
                ["userName"]=>
                string(12) "canvasPeople"
                ["country"]=>
                string(2) "US"
                ["state"]=>
                string(2) "CA"
                ["locId"]=>
                int(3)
                ["lockedAt"]=>
                NULL
                ["useGeneralShippingRates"]=>
                string(1) "N"
                ["shippingType"]=>
                string(15) "3 Day Delivered"
                ["shippingZoneId"]=>
                int(1)
                ["pricingGroupId"]=>
                int(6)
                ["shipping"]=>
                string(2) "81"
                ["shippingModelId"]=>
                int(2)
                ["carrier"]=>
                string(5) "FEDEX"
                ["hdId"]=>
                int(128978475)
                ["orderReferenceId"]=>
                string(29) "1128-multQtCP-01_canvasPeople"
                ["gallery"]=>
                string(12) "canvasPeople"
                ["groupId"]=>
                int(0)
                ["departmentStatus"]=>
                string(1) "0"
                ["departmentList"]=>
                string(5) " Prep"
                ["slaDays"]=>
                int(5)
                ["slaStartDate"]=>
                string(10) "2023-12-04"
                ["slaEndDate"]=>
                string(10) "2023-12-11"
                ["cancelTime"]=>
                int(0)
                ["slaEndTime"]=>
                int(1702332930)
                ["unixTs"]=>
                int(1701209730)
                ["productFeed"]=>
                array(8) {
                [0]=>
                string(5) "90009"
                [1]=>
                string(5) "90009"
                [2]=>
                string(5) "90009"
                [3]=>
                string(5) "90107"
                [4]=>
                int(90311)
                [5]=>
                int(90311)
                [6]=>
                int(90311)
                [7]=>
                int(90104)
                }
                }
                 */
                $orderCalculateRateHdl = new Orders($shippingInfo);
                $totalShippingPrice = $orderCalculateRateHdl->calculateShippingRate();
                $zoneId = $orderCalculateRateHdl->getZoneId();

                if($zoneId != '') {
                    $this->_synUpdateAddressArray["zoneId"] = $zoneId;
                    $this->_HDUpdateAddressArray["zoneId"] = $zoneId;
                }
            }
        }//Not a straight forward update

        //Update in SYN with $this->_synOrderId
        $updatedRecords = $this->_updateDBAddress();

        //Update SYN success
        if( $updatedRecords > 0 ) {
            $success = TRUE;

            //Order is transmitted
            if( $hdOrderId != '' ) {
                $updatedRecords = $this->_updateDBAddress(HD_DB); //Update In HD
                //Update HD success
                if( $updatedRecords > 0 ) {
                    if( !$sameLocation ) {
                        //Order in HD and different location - Reset Transporter flags
                        $this->_resetTransporterFlags();
                        //update HD.orderSku.locId
                        $orderAssignLocHdl->updateOrderSkuNewLocationIdByHdId($hdOrderId, $newLocId);
                    }
                }

                //Update Reason
                $counts = $this->_updateHDReasonAddress();
            }//Order is transmitted

            //Update Shipping price for both HD and SYN
            if( $totalShippingPrice != "SKIP" && $totalShippingPrice > 0 ) {
                $shippingPriceByProductArray = $orderCalculateRateHdl->getShippingPriceByProduct();
                $this->_updateShipping($totalShippingPrice, $shippingPriceByProductArray);
            }

            //Update History

        }//Update SYN success

        return $success;
    }

    /**
     * @param $totalShippingPrice
     * @param $shippingPriceByProductArray
     * @throws \Exception
     */
    private function _updateShipping($totalShippingPrice, $shippingPriceByProductArray)
    {
        /**
         * <pre>PRINT_my_total_price<br/>float(49)
        </pre><pre>PRINT_my_shipping_by_product<br/>array(3) {
        [90013]=>
        float(12.25)
        [90107]=>
        float(12.25)
        [90311]=>
        float(12.25)
        }
         */

        //Update SYN.shipping table
        $dbSYNShipping = $this->getResource(SYN_DB)->where('id', $this->_synOrderId);
        if( $dbSYNShipping->update('orders', array('shipping' => $totalShippingPrice )) ) {
            $counts = $dbSYNShipping->count;
        }

        //Update HD.shipping table
        $shippingInfo = $this->_shippingInfo;
        $hdOrderId = $shippingInfo["hdId"];
        if( $hdOrderId != '' ) {
            //Update HD.orders.shipping
            $dbHDShipping = $this->getResource(HD_DB)->where('id', $hdOrderId);
            if( $dbHDShipping->update('orders', array('shipping' => $totalShippingPrice)) ) {
                $counts = $dbHDShipping->count;
            }
        }

        if( $this->isNotEmptiedArray($shippingPriceByProductArray) ) {
            //SYN.orderItems
            foreach ($shippingPriceByProductArray as $productId => $shipping) {
                $dbSYNOrderItem =
                    $this->getResource(SYN_DB)
                         ->where('id', $this->_synOrderId)
                         ->where('itemCode', $productId);
                if( $dbSYNOrderItem->update('orderItems', array('shipping' => $shipping ) ) ) {
                    $counts = $dbSYNOrderItem->count;
                }
            }//foreach

            //Order is transmitted
            if( $hdOrderId != '' ) {
                //HD.orderSkus
                foreach ($shippingPriceByProductArray as $productId => $shipping) {
                    $dbHDCustItemCode =
                        $this->getResource(HD_DB)
                             ->where('customerItemCode', $productId)
                             ->where('orderId', $hdOrderId);
                    if( $dbHDCustItemCode->update('orderSkus', array('shipping' => $shipping)) ) {
                        $counts = $dbHDCustItemCode->count;
                    }

                }//foreach
            }
        }//$shippingPriceByProductArray
    }

    /**
     * @param string $returnType
     * @return string
     * @throws \Exception
     */
    public function updateAddress($returnType = "message")
    {
        $validateResults = $this->_validateRequest();
        $timestamp = convertUnixTimeToISO_8061(time());
        $validateSuccess = $validateResults['success'];
        $errorCode = $validateResults['errorCode'];

        if( $validateSuccess ) {
            //It's time to update address
            $code = $this->_synOrderId;
            $success = $this->_doUpdateAddress();
            if( $success ) {
                $message = "Successfully updated address!";
                $return = 1;
            }
            else {
                $errorCode = 2;
                $message = "Update Error: ".ERROR_CODE[$errorCode];
                $return = 0;
            }
        }
        else {
            $message = "Update Error: ".ERROR_CODE[$errorCode];
            $code = $errorCode;
            $return = 0;
        }

        //Simple text
        if( $returnType == "message" ) {
            return array( 'message' => $message );
        }
        //xml
        else if( $returnType == "xml" ) {
            return
               "<?xml version='1.0'?>
                <root>
                    <updateReply>
                        <status>$return</status>
                        <code>$code</code>
                        <message>$message</message>
                        <timestamp>$timestamp</timestamp>
                    </updateReply>
                </root>";
        }
        //Array
        else {
            return
                array(
                    'status'    => $return,
                    'code'      => $errorCode,
                    'message'   => $message,
                    'timestamp' => $timestamp
                );
        }
    }

    /**
     * @return int|string
     * @throws \Exception
     */
    private function _resetTransporterFlags()
    {
        $orderId = $this->_shippingInfo['hdId'];
        $updateArray = array(
            'status' => 0,
            'isFileTransferred' => 'NO',
            'fileTransferAttempts' => 0
        );

        $db = $this->getResource(HD_DB)
                   ->where('orderId', $orderId);
        if( $db->update('orderSkus', $updateArray) ) {
            return $db->count;
        }

        return 0;
    }

    /**
     * @param array $db
     * @return int|string
     * @throws \Exception
     */
    private function _updateDBAddress($db = SYN_DB)
    {
        if( $db === SYN_DB ) {
            $addressArray = $this->_synUpdateAddressArray;
            $orderId = $this->_synOrderId;
        }
        else {
            $addressArray = $this->_HDUpdateAddressArray;
            $orderId = $this->_shippingInfo['hdId'];
        }

        $db =
            $this->getResource($db)
                 ->where('id', $orderId);
        if( $db->update('orders', $addressArray) ) {
            return $db->count;
        }

        return 0;
    }

    /**
     * @return int|string
     * @throws \Exception
     */
    private function _updateHDReasonAddress()
    {
        $updateArray = array('editOrderReason' => $this->_request['reason']);

        $db =
            $this->getResource(HD_DB)
                 ->where('id', $this->_shippingInfo['hdId']);
        if( $db->update('orders', $updateArray) ) {
            return $db->count;
        }

        return 0;
    }

}//End of class