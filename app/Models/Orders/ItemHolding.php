<?php

namespace App\Models\Orders;

use \App\Models\Base;

class ItemHolding extends Base
{
    private $_request;
    private $_itemId;
    private $_actionId;

    /**
     * ItemHolding constructor.
     * @param $request
     */
    function __construct($request)
    {
        /**
         *  _DEBUG
         * array(8) {
         * ["route"]=>
         * string(33) "ajax/workorder/getitemholdinginfo"
         * ["itemId"]=>
         * string(9) "191320031"
         * ["order"]=>
         * string(9) "128978331"
         * ["unhold"]=>
         * string(1) "1"
         * ["reasonGroup"]=>
         * string(4) "None"
         * ["reasonType"]=>
         * string(0) ""
         * ["reason"]=>
         * string(4) "TEST"
         * ["resetSLA"]=>
         * string(1) "0"
         * }
         */
        $this->_request = $request;
        if (isset($request['unhold'])) {
            $this->_actionId = "UN_HOLD_IMAGE";
        }
        else {
            $this->_actionId = "GET_HOLD_REASON";
        }

        $this->_itemId = $request['itemId'];
    }

    /**
     * @return array|mixed
     * @throws \Exception
     */
    public function getData()
    {
        $data = array(
            "status" => false,
            "message" => "No action request"
        );

        switch ($this->_actionId) {
            case "GET_HOLD_REASON":
                $data = $this->_getHoldReason();
                break;

            case "UN_HOLD_IMAGE":
                $data = $this->_unholdItemImage();
                break;
        }//switch

        return $data;
    }

    private function _unholdItemImage()
    {
        $data = array();

        return $data;
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    private function _getHoldReason()
    {
        if ($this->_itemId == '') {
            return
                array(
                    "status" => false,
                    "message" => "Item ID not found. Holding data cannot be retrieved."
                );
        }

        $status = false;
        $message = "No holding data found.";

        //Reasons
        $sql = "SELECT holdReason, holdDate FROM orderSkus WHERE id = ?";
        $data = $this->rawHDQuery($sql, array($this->_itemId));
        $dataHoldReason = $data[0];
        if ($this->isNotEmptiedArray($dataHoldReason)) {
            $status = TRUE;
            $message = "Holding data found.";
        }

        //Comments
        $holdComments = array();
        $sql = "SELECT r.id, r.slaReset 
                FROM holdComments c, holdReasons r 
                WHERE c.orderSkuId = ? AND c.holdReasonId = r.id 
                ORDER BY c.id DESC LIMIT 1";

        $data = $this->rawHDQuery($sql, array($this->_itemId));
        if (isset($data[0])) {
            $holdComments = $data[0];
            return $dataHoldReason + $holdComments;
        }

        //Final
        return
            array(
                "status" => $status,
                "message" => $message,
                "data" => ($dataHoldReason + $holdComments)
            );
    }

}//End of class