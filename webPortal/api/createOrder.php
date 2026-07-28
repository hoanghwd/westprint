<?php

/***************************************** Create Order Token Sample Code **************************************************

// This is a Sample code to POST data to Jondo API for create order.

(C) 2019 Jondo, Ltd.

*************************************************************************************************************************/

// url to create order
$url = "https://jondohd.com/jondoApi/create/createOrder";
// token generated
$token = "YOURTOKEN";
// xml request
$xml = "
<root>
    <orderRequest>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <customerInfo>
            <companyName>ABC</companyName>
            <custLogo>www.abc.com/customLogo.jpg</custLogo>
            <billingIsReturnAddress>Y</billingIsReturnAddress>
        </customerInfo>
        <shippingType>Basic</shippingType>
        <testMode>1</testMode>
        <quoteId>809</quoteId>
        <poNumber>Test123456</poNumber>
        <firstName>John</firstName>
        <lastName>Doe</lastName>
        <company>Bongo</company>
        <address>1234, Fake st</address>
        <address2>Near fake lane</address2>
        <aptNumber>#111</aptNumber>
        <city>SAN JUAN</city>
        <state>PR</state>
        <zip>00926</zip>
        <urbanizationCode>URB LAS GLADIOLAS</urbanizationCode>
        <country>US</country>
        <phoneNumber>987654321</phoneNumber>
        <email>test@test.com</email>
        <statusUrl>https://your_status_url.com/example/your-status-notification</statusUrl>
        <orderReference>orderNum_1234</orderReference>
        <footerText>Footer text description</footerText>
        <services>
            <branding>
                <insertCard>
                    <outsideImage> www.abc.com/temp3.jpg </outsideImage>
                    <insideImage> www.abc.com/temp4.jpg </insideImage>
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
                <itemNumber>456789</itemNumber>
                <itemDescription>Description of item</itemDescription>
                <retailPrice>5.25</retailPrice>
                <imageLocation>http://www.abc.com/imageBF.jpg</imageLocation>
            </orderItem>
            <orderItem>
                <qt>2</qt>
                <code>XXXXXX</code>
                <itemNumber>457896</itemNumber>
                <itemDescription>Description of item</itemDescription>
                <retailPrice>7</retailPrice>
                <imageLocation>http://www.abc.com/image.jpg</imageLocation>
            </orderItem>
        </orderItems>
    </orderRequest>
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

