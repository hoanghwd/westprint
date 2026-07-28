<?php

namespace App\Models;

use App\Models\Base;
use Cassandra\Date;
use Cassandra\Varint;


class Orders extends Base
{
    //https://www.huynhdo.us/westprint/webPortal/api/orderdetails?userName=canvasPeople&orderId=15588727
    /**
     * incoming request:
     * array(3) {
     * ["route"]=>
     * string(26) "webPortal/api/orderdetails"
     * ["userName"]=>
     * string(12) "canvasPeople"
     * ["orderId"]=>
     * string(8) "16562317"
     * ["hdoOrderId]
     * }
     */
    private $_request;
    private $_ordersPerPageDisplay = 500;
    private $_daysLookBack = 30;
    private $_zoneId = '';
    private $_shippingTemplateArray;
    private $_shippingPriceByProduct;

    /**
     * Orders constructor.
     * @param string $request
     */
    function __construct($request = '')
    {
        $this->_request = $request;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _createListOrderQuery()
    {
        /**
         * DEBUG_
         * array(12) {
         * ["route"]=>
         * string(20) "webPortal/api/orders"
         * ["userName"]=>
         * string(13) "canvasPeople "
         * ["dateFrom"]=>
         * string(0) ""
         * ["dateTo"]=>
         * string(0) ""
         * ["status"]=>
         * string(0) ""
         * ["locId"]=>
         * string(0) ""
         * ["orderId"]=>
         * string(0) ""
         * ["trackingNumber"]=>
         * string(0) ""
         * ["page"]=>
         * string(9) "undefined"
         * ["limit"]=>
         * string(2) "40"
         * ["orderBy"]=>
         * string(9) "undefined"
         * ["descAsc"]=>
         * string(4) "desc"
         * }
         */

        //Page
        $page = $this->_request["page"];
        if ($page == "" || $page == "undefined") {
            $this->_request["page"] = 0;
        }

        //Limit
        $limit = $this->_request["limit"];
        if ($limit == "" or $limit < 1) {
            $this->_request["limit"] = $this->_ordersPerPageDisplay;
        }

        //Order by
        $orderBy = $this->_request["orderBy"];
        if ($orderBy == "" || $orderBy == "undefined") {
            $this->_request["orderBy"] = "id";
        }

        //Date from
        $dateFrom = $this->_request["dateFrom"];
        $sinceDateUnix = ($dateFrom == '') ? (time() - (SECS_DAY * $this->_daysLookBack)) : strtotime($dateFrom);
        $this->_request["dateFrom"] = $sinceDateUnix;

        //Date to
        $dateTo = $this->_request["dateTo"];
        $toDateUnix = ($dateTo == '') ? time() : add24HoursToDate($dateTo);
        $this->_request["dateTo"] = $toDateUnix;

        //Status
        $status = $this->_request["status"];
        if ($status == "" || $status == "undefined") {
            $status = "ALL";
        }
        else if (strcmp($status, 'InProgress') == 0) {
            $status = 'In Progress';
        }
        $this->_request["status"] = strtoupper($status);

        //LocId
        $locId = $this->_request["locId"];
        if ($locId == "" || $locId == "undefined") {
            $locId = "ALL";
        }
        $this->_request["locId"] = $locId;

        //PO statement
        $sqlSynIdOrPo = " ";
        $poNumber = isset($this->_request["orderId"]) ? $this->_request["orderId"] : '';
        $this->_request["orderId"] = $poNumber;
        if ($poNumber != "") {
            $sqlSynIdOrPo = " AND poNumber = '" . $poNumber . "' ";
        }

        //Tracking statement
        $sqlTracking = " ";
        if ($this->_request["trackingNumber"] != "") {
            $sqlTracking = " AND trackingNumber LIKE '%" . ($this->_request["trackingNumber"]) . "%' ";
        }

        //LocId Statement
        $sqlLocId = " AND locId = " . $locId . " ";
        if ($locId == "ALL") {
            $sqlLocId = " ";
        }

        //Status statement
        $sqlStatus = '';
        if ($this->_request["status"] == "CANCELLED") {
            $sqlStatus = " AND deleted = 1 ";
        }
        elseif ($this->_request["status"] == "IN PROGRESS") {
            $sqlStatus = " AND deleted = 0 AND complete = 0  ";
        }
        elseif ($this->_request["status"] == "COMPLETED") {
            $sqlStatus = " AND deleted = 0 AND complete = 1  ";
        }

        //Offset
        $offset = ($this->_request["page"]) * ($this->_request["limit"]);

        //sql Query
        $params = array(
            $this->_request['userName'], $this->_request['dateFrom'],
            $this->_request['dateTo'], $offset, $this->_request['limit']);
        $sql =
            "SELECT 
                id, poNumber, locId, orderTime, total, shipping, complete, deleted, trackingNumber, 
                carrier, completeTime, itemsDeleted, firstName, lastName, country
            FROM orders
            WHERE 
                owner = ? AND orderTime >= ? AND orderTime <= ? " . $sqlSynIdOrPo . $sqlTracking . $sqlLocId . $sqlStatus . " 
            ORDER BY " . ($this->_request["orderBy"]) . " " . ($this->_request["descAsc"]) . "  LIMIT ?, ?";

        //sql total records
        $paramTotalBind = array($this->_request['userName'], $this->_request['dateFrom'], $this->_request['dateTo']);
        $sqlTotal = "SELECT count(1) total 
                     FROM orders 
                     WHERE owner = ? AND orderTime >= ? AND orderTime < ? " . $sqlSynIdOrPo . $sqlTracking . $sqlLocId . $sqlStatus;
        $totalResult = $this->rawSYNQuery($sqlTotal, $paramTotalBind);

        return
            array(
                'sql' => $sql,
                'bind' => $params,
                'total' => $totalResult[0]['total']
            );
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function listOrders()
    {
        //https://www.huynhdo.us/westprint/webPortal/api/orders?userName=canvasPeople%20&dateFrom=2023-11-8&dateTo=2023-12-8&status=InProgress&locId=&orderId=ValidOrder_1699493123&trackingNumber=&page=0&limit=40&orderBy=orderTime&descAsc=asc
        $results = $this->_createListOrderQuery();
        $orderArray = $this->rawSYNQuery($results['sql'], $results['bind']);
        $i = 0;
        foreach ($orderArray as $row) {
            $orderId = $row['id'];
            $orderArray[$i]['status'] = $this->_calculateOrderStatus($row);
            $orderArray[$i]['total'] = moneyFormat($this->calculateOrderTotalPrice($orderId));
            $i++;
        }

        return
            array(
                "orders" => $orderArray,
                "total" => $results['total']
            );
    }

    /**
     * @param $data
     * @return string
     */
    private function _calculateOrderStatus($data)
    {
        $status = "IN PROGRESS";

        if ($data['deleted'] == 1) {
            $status = "CANCELLED";
        }
        else if ($data['complete'] == 1) {
            $status = "COMPLETED";
        }

        return $status;
    }

    /**
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    public function getOrderItems()
    {
        $data = $this->getResource(SYN_DB)
            ->where("orderId", $this->_request['orderId'])
            ->get("orderItems");

        $i = 0;
        foreach ($data as $row) {
            $itemNumber = $row['itemNumber'];
            if (is_null($itemNumber) or $itemNumber == "") {
                $itemNumber = "NA";
            }
            $data[$i]["itemNumber"] = $itemNumber;
            $data[$i]["itemIndex"] = "index_" . $i;
            $data[$i]["price"] = moneyFormat($row['price']);
            $i++;
        }

        return $data;
    }

    /**
     * @param string $useThirdPartyShipment
     * @param string $useThirdPartyCarrier
     * @return string
     */
    private function _getShipmentType($useThirdPartyShipment = "Y", $useThirdPartyCarrier = "Y")
    {
        $newShipmentType = "Fulfill Account";
        $shipmentType = '';

        if ($useThirdPartyShipment == 'Y') {
            $shipmentType = 'useThirdPartyShipment';
        }
        else if ($useThirdPartyCarrier == 'Y') {
            $shipmentType = 'useThirdPartyCarrier';
        }

        if ($shipmentType == "useThirdPartyShipment") {
            $newShipmentType = "Third Party Account";
        }
        else if ($shipmentType == "useThirdPartyCarrier") {
            $newShipmentType = "Third Party Carrier";
        }

        return $newShipmentType;
    }

    /**
     * @param $locId
     * @return array
     * @throws \Exception
     */
    private function _getSLAHolidayByLocId($locId)
    {
        //SLA holiday
        $holidaysArr = array();
        $data = $this->getResource(HD_DB)
            ->where('locId', $locId)
            ->get('slaHolidays', NULL, 'holiday');
        foreach ($data as $row) {
            array_push($holidaysArr, $row['holiday']);
        }

        foreach ($data as $row) {
            array_push($holidaysArr, $row['holiday']);
        }

        return $holidaysArr;
    }

    /**
     * @param $fromTime
     * @param $toTime
     * @param $gallery
     * @param $locId
     * @param bool $exclude
     * @return int[]
     * @throws \Exception
     */
    private function _getBusinessDays($fromTime, $toTime, $gallery, $locId, $exclude = True)
    {
        //SLA type
        $data = $this->getResource(HD_DB)
            ->where('userName', $gallery)
            ->get('slaRules', 1, 'slaType');
        $slaType = isset($data[0]) ? $data[0]['slaType'] : '';

        //SLA holiday
        $holidaysArr = $this->_getSLAHolidayByLocId($locId);

        $from = ($fromTime == '') ? '' : date('Y-m-d', $fromTime);
        $to = date('Y-m-d', $toTime);

        //If same day
        if ($from == $to) {
            if ((int)date('N', strtotime($from)) < 6 && !in_array($from, $holidaysArr)) {
                return array("business" => 0, "holiday" => 0);
            }

            $exclude = False;
            $from = date('Y-m-d', $fromTime - 86400);
        }

        //Exclude start day for plus days & include start day for minus days

        $fromDate = new \DateTime($from . ' 00:00:00');
        $interval = new \DateInterval('P1D');    //1 day period

        if ($exclude) {
            $toDate = new \DateTime($to . ' 23:59:59');
            $datePeriods = new \DatePeriod($fromDate, $interval, $toDate, \DatePeriod::EXCLUDE_START_DATE);
        }
        else {
            $toDate = new \DateTime($to . ' 00:00:00');
            $datePeriods = new \DatePeriod($fromDate, $interval, $toDate);
        }

        $totalBusiness = 0;
        $totalHolidays = 0;
        //set_time_limit(120);    //mainly for DEV testing
        foreach ($datePeriods as $date) {
            $isSaturday = ($date->format('N') == 6) ? True : False;
            $isSunday = ($date->format('N') == 7) ? True : False;

            if ($slaType == "Business" && ($isSaturday || $isSunday))
                continue;
            elseif ($slaType == "Business-Sat" && $isSunday)
                continue;
            elseif ($slaType == "Business-Sun" && $isSaturday)
                continue;
            else if ($isSaturday || $isSunday)
                continue;

            if (in_array($date->format('Y-m-d'), $holidaysArr)) {
                $totalHolidays++;
                continue;
            }
            $totalBusiness++;
        }

        return array("business" => $totalBusiness, "holiday" => $totalHolidays);
    }

    /**
     * @param $slaEndTime
     * @param $startingTime
     * @param $gallery
     * @param $locId
     * @return int|string
     * @throws \Exception
     */
    private function _calculateSLARemainder($slaEndTime, $startingTime, $gallery, $locId)
    {
        $remainderSLA = "";
        if ($slaEndTime != 0 && isset($startingTime)) {
            if ($startingTime > $slaEndTime) {
                $validDays = $this->_getBusinessDays($slaEndTime, $startingTime, $gallery, $locId, False);
                $remainderSLA = $validDays["business"] * (-1);
            }
            else {
                $validDays = $this->_getBusinessDays($startingTime, $slaEndTime, $gallery, $locId);
                $remainderSLA = $validDays["business"];
            }
        }
        else {
            $remainderSLA = 0;
        }

        return $remainderSLA;
    }

    /**
     * @param $departmentStatus
     * @param $shipTime
     * @param $cancelTime
     * @return int|string
     */
    private function _getOrderStartingTime($departmentStatus, $shipTime, $cancelTime)
    {
        $startingTime = '';

        if ($departmentStatus == "1") {
            $startingTime = $shipTime;
        }
        //In progress
        else if ($departmentStatus == "0") {
            $startingTime = time();
        }
        //Cancel
        else if ($departmentStatus == "-2") {
            $startingTime = $cancelTime;
        }

        return $startingTime;
    }

    /**
     * Get SYN order details
     * @return array|mixed
     * @throws \Exception
     */
    private function _doGetOrderDetailsData()
    {
        $sql = "SELECT 
                    synORD.id, synORD.poNumber, synORD.locId, synORD.orderTime, synORD.total, synORD.shipping, 
                    synORD.complete, synORD.deleted, synORD.trackingNumber, synORD.carrier, synORD.completeTime, synORD.shippingType, 
                    synORD.company, synORD.firstName, synORD.lastName, synORD.email, 
                    synORD.phone, synORD.address, synORD.address2, synORD.city, synORD.`state`, synORD.zip, synORD.country, synORD.testMode,
                    hdORDERS.gallery, hdORDERS.numberPrints,hdORDERS._orderType,
                    hdORDERS.slaStartDate, hdORDERS.slaEndDate, hdORDERS.slaEndTime, hdORDERS.shipTime,                   
                    hdORDERS.departmentStatus,hdORDERS.departmentList,hdORDERS.invoiceNumber,hdORDERS.invoiceDate,hdORDERS.trackNumber,  
                    hdORDERS.cancelTime, hdORDERS.salesRep,                    
                    p.useThirdPartyShipment, p.useThirdPartyCarrier                    
                FROM harvestd_synergize.orders synORD
                    LEFT JOIN harvestd_harvestDigital.orders hdORDERS ON hdORDERS.poNumber = synORD.id
                    LEFT JOIN harvestd_synergize.permissions p ON p.userName = hdORDERS.gallery 
                WHERE synORD.id = ? AND synORD.owner = ?";
        $params = array($this->_request['orderId'], $this->_request['userName']);
        $dataArray = $this->rawSYNQuery($sql, $params);

        //If order exists
        if (isset($dataArray[0])) {
            $data = ($dataArray[0]);
            $trackingNumber = isset($data['trackingNumber']) ? trim($data['trackingNumber']) : '';
            $carrier = strtoupper($data['carrier']);
            $country = strtoupper($data['country']);
            $state = strtoupper($data['state']);
            $calculatedOrderPrice = $this->calculateOrderTotalPrice();
            $itemsArray = $this->getOrderItems();

            //Shipping
            $shippingCollection = $this->getUserShippingTypeArray();
            $useThirdPartyShipment = $data['useThirdPartyShipment'];
            $useThirdPartyCarrier = $data['useThirdPartyCarrier'];
            $departmentStatus = $data['departmentStatus'];
            $shipTime = $data['shipTime'];
            $cancelTime = $data['cancelTime'];
            $locId = $data['locId'];
            $gallery = $data['gallery'];

            $slaEndTime = $data['slaEndTime'];
            $startingTime = $this->_getOrderStartingTime($departmentStatus, $shipTime, $cancelTime);
            $remainderSLA = $this->_calculateSLARemainder($slaEndTime, $startingTime, $gallery, $locId);

            $data['orderId'] = $data['id']; //SYN orderId
            $data["HDorderId"] = $this->orderIsTransmitted();
            $data['userName'] = $this->_request['userName'];
            $data['address1'] = $data['address'];

            $data['total'] = $calculatedOrderPrice;
            $data['totalMFT'] = moneyFormat($calculatedOrderPrice);
            $data["totalPrice"] = $calculatedOrderPrice;
            $grandTotal = $calculatedOrderPrice + $data['shipping'];
            $data['grandTotal'] = $grandTotal;
            $data['grandTotalFMT'] = moneyFormat($grandTotal);

            $data['shippingMFT'] = moneyFormat($data['shipping']);
            $data["orderTimeHuman"] = unixToReadableDate($data['orderTime']);
            $data["completeTimeHuman"] = unixToReadableDate($data['completeTime']);
            $data["statusFM"] = $this->_calculateOrderStatus($data);
            $data["trackingUrl"] = ($trackingNumber != "" && $carrier != "") ? getTrackingURL($carrier, $country, $trackingNumber) : "";
            $data['items'] = $itemsArray;
            $data["itemCounts"] = sizeof($itemsArray);
            $data["imageCounts"] = $this->countPhysicalImages();

            //Shipping
            $data["shippingInfo"] = $this->getShippingInfoBySYNOrderId($data['id']);
            $data["shippingCollection"] = $shippingCollection;
            $data["shippingCollectionSize"] = sizeof($shippingCollection);
            $data["shipmentType"] = $this->_getShipmentType($useThirdPartyShipment, $useThirdPartyCarrier);
            $data["slaRemDays"] = $remainderSLA;

            //Reason collection
            $data['editReasonCollection'] = $this->getGroupEditOrderReasons('shippingAddress');
            $data["editReasonCancelItemCollection"] = $this->getGroupEditOrderReasons('Cancel Item');
            $data["editReasonCancelOrderCollection"] = $this->getGroupEditOrderReasons('Cancel Order');
            $data["editReasonShippingTypeCollection"] = $this->getGroupEditOrderReasons('shippingType');

            //Geo collection
            $data["countryCollection"] = $this->getCountryCollection($country);
            $data["usSatesCollection"] = $this->getUSStates($state);
            $data["CASatesCollection"] = $this->getStatesCanada($state);

            //REACT call
            $data["siteUrl"] = SITE_ROOT;
            $data["cancelOrderUrl"] = SITE_ROOT . WESTPRINT_API . '/cancelorder';
            $data["updateAddressUrl"] = SITE_ROOT . WESTPRINT_API . '/updateaddress';
            $data["updateShippingTypeOrderUrl"] = SITE_ROOT . WESTPRINT_API . '/updateshippingtype';

            return $data;
        }//If order exists

        return array();
    }

    /**
     * @return array|mixed
     * @throws \Exception
     */
    public function getOrderDetail()
    {
        //https://www.huynhdo.us/westprint/webPortal/api/orderdetails?userName=canvasPeople&orderId=15588727
        /**
         * incoming request:
         * array(3) {
         * ["route"]=>
         * string(26) "webPortal/api/orderdetails"
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["orderId"]=>
         * string(8) "16562317"
         * }
         */

        return $this->_doGetOrderDetailsData();
    }

    /**
     * @param $hdOrderId
     * @return array|string
     * @throws \Exception
     */
    public function getHDOrderPricingInfo($hdOrderId)
    {
        $sql = "SELECT SUM(price * qt) AS totalPrice, SUM(itemDiscount) AS totalDiscount, 'active' AS origin 
                FROM orderSkus WHERE orderId = ?                 
                    UNION                 
                SELECT SUM(price * qt) AS totalPrice, SUM(itemDiscount) AS totalDiscount, 'deleted_billable' AS origin 
                FROM deletedOrderSkus 
                WHERE 
                    ((((`status` <= 1) || (`status` != 'INVENTORY')) && (reprint > 0)) || (`status` > 1) || (`status` = 'INVENTORY')) 
                    AND orderId = ?";

        $data = $this->rawHDQuery($sql, array($hdOrderId, $hdOrderId));

        $activeData = $data[0];
        $deletedBillableData = $data[1];
        $totalPriceActive = $activeData["totalPrice"] - $activeData["totalDiscount"];
        $totalPriceDeletedBill = $deletedBillableData["totalPrice"] - $deletedBillableData["totalDiscount"];

        return (float)($totalPriceActive + $totalPriceDeletedBill);
    }

    /**
     * @param string $externalOderId
     * @return float
     * @throws \Exception
     */
    public function calculateOrderTotalPrice($externalOderId = '')
    {
        $orderId = ($externalOderId != '') ? $externalOderId : $this->_request['orderId'];
        $hdOrderId = $this->orderIsTransmitted($orderId);

        //Order made to HD
        if ($hdOrderId != '') {
            $itemPriceTotal = $this->getHDOrderPricingInfo($hdOrderId);
        }
        //Just regular calculation because it will be cancel before product commence
        else {
            $itemPriceTotalData =
                $this->getResource(SYN_DB)
                    ->where('orderId', $orderId)
                    ->getOne("orderItems", "SUM(price * qt) AS total");
            $itemPriceTotal = $itemPriceTotalData['total'];
        }

        return (float)$itemPriceTotal;
    }

    /**
     * @param string $externalOderId
     * @return mixed|string
     * @throws \Exception
     */
    public function orderIsTransmitted($externalOderId = '')
    {
        $orderId = ($externalOderId != '') ? $externalOderId : $this->_request['orderId'];

        $sql = "SELECT	hdORDERS.id hdId	
                FROM
                    harvestd_synergize.orders synORD	
                    LEFT JOIN harvestd_harvestDigital.orders hdORDERS ON hdORDERS.poNumber = synORD.id 
                WHERE
                    synORD.id = ?" .
            " ORDER BY hdORDERS.id DESC	
               LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($orderId));

        return isset($data[0]) ? $data[0]['hdId'] : '';
    }

    /**
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    protected function countPhysicalImages()
    {
        $data =
            $this->getResource(SYN_DB)
                ->where('orderId', $this->_request['orderId'])
                ->getOne("orderItems", "SUM(qt) AS imageCounts");

        return $data['imageCounts'];
    }

    //SHIPPING TYPES//

    /**
     * @return mixed
     * @throws \Exception
     */
    public function getUserShippingTypeArray()
    {
        $shippingCollection = array();
        $collection = array();
        $shippingInfo = $this->getShippingInfoBySYNOrderId($this->_request['orderId']);
        $shippingModelId = $shippingInfo['shippingModelId'];

        switch ($shippingModelId) {
            case 1:
            case 2:
                $shippingCollection = $this->_getShippingTypeByShippingRates($shippingInfo);
                break;
            case 3:
            case 5:
                if (isset($synUserInfo['userName'])) {
                    $shippingCollection = $this->_getShippingTypeByShippingAccounts($shippingInfo);
                }
                break;
        }//switch

        /**
         * With special userName like zazzle, this user will have their own set of shipping types, HOWEVER,
         * 1. With zazzle (at least for now), we DO NOT ALLOW [edit] when locID = 4
         */
        if (sizeof($shippingCollection) == 0) {
            $userName = $shippingInfo['userName'];
            $locId = $shippingInfo['locId'];
            $allowed = $this->_shouldAllowSpecialUserNameEditShippingType($userName, $locId);
            if ($allowed) {
                $shippingCollection = $this->_getSpecialShippingTypes($userName);
            }
        }

        //PUT current shipping type in front
        if (sizeof($shippingCollection) > 0) {
            $currShippingType = $shippingInfo['shippingType'];
            foreach ($shippingCollection as $row) {
                if ($row['shippingType'] !== $currShippingType) {
                    array_push($collection, $row['shippingType']);
                }
            }
            array_unshift($collection, $currShippingType);
        }

        return $collection;
    }

    /**
     * shippingModelId = 1 or 2
     * @param $shippingInfo
     * @return array|string
     * @throws \Exception
     */
    private function _getShippingTypeByShippingRates($shippingInfo)
    {
        //SYN.users.useGeneralShippingRates = Y
        if ($shippingInfo['useGeneralShippingRates'] == 'Y') {
            return $this->_getUserShippingTypesByShippingRates($shippingInfo);
        }
        //SYN.users.useGeneralShippingRates = N
        else {
            //Order transmitted to HD
            if (isset($shippingInfo['hdId']) && $shippingInfo['hdId'] != '') {
                $shippingCollection = $this->_getUserShippingTypesByShippingTemplates($shippingInfo);
            }
            //Only in SYN
            else {
                return $this->_getUserShippingTypesByShippingTemplatesAlternate($shippingInfo);
            }
        }

        return $shippingCollection;
    }

    /**
     * @param $shippingInfo
     * @return array|string
     * @throws \Exception
     */
    private function _getUserShippingTypesByShippingRates($shippingInfo)
    {
        $username = $shippingInfo['userName'];
        $countryId = strtoupper($shippingInfo['country']);

        //For costco user ONLY
        $specialCostCoUserArray = array('yourphotooncanvas', 'costcoBusinessCenter');
        $whereStmt = in_array($shippingInfo['gallery'], $specialCostCoUserArray) ?
            " (userName = 'yourphotooncanvas' OR userName = 'costcoBusinessCenter') " :
            " userName = '$username' ";
        $sql =
            'SELECT DISTINCT(shippingType)
             FROM generalShippingRates 
             WHERE ' . $whereStmt;
        if ($countryId != '') {
            $sql .= " AND countryCode = '$countryId' ";
        }
        $sql .= " ORDER BY shippingType ASC";

        return $this->rawSYNQuery($sql);
    }

    /**
     * @param $shippingInfo
     * @return array|string
     * @throws \Exception
     */
    private function _getUserShippingTypesByShippingTemplates($shippingInfo)
    {
        $orderId = $shippingInfo['hdId'];
        $countryCode = $shippingInfo['country'];
        $countryState = $shippingInfo['state'];
        $countryHasStatesArray = array('US');

        $sql = "SELECT DISTINCT(synShippingTemplate.shippingType)
                FROM harvestd_synergize.shippingPricingTemplates synShippingTemplate
                    INNER JOIN harvestd_harvestDigital.orderSkus hdOrderSkus
                        ON synShippingTemplate.shippingTemplateId = hdOrderSkus.shippingTemplateId
                    INNER JOIN harvestd_synergize.shippingZones synShippingZone
                        ON synShippingZone.zoneName = synShippingTemplate.zoneName
                WHERE 
                    hdOrderSkus.orderId = $orderId 
                    AND synShippingZone.countryCode = '$countryCode'";
        if (in_array($countryCode, $countryHasStatesArray)) {
            $sql .= "AND synShippingZone.countryState = '$countryState'";
        }

        return $this->rawSYNQuery($sql);
    }

    /**
     * @param $shippingInfo
     * @return array|string
     * @throws \Exception
     */
    private function _getUserShippingTypesByShippingTemplatesAlternate($shippingInfo)
    {
        $shippingZoneId = $shippingInfo['shippingZoneId'];
        $pricingGroupId = $shippingInfo['pricingGroupId'];
        $countryCode = $shippingInfo['country'];
        $countryState = $shippingInfo['state'];
        $countryHasStatesArray = array('US');

        $sql = "SELECT
                    pt.shippingType                   
                FROM
                    shippingTemplates t
                    INNER JOIN shippingPricingTemplates pt ON t.shippingTemplateId = pt.shippingTemplateId 
                    INNER JOIN shippingZones z ON pt.zoneName = z.zoneName  
                WHERE
                    t.shippingZoneId = $shippingZoneId 
                    AND t.pricingGroupId = $pricingGroupId     
                    AND z.countryCode = '$countryCode'              
                    AND t.isDefault = 'Y' ";

        //We will include the state
        if (in_array($countryCode, $countryHasStatesArray)) {
            $sql .= "AND z.countryState = '$countryState' ";
        }

        $sql .= "GROUP BY shippingType";

        return $this->rawSYNQuery($sql);
    }

    /**
     * @param $userName
     * @param $locId
     * @return bool
     */
    private function _shouldAllowSpecialUserNameEditShippingType($userName, $locId)
    {
        $isAllowed = true;
        $userName = strtolower($userName);

        switch (strtolower($userName)) {
            case 'zazzle':
                if ($locId == 4) {
                    $isAllowed = false;
                }
                break;
        }//switch

        return $isAllowed;
    }

    /**
     * @param $userName
     * @return array|string
     * @throws \Exception
     */
    private function _getSpecialShippingTypes($userName)
    {
        $sql = "SELECT DISTINCT(spt.shippingType)
                FROM harvestd_synergize.shippingTypes spt                     
                WHERE spt.userName = '$userName'
                ORDER BY spt.shippingType";

        return $this->rawSYNQuery($sql);
    }

    /**
     * @param $shippingInfo
     * @return array|string
     * @throws \Exception
     */
    private function _getShippingTypeByShippingAccounts($shippingInfo)
    {
        $shippingModelId = $shippingInfo['shippingModelId'];
        $userName = $shippingInfo['userName'];
        $isInternal = 'N';
        $accountType = ($shippingModelId == 5) ? 'primary' : 'thirdParty';

        $sql = "SELECT	
                    DISTINCT(synShippintTypes.shippingType)                   
                FROM 
                    harvestd_harvestDigital.shippingAccounts hdShippingAccounts
                    INNER JOIN harvestd_harvestDigital.shippingCarriers hdShippingCarriers
                        ON hdShippingAccounts.carrierId = hdShippingCarriers.id
                    INNER JOIN harvestd_synergize.shippingTypes synShippintTypes
                        ON synShippintTypes.carrier = hdShippingCarriers.carrierName                    
                WHERE
                    hdShippingAccounts.companyName = '$userName' 
                    AND hdShippingAccounts.accountType = '$accountType' 
                    AND synShippintTypes.isInternal = '$isInternal'
                    AND synShippintTypes.isGeneralized = 'N'
                ORDER BY synShippintTypes.shippingType";

        return $this->rawSYNQuery($sql);
    }

    //SHIPPING RATES///

    /**
     * Calculate shipping rates
     */
    public function calculateShippingRate()
    {
        /**
         * <pre>DEBUG_my_shipping_info<br/>array(28) {
         * ["synId"]=>
         * int(16562285)
         * ["apiKey"]=>
         * string(88) "QWP+MZ4FRuFMV9xZoJJVSQIamYtOjx+VPjjMWE0/LMV563yd8STZ3aRm8UdlFHQ3xLaCga0AN7mF8o1Zfdt/WA=="
         * ["userId"]=>
         * int(90)
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["country"]=>
         * string(2) "US"
         * ["state"]=>
         * string(2) "CA"
         * ["locId"]=>
         * int(3)
         * ["lockedAt"]=>
         * NULL
         * ["useGeneralShippingRates"]=>
         * string(1) "N"
         * ["shippingType"]=>
         * string(15) "3 Day Delivered"
         * ["shippingZoneId"]=>
         * int(1)
         * ["pricingGroupId"]=>
         * int(6)
         * ["shipping"]=>
         * string(2) "81"
         * ["shippingModelId"]=>
         * int(2)
         * ["carrier"]=>
         * string(5) "FEDEX"
         * ["hdId"]=>
         * int(128978475)
         * ["orderReferenceId"]=>
         * string(29) "1128-multQtCP-01_canvasPeople"
         * ["gallery"]=>
         * string(12) "canvasPeople"
         * ["groupId"]=>
         * int(0)
         * ["departmentStatus"]=>
         * string(1) "0"
         * ["departmentList"]=>
         * string(5) " Prep"
         * ["slaDays"]=>
         * int(5)
         * ["slaStartDate"]=>
         * string(10) "2023-12-04"
         * ["slaEndDate"]=>
         * string(10) "2023-12-11"
         * ["cancelTime"]=>
         * int(0)
         * ["slaEndTime"]=>
         * int(1702332930)
         * ["unixTs"]=>
         * int(1701209730)
         * ["productFeed"]=>
         * array(8) {
         * [0]=>
         * string(5) "90009"
         * [1]=>
         * string(5) "90009"
         * [2]=>
         * string(5) "90009"
         * [3]=>
         * string(5) "90107"
         * [4]=>
         * int(90311)
         * [5]=>
         * int(90311)
         * [6]=>
         * int(90311)
         * [7]=>
         * int(90104)
         * }
         * }
         */

        return
            ($this->_request['useGeneralShippingRates'] == 'Y') ?
                $this->_calculateShippingRateV1() : $this->_calculateShippingRateV2();
    }

    /**
     * $useGeneralShippingRates = Y
     */
    private function _calculateShippingRateV1()
    {
        $totalQuotePrice = FALSE;
    }

    /**
     * @return float
     * @throws \Exception
     * $useGeneralShippingRates = N
     */
    private function _calculateShippingRateV2()
    {
        /**
         * pre>PRINT_<br/>array(28) {
         * ["synId"]=>
         * int(16562290)
         * ["apiKey"]=>
         * string(88) "/6E5kqP5nCYCmUpnF9Z47d8pRwjg9F1Emxdsf3JyO+MXNx5CG3wA6NZrGSxZRybDKx/O9nxIPjSLXs+0tHQzZQ=="
         * ["userId"]=>
         * int(90)
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["country"]=>
         * string(2) "US"
         * ["state"]=>
         * string(2) "CA"
         * ["locId"]=>
         * int(3)
         * ["lockedAt"]=>
         * NULL
         * ["useGeneralShippingRates"]=>
         * string(1) "N"
         * ["shippingType"]=>
         * string(5) "Basic"
         * ["shippingZoneId"]=>
         * int(1)
         * ["pricingGroupId"]=>
         * int(6)
         * ["shipping"]=>
         * string(1) "9"
         * ["shippingModelId"]=>
         * int(2)
         * ["carrier"]=>
         * string(5) "FEDEX"
         * ["hdId"]=>
         * int(128978480)
         * ["orderReferenceId"]=>
         * string(29) "1128-multQtCP-04_canvasPeople"
         * ["gallery"]=>
         * string(12) "canvasPeople"
         * ["groupId"]=>
         * int(0)
         * ["departmentStatus"]=>
         * string(1) "0"
         * ["departmentList"]=>
         * string(5) " Prep"
         * ["slaDays"]=>
         * int(5)
         * ["slaStartDate"]=>
         * string(10) "2023-12-04"
         * ["slaEndDate"]=>
         * string(10) "2023-12-11"
         * ["cancelTime"]=>
         * int(0)
         * ["slaEndTime"]=>
         * int(1702334715)
         * ["unixTs"]=>
         * int(1701211515)
         * ["productFeed"]=>
         * array(8) {
         * [0]=>
         * string(5) "90009"
         * [1]=>
         * string(5) "90009"
         * [2]=>
         * string(5) "90009"
         * [3]=>
         * string(5) "90107"
         * [4]=>
         * int(90311)
         * [5]=>
         * int(90311)
         * [6]=>
         * int(90311)
         * [7]=>
         * int(90104)
         * }
         * }
         */
        $locId = $this->_request['locId'];
        $currency = $data = $this->_getCurrencyAtLoc($locId);
        $itemsQuantityArray = $this->_calProductFeedQtyArray();
        $itemsQuantityArray = $this->_getNewItemQtyArray($itemsQuantityArray);

        $grandTotal = 0;
        foreach ($itemsQuantityArray as $productId => $quantity) {
            /**
             * <pre>PRINT_$priceDataArray<br/>array(3) {
             * ["basePriceUSD"]=>
             * string(5) "25.00"
             * ["manyPriceUSD"]=>
             * string(4) "8.00"
             * ["isAllowed"]=>
             * string(1) "Y"
             * }
             * </pre>
             */
            $priceDataArray = $this->_getPriceArray($productId);
            if (isset($priceDataArray['isAllowed']) && $priceDataArray['isAllowed'] == "Y") {
                $basePrice = (float)$priceDataArray['basePrice' . $currency];
                $manyPrice = (float)$priceDataArray['manyPrice' . $currency];

                $grandTotal += $basePrice;
                $shippingPriceByProduct[$productId] = $basePrice;

                //More than 1
                if ($quantity > 1) {
                    for ($i = 1; $i < $quantity; $i++) {
                        $grandTotal += $manyPrice;
                        $shippingPriceByProduct[$productId] += $manyPrice;
                    }
                }

                $shippingTemplateArray = $this->_shippingTemplateArray;
                $templateId = searchForKey($productId, $shippingTemplateArray);
                $totalByProduct = round(($shippingPriceByProduct[$productId] / $quantity), 2);
                $productsCountsByShippingTemplate = count($shippingTemplateArray[$templateId]);
                if ($templateId != 0 && $productsCountsByShippingTemplate > 1) {
                    /**
                     * $shippingTemplateArray[$templateId])
                     * <pre>PRINT_<br/>array(3) {
                     * [0]=>
                     * int(90013)
                     * [1]=>
                     * int(90107)
                     * [2]=>
                     * int(90311)
                     * }
                     */
                    //$this->dumpVar( $shippingTemplateArray[$templateId]);
                    foreach ($shippingTemplateArray[$templateId] as $pId) {
                        $shippingPriceByProduct[$pId] = $totalByProduct;
                    }
                }
                else {
                    $shippingPriceByProduct[$productId] = $totalByProduct;
                }

                $this->_shippingPriceByProduct = $shippingPriceByProduct;
            }
            else {
                return FALSE;
            }
        }//foreach

        $grandTotal = round($grandTotal, 2);

        return (float)$grandTotal;
    }

    /**
     * @return string
     */
    public function getZoneId()
    {
        return $this->_zoneId;
    }

    /**
     * @return array
     */
    private function _calProductFeedQtyArray()
    {
        $productFeedArray = $this->_request["productFeed"];
        $itemsQuantityArray = array();

        $i = 0;
        foreach ($productFeedArray as $productId) {
            if (is_object($productId)) {
                $productId = (array)$productId;
                $productId = $productId[0];
            }

            if (isset($itemsQuantityArray[$productId])) {
                $itemsQuantityArray[$productId] += 1;
            }
            else {
                $itemsQuantityArray[$productId] = 1;
            }
            $i += 1;
        }

        return $itemsQuantityArray;
    }

    /**
     * @param $itemsQuantityArray
     * @return array
     * @throws \Exception
     */
    private function _getNewItemQtyArray($itemsQuantityArray)
    {
        $itemsQuantityKeysArray = array_keys($itemsQuantityArray);
        $productsInStmt = implode(",", $itemsQuantityKeysArray);
        $shippingTemplateArray = array();
        $productsKitArray = array();

        /**
         * DEBUG_
         * array(3) {
         * [0]=>
         * array(4) {
         * ["id"]=>
         * int(90013)
         * ["productCodes"]=>
         * string(0) ""
         * ["sku"]=>
         * int(19000300008)
         * ["shippingTemplateId"]=>
         * int(1035)
         * }
         * [1]=>
         * array(4) {
         * ["id"]=>
         * int(90107)
         * ["productCodes"]=>
         * string(0) ""
         * ["sku"]=>
         * int(20000000002)
         * ["shippingTemplateId"]=>
         * int(1035)
         * }
         * [2]=>
         * array(4) {
         * ["id"]=>
         * int(90311)
         * ["productCodes"]=>
         * string(17) "90310|90310|90310"
         * ["sku"]=>
         * int(19030300057)
         * ["shippingTemplateId"]=>
         * int(1035)
         * }
         * }
         */
        $sqlProducts =
            "SELECT id, productCodes, sku, shippingTemplateId FROM products WHERE id IN (" . $productsInStmt . ")";
        $data = $this->rawSYNQuery($sqlProducts);

        foreach ($data as $row) {
            $productId = $row['id'];
            $productCode = $row['productCodes'];
            $shippingTemplateId = $row['shippingTemplateId'];

            //Is kit
            if ($productCode != '') {
                $productsKitArray[$productId] = $productCode;
            }
            //Regular product
            else {
                if (is_null($shippingTemplateId)) {
                    $shippingTemplateId = 0;
                }
                $shippingTemplateArray[$shippingTemplateId][] = $productId;
            }
        }//sql products

        /**
         * DEBUG_my_productsKitArray
         * array(1) {
         * [90311]=>
         * string(17) "90310|90310|90310"
         * }
         * DEBUG_my_shippingTemplateArray
         * array(1) {
         * [1035]=>
         * array(2) {
         * [0]=>
         * int(90013)
         * [1]=>
         * int(90107)
         * }
         * }
         */
        if ($this->isNotEmptiedArray($productsKitArray)) {
            foreach ($productsKitArray as $pId => $codes) {
                $prdCodeArray = explode("|", $codes);
                $sqlKit = "SELECT sku, shippingTemplateId FROM products WHERE id = ?";
                $dataKitArray = $this->rawSYNQuery($sqlKit, array($prdCodeArray[0]));

                if ($this->isNotEmptiedArray($dataKitArray[0])) {
                    $kitArray = $dataKitArray[0];
                    $shippingTemplateId = $kitArray['shippingTemplateId'];
                    $shippingTemplateArray[$shippingTemplateId][] = $pId;
                }
            }
        }

        $newItemsQuantityArray = array();
        foreach ($shippingTemplateArray as $key => $shippingTemplate) {
            if ($key !== 0) {
                $index = $shippingTemplate[0];

                if (count($shippingTemplate) == 1) {
                    $newQt = $itemsQuantityArray[$index];
                }
                else {
                    $total = 0;
                    foreach ($shippingTemplate as $pId) {
                        $total += $itemsQuantityArray[$pId];
                    }
                    $newQt = $total;
                }

                $newItemsQuantityArray[$index] = $newQt;
            }
            else {
                foreach ($shippingTemplate as $pId) {
                    $newItemsQuantityArray[$pId] = $itemsQuantityArray[$pId];
                }
            }
        }

        $this->_shippingTemplateArray = $shippingTemplateArray;

        return $newItemsQuantityArray;
    }

    /**
     * @param $locId
     * @return mixed
     * @throws \Exception
     */
    private function _getCurrencyAtLoc($locId)
    {
        $data =
            $this->getResource(HD_DB)
                ->where('id', $locId)
                ->get('locations', 1, 'currency');

        return $data[0]['currency'];
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    private function _getZoneName()
    {
        $sql = "SELECT id, zoneName FROM shippingZones WHERE countryCode = ? AND shippingZoneId = ?";
        if ($this->_request['state'] != '') {
            $state = $this->_request['state'];
            $sql .= " AND countryState = '$state' ";
        }

        $data = $this->rawSYNQuery($sql, array($this->_request['country'], $this->_request['shippingZoneId']));
        if (isset($data[0]) && $this->isNotEmptiedArray($data[0])) {
            return $data[0];
        }
        else {
            $data =
                $this->getResource(SYN_DB)
                    ->where('countryCode', $this->_request['country'])
                    ->get('shippingZones');

            return $data[0];
        }
    }

    /**
     * @param $productId
     * @return array|string
     * @throws \Exception
     */
    private function _getPriceArray($productId)
    {
        $locId = $this->_request['locId'];
        $currency = $data = $this->_getCurrencyAtLoc($locId);
        $zoneArray = $this->_getZoneName();
        $zoneName = $zoneArray['zoneName'];
        $this->_zoneId = $zoneArray['id'];

        $sql = "SELECT pt.basePrice" . $currency . ", pt.manyPrice" . $currency . ", pt.isAllowed
                FROM products p, shippingPricingTemplates pt
                WHERE p.id = ? AND p.name = ?
                AND p.shippingTemplateId = pt.shippingTemplateId AND pt.zoneName = ? AND pt.shippingType = ?";
        $bindParams = array($productId, $this->_request['userName'], $zoneName, $this->_request['shippingType']);
        /**
         * <pre>PRINT_$priceDataArray<br/>array(3) {
         * ["basePriceUSD"]=>
         * string(5) "25.00"
         * ["manyPriceUSD"]=>
         * string(4) "8.00"
         * ["isAllowed"]=>
         * string(1) "Y"
         * }
         * </pre>
         */
        $priceDataArray = $this->rawSYNQuery($sql, $bindParams);
        if (isset($priceDataArray[0])) {
            return $priceDataArray[0];
        }
        //Try another way
        else {
            $sql =
                "SELECT pt.basePrice" . $currency . ", pt.manyPrice" . $currency . ", pt.isAllowed 
                 FROM shippingTemplates t, shippingPricingTemplates pt  
                 WHERE t.shippingZoneId = ? AND t.pricingGroupId = ? AND t.isDefault = 'Y' 
                    AND t.shippingTemplateId = pt.shippingTemplateId
                    AND pt.zoneName = ? AND pt.shippingType = ?";
            $bindParams = array(
                $this->_request['shippingZoneId'],
                $this->_request['pricingGroupId'],
                $zoneName,
                $this->_request['shippingType']
            );
            $priceDataArray = $this->rawSYNQuery($sql, $bindParams);
            if (isset($priceDataArray[0])) {
                return $priceDataArray[0];
            }
        }

        return FALSE;
    }

    /**
     * @return mixed
     */
    public function getShippingPriceByProduct()
    {
        /**
         * </pre><pre>PRINT_<br/>array(3) {
         * [90013]=>
         * float(11.4)
         * [90107]=>
         * float(11.4)
         * [90311]=>
         * float(11.4)
         * }
         */
        return $this->_shippingPriceByProduct;
    }

}//End of class