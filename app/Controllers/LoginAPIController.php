<?php


namespace App\Controllers;


use App\Models\LoginAPI;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class LoginAPIController extends baseController
{
    /**
     * ProductController constructor.
     */
    function __construct() {
        parent::__construct("loginapi");
    }

    /**
     * @param RouteCollection $routes
     */
    public function loginapiAction(RouteCollection $routes)
    {
        $loginAPIHdl = new LoginAPI();
        $this->render($loginAPIHdl, FALSE, FALSE);
    }

}//End of class