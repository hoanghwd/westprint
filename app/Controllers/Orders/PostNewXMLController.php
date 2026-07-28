<?php

namespace App\Controllers\Orders;
use App\Controllers\baseController;
use Symfony\Component\Routing\RouteCollection;

class PostNewXMLController extends baseController
{
    /**
     * PostNewXMLController constructor.
     */
    function __construct()
    {
        parent::__construct("orders/postnewxml");
    }

    /**
     * @param RouteCollection $routes
     */
    public function postnewxmlAction(RouteCollection $routes)
    {
        $this->render('',true,true);
    }

}//End of class