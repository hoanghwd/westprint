<?php

namespace App\Models;

use App\Models\Base;
use App\Models\Orders\OrderSkus;

class WorkOrder extends Base
{
    private $_request;
    private $_orderId;
    private $_orderInfo;
    private $_shippingInfo;
    private $_itemArray;

    /**
     * WorkOrder constructor.
     * @param $request
     * @throws \Exception
     */
    function __construct($request)
    {
        $this->_request = $request;
        $this->_orderId = $this->_request['orderId'];
        if( $this->_orderId != '' ) {
            $this->_orderInfo = $this->_getOrderInfo();
            $this->_shippingInfo = $this->_orderInfo['shippingInfo'];
            $this->_itemArray =  $this->_orderInfo['items'];
        }
    }

    public function test()
    {
        echo "echo from WorkOrder";
    }

    /**
     * Render general info
     */
    public function renderGeneralInfo()
    {
        $this->renderPage('workorder/generalinfo', $this);
    }

    /**
     * Render tab items
     */
    public function renderTabs()
    {
        $this->renderPage('workorder/tabs', $this);
    }

    /**
     * @return mixed
     */
    public function getOrderId()
    {
        return $this->_orderId;
    }

    /**
     * @return array|mixed|string
     */
    public function getSimpleOrderInfo()
    {
        //Get simple
        $orderInfo = $this->_orderInfo;
        unset($orderInfo['items']);
        unset($orderInfo['shippingInfo']);
        unset($orderInfo['editReasonCollection']);
        unset($orderInfo['editReasonCancelItemCollection']);
        unset($orderInfo['editReasonCancelOrderCollection']);
        unset($orderInfo['editReasonShippingTypeCollection']);
        unset($orderInfo['countryCollection']);
        unset($orderInfo['usSatesCollection']);
        unset($orderInfo['CASatesCollection']);
        unset($orderInfo['siteUrl']);
        unset($orderInfo['cancelOrderUrl']);
        unset($orderInfo['updateAddressUrl']);
        unset($orderInfo['updateShippingTypeOrderUrl']);
        /**
         * PRINT_
        array(57) {
        ["id"]=>
        int(16562296)
        ["poNumber"]=>
        string(17) "Tilda_1128-mix2-3"
        ["locId"]=>
        int(13)
        ["orderTime"]=>
        int(1701219213)
        ["total"]=>
        float(221.67999999999995)
        ["shipping"]=>
        string(2) "57"
        ["complete"]=>
        int(0)
        ["deleted"]=>
        int(0)
        ["trackingNumber"]=>
        string(0) ""
        ["carrier"]=>
        string(5) "FEDEX"
        ["completeTime"]=>
        int(0)
        ["shippingType"]=>
        string(15) "3 Day Delivered"
        ["company"]=>
        string(0) ""
        ["firstName"]=>
        string(9) "Christina"
        ["lastName"]=>
        string(6) "OBryan"
        ["email"]=>
        string(25) "christinaobryan@yahoo.com"
        ["phone"]=>
        string(10) "9376728485"
        ["address"]=>
        string(17) "203 Sunset Ave NW"
        ["address2"]=>
        string(0) ""
        ["city"]=>
        string(7) "Atlanta"
        ["state"]=>
        string(2) "GA"
        ["zip"]=>
        string(5) "30314"
        ["country"]=>
        string(2) "US"
        ["testMode"]=>
        int(0)
        ["gallery"]=>
        string(12) "canvasPeople"
        ["numberPrints"]=>
        string(2) "10"
        ["_orderType"]=>
        string(6) "retail"
        ["slaStartDate"]=>
        string(10) "2023-11-28"
        ["slaEndDate"]=>
        string(10) "2023-11-29"
        ["slaEndTime"]=>
        int(1701305613)
        ["shipTime"]=>
        int(0)
        ["departmentStatus"]=>
        string(1) "0"
        ["departmentList"]=>
        string(25) " Prep, Shipping, Printing"
        ["invoiceNumber"]=>
        NULL
        ["invoiceDate"]=>
        string(0) ""
        ["trackNumber"]=>
        string(0) ""
        ["cancelTime"]=>
        int(0)
        ["salesRep"]=>
        string(11) "20|21|22|23"
        ["useThirdPartyShipment"]=>
        string(1) "N"
        ["useThirdPartyCarrier"]=>
        string(1) "N"
        ["orderId"]=>
        int(16562296)
        ["HDorderId"]=>
        int(128978484)
        ["userName"]=>
        string(12) "canvasPeople"
        ["address1"]=>
        string(17) "203 Sunset Ave NW"
        ["totalMFT"]=>
        string(6) "221.68"
        ["totalPrice"]=>
        float(221.67999999999995)
        ["shippingMFT"]=>
        string(5) "57.00"
        ["orderTimeHuman"]=>
        string(27) "2023-11-29 12:53:33 AM (PT)"
        ["completeTimeHuman"]=>
        string(2) "NA"
        ["statusFM"]=>
        string(11) "IN PROGRESS"
        ["trackingUrl"]=>
        string(0) ""
        ["itemCounts"]=>
        int(9)
        ["imageCounts"]=>
        float(10)
        ["shippingCollection"]=>
        array(4) {
        [0]=>
        string(15) "3 Day Delivered"
        [1]=>
        string(5) "Basic"
        [2]=>
        string(15) "6 Day Delivered"
        [3]=>
        string(13) "Standard USPS"
        }
        ["shippingCollectionSize"]=>
        int(4)
        ["shipmentType"]=>
        string(15) "Fulfill Account"
        ["slaRemDays"]=>
        int(-18)
        }
         */
        //$this->dumpVar($orderInfo);

        return $orderInfo;
    }

