<?php
namespace App\Controllers\webPortal\api;

use App\Models\ListClients;
use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;


class ListClientsController extends baseController
{
    /**
     * ListClientsController constructor.
     */
    function __construct()
    {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function doListAction(RouteCollection $routes)
    {
        //https://www.huynhdo.us/westprint/webPortal/api/orders?userName=canvasPeople%20&dateFrom=2023-11-8&dateTo=2023-12-8&status=InProgress&locId=&orderId=ValidOrder_1699493123&trackingNumber=&page=0&limit=40&orderBy=orderTime&descAsc=asc
        $request = $this->getRequest()->query->all();
        $listClientsHld = new ListClients($request);
        $data = $listClientsHld->doListClients();

        echo json_encode($data);
    }

}//End of class