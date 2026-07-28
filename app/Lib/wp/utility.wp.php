<?php

/**
 * @param $myVar
 * @param string $title
 */
function myVarDump($myVar, $title = '')
{
    echo "<br/>";
    echo $title . "<br/>";
    var_dump($myVar);
    echo "<br/>";
}

/**
 * Since php8.2 deprecated utf8_encode
 * @param string $s
 * @return string
 */
function iso8859_1_to_utf8(string $s): string
{
    $s .= $s;
    $len = strlen($s);

    for ($i = $len >> 1, $j = 0; $i < $len; ++$i, ++$j) {
        switch (true) {
            case $s[$i] < "\x80":
                $s[$j] = $s[$i];
                break;
            case $s[$i] < "\xC0":
                $s[$j] = "\xC2";
                $s[++$j] = $s[$i];
                break;
            default:
                $s[$j] = "\xC3";
                $s[++$j] = \chr(\ord($s[$i]) - 64);
                break;
        }
    }

    return substr($s, 0, $j);
}

/**
 * @param $d
 * @return array|mixed
 */
function utf8Encode($d)
{
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8Encode($v);
        }
    }
    else if (is_string($d)) {
        return iso8859_1_to_utf8($d);
    }

    return $d;
}

/**
 * @param $date
 * @return int
 * @throws Exception
 */
function add24HoursToDate($date)
{
    $addTo = new DateTime($date);
    $addTo->add(new DateInterval(TIME_INTERVAL));

    return $addTo->getTimestamp();
}

/**
 * @param $unixTime
 * @return false|string
 */
function convertUnixTimeToISO_8061($unixTime)
{
    return gmdate('Y-m-d\TH:i:s\Z', $unixTime);
}

/**
 * @param $datetime
 * @param $daysToAdd
 * @return false|int
 */
function addWorkingDays($datetime, $daysToAdd)
{
    $i = 1;
    while ($i <= $daysToAdd) {
        $next_day = date('N', strtotime('+1 day', $datetime));
        if ($next_day == 6 || $next_day == 7) {
            $datetime = strtotime('+1 day', $datetime);
            continue;
        }
        $datetime = strtotime('+1 day', $datetime);
        $i++;
    }

    return $datetime;
}

/**
 * @return false|string
 */
function friendlyDateNow()
{
    $reqTime = time();
    //Format a PHP date
    return date("Y-m-d H:i:s", $reqTime);
}

/**
 * @param $myDate
 * @return string
 */
function unixToReadableDate($myDate)
{
    if ($myDate == '' || $myDate == 0) {
        return "NA";
    }

    return date("Y-m-d h:i:s A", $myDate) . " (PT)";
}

/**
 * @param $s
 * @return string|string[]
 */
function removeSpecialChars($s)
{
    $unwanted_array = array('Š', 'š', 'Ž', 'ž', 'À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ', 'Ç', 'È', 'É',
        'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù',
        'Ú', 'Û', 'Ü', 'Ý', 'Þ', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ç',
        'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ð', 'ñ', 'ò', 'ó', 'ô', 'õ',
        'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'þ', 'ÿ', '#', '"', "'", ".", "£", "&");

    $wanted_array = array('S', 's', 'Z', 'z', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'C', 'E', 'E',
        'E', 'E', 'I', 'I', 'I', 'I', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U',
        'U', 'U', 'U', 'Y', 'B', 'Ss', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'c',
        'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'o', 'n', 'o', 'o', 'o', 'o',
        'o', 'o', 'u', 'u', 'u', 'u', 'y', 'b', 'y', '', '', "", "", "", "and");

    return str_replace($unwanted_array, $wanted_array, $s);
}

/**
 * @param $url
 * @return bool
 */
function urlExist($url)
{
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_NOBODY, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 0);
    curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return ($code == 200);
}

/**
 * @param $carrier
 * @param $countryCode
 * @param $trackingNumber
 * @param null $shippingMethod
 * @return string
 */
