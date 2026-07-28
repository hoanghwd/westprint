<?php
CONST LOGIN_ACTION_MODULES = array(
    array(
        'name'       => 'verify',
        'subFolder'  => '/loginaction/verify',
        'controller' => array('controller' => 'LoginAction\VerifyController', 'method'=>'verifyAction'),
    ),
);