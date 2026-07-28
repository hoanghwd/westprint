<?php

/***************************************** Receive Status Update Sample Code **************************************************

// This is a Sample code for receive status updates.

(C) 2019 Jondo, Ltd.

*************************************************************************************************************************/

// Get Payload
$postBody = file_get_contents('php://input');
// Parse Payload
$payload = simplexml_load_string($postBody);

// Display response
print_r($payload);

?>