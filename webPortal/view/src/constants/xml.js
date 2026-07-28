//export const create = "<root><orderRequest><userId>99</userId><apiKey> zz00zz00</apiKey><customerInfo><companyName>ABC</companyName><custLogo>www.abc.com/customLogo.jpg</custLogo><billingIsReturnAddress>Y</billingIsReturnAddress></customerInfo><shippingType>Standard</shippingType><testMode>1</testMode><quoteId>809</quoteId><poNumber>Test123456</poNumber><firstName>John</firstName><lastName>Doe</lastName><company>Bongo</company><address>1234, Fake st</address><address2>Near fake lane</address2><aptNumber>#111</aptNumber><city>SAN JUAN</city><state>PR</state><zip>00926</zip><urbanizationCode>URB LAS GLADIOLAS</urbanizationCode><country>US</country><phoneNumber>987654321</phoneNumber><email>test@test.com</email><services><branding><packingSlip><frontImage>www.abc.com/temp1.jpg</frontImage><backImage> www.abc.com/temp2.jpg </backImage><template>1</template></packingSlip><insertCard><outsideImage> www.abc.com/temp3.jpg </outsideImage><insideImage> www.abc.com/temp4.jpg </insideImage></insertCard><sticker><frontImage> www.abc.com/temp5.jpg </frontImage></sticker></branding></services><orderItems><orderItem><qt>1</qt><code>1234</code><coverSheet><frontImage> www.abc.com/temp.jpg </frontImage></coverSheet><imageLocation>http://www.abc.com/imageBF.jpg</imageLocation><imageLocation>http://www.abc.com/image12.jpg</imageLocation><imageLocation>http://www.abc.com/image34.jpg</imageLocation><imageLocation>http://www.abc.com/image56.jpg</imageLocation><imageLocation>http://www.abc.com/image78.jpg</imageLocation></orderItem><orderItem><qt>2</qt><code>4567</code><imageLocation>http://www.abc.com/image.jpg</imageLocation></orderItem></orderItems></orderRequest></root>";
export const create =
    `<root>
    <orderRequest>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <customerInfo>
            <thirdPartyId>159753</thirdPartyId>
            <billingIsReturnAddress>Y</billingIsReturnAddress>
            <companyName>ABC</companyName>
            <custLogo>www.abc.com/customLogo.jpg</custLogo>
        </customerInfo>
        <shippingType>Basic</shippingType>
        <testMode>1</testMode>
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
        <services>
            <branding>
                <packingSlip>
                    <frontImage>www.abc.com/temp1.jpg</frontImage>
                    <backImage>www.abc.com/temp2.jpg</backImage>
                    <template>1</template>
                </packingSlip>
                <insertCard>
                    <outsideImage>www.abc.com/temp3.jpg</outsideImage>
                    <insideImage>www.abc.com/temp4.jpg</insideImage>
                </insertCard>
                <sticker>
                    <frontImage>www.abc.com/temp5.jpg</frontImage>
                </sticker>
            </branding>
        </services>
        <orderItems>
            <orderItem>
                <qt>1</qt>
                <code>XXXXXX</code>
                <itemNumber>456789</itemNumber>
                <retailPrice>5.25</retailPrice>
                <imageLocation>http://www.abc.com/imageBF.jpg</imageLocation>                
            </orderItem>
            <orderItem>
                <qt>2</qt>
                <code>XXXXXX</code>
                <itemNumber>457896</itemNumber>
                <retailPrice>7</retailPrice>
                <imageLocation>http://www.abc.com/image.jpg</imageLocation>               
            </orderItem>
        </orderItems>
    </orderRequest>
</root>`

//export const cancel = "<root><cancelOrder><userId>99</userId><apiKey> abcd123</apiKey><poNumber>123654789</poNumber></cancelOrder></root>";
export const cancel =
    `<root>
    <cancelOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <poNumber>123654789</poNumber>
    </cancelOrder>
</root>`