    /**
     * @return mixed|string
     */
    public function getLocId()
    {
        return $this->_shippingInfo['locId'];
    }

    /**
     * @param $salesReps
     * @return string
     * @throws \Exception
     */
    private function _translateSalesReps($salesReps)
    {
        $saleRepString = 'House - API';

        if( $salesReps != '' ) {
            $salesRepArr = explode("|", $salesReps);
            if( count($salesRepArr) > 0 ) {
                $saleRepString = '';

                $salesRepSql = "SELECT `name` FROM salesRepList WHERE id IN (";
                foreach($salesRepArr as $rep) {
                    $salesRepSql .= "$rep, ";
                }
                $salesRepSql = rtrim($salesRepSql, ", ") . ")";
                $data = $this->rawHDQuery($salesRepSql);
                if( $this->isNotEmptiedArray($data) ) {
                    foreach ( $data AS $row ) {
                        $saleRepString .= ($row['name']).', ';
                    }
                    $saleRepString = rtrim($saleRepString, ", ");
                }
            }
        }

        return $saleRepString;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function generateGeneralInfo()
    {
        $this->_translateSalesReps($this->_orderInfo['salesRep']);
        $saleRepString = $this->_translateSalesReps($this->_orderInfo['salesRep']);
        if(strlen($saleRepString) > 25) {
            $saleRepString =
                "<a class='orderInfoLink' onclick='openAlert(\"$saleRepString\", {headerTxtId: { text: \"Sales Reps\"}}  )'>".
                    (substr($saleRepString, 0, 25) . "...") .
                "</a>";
        }

        return array(
            "Placed By" => $this->_shippingInfo['gallery'],
            "Sales Rep" => $saleRepString,
            "Status" => upperCaseFirst($this->_orderInfo["statusFM"]),

            "PO #" => $this->_orderInfo['poNumber'],
            "SLA Processing Rem" => $this->_orderInfo["slaRemDays"],
            "Shipment Type" => $this->_orderInfo['shipmentType'],

            "Synergize Id" => $this->_shippingInfo['synId'],
            "SLA Delivered Rem." => '',
            "Shipping Type" => $this->_orderInfo['shippingType'],

            "Number of Prints" => $this->_orderInfo['numberPrints'],
            "SLA Delivered Date" => '',
            "Shipping Method" => $this->_orderInfo["carrier"],

            "Ordered Date" => unixToReadableDate($this->_shippingInfo["unixTs"]),
            "SLA Start Time" => $this->_orderInfo["slaStartDate"],
            "Tracking Numbers" => '',

            "Shipped Date" => unixToReadableDate($this->_orderInfo['shipTime']),
            "SLA End Time" => unixToReadableDate($this->_orderInfo["slaEndTime"]),
            "Notes" => '',

            "Delivery Date" => ''
        );
    }

    /**
     * @return array|mixed|string
     * @throws \Exception
     */
    private function _getOrderInfo()
    {
        $data = $this->_geHDSimpleOrderByHdId();
        if ($this->isNotEmptiedArray($data)) {
            $request["userName"] = $data['owner'];
            $request["orderId"] = $data['id'];
            $orderInfoHdl = new Orders($request);

            return $orderInfoHdl->getOrderDetail();
        }

        return '';
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    private function _geHDSimpleOrderByHdId()
    {
        $sql =
            "SELECT	synORD.id, synORD.owner
             FROM
                harvestd_synergize.orders synORD	
                    INNER JOIN harvestd_harvestDigital.orders hdORDERS ON hdORDERS.poNumber = synORD.id 
             WHERE
                hdORDERS.id = " . $this->_orderId;

        $data = $this->rawSYNQuery($sql);

        return isset($data[0]) ? $data[0] : array();
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function getHDOrderSkuItemArray()
    {
        $orderSkuHdl = new OrderSkus( $this->_request);

        return $orderSkuHdl->getActiveItemsInfo();
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function getHoldReasons()
    {
        $holdReasonArray = array();

        $sql = "SELECT id, holdGroup, reason 
                FROM holdReasons
                ORDER BY holdGroup, reason";
        $data = $this->rawHDQuery($sql);

        foreach ($data AS $row) {
            $holdReasonArray[] = array(
                "reasonId"    => $row['id'],
                "reasonGroup" => $row['holdGroup'],
                "reason"      => $row['reason']
            );
        }

        return $holdReasonArray;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function loadHoldReasonsHTML()
    {
        $reprintReasonArray = $this->getHoldReasons();

        $html = "<select id=''>";
        $html .=    "<option value='None'>None</option>";
        if (count($reprintReasonArray) > 0) {
            $lastGroup = "";
            foreach ($reprintReasonArray as $reprintReason) {
                $reasonId = $reprintReason['reasonId'];
                $reason = $reprintReason['reason'];
                $reasonGroup = $reprintReason['reasonGroup'];

                if ($lastGroup != $reasonGroup) {
                    if ($lastGroup != "") {
                        $html .= "</optgroup>";
                    }
                    $html .= "<optgroup label='$reasonGroup'>";
                    $lastGroup = $reasonGroup;
                }
                $html .= "<option value='" . $reasonId . "'>$reasonGroup - $reason</option>\n";
            }
        }
        $html .= "</select>";

        return $html;
    }

    /**
     * @param string $active
     * @return array
     * @throws \Exception
     */
    public function getReprintReasons($active = "Y")
    {
        $reprintReasonArray = array();

        $sql = "SELECT id, reasonGroup, reason 
                FROM reprintReasons
                WHERE active = '$active' 
                ORDER BY reasonGroup, reason";
        $data = $this->rawHDQuery($sql);

        foreach ( $data AS $row ) {
            $reprintReasonArray[] = array(
                "reasonId"    => $row['id'],
                "reasonGroup" => $row['reasonGroup'],
                "reason"      => $row['reason']
            );
        }//while

        return $reprintReasonArray;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function loadReprintReasonsHTML()
    {
        $reprintReasonArray = $this->getReprintReasons();

        $html = "<select>";
        $html .= "<option value='None'>None</option>";
        if (count($reprintReasonArray) > 0) {
            $lastGroup = "";
            foreach ($reprintReasonArray as $reprintReason) {
                $reasonId = $reprintReason['reasonId'];
                $reason = $reprintReason['reason'];
                $reasonGroup = $reprintReason["reasonGroup"];

                if ($lastGroup != $reasonGroup) {
                    if ($lastGroup != "") {
                        $html .= "</optgroup>";
                    }
                    $html .= "<optgroup label='$reasonGroup'>";
                    $lastGroup = $reasonGroup;
                }

                $reasonG = str_replace("Issues", "-", $reasonGroup);
                $html .= "<option value='" . $reasonId . "'>$reasonG $reason</option>\n";
            }
        }
        $html .= "</select>";

        return $html;
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function getStatusCode()
    {
        $sql = "SELECT status,description 
                FROM orderSkuStatus
                WHERE status !='-5' AND status !='INVENTORY' 
                ORDER BY status";

        return $this->rawHDQuery($sql);
    }

    /**
     * @param int $addAll
     * @param int $minusCpu
     * @return string
     * @throws \Exception
     */
    public function loadAllDepartmentsHtml($addAll = 0, $minusCpu = 0)
    {
        $status_codes_array = $this->getStatusCode();

        $html = "<select name='department'>";
        $html .=    "<option value='None'>None</option>";

        if ($addAll == 1) {
            $html .= "<option value='all'>All</option>";
        }
        foreach ($status_codes_array as $status_code_info) {
            $status = $status_code_info['status'];
            $description = $status_code_info['description'];
            $status = trim($status);
            $status = intval($status); //status should be an int
            $description = trim($description);
            //do not show completed in the drop down list
            if ($status != 9) {
                $html .= "<option value='" . $status . "'>" . $description . "</option>";
            }
        }

        if ($minusCpu == 0) {
            $html .= "<option value='CPU'>CPU</option>";
        }

        $html .= "</select>";

        return $html;
    }


}//End of class