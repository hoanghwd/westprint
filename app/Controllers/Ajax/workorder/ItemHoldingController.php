<?php


namespace App\Controllers\Ajax\workorder;

use App\Controllers\baseController;
use App\Models\Orders\ItemHolding;
use Symfony\Component\Routing\RouteCollection;

class ItemHoldingController extends baseController
{
    function __construct() {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function itemholdingAction(RouteCollection $routes)
    {
        /**
         *  _DEBUG
        array(8) {
            ["itemId"]=>
            string(9) "191320031"
            ["order"]=>
            string(9) "128978331"
            ["unhold"]=>
            string(1) "1"
            ["reasonGroup"]=>
            string(4) "None"
            ["reasonType"]=>
            string(0) ""
            ["reason"]=>
            string(4) "TEST"
            ["resetSLA"]=>
            string(1) "0"
        }
        */
        $request = $this->getHttpRequest();
        $itemHoldingHdl = new ItemHolding($request);

        $results = $itemHoldingHdl->getData();

        echo json_encode($results);
    }
}