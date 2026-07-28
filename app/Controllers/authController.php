<?php


namespace App\Controllers;


use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class authController extends baseController
{
    function __construct() {
        parent::__construct("auth");
    }

    // Homepage action
    public function authAction(RouteCollection $routes)
    {
        $this->render();
    }

}