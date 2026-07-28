<?php

namespace App\Models\LoginAction;
use App\Models\Base;
use App\Models\User;

class Verify extends Base
{
    private $_request;
    CONST MAX_LOGIN_FAILED = 4;

    /**
     * Verify constructor.
     * @param $request
     */
    function __construct($request) {
        $this->_request = $request;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function doVerifyUserCredentials()
    {
        $userHdl = new User($this->_request);
        $success = $userHdl->verifyRequestLogin();
        $url = SITE_ROOT;

        if( $success ) {
            $this->_doRegisterUserSession();
            $userHdl->setLoginAttempt(TRUE);
        }
        //Start recording login attempts if failed
        else {
            $_SESSION['loginSuccess'] = FALSE;

            //Start recording login attempts
            $totalAttempts = $userHdl->getLoginAttempts();

            if( $totalAttempts >= self::MAX_LOGIN_FAILED ) {
                session_unset();
                $_SESSION['maxLoginAttemptsMsg'] =
                    "* There have been more than ". self::MAX_LOGIN_FAILED . " failed login attempts for this account. Please contact administrator.";
            }
            else {
                $userHdl->setLoginAttempt();
            }

            $url =  SITE_ROOT . "auth";
        }

        return $url;
    }

    /**
     * Do register user session
     */
    private function _doRegisterUserSession()
    {
        session_unset();

        $loginData = $this->doLogin();
        $jwt = $loginData['jwt'];
        $userInfoJWT = $this->decodeJWT($jwt);
        $userInfo = $userInfoJWT['payload'];

        $userName = $this->_request['userName'];
        $_SESSION['loginSuccess'] = TRUE;
        $_SESSION["UA"] = md5($_SERVER['HTTP_USER_AGENT'] . "x32in9*3");
        $_SESSION["IP"] = requestIp();
        $_SESSION['userName'] = $userName;
        $_SESSION['userFullName'] = trim($userInfo->firstName) . " " . trim($userInfo->lastName);
        setcookie("jwt", $jwt, time() + SECS_DAY, "/", COOKIE_DOMAIN);
        //For API portal
        if( isset($_COOKIE['adminName']) ) {
            unset($_COOKIE['adminName']);
        }
        setcookie("adminName", $userName, time() + SECS_DAY, "/", COOKIE_DOMAIN);

        if( isset($_SESSION['maxLoginAttemptsMsg']) ) {
            unset( $_SESSION['maxLoginAttemptsMsg'] );
        }
    }

    /**
     * @throws \Exception
     */
    public function doLogin()
    {
        $userHdl = new User($this->_request);

        return $userHdl->getLoginData();
    }

}//End of class