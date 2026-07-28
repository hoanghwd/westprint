<?php


namespace App\Models;
use App\Models\Base;


class Login extends Base
{

    public function login($request)
    {
        /**
         * Incoming request
         * array(4) { ["userName"]=> string(3) "hdo" ["password"]=> string(15) "1234" ["rememberMe"]=> bool(false) ["recaptchaToken"]=> string(0) "" }
         */
        $userHdl = new User($request);
        return $userHdl->getLoginData();
    }

    /**
     * @param $loginAs
     * @return \string[][]
     */
    public function loginAs($loginAs)
    {
        $decodeJWT = $this->validateJWT();
        if ($decodeJWT["response"]) {
            $request = array("userName" => $loginAs, 'requirePassword' => false);
            return $this->login($request);
        }

        return array( "error" => array("text" => "Wrong username or password.") );
    }


}//End of class