<?php


namespace App\Controllers\webPortal\api;
use App\Models\Orders;
use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;

class OrderDetailsController extends baseController
{
    /**
     * OrderDetailsController constructor.
     */
    function __construct()
    {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function OrderDetailsAction(RouteCollection $routes)
    {
        //https://www.huynhdo.us/westprint/webPortal/api/orderdetails?userName=canvasPeople&orderId=15588727
        /**
        incoming request:
        array(3) {
        ["route"]=>
        string(26) "webPortal/api/orderdetails"
        ["userName"]=>
        string(12) "canvasPeople"
        ["orderId"]=>
        string(8) "16562317"
        }
         */
        $request = $this->getRequest()->query->all();
        $orderHdl = new Orders($request);
        $data = $orderHdl->getOrderDetail();

        if( is_array($data) && sizeof($data) > 0 ) {
            echo json_encode($data);
        }
        else {
            echo '{"error":{"text":"Order NOT Found!"}}';
        }
    }


}//End of class