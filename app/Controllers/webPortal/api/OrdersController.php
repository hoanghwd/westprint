<?php
namespace App\Controllers\webPortal\api;

use App\Controllers\baseController;
use App\Models\Orders;
use Symfony\Component\Routing\RouteCollection;


class OrdersController extends baseController
{
    /**
     * OrdersController constructor.
     */
    function __construct() {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function OrderAction(RouteCollection $routes)
    {
        //https://www.huynhdo.us/westprint/webPortal/api/orders?userName=canvasPeople%20&dateFrom=2023-11-8&dateTo=2023-12-8&status=InProgress&locId=&orderId=ValidOrder_1699493123&trackingNumber=&page=0&limit=40&orderBy=orderTime&descAsc=asc
        $request = $this->getRequest()->query->all();
        $ordersHdl = new Orders($request);
        $orderArray = $ordersHdl->listOrders();

        echo json_encode(utf8Encode($orderArray));
    }

}//End of class