export const cancelItem =
    `<root>
    <cancelOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <poNumber>123654789</poNumber>
        <cancelItems>
            <cancelItem>
                <itemNumber>456789</itemNumber>
                <qt>1</qt>
            </cancelItem>
            <cancelItem>
                <itemNumber>457896</itemNumber>
                <qt>2</qt>
            </cancelItem>
        </cancelItems>
    </cancelOrder>
</root>`

export const redo =
    `<root>
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
    <shippingType>Basic</shippingType>
    <poNumber>123654789</poNumber>
    <redoCode>4</redoCode>
    <redoComment>Image was too dark</redoComment>
    <changesRequired>Y</changesRequired>
    <services>
        <branding>
            <packingSlip>
                <frontImage>www.abc.com/temp1.jpg</frontImage>
                <backImage>www.abc.com/temp2.jpg</backImage>
                <template>1</template>
            </packingSlip>
            <insertCard>
                <outsideImage>www.abc.com/temp3.jpg</outsideImage>
                <insideImage>www.abc.com/temp4.jpg</insideImage>
            </insertCard>
            <sticker>
                <frontImage>www.abc.com/temp5.jpg</frontImage>
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
</root>`

export const redoAsIs =
    `<root>
    <redoOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXX</apiKey>
        <poNumber>123654789</poNumber>
        <redoCode>4</redoCode>
        <redoComment>Image was too dark</redoComment>
    </redoOrder>
</root>
`

/////////////////////////

export const redoWithChanges =
    `<root>
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
        <shippingType>Basic</shippingType>
        <poNumber>123654789</poNumber>
        <redoCode>4</redoCode>
        <redoComment>Image was too dark</redoComment>
        <changesRequired>Y</changesRequired>
        <services>
            <branding>
                <packingSlip>
                    <frontImage>www.abc.com/temp1.jpg</frontImage>
                    <backImage>www.abc.com/temp2.jpg</backImage>
                    <template>1</template>
                </packingSlip>
                <insertCard>
                    <outsideImage>www.abc.com/temp3.jpg</outsideImage>
                    <insideImage>www.abc.com/temp4.jpg</insideImage>
                </insertCard>
                <sticker>
                    <frontImage>www.abc.com/temp5.jpg</frontImage>
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
</root>`

//export const createResp = "<root><orderReply><status>1</status><code>130511</code><message>Success!</message><location><city>Halfmoon</city><state>New York</state><country>US</country></location></orderReply></root>";
export const createResp =
    `<root>
    <orderReply>
        <status>1</status>
        <code>130511</code>
        <message>Success!</message>
        <timestamp>2019-08-20T23:29:59Z</timestamp>
        <poNumber>Test123456</poNumber>
        <location>
            <city>Mechanicville</city>
            <zip>12118</zip>
            <state>NY</state>
            <country>US</country>
        </location>
    </orderReply>
</root>`

export const createRespError =
    `<root>
    <orderReply>
        <status>0</status>
        <code>01</code>
        <message>Cannot log in. Invalid user or password.</message>
        <location>
            <city></city>
            <zip></zip>
            <state></state>
            <country></country>
        </location>
    </orderReply>
</root>`

export const cancelResp =
    `<root>
<cancelReply>
    <code>0</code>
    <message>Success!</message>
    <date>2017-03-21T22:09:01Z<date></date></date>
</cancelReply>
</root>`

export const cancelRespBefore =
    `<root>
    <cancelOrderReply>
        <status>1</status>
        <code>0</code>
        <message>Cancelled Before Production Commenced</message>
        <date>2017-03-21T22:09:01Z</date>
    </cancelOrderReply>
</root>`

export const cancelRespAfter =
    `<root>
    <cancelOrderReply>
        <status>1</status>
        <code>0</code>
        <message>Cancelled After Production Commenced</message>
        <date>2017-03-22T22:09:01Z</date>
    </cancelOrderReply>
</root>`

