<?php


namespace App\Models\Orders;

use App\Models\Base;
use App\Models\Orders;

class OrderSummary extends Base
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
     * @return array|mixed
     * @throws \Exception
     */
    public function getOrderDetails()
    {
        $orderDetailsHdl = new Orders($this->_request);

        return $orderDetailsHdl->getOrderDetail();
    }

    /**
     * @return mixed
     */
    public function getOrderId()
    {
        return $this->_orderId;
    }

    public function test()
    {
        echo "test";
    }

}//End of class