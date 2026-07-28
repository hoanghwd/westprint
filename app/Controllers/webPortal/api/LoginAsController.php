<?php

namespace App\Controllers\webPortal\api;

use App\Controllers\baseController;
use App\Models\Login;
use Symfony\Component\Routing\RouteCollection;

class LoginAsController extends baseController
{
    function __construct() {

    }

    /**
     * @param RouteCollection $routes
     */
    public function LoginAsAction(RouteCollection $routes)
    {
        $request = $this->getInputRequest();
        $loginAs = trim($request['loginAs']);
        $loginHdl = new Login();
        $results = $loginHdl->loginAs($loginAs);

        if( isset($results["error"]) ) {
            $results = array(
                "error" => array("text" => "Wrong username or password.")
            );
        }

        echo json_encode($results);
    }

}//End of class