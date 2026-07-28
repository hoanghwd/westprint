<?php


namespace App\Controllers\Orders;
use App\Controllers\baseController;
use App\Models\Orders\OrderSummary;
use Symfony\Component\Routing\RouteCollection;

class ReceiptController extends baseController
{
    /**
     * PostNewXMLController constructor.
     */
    function __construct()
    {
        parent::__construct("orders/receipt");
    }

    /**
     * @param RouteCollection $routes
     */
    public function receiptAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $orderSummaryHdl = new OrderSummary($request);

        $this->render($orderSummaryHdl,true,true);
    }

}//End of class