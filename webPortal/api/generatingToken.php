<?php

/***************************************** Generating Token Sample Code **************************************************

// This is a Sample code to POST data to Jondo API for requesting the access token.

Note: This token can be reused for creating orders, cancelling orders, resubmitting orders until the token is active.
You will need to regenerate the token after it gets expired.

(C) 2019 Jondo, Ltd.

*************************************************************************************************************************/

// url to request token
$url = "https://jondohd.com/jondoApi/oauth/requestToken";
// userID
$userId = "yourUserId";
// apiKey
$apiKey = "yourApiKey";

// Initialize CURL
$ch = curl_init();
// Set options
curl_setopt($ch, CURLOPT_URL, $url );
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,  "grant_type=client_credentials");
curl_setopt($ch, CURLOPT_USERPWD, $userId.":".$apiKey); 
// execute and get results
$output = curl_exec($ch);
// close curl resource to free up system resources
curl_close($ch);

// Display response
echo $output; 

?>