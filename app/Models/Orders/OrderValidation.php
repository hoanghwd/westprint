<?php


namespace App\Models\Orders;


use App\Models\Base;

class OrderValidation extends Base
{
    private $_request;
    private $_orderId;

    /**
     * OrderValidation constructor.
     * @param $request
     * @throws \Exception
     */
    function __construct($request = '')
    {
        $this->_request = $request;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function validateOrder()
    {
        $orderMapArray = $this->_doActivateOrder();
        $msg = "There's nothing to report for order validation.";

        if( $this->isNotEmptiedArray($orderMapArray) )  {
            $msg = sizeof($orderMapArray). " ordres(s) were activated successfully.";
        }

        return
            $data =
                array(
                    'htmlReport' => $msg,
                    'htmlReportDetails' => $msg,
                    'dateReport' => friendlyDateNow()
                );
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _doActivateOrder()
    {
        $orderMapArray = array();

        $orderArray = $this->_getEligibleOrder();
        if( $this->isNotEmptiedArray($orderArray) ) {
            foreach ($orderArray AS $order) {
                $orderId = $order['id'];
                $itemCounts = $this->_countOrderItemByOrderId($orderId);
                if( $itemCounts == 0 ) {
                    $data = array('active' => 1);
                    $db = $this->getResource(SYN_DB);
                    $db->where('id', $orderId)
                       ->update('orders', $data);
                    if( $db->count > 0) {
                        array_push($orderMapArray, $orderId);
                    }
                }
            }//foreach
        }

        return $orderMapArray;
    }

    /**
     * @param $orderId
     * @return int|mixed
     * @throws \Exception
     */
    private function _countOrderItemByOrderId($orderId)
    {
        $sql = "SELECT COUNT(*) itemCounts 
                FROM orderItems 
                WHERE imageStatus IN('','-2') AND orderId='$orderId'";
        $data = $this->rawSYNQuery($sql);

        return isset($data[0]) ? $data[0]['itemCounts'] : 0;
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    private function _getEligibleOrder()
    {
        $sql ="SELECT
               id, poNumber, `OWNER` 
               FROM orders 
               WHERE
                    active = 0
                    AND complete != '1' 
                    AND production != '1' 
                    AND testMode != '1'
               ORDER BY id DESC";

        return $this->rawSYNQuery($sql);
    }

}