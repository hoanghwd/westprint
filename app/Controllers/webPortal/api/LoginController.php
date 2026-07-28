<?php
namespace App\Controllers\webPortal\api;

use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;
use App\Models\LoginAction\Verify;


class LoginController extends baseController
{
    /**
     * VerifyController constructor.
     */
    function __construct() {
        parent::__construct("loginaction/verify");
    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function loginAction(RouteCollection $routes)
    {
        $requestArray = $this->getInputRequest();

        /**
         * Login verify Model
         */
        $verifyHdl = new Verify($requestArray);
        $isConfirmed = $verifyHdl->doVerifyUserCredentials();

        if( $isConfirmed ) {
            $data = $verifyHdl->doLogin();
            echo json_encode($data);
        }
        else {
            echo '{"error":{"text":"Wrong user or password."}}';
        }
    }

}//End of class