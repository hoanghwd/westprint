<?php

/***************************************** Cancel Order Sample Code **************************************************

// This is a Sample code to DELETE data to Jondo API for cancel order.

(C) 2019 Jondo, Ltd.

*************************************************************************************************************************/

// url to cancel order
$url = "https://jondohd.com/jondoApi/cancel/cancelOrder";
// token generated
$token = "YOURTOKEN";
// xml request
$xml = "
<root>
    <cancelOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <poNumber>123654789</poNumber>
    </cancelOrder>
</root>"; 

// Initialize CURL	
$ch = curl_init();
// Set options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$token));
// execute and get results
$output = curl_exec($ch);
// close curl resource to free up system resources
curl_close($ch);

// Display response
echo $output;

?>

