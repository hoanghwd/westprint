<?php


namespace App\Controllers;


use Symfony\Component\Routing\RouteCollection;

class LoginOutController
{
    function __construct()
    {

    }

    /**
     * @param RouteCollection $routes
     */
    public function loginoutAction(RouteCollection $routes)
    {
        //Destroy all cookies
        $past = time() - 3600;
        foreach ($_COOKIE as $key => $value) {
            if ($key != "adminName") {
                setcookie($key, $value, $past, '/', COOKIE_DOMAIN);
            }
        }

        session_unset();

        header("Location: " . SITE_ROOT . "auth");
    }

}//End of class