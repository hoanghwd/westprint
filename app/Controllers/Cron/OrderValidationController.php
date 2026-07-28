<?php


namespace App\Controllers\Cron;
use App\Controllers\baseController;
use App\Models\Orders\OrderValidation;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class OrderValidationController extends baseController
{
    function __construct() {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function ordervalidationAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $orderValidationHdl = new OrderValidation($request);
        $data = $orderValidationHdl->validateOrder();

        echo json_encode($data);
    }

}//End of class