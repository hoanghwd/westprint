<?php

namespace App\Controllers;

use App\Models\Login;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class IndexController extends baseController
{
    function __construct() {
        parent::__construct("home");
    }

    // Homepage action
    public function indexAction(RouteCollection $routes)
    {
        $this->render();
    }
}