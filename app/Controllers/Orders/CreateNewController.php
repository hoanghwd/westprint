<?php


namespace App\Controllers\Orders;

use App\Controllers\baseController;
use App\Models\Orders\CreateNew;
use Symfony\Component\Routing\RouteCollection;


class CreateNewController extends baseController
{
    /**
     * CreateNewController constructor.
     */
    function __construct() {

    }

    /**
     * @param RouteCollection $routes
     */
    public function createnewAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $createNewOrderHdl = new CreateNew($request);
        $results = $createNewOrderHdl->createNewOrder();

        echo json_encode($results);
    }

}//End of class