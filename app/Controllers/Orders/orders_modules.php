<?php
CONST ORDERS_MODULES = array(
    //orders_postnewxml
    array(
        'name'       => 'orders_postnewxml',
        'subFolder'  => '/orders/postnewxml',
        'controller' => array('controller' => 'Orders\PostNewXMLController', 'method'=>'postnewxmlAction'),
    ),
    //orders_createnew
    array(
        'name'       => 'orders_createnew',
        'subFolder'  => '/orders/createnew',
        'controller' => array('controller' => 'Orders\CreateNewController', 'method'=>'createnewAction'),
    ),
    //orders_receipt
    array(
        'name'       => 'orders_receipt',
        'subFolder'  => '/orders/receipt',
        'controller' => array('controller' => 'Orders\ReceiptController', 'method'=>'receiptAction'),
    ),
);
