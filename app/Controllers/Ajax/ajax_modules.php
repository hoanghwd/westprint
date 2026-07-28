<?php
CONST AJAX_MODULES = array(
    //Ajax/search
    array(
        'name'       => 'ajax_search',
        'subFolder'  => '/ajax/search',
        'controller' => array('controller' => 'Ajax\SearchController', 'method'=>'searchAction'),
    ),
    //Ajax/workorder/itemholding
    array(
        'name'       => 'ajax_workorder_itemholding',
        'subFolder'  => '/ajax/workorder/itemholding',
        'controller' => array('controller' => 'Ajax\workorder\ItemHoldingController', 'method'=>'itemholdingAction'),
    ),
);