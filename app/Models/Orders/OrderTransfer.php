<?php


namespace App\Models\Orders;
use App\Models\Base;
use App\Models\Orders;

class OrderTransfer extends Base
{
    private $_request;
    private $_orderId;

    /**
     * OrderSummary constructor.
     * @param $request
     */
    function __construct($request)
    {
        $this->_request = $request;
        $this->_orderId = isset($this->_request['orderId']) ? $this->_request['orderId'] : '';
    }



    /**
     * @return array|string
     * @throws \Exception
     */
    private function _getEligibleOrders()
    {
        $sql = "SELECT
                    o.*
                FROM
                    orders o
                    INNER JOIN permissions p ON o.OWNER = p.userName
                    INNER JOIN users u ON o.`OWNER` = u.userName 
                WHERE
                    o.active = 1 
                    AND o.production = 0 
                    AND o.complete = 0 
                    AND ( ISNULL( o.statusId ) OR o.statusId = '0' ) 
                    AND o.transferredToHd = 'NO' 
                    AND o.thirdPartyERPTransferred = 'NA' 
                    AND ( ( p.useHD = 'Y' ) OR ( p.useHD = 'N' AND o.locId != 4 ) )";

        if( $this->_orderId != '' ) {
            $sql .= " AND o.id = ".$this->_orderId;
        }

        $sql .= " ORDER BY o.id DESC";

        return $this->rawSYNQuery($sql);
    }

}//End of class