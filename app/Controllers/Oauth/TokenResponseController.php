<?php
namespace App\Controllers\Oauth;

use App\Controllers\baseController;
use App\Models\Oauth\RequestToken;
use Symfony\Component\Routing\RouteCollection;

class TokenResponseController extends baseController
{
    /**
     * TokenResponseController constructor.
     */
    function __construct() {
        //Nothing here
    }
    /**
     * @param RouteCollection $routes
     */
    public function tokenresponseAction(RouteCollection $routes)
    {
        new RequestToken();
    }

}//End of class