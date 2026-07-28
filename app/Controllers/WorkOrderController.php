<?php
namespace App\Controllers;

use App\Models\WorkOrder;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;


class WorkOrderController extends baseController
{
    /**
     * WorkOrderController constructor.
     */
    function __construct() {
        parent::__construct("workorder");
    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function workorderAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $workOrderHdl = new WorkOrder($request);

        $this->render($workOrderHdl);
    }

}//End of class