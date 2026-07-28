<?php
CONST PARENT_MODULES = array(
    //Home page
    array(
        'name'       => 'index',
        'subFolder'  =>  '/',
        'controller' => array('controller' => 'IndexController', 'method'=>'indexAction'),
    ),
    //Test
    array(
        'name'       => 'test',
        'subFolder'  => '/test',
        'controller' => array('controller' => 'TestController', 'method'=>'testAction'),
    ),
    //Auth
    array(
        'name'       => 'auth',
        'subFolder'  => '/auth',
        'controller' => array('controller' => 'authController', 'method'=>'authAction'),
    ),
    //Work Order
    array(
        'name'       => 'hd_workorder',
        'subFolder'  => '/workorder',
        'controller' => array('controller' => 'WorkOrderController', 'method'=>'workorderAction'),
    ),
    //Log out
    array(
        'name'       => 'loginout',
        'subFolder'  => '/logout',
        'controller' => array('controller' => 'LoginOutController', 'method'=>'loginoutAction'),
    ),
    //Search
    array(
        'name'       => 'search',
        'subFolder'  => '/search',
        'controller' => array('controller' => 'SearchController', 'method'=>'searchAction'),
    ),
    //Login API Portal
    array(
        'name'       => 'login_api_portal',
        'subFolder'  => '/loginapiportal',
        'controller' => array('controller' => 'LoginAPIController', 'method'=>'loginapiAction'),
    )
);