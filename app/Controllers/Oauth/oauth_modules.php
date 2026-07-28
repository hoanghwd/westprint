<?php
CONST OAUTH_MODULES = array(
    //oauth_requesttoken
    array(
        'name'       => 'oauth_requesttoken',
        'subFolder'  => '/oauth/requesttoken',
        'controller' => array('controller' => 'Oauth\RequestTokenController', 'method'=>'requesttokenAction'),
    ),
    //oauth_tokenresponse
    array(
        'name'       => 'oauth_tokenresponse',
        'subFolder'  => '/oauth/tokenresponse',
        'controller' => array('controller' => 'Oauth\TokenResponseController', 'method'=>'tokenresponseAction'),
    ),
);
