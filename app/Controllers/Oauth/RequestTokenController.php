<?php


namespace App\Controllers\Oauth;
use App\Controllers\baseController;
use App\Models\Oauth\RequestToken;
use Symfony\Component\Routing\RouteCollection;

class RequestTokenController extends baseController
{
    /**
     * RequestTokenController constructor.
     */
    function __construct()
    {
        parent::__construct("oauth/requesttoken");
    }

    /**
     * @param RouteCollection $routes
     */
    public function requesttokenAction(RouteCollection $routes)
    {
        $this->render('',true,true);
    }

}//End of class