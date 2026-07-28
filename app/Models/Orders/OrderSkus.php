<?php


namespace App\Models\Orders;

use \App\Models\Base;

class OrderSkus extends Base
{
    private $_request;
    private $_hdOrderId;
    private $_activeCode;
    const DEFAULT_LOCID = 1;

    /**
     * OrderSkus constructor.
     * @param $request
     */
    function __construct($request)
    {
        $this->_request = $request;
        $this->_hdOrderId = $this->_request['orderId'];
        if ($this->_hdOrderId != '') {
            $this->_activeCode = $this->_request['orderId'];
        }
    }

    /**
     * @return string
     */
    private function _getItemSelectColumns()
    {
        return
            "id, imageId, imageStatus, psTitle, x, y, qt, price, printer, substrate,
            customerItemCode, costcoItemCode, coating, borders, stretching, mounting,
            galleryWrap, enhancing, label, printNumbers, hardware, whiteInk, polishEdge,
            tear, signNumber, specialInstructions, `status`, history, notes, holding,
            holdReason, holdDate, completionDate, trackNumber, duePrinting,
            dueStretching, dueMounting, dueEnhancing, reprint, framing, frameColor,
            matted, origSku, enhanceTime, title, cisID, fileLocation, gwSpec, apiId,
            tShirtSize, tShirtColor, itemDiscount, sku, oneFlowSku, _corbis,
            attributeCode, thumbLocation";
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    private function _getItemSkuRawData()
    {
        $sql = "SELECT " . ($this->_getItemSelectColumns()) . ", 'active' AS origin 
                FROM orderSkus 
                WHERE orderId = ?";
        $params = array($this->_hdOrderId);

        return $this->rawHDQuery($sql, $params);
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    private function _getItemSkuData()
    {
        /**
         * PRINT__getItemSkuData
         * array(24) {
         * [0]=>
         * array(57) {
         * ["id"]=>
         * int(191321876)
         * ["imageId"]=>
         * int(1)
         * ["imageStatus"]=>
         * string(1) "2"
         * ["psTitle"]=>
         * string(23) "Canvas 16x20 - Standard"
         * ["x"]=>
         * string(2) "11"
         * ["y"]=>
         * string(2) "14"
         * ["qt"]=>
         * string(1) "1"
         * ["price"]=>
         * string(8) "12.85000"
         * ["printer"]=>
         * string(1) "2"
         * ["substrate"]=>
         * string(2) "23"
         * ["customerItemCode"]=>
         * string(5) "90009"
         * ["costcoItemCode"]=>
         * string(0) ""
         * ["coating"]=>
         * string(1) "1"
         * ["borders"]=>
         * string(2) "11"
         * ["stretching"]=>
         * string(1) "2"
         * ["mounting"]=>
         * string(1) "1"
         * ["galleryWrap"]=>
         * string(2) "20"
         * ["enhancing"]=>
         * string(1) "1"
         * ["label"]=>
         * string(36) "Matte Canvas Stretched (0.75): 11x14"
         * ["printNumbers"]=>
         * string(0) ""
         * ["hardware"]=>
         * string(2) "22"
         * ["whiteInk"]=>
         * string(1) "9"
         * ["polishEdge"]=>
         * string(1) "1"
         * ["tear"]=>
         * string(0) ""
         * ["signNumber"]=>
         * string(1) "1"
         * ["specialInstructions"]=>
         * string(0) ""
         * ["status"]=>
         * string(1) "0"
         * ["history"]=>
         * string(0) ""
         * ["notes"]=>
         * string(0) ""
         * ["holding"]=>
         * string(0) ""
         * ["holdReason"]=>
         * string(0) ""
         * ["holdDate"]=>
         * string(0) ""
         * ["completionDate"]=>
         * string(0) ""
         * ["trackNumber"]=>
         * string(0) ""
         * ["duePrinting"]=>
         * int(0)
         * ["dueStretching"]=>
         * int(0)
         * ["dueMounting"]=>
         * int(0)
         * ["dueEnhancing"]=>
         * int(0)
         * ["reprint"]=>
         * string(0) ""
         * ["framing"]=>
         * string(1) "0"
         * ["frameColor"]=>
         * string(4) "None"
         * ["matted"]=>
         * int(0)
         * ["origSku"]=>
         * string(9) "128978475"
         * ["enhanceTime"]=>
         * string(0) ""
         * ["title"]=>
         * string(8) "20342561"
         * ["cisID"]=>
         * int(0)
         * ["fileLocation"]=>
         * string(69) "\\HAL2001\Raid_0E\003\canvasPeople\112823\16562285\20342561_11x14.jpg"
         * ["gwSpec"]=>
         * string(8) "Built in"
         * ["apiId"]=>
         * int(20342561)
         * ["tShirtSize"]=>
         * string(0) ""
         * ["tShirtColor"]=>
         * string(0) ""
         * ["itemDiscount"]=>
         * string(0) ""
         * ["sku"]=>
         * int(19000300004)
         * ["oneFlowSku"]=>
         * NULL
         * ["_corbis"]=>
         * int(1)
         * ["attributeCode"]=>
         * string(7) "MC|0.75"
         * ["origin"]=>
         * string(6) "active"
         * }
         * .....
         */
        $rawData = $this->_getItemSkuRawData();
        $data = array();
        $orderId = $this->_hdOrderId;
        $apiFlag = $this->getHDExactOne('orders', 'api', 'id', $this->_hdOrderId);
        $itemNumberArray = $this->_getItemNumberByOrderId();

        foreach ($rawData as $row) {
            $id = $row['id'];
            $status = $row['status'];
            $imageTitle = ($apiFlag != "1") ? $id . "-" . $row["title"] : $id;
            $thumbnailLocation = $row['thumbLocation'];

            //Image title
            $row['imageTitle'] = $imageTitle;
            $row['isDynamic'] = $this->getHDExactOne('sku', 'isDynamic', 'id', $row['sku']);

            //Department name
            $departmentName = $this->getHDExactOne('departments', 'name', 'productionOrder', $status);
            if ($departmentName == '') {
                $departmentName = "Inventory";
            }

            //Status
            $shelfName = $this->_getShelfName($orderId, $departmentName, $status);
            if (($departmentName == "Inventory" || $departmentName == "GS Inventory") && $shelfName != "") {
                $itemStatus = "$departmentName / $shelfName";
            }
            else {
                $itemStatus = $departmentName;
            }
            $row['itemStatus'] = $itemStatus;
            $row['departmentName'] = $departmentName;

            //Item code
            $customerItemCode = $row['customerItemCode'];
            $costcoItemCode = $row['costcoItemCode'];
            if ($customerItemCode == NULL || $customerItemCode == "") {
                // IF costcoItemCode is BLANK or NULL, the value of item code should be N/A
                if ($costcoItemCode == NULL || $costcoItemCode == "") {
                    $itemCode = "N/A";
                }
                else {
                    $itemCode = $costcoItemCode;
                }
            }
            else {
                $itemCode = $customerItemCode;
            }
            $row['itemCode'] = $itemCode;

            //Item number
            $row['itemNumber'] = (isset($itemNumberArray[$id]) && $itemNumberArray[$id] != "") ? $itemNumberArray[$id] : "N/A";

            // Get borders info
            $bordersName = $this->_getBordersInfo($row["borders"]);
            $row['borderName'] = $bordersName;

            // Get substrate info
            $substratesData = $this->_getSubstratesInfo($row['substrate']);
            $row["substrateGroup"] = $substratesData["substrateGroup"];
            $row["substrateName"] = $substratesData["name"];

            // Assembly (stretching, gw, hardware)
            $row["stretchingName"] = $this->getHDExactOne('stretching', 'name', 'id', $row["stretching"]);
            $row["hardwareName"] = $this->getHDExactOne('hardware', 'name', 'id', $row["hardware"]);
            $row["galleryWrapName"] = $this->getHDExactOne('galleryWrap', 'name', 'id', $row["galleryWrap"]);

            //Price
            $currency = $this->getHDExactOne('locations', 'currency', 'id', self::DEFAULT_LOCID);
            $price = floatval($row["price"]) - floatval($row["itemDiscount"]);
            $row["price"] = $currency . ' ' . (moneyFormat($price));

            //Instruction
            $row["specialInstructions"] = $this->_getInstructionHtml($id, $row["specialInstructions"], $imageTitle, $thumbnailLocation);

            //trBg color status
            $holding = $row["holding"];
            $trBgClass = "";
            if($row["reprint"] == -1 && $holding == 0 && $row["holdReason"] == "") {
                $trBgClass = "activeReprint";
            }
            else if($holding == 1) {
                $trBgClass = "activeHolding";
            }
            $row["trBkGroundStatusClass"] = $trBgClass;

            //Assign row data
            $data[$id] = $row;
        }//foreach

        return $data;
    }

    /**
     * @param $id
     * @param $instruction
     * @param $imageTitle
     * @param $thumbnailLocation
     * @return string
     */
    private function _getInstructionHtml($id, $instruction, $imageTitle, $thumbnailLocation)
    {
        $newInstruction = $instruction;

        //Instruction
        if (strlen($instruction) > 25) {
            $insParts = explode('-', $instruction);
            $insString = '';
            if ($this->isNotEmptiedArray($insParts)) {
                $insString .= "<ul>";
                $i = 1;
                foreach ($insParts as $comment) {
                    $insString .= '<li>'.$comment . "</li>";
                    $i++;
                }
                $insString .= "</ul>";
            }
            $cutInstruction = substr($instruction, 0, 25) . "...";
            $html = "<span>
                        <a class='orderInfoLink addInstrBtn' onclick=\"openAlert('$insString',  { headerTxtId: { text: 'Instruction Notes:  #' + '$imageTitle' } }       )\">$cutInstruction</a>
                     </span>                    
                     <br/>";

            if ($instruction != "none") {
                $html .= "<span class='deleteInstrBtn'>
                            <a class='orderInfoLinkRed' onclick='confirmDeleteInstruction(" . $id . ");'>Delete</a>
                         </span>";
            }
            $newInstruction = $html;
        }//greater 25

        return $newInstruction;
    }

    /**
     * @param $id
     * @return mixed|string
     * @throws \Exception
     */
    private function _getSubstratesInfo($id)
    {
        $data =
            $this->getResource(HD_DB)
                ->where('id', $id)
                ->get('substrates', NULL, array('substrateGroup', 'name'));

        return isset($data[0]) ? $data[0] : '';
    }

    /**
     * @param $borders
     * @return mixed
     * @throws \Exception
     */
    private function _getBordersInfo($borders)
    {
        $data =
            $this->getResource(HD_DB)
                ->where('id', $borders)
                ->get('borders', 1, 'name');

        return isset($data[0]) ? $data[0]['name'] : '';
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getItemNumberByOrderId()
    {
        $itemNumberArray = array();

        $data =
            $this->getResource(HD_DB)
                ->where('orderId', $this->_hdOrderId)
                ->get('orderSkus', NULL, array('id', 'itemNumber'));
        if ($this->isNotEmptiedArray($data)) {
            foreach ($data as $row) {
                $id = $row['id'];
                $itemNumberArray[$id] = $row['itemNumber'];
            }
        }

        return $itemNumberArray;
    }

    /**
     * @param $departmentName
     * @param $status
     * @return string
     * @throws \Exception
     */
    private function _getShelfName($departmentName, $status)
    {
        $name = "";
        $departmentName = strtolower(str_replace(" ", "", $departmentName));
        if ($departmentName == "inventory" || $departmentName == "gsinventory") {
            if (strval($status) == "88") {
                $sql = "SELECT s.name AS shelfName FROM groupedShipmentPieces g, shelf s WHERE g.orderId = ? AND g.shelfId = s.id";
            }
            else {
                $sql = "SELECT shelfName FROM shelfItem WHERE orderId = ?";
            }


            $data = $this->rawHDQuery($sql, array($this->_hdOrderId));
            $name = isset($data[0]) ? $data[0]['shelfName'] : '';
        }

        return $name;
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function getActiveItemsInfo()
    {
        return $this->_getItemSkuData();
    }

}//End of class