export const cancelRespError =
    `<root>
    <cancelOrderReply>
        <status>0</status>
        <code>202</code>
        <message>Order is Complete! Order cannot be cancelled</message>
        <date>NA</date>
    </cancelOrderReply>
</root>`

export const cancelItemResp =
    `<root>
    <cancelOrderReply>
        <cancelItems>
            <cancelItem>
                <itemNumber>456789</itemNumber>
                <qt>1</qt>
                <status>1</status>
                <code>0</code>
                <message>Cancelled Before Production Commenced</message>
                <date>2017-03-21T22:09:01Z</date>
            </cancelItem>
            <cancelItem>
                <itemNumber>457896</itemNumber>
                <qt>1</qt>
                <status>1</status>
                <code>0</code>
                <message>Cancelled Before Production Commenced</message>
                <date>2017-03-21T22:09:01Z</date>
            </cancelItem>
            <cancelItem>
                <itemNumber>457896</itemNumber>
                <qt>1</qt>
                <status>1</status>
                <code>0</code>
                <message>Cancelled After Production Commenced</message>
                <date>2017-03-21T22:09:01Z</date>
            </cancelItem>
        </cancelItems>
    </cancelOrderReply>
</root>`

export const cancelItemRespError =
    `<root>
    <cancelOrderReply>
        <status>0</status>
        <code>203</code>
        <message>Order is already cancelled</message>
        <date>2017-03-21T22:09:01Z</date>
    </cancelOrderReply>
</root>`

export const cancelItemRespPartial =
    `<root>
    <cancelOrderReply>
        <cancelItems>
            <cancelItem>
                <itemNumber>456789</itemNumber>
                <qt>1</qt>
                <status>1</status>
                <code>0</code>
                <message>Cancelled Before Production Commenced</message>
                <date>2017-03-21T22:09:01Z</date>
            </cancelItem>
            <cancelItem>
                <itemNumber>457006</itemNumber>
                <qt>2</qt>
                <status>0</status>
                <code>204</code>
                <message> Item does not exist </message>
                <date>NA</date>
            </cancelItem>
        </cancelItems>
    </cancelOrderReply>
</root>`

//export const redoResp = "<root><redoOrderReply><status>1</status><code>130511</code><message>Success!</message><location><city>Halfmoon</city><state>New York</state><country>US</country></location></redoorderReply></root>";
export const redoResp =
    `<root>
    <redoOrderReply>
        <status>1</status>
        <code>130511</code>
        <message>Success!</message>
        <location>
            <city>Halfmoon</city>
            <state>New York</state>
            <country>US</country>
        </location>
    </redoOrderReply>
</root>`

export const redoRespError =
    `<root>
    <redoOrderReply>
        <status>0</status>
        <code>01</code>
        <message>Cannot log in. Invalid user or password.</message>
        <location>
            <city></city>
            <state></state>
            <country></country>
        </location>
    </redoOrderReply>
</root>`

export const token = "<response><access_token>9b238596775fe9956f655d24a23693abb10ad411</access_token><expires_in>3600</expires_in><token_type>Bearer</token_type><scope /></response>"

export const statusUpdateAck =
    `<statusResponse>
    <statusCode>1</statusCode>
    <statusMessage>Success</statusMessage>
    <customMessage></customMessage>
</statusResponse>`

export const statusUpdateAckError =
    `<statusResponse>
    <statusCode>0</statusCode>
    <statusMessage>Failure</statusMessage>
    <customMessage>Parsing error</customMessage>
</statusResponse>`

