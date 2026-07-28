<?php
CONST WEB_PORTAL_MODULES = array(
    //webportal_api_login
    array(
        'name'       => 'webportal_api_login',
        'subFolder'  => '/webPortal/api/login',
        'controller' => array('controller' => 'webPortal\api\LoginController', 'method'=>'loginAction')
    ),
    //webportal_api_listclients
    array(
        'name'       => 'webportal_api_listclients',
        'subFolder'  => '/webPortal/api/listclients',
        'controller' => array('controller' => 'webPortal\api\ListClientsController', 'method'=>'doListAction')
    ),
    //webportal_api_updateclientportalstatuses
    array(
        'name'       => 'webportal_api_updateclientportalstatuses',
        'subFolder'  => '/webPortal/api/updateclientportalstatuses',
        'controller' => array('controller' => 'webPortal\api\UpdateClientPortalStatusesController', 'method'=>'doUpdateStatusesAction')
    ),
    //webportal_api_orders
    array(
        'name'       => 'webportal_api_orders',
        'subFolder'  => '/webPortal/api/orders',
        'controller' => array('controller' => 'webPortal\api\OrdersController', 'method'=>'OrderAction')
    ),
    //webportal_api_orderdetails
    array(
        'name'       => 'webportal_api_orderdetails',
        'subFolder'  => '/webPortal/api/orderdetails',
        'controller' => array('controller' => 'webPortal\api\OrderDetailsController', 'method'=>'OrderDetailsAction')
    ),
    //webportal_api_loginas
    array(
        'name'       => 'webportal_api_loginas',
        'subFolder'  => '/webPortal/api/loginas',
        'controller' => array('controller' => 'webPortal\api\LoginAsController', 'method'=>'LoginAsAction')
    ),
    //webportal_api_updateaddress
    array(
        'name'       => 'webportal_api_updateaddress',
        'subFolder'  => '/webPortal/api/updateaddress',
        'controller' => array('controller' => 'webPortal\api\UpdateAddressController', 'method'=>'UpdateAddressAction')
    ),
    //webportal_api_getsamplecode
    array(
        'name'       => 'webportal_api_getsamplecode',
        'subFolder'  => '/webPortal/api/getSampleCode',
        'controller' => array('controller' => 'webPortal\api\GetSampleCodeController', 'method'=>'GetSampleCodeAction')
    ),
    //webportal_api_getsampletemplate
    array(
        'name'       => 'webportal_api_getsampletemplate',
        'subFolder'  => '/webPortal/api/getSampleTemplate',
        'controller' => array('controller' => 'webPortal\api\GetSampleTemplateController', 'method'=>'GetSampleTemplateAction')
    )
);
