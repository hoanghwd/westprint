<?php
CONST CRON_MODULES =
    array(
        array(
            'name' => 'cron_masterscheduler',
            'subFolder' => '/cron/masterscheduler',
            'controller' => array('controller' => 'Cron\MasterSchedulerController', 'method' => 'masterschedulerAction'),
        ),
        array(
            'name' => 'cron_imagevalidation',
            'subFolder' => '/cron/imagevalidation',
            'controller' => array('controller' => 'Cron\ImageValidationController', 'method' => 'imagevalidationAction'),
        ),
        array(
            'name' => 'cron_ordervalidation',
            'subFolder' => '/cron/ordervalidation',
            'controller' => array('controller' => 'Cron\OrderValidationController', 'method' => 'ordervalidationAction'),
        ),
         array(
             'name' => 'cron_ordertransfer',
             'subFolder' => '/cron/ordertransfer',
             'controller' => array('controller' => 'Cron\OrderTransferController', 'method' => 'ordertransferAction'),
         )
);