export const statusUpdateItemized =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>
    <carrier>usps</carrier>
    <tracking>12345</tracking>
    <trackingUrl>https://carrierDomain.com/tracking/12345</trackingUrl>
    <carrierSecondary></carrierSecondary>
    <trackingSecondary></trackingSecondary>
    <trackingUrlSecondary></trackingUrlSecondary>    
    <status>Shipped</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>NA</statusMessage>
    <packages>
        <package>
            <carrier>usps</carrier>
            <tracking>12345</tracking>
            <trackingUrl>https://carrierDomain.com/tracking/12345</trackingUrl>
            <trackingSecondary></trackingSecondary>
            <carrierSecondary></carrierSecondary>
            <trackingUrlSecondary></trackingUrlSecondary>
            <items>
                <itemNumber>001</itemNumber>
                <itemNumber>002</itemNumber>
                <itemNumber>003</itemNumber>
            </items>
        </package>
    </packages>
</root>`

export const statusUpdateItemizedCancel =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>    
    <tracking>Cancelled Before Production Commenced</tracking>    
    <status>Cancelled</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>NA</statusMessage>
</root>`

export const statusUpdateItemizedHold =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>    
    <status>On Hold</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>Hold reason</statusMessage>
</root>`

export const statusUpdateItemizeProcessing =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>    
    <status>Processing</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>NA</statusMessage>
</root>`

export const statusUpdateItemizeAccepted =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>    
    <tracking>12345</tracking>    
    <status>Accepted</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>NA</statusMessage>
</root>`

export const statusUpdateItemizeRejected =
    `<root>
    <userId>HIDDEN</userId>
    <apiKey>HIDDEN</apiKey>
    <poNumber>3451049</poNumber>
    <orderId>0000001</orderId>    
    <tracking>12345</tracking>    
    <status>Rejected</status>
    <statusDate>2019-09-18T17:58:50Z</statusDate>
    <statusMessage>Rejected reason</statusMessage>
</root>`

/*
 * Huynh - 08/19/2021
 * https://app.clickup.com/t/9mjank
 * Under public/jondoApi/Update directory
 */

/////--- Update Order -> Shipping type --- /////

export const shippingType =
    `<root>
   <updateOrder>
      <userId>XXX</userId>
      <apiKey>XXXXXXXXXX</apiKey>      
      <orderId>12491092</orderId>
      <shippingType>Premium</shippingType>
   </updateOrder>
</root>
`

export const shippingTypeResp =
    `<root>
    <updateReply>
        <status>1</status>
        <code>Order_ID</code>
        <message>Success!</message>
        <timestamp>TIMESTAMP</timestamp>        
    </updateReply>
</root>
`

export const shippingTypeRespError =
    `<root>
    <updateReply>
        <status>0</status>
        <code>ERROR_CODE</code>
        <message>ERROR_MESSAGE</message>
        <timestamp>TIMESTAMP</timestamp>        
    </updateReply>
</root>
`

/////--- Update Order -> Shipping Address --- /////

export const updateAddress =
    `<root>
   <updateOrder>
        <userId>XXX</userId>
        <apiKey>XXXXXXXXXX</apiKey>
        <orderId>12545366</orderId>
        <firstName>John</firstName>
        <lastName>Doe</lastName>
        <company>Bongo</company>
        <address>1234, Fake st</address>
        <address2>Near fake lane</address2>
        <aptNumber>#111</aptNumber>        
        <city>Long Beach</city>
        <state>CA</state>
        <zip>90815</zip>
        <urbanizationCode/>
        <country>US</country>
        <phoneNumber>5627898767</phoneNumber>
   </updateOrder>
</root>
`

export const updateAddressResp =
    `<root>
     <updateReply>
        <status>1</status>
        <code>Order_ID</code>
        <message>Success!</message>
        <timestamp>TIMESTAMP</timestamp>        
    </updateReply>
</root>
`

export const updateAddressRespError =
    `<root>
    <updateReply>
        <status>0</status>        
        <code>ERROR_CODE</code>        
        <message>ERROR_MESSAGE</message>
        <timestamp>TIMESTAMP</timestamp>        
    </updateReply>
</root>
`