<?php 

use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;

$routeMaster = array_merge(
    PARENT_MODULES, CRON_MODULES, ORDERS_MODULES,
    WEB_PORTAL_MODULES, AJAX_MODULES, LOGIN_ACTION_MODULES, OAUTH_MODULES);

//Adding routes
$routes = new RouteCollection();
foreach($routeMaster AS $routeMember)  {
    $routes->add(
        $routeMember['name'],
        new Route(
            URL_SUBFOLDER . $routeMember['subFolder'],
            $routeMember['controller']
        )
    );
}//foreach