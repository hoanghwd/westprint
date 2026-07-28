<?php

/***************************************** Redo Order Sample Code **************************************************

// This is a Sample code to POST data to Jondo API for redo order.

(C) 2019 Jondo, Ltd.

*************************************************************************************************************************/

// url to redo order
$url = "https://jondohd.com/jondoApi/redo/redoOrder";
// token generated
$token = "YOURTOKEN";
// xml request
$xml = "
<root>
    <redoOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <firstName>John</firstName>
        <lastName>Doe</lastName>
        <address>5050 E Garford St</address>
        <address2></address2>
        <aptNumber>#1</aptNumber>
        <city>Long Beach</city>
        <state>CA</state>
        <zip>90815</zip>
        <country>US</country>
        <email>abc@xyz.com</email>
        <phoneNumber>0123456789</phoneNumber>
        <poNumber>123654789</poNumber>
        <redoCode>4</redoCode>
        <redoComment>Image was too dark</redoComment>
        <changesRequired>Y</changesRequired>
        <orderReference>orderNum_1234</orderReference>
        <footerText>Footer text description</footerText>
        <services>
            <branding>
                <insertCard>
                    <outsideImage>www.abc.com/temp3.jpg</outsideImage>
                    <insideImage>www.abc.com/temp4.jpg</insideImage>
                </insertCard>
                <sticker>
                    <frontImage> www.abc.com/temp5.jpg </frontImage>
                </sticker>
            </branding>
        </services>
        <orderItems>            
            <orderItem>
                <qt>1</qt>
                <code>XXXXXX</code>
                <imageLocation>http://www.abc.com/imageBF.jpg</imageLocation>
            </orderItem>
            <orderItem>
                <qt>2</qt>
                <code>XXXXXX</code>
                <imageLocation>http://www.abc.com/image.jpg</imageLocation>
            </orderItem>
        </orderItems>
    </redoOrder>
</root>"; 

// Initialize CURL	
$ch = curl_init();
// Set options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $xml); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$token));
// execute and get results
$output = curl_exec($ch);
// close curl resource to free up system resources
curl_close($ch);

// Display response
echo $output;

?>

