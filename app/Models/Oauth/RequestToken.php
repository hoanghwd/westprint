<?php

namespace App\Models\Oauth;
use App\Models\Base;

class RequestToken extends Base
{
    /**
     * RequestToken constructor.
     */
    function __construct()
    {
        $this->_doRequestToken();
    }

    /**
     * Call token request
     */
    private function _doRequestToken()
    {
        require_once MODELS_DIR.'Oauth/server.php';
        $server->handleTokenRequest(\OAuth2\Request::createFromGlobals())->send("json");
    }

}//End of class