function getTrackingURL($carrier, $countryCode, $trackingNumber, $shippingMethod = null)
{
    if ($carrier == "USPS") {
        return "https://tools.usps.com/go/TrackConfirmAction_input?strOrigTrackNum=$trackingNumber";
    }
    else if (strtolower($carrier) == "fedex" || strtolower(str_replace(" ", "", $carrier)) == "fedexfreight") {
        return "https://www.fedex.com/apps/fedextrack/?action=track&tracknumbers=$trackingNumber&language=english&clienttype=pluginre&cntry_code=$countryCode";
    }
    else if ($carrier == "UPS") {
        return "https://www.ups.com/track?loc=en_US&tracknum=$trackingNumber&requester=WT/trackdetails";
    }
    else if ($carrier == "DHL") {
        if ($countryCode != 'ES' && $countryCode != 'AU') {
            return "https://webtrack.dhlglobalmail.com/?trackingnumber=$trackingNumber";
        }
        else {
            return "https://www.dhl.com/en/express/tracking.html?AWB=$trackingNumber&brand=DHL";
        }
    }
    else if (strtolower(str_replace(" ", "", $carrier)) == "canadapost") {
        return "https://www.canadapost.ca/trackweb/en#/search?searchFor=$trackingNumber";
    }
    else if (strtolower(str_replace(" ", "", $carrier)) == "australiapost") {
        return "https://auspost.com.au/mypost/track/#/details/$trackingNumber";
    }
    else if (strtolower($carrier) == "interparcel") {
        return "https://au.interparcel.com/tracking/$trackingNumber";
    }
    else if ($carrier == "Fastway") {
        return "https://www.fastway.com.au/tools/track?l=$trackingNumber";
    }
    else if (strtolower(str_replace(" ", "", $carrier)) == "royalmail") {
        return "https://www.royalmail.com/portal/rm/track?trackNumber=$trackingNumber";
    }
    else if ($carrier == "Spring Tracked" or $carrier == "Spring") {
        return "https://mailingtechnology.com/tracking/?tn=$trackingNumber";
    }
    else if (strtolower($carrier) == 'gls') {
        return "https://www.gso.com/Trackshipment?TrackingNumbers=$trackingNumber";
    }
    else if (strtolower(str_replace(" ", "", $carrier)) == 'lasership') {
        return "https://www.lasership.com/track/$trackingNumber";
    }
    else if (strtolower(str_replace(" ", "", $carrier)) == "asendia") {
        return "https://app.shippingchimp.com/tracking/trackingdetails/$trackingNumber";
    }
    else if (strtolower($carrier) == "lso") {
        return "https://www.lso.com/tracking?airbillnos=" . $trackingNumber;
    }
    elseif (strtolower($carrier) == "dpd") {
        return "https://www.dpdgroup.com/nl/mydpd/my-parcels/incoming?parcelNumber=" . $trackingNumber;
    }
}

/**
 * @param $price
 * @return string
 */
function moneyFormat($price)
{
    $price = ($price == "") ? 0 : $price;
    $price = number_format($price, 2, '.', '');

    return $price;
}

/**
 * @param $address
 * @return bool
 */
function isPoBoxAddress($address)
{
    $ar = explode(" ", strtolower(trim($address)));

    if (
        in_array("po", $ar) || in_array("pobox", $ar) || in_array("po#", $ar) ||
        in_array("p.o.", $ar) || in_array("p.o", $ar) || in_array("apo", $ar) ||
        in_array("dpo", $ar) || in_array("fpo", $ar)
    ) {
        return true;
    }

    return false;
}

/**
 * @param $simpleXMLElement
 * @return false|string
 */
function formatXml($simpleXMLElement)
{
    $xmlDocument = new DOMDocument('1.0');
    $xmlDocument->preserveWhiteSpace = false;
    $xmlDocument->formatOutput = true;
    $xmlDocument->loadXML($simpleXMLElement->asXML());

    return $xmlDocument->saveXML();
}

/**
 * @return mixed
 */
function requestIp()
{
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else if (!empty($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    else {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    }

    return $ip;
}

/**
 * @param $xmlContent
 * @param string $version
 * @param string $encoding
 * @return bool
 */
function isXMLContentValid($xmlContent, $version = '1.0', $encoding = 'utf-8')
{
    if (trim($xmlContent) == '') {
        return false;
    }

    libxml_use_internal_errors(true);

    $doc = new DOMDocument($version, $encoding);
    $doc->loadXML($xmlContent);

    $errors = libxml_get_errors();
    libxml_clear_errors();

    return empty($errors);
}

/**
 * @param $myXMLString
 * @return string
 */
function friendlyXmlToBrowser($myXMLString)
{
    $validXMLObjet = false;
    $xml = '';

    if ($myXMLString instanceof SimpleXMLElement) {
        $xml = $myXMLString;
        $validXMLObjet = true;
    }
    else {
        if (isXMLContentValid($myXMLString)) {
            $xml = simplexml_load_string($myXMLString);
            $validXMLObjet = true;
        }
    }

    if ($validXMLObjet) {
        //Do nothing for now
    }
    else {
        $timestamp = convertUnixTimeToISO_8061(time());
        $myXMLString =
            "<?xml version='1.0'?>
                <root>
                    <orderReply>
                        <status>0</status>
                        <code>0</code>
                        <message>Invalid result XML data</message>
                        <timestamp>" . $timestamp . "</timestamp>                          
                    </orderReply>
                </root>";
        $xml = simplexml_load_string($myXMLString);
    }

    $domXml = new DOMDocument('1.0');
    $domXml->preserveWhiteSpace = false;
    $domXml->formatOutput = true;
    $domXml->loadXML($xml->asXML());
    $xmlString = $domXml->saveXML();

    return "<pre>" . htmlentities($xmlString) . "</pre>";
}

/**
 * @param $time
 * @return false|int
 * Ex: let's say we feed in 12th May 2016, 5:23 PM, this function will return 12th May 2016, 12:00 AM
 */
function getStartTimeOfTheDay($time)
{
    return strtotime("midnight", $time);
}

/**
 * @param $str1
 * @param $str2
 * @param false $requireLowercase
 * @return bool
 */
function is2StringsIdentical($str1, $str2, $requireLowercase = false)
{
    $str1 = trim($str1);
    $str2 = trim($str2);

    if ($requireLowercase) {
        $str1 = strtolower($str1);
        $str2 = strtolower($str2);
    }

    return (strcmp($str1, $str2) == 0);
}

/**
 * @param $id
 * @param $array
 * @return int|string|null
 */
function searchForKey($id, $array)
{
    foreach ($array as $key => $val) {
        if (in_array($id, $val)) {
            return $key;
        }
    }

    return null;
}

/**
 * @return int
 */
function getTimeStamp()
{
    $now = new DateTime();
    return $now->getTimestamp();
}

/**
 * @param $data
 * @return array
 */
function object_to_array($data)
{
    $result = [];
    foreach ($data as $key => $value) {
        $result[$key] = (is_array($value) || is_object($value)) ? object_to_array($value) : $value;
    }
    return $result;
}

/**
 * @param $myWord
 * @return string
 */
function upperCaseFirst($myWord)
{
    return ucwords(strtolower($myWord));
}

function getPageName()
{
    $pageParts = explode("/", $_SERVER['REQUEST_URI']);
    $page = upperCaseFirst($pageParts[sizeof($pageParts) - 1]);
    $pageParts = explode("?", $page);
    $page = $pageParts[0];
    if ($page == '') {
        $page = "Home";
    }

    return $page;
}

/**
 * @param $url
 * @return false|string
 */
function getImgThumbnailErrorXML($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);

    // comment DS - catching error in case of problem with cURL  communication
    $errorCurlCodeFlag = false;
    if ($result === false) {
        $errorCurlCodeFlag = true; //boolean flag for error indication
        $errorCurlText = curl_error($ch); // getting error reason on CURL execution

        return false;
    }

    // close curl resource to free up system resources
    curl_close($ch);

    libxml_use_internal_errors(true);
    $xmlDataResult = simplexml_load_string($result);
    if ($xmlDataResult) {
        $dataArray = _XML2Array($xmlDataResult);
        if (isset($dataArray['Code']) && $dataArray['Code'] == 'AccessDenied') {
            return 'Thumbnail Inaccessible';
        }
    }
    libxml_use_internal_errors(false);

    return '';
}

/**
 * @param SimpleXMLElement $parent
 * @return array
 */
function XML2Array(SimpleXMLElement $parent)
{
    $array = array();

    foreach ($parent as $name => $element) {
        ($node = &$array[$name])
        && (1 === count($node) ? $node = array($node) : 1)
        && $node = &$node[];

        $node = $element->count() ? XML2Array($element) : trim($element);
    }//foreach

    return $array;
}

/**
 * @param $userId
 * @param $apiKey
 * @return mixed
 */
function generateNewToken($userId, $apiKey)
{
    $ch = curl_init();
    $url = SITE_ROOT . "oauth/tokenresponse";
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    curl_setopt($ch, CURLOPT_USERPWD, $userId . ":" . $apiKey);
    $output = curl_exec($ch);

    return json_decode($output, TRUE);
}

/**
 * @param $xmlString
 * @return SimpleXMLElement|string
 */
function convertXmlStringToObject($xmlString)
{
    $xmlObject = '';

    if ($xmlString instanceof SimpleXMLElement) {
        $xmlObject = $xmlString;
    }
    else if (isXMLContentValid($xmlString)) {
        $xmlString = str_replace("&", "&amp;", $xmlString);
        $xmlString = str_replace("'", "&apos;", $xmlString);
        $xmlString = stripslashes($xmlString);
        $xmlObject = @simplexml_load_string($xmlString);
    }

    return $xmlObject;
}

/**
 * @return int
 */
function generateRandomInteger()
{
    $timeStamp = date ("YmdHis");
    return ($timeStamp) . mt_rand(100, 500);
}

function generateCode($length = 12) {
    $chars = 'BCDFGHJKLMNPQRSTVWXYZ0123456789';
    $count = mb_strlen($chars);

    for ($i = 0, $result = ''; $i < $length; $i++) {
        $randomIndex = devurandom_rand(0, $count - 1);
        $result .= mb_substr($chars, $randomIndex, 1);
    }

    return $result;
}

function devurandom_rand($min = 0, $max = 0x7FFFFFFF) {
    $diff = $max - $min;
    if ($diff < 0 || $diff > 0x7FFFFFFF) {
        throw new RuntimeException("Bad range");
    }
    $bytes = mcrypt_create_iv(4, MCRYPT_DEV_URANDOM);
    if ($bytes === false || strlen($bytes) != 4) {
        throw new RuntimeException("Unable to get 4 bytes");
    }
    $ary = unpack("Nint", $bytes);
    $val = $ary['int'] & 0x7FFFFFFF;   // 32-bit safe
    $fp = (float) $val / 2147483647.0; // convert to [0,1]
    return round($fp * $diff) + $min;
}

function sanitizeMyString($myString)
{
    $myString = htmlspecialchars(trim($myString), ENT_QUOTES);
    $myString = str_replace(array("\n", "\r", "\t"), '', $myString);

    if ($myString != '') {
        //After removed all special chars, just take the first 40 chars only
        if (strlen($myString) > MAX_BACKlINE_PRINT) {
            $myString = substr($myString, 0, MAX_BACKlINE_PRINT);
        }
    }

    return trim($myString);
}

/**
 * Convert an array input to XML output
 *
 * @param $data
 * @param $xmlData
 */
function toXml($data, &$xmlData)
{
    foreach ($data as $key => $value) {
        if (is_array($value)) {
            if (is_numeric($key)) {
                toXml($value, $xmlData);
            }
            else {
                $subNode = $xmlData->addChild($key);
                toXml($value, $subNode);
            }
        }
        else {
            $xmlData->addChild("$key", htmlspecialchars("$value"));
        }
    }
}

/**
 * @param $imgFullPath
 * @param $imgContent
 * @return false|int
 */
function downloadToWPDrive($imgFullPath, $imgContent)
{
    file_put_contents($imgFullPath, $imgContent);

    return file_exists($imgFullPath) ? filesize($imgFullPath) : 0;
}

/**
 * @param $imgUrl
 * @param $fullWPFilePath
 * @return array
 */
function downloadImgUrlToWPDrive($imgUrl, $fullWPFilePath)
{
    $imgUrl = str_replace(' ', '%20', $imgUrl);
    $fileType = '';
    $allowTypes = array('pdf', 'png', 'jpg');

    $fileContent = file_get_contents($imgUrl);
    $fileSize = downloadToWPDrive($fullWPFilePath, $fileContent);
    if ( $fileSize > 0 ) {
        $execReturn = array();
        if ( exec("identify  " . $fullWPFilePath, $execReturn) ) {
            $identify = explode(" ", trim($execReturn[0]));
        }
        //Yes it is pdf file
        if ( isset($identify[1]) && strtolower($identify[1]) == "pdf" ) {
            $fileType = "pdf";
        }
        //Nope, it should be an image file
        else {
            $info = getimagesize($fullWPFilePath);
            $extension = image_type_to_extension($info[2]);
            if (strtolower($extension) == '.jpeg') {
                $extension = ".jpg";
            }
            $ext = explode('.', $extension);
            if ( isset($ext[count($ext) - 1]) ) {
                $fileType = $ext[count($ext) - 1];
            }
        }
    }

    //Only allow types
    if( !in_array($fileType, $allowTypes) ) {
        $fileType = '';
    }

    return
        array(
            'ext'     => $fileType,
            'fileSize'=> $fileSize
        );
}

function addLeadingZero($value, $padLength)
{
    $padChar = '0';

    return str_pad($value, $padLength, $padChar, STR_PAD_LEFT);
}