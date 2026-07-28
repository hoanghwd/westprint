<?php


namespace App\Controllers\Cron;
use App\Controllers\baseController;
use App\Models\Orders\OrderTransfer;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;


class OrderTransferController extends baseController
{
    /**
     * OrderTransferController constructor.
     */
    function __construct()
    {

    }

    public function ordertransferAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $orderTransferHdl = new OrderTransfer($request);

    }

}//End of class