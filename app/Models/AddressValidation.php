<?php
namespace App\Models;

use App\Models\Base;

class AddressValidation extends Base
{
    /**
     * DEBUG_
     * array(17) {
     * ["orderId"]=>
     * int(16562288)
     * ["country"]=>
     * string(2) "US"
     * ["address1"]=>
     * string(10) "po box 123"
     * ["address2"]=>
     * string(0) ""
     * ["city"]=>
     * string(6) "Irvine"
     * ["zip"]=>
     * string(5) "92603"
     * ["state"]=>
     * string(2) "CA"
     * ["userName"]=>
     * string(12) "canvasPeople"
     * ["shippingType"]=>
     * string(5) "Basic"
     * }
     */
    private $_request;

    const UPS_SHIPPING_API = "http://production.shippingapis.com/ShippingAPI.dll?API=Verify";
    const DEFAULT_LOCID = 1;

    /**
     * AddressValidation constructor.
     * @param $request
     */
    function __construct($request)
    {
        $this->_request = $request;
    }

    /**
     * @return bool
     */
    public function checkCountryAllowPoBoxes()
    {
        $country = $this->_request['country'];
        $shippingType = $this->_request['shippingType'];
        $valid = true;

        if (in_array($shippingType, ALLOW_SHIPPING_WITH_PO)) {
            if (!in_array($country, ALLOW_PO_COUNTRIES) and !in_array($country, US_TERITORY)) {
                $valid = false;
            }
        }

        return $valid;
    }

    /**
     * @param $string
     * @return bool
     */
    public function isBlank($string)
    {
        return (trim($string) == "");
    }

    /**
     * @param $string
     * @param $limit
     * @return bool
     */
    public function lessThanLimit($string, $limit)
    {
        return (strlen($string) < $limit);
    }

    /**
     * @param $string
     * @param $limit
     * @return bool
     */
    public function moreThanLimit($string, $limit)
    {
        return (strlen($string) > $limit);
    }

    /**
     * @param $string
     * @param $length
     * @return bool
     */
    public function differentLength($string, $length)
    {
        return (strlen($string) != $length);
    }

    /**
     * @param $string
     * @return false|int
     */
    public function atLeastOneAlphanumeric($string)
    {
        return (preg_match('/[a-z0-9]/i', $string));
    }

    /**
     * @param $zip
     * @return string[]
     */
    public function cityStateLookup()
    {
        $zip = $this->_request['zip'];
        $tmp = explode("-", $zip);
        $uspsService = "http://production.shippingapis.com/ShippingAPI.dll?API=CityStateLookup";

        $xml = '<CityStateLookupRequest  USERID="606JONDO1738">';
        $xml .= '<ZipCode ID="0">';
        $xml .= '<Zip5>' . $tmp[0] . '</Zip5>';
        $xml .= '</ZipCode>';
        $xml .= '</CityStateLookupRequest>';

        $xml = rawurlencode($xml);


        $returnArray = array('SuccessfulCall' => 'false',
            'EffectiveAddressCity' => '',
            'EffectiveAddressStateOrProvinceCode' => '',
            'EffectiveAddressPostalCode' => '',
            'Error' => 'FAILED CONNECTION',
            'ErrorFlag' => 'false');

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $uspsService . "&XML=" . $xml);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            $output = curl_exec($ch);
            curl_close($ch);

            $xml_snippet = simplexml_load_string($output);
            $json_convert = json_encode($xml_snippet);
            $json = json_decode($json_convert);
        }
        catch (Exception $e) {
            return $returnArray;
        }

        if (isset($json->ZipCode)) {
            $returnArray["SuccessfulCall"] = "true";
        }
        else {
            return $returnArray;
        }

        if (isset($json->ZipCode->Error)) {
            $returnArray["ErrorFlag"] = "true";
            $returnArray["Error"] = trim($json->ZipCode->Error->Description);
        }
        else {
            $returnArray["EffectiveAddressCity"] = trim($json->ZipCode->City);
            $returnArray["EffectiveAddressStateOrProvinceCode"] = trim($json->ZipCode->State);
            $returnArray["EffectiveAddressPostalCode"] = trim($json->ZipCode->Zip5);
            $returnArray["Error"] = "";
        }

        return $returnArray;
    }

    /**
     * @param $address
     * @param $city
     * @param $state
     * @param $country
     * @param $zip
     * @param null $urbanizationCode
     * @return string[]
     */
    public function addressValidationUsps()
    {
        $address = strtoupper($this->_request['address1']);
        $state = strtoupper($this->_request['state']);
        $zip = strtoupper($this->_request['zip']);
        $city = strtoupper($this->_request['city']);
        $country = strtoupper($this->_request['country']);

        $uspsService = AddressValidation::UPS_SHIPPING_API;

        $xml = '<AddressValidateRequest USERID="' . UPS_ACCOUNT . '">';
        $xml .= '<IncludeOptionalElements>true</IncludeOptionalElements>';
        $xml .= '<ReturnCarrierRoute>true</ReturnCarrierRoute>';
        $xml .= '<Address ID="0">';
        $xml .= '<Address1></Address1>';
        $xml .= '<Address2>' . $address . '</Address2>';
        $xml .= '<City>' . $city . '</City>';
        $xml .= '<State>' . $state . '</State>';
        $tmp = explode("-", $zip);
        $xml .= '<Zip5>' . $tmp[0] . '</Zip5>';
        if (isset($tmp[1])) {
            $xml .= '<Zip4>' . $tmp[1] . '</Zip4>';
        }
        else {
            $xml .= '<Zip4></Zip4>';
        }
        $xml .= '</Address>';
        $xml .= '</AddressValidateRequest>';

        $xml = rawurlencode($xml);
        //var_dump($xml);

        $returnArray = array('SuccessfulCall' => 'false',
            'EffectiveAddressStreetLines' => '',
            'EffectiveAddressCity' => '',
            'EffectiveAddressStateOrProvinceCode' => '',
            'EffectiveAddressPostalCode' => '',
            'EffectiveAddressPostalCode4' => '',
            'EffectiveAddressUrbanizationCode' => 'NA',
            'Error' => 'FAILED CONNECTION');

        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $uspsService . "&XML=" . $xml);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
            $output = curl_exec($ch);
            curl_close($ch);

            $xml_snippet = simplexml_load_string($output);
            $json_convert = json_encode($xml_snippet);
            $json = json_decode($json_convert);
        }
        catch (Exception $e) {
            return $returnArray;
        }

        if (isset($json->Address->Error)) {
            $returnArray["SuccessfulCall"] = 'true';
            $returnArray["Error"] = $json->Address->Error->Description;
        }
        else {
            $returnArray["SuccessfulCall"] = 'true';
            $returnArray["EffectiveAddressStreetLines"] = $json->Address->Address2;
            $returnArray["EffectiveAddressCity"] = $json->Address->City;
            $returnArray["EffectiveAddressStateOrProvinceCode"] = $json->Address->State;
            $returnArray["EffectiveAddressPostalCode"] = $json->Address->Zip5;
            if (isset($json->Address->Zip4) && is_string($json->Address->Zip4) && $json->Address->Zip4 != "") {
                $returnArray["EffectiveAddressPostalCode4"] = $json->Address->Zip4;
            }
            if ($state == "PR" && isset($json->Address->Urbanization)) {
                $returnArray["EffectiveAddressUrbanizationCode"] = $json->Address->Urbanization;
            }

            $returnArray["Error"] = "";
        }

        $isValid = TRUE;
        if( $country == "US" ) {
            if(
                $returnArray['EffectiveAddressCity'] == "" ||
                $returnArray['EffectiveAddressStateOrProvinceCode'] == "" ||
                $returnArray['EffectiveAddressPostalCode'] == "" ||
                $returnArray['EffectiveAddressPostalCode4'] == "" ||
                $returnArray['Error'] != ""
            ) {
                $isValid = FALSE;
            }
        }

        return $isValid;
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    public function getCountryIdFromCountryCode()
    {
        $addressArray = $this->_request;
        $country = $addressArray["country"];

        $data =
            $this->getResource(SYN_DB)
                ->where('countryCode', $country)
                ->get('countryWithLoc', 1, 'id');

        return isset($data[0]) ? $data[0]['id'] : '';
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    public function checkStates()
    {
        $addressArray = $this->_request;
        $state = $addressArray["state"];

        $countryId = $this->getCountryIdFromCountryCode();
        if ($countryId != '') {
            $data =
                $this->getResource(SYN_DB)
                    ->where('countryId', $countryId)
                    ->where('stateCode', $state)
                    ->get('statesByCountry');
            return isset($data[0]) ? $data[0] : '';
        }

        return '';
    }

    /**
     * @param $address1
     * @param string $address2
     * @return bool
     */
    public function validateStreetAddress($address1, $address2 = "")
    {
        if ($this->lessThanLimit($address1 . $address2, 3)) {
            return false;
        }

        return true;
    }

    public function checkZipCode()
    {
        $addressArray = $this->_request;
        $zipCode = $addressArray["zip"];
        $country = $addressArray["country"];

        if (strlen($zipCode) == 5) {
            $zipCode = substr($zipCode, 0, 2);
            $zipCode .= " ";
        }
        else {
            $zipCode = substr($zipCode, 0, 3);
        }

        $data =
            $this->getResource(SYN_DB)
                ->where('countryCode', $country)
                ->where('zip', $zipCode)
                ->getOne('zipWithLoc', 1, 'id');

        return $data[0];
    }

    /**
     * @param int $locId
     * @return mixed
     * @throws \Exception
     */
    public function getShippingAccountsFromLocId($locId = AddressValidation::DEFAULT_LOCID)
    {
        $carrier = isset($this->_request['carrier']) ? $this->_request['carrier'] : '';

        $sql = "SELECT 
                    sa.`key`, sa.`password`, sa.accountNumber, sa.meterNumber, 
                    sa.hubId, sa.freightAccountNumber, sa.userName, sa.zip, sa.closeOutId
                FROM shippingAccounts sa, shippingCarriers sc 
                WHERE 
                    sa.carrierId=sc.id AND sa.locId=? AND 
                    sa.companyName = 'jondo' AND sa.accountType = 'primary'";
        if ($carrier != '') {
            $sql .= " AND sc.carrierName = '$carrier' ";
        }

        $bindParams = array($locId);

        $data = $this->rawHDQuery($sql, $bindParams);

        return $data[0];
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function getShippingAccounts()
    {
        /**
         * PRINT_
         * array(11) {
         * ["orderId"]=>
         * int(16562288)
         * ["country"]=>
         * string(2) "US"
         * ["address1"]=>
         * string(14) "7702 Trask AVe"
         * ["address2"]=>
         * string(0) ""
         * ["city"]=>
         * string(11) "westminster"
         * ["zip"]=>
         * string(5) "92683"
         * ["state"]=>
         * string(2) "CA"
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["shippingType"]=>
         * string(5) "Basic"
         * ["locId"]=>
         * int(1)
         * ["carrier"]=>
         * string(5) "FEDEX"
         * }
         */
        return $this->getShippingAccountsFromLocId();
    }

    /**
     * @return bool
     * @throws \SoapFault
     */
    public function addressValidationFedex()
    {
        /**
         * PRINT_
         * array(11) {
         * ["orderId"]=>
         * int(16562288)
         * ["country"]=>
         * string(2) "US"
         * ["address1"]=>
         * string(14) "7702 Trask AVe"
         * ["address2"]=>
         * string(0) ""
         * ["city"]=>
         * string(11) "westminster"
         * ["zip"]=>
         * string(5) "92683"
         * ["state"]=>
         * string(2) "CA"
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["shippingType"]=>
         * string(5) "Basic"
         * ["locId"]=>
         * int(1)
         * ["carrier"]=>
         * string(5) "FEDEX"
         * }
         */

        $addressArray = $this->_request;
        $address = $addressArray["address1"];
        $city = $addressArray["city"];
        $state = $addressArray["state"];
        $zipCode = $addressArray["zip"];
        $country = $addressArray["country"];
        ini_set("soap.wsdl_cache_enabled", "0");
        $addressValidation4WSDL = SITE_WSDL . "addressValidation4.wsdl";
        // Refer to http://us3.php.net/manual/en/ref.soap.php for more information
        $clientAddressValidation = new \SoapClient($addressValidation4WSDL, array('trace' => 1));
        $shippingAccount = $this->getShippingAccounts();

        $requestAddressValidation = array();
        $requestAddressValidation['Version'] = array('ServiceId' => 'aval', 'Major' => '4', 'Intermediate' => '0', 'Minor' => '0');
        $requestAddressValidation['WebAuthenticationDetail'] = array('UserCredential' => array('Key' => $shippingAccount["key"], 'Password' => $shippingAccount["password"]));
        $requestAddressValidation['ClientDetail'] = array('AccountNumber' => $shippingAccount["accountNumber"], 'MeterNumber' => $shippingAccount["meterNumber"]);
        $requestAddressValidation['RequestTimestamp'] = date(DATE_ATOM);
        $requestAddressValidation['Options'] = array('VerifyAddresses' => true, 'RecognizeAlternateCityNames' => true, 'ReturnParsedElements' => true, 'DirectionalAccuracy' => 'MEDIUM');
        $requestAddressValidation['Options'] = array('VerifyAddresses' => true, 'ReturnParsedElements' => true, 'DirectionalAccuracy' => 'TIGHT');

        //Address to verify
        $requestAddressValidation['AddressesToValidate']['Address']['StreetLines'] = array($address);
        $requestAddressValidation['AddressesToValidate']['Address']['City'] = $city;
        $requestAddressValidation['AddressesToValidate']['Address']['StateOrProvinceCode'] = $state;
        $requestAddressValidation['AddressesToValidate']['Address']['PostalCode'] = $zipCode;
        $requestAddressValidation['AddressesToValidate']['Address']['CountryCode'] = $country;

        $returnArray =
            array(
                'SuccessfulCall' => 'false',
                'Classification' => '',
                'State' => '',
                'EffectiveAddressStreetLines' => '',
                'EffectiveAddressCity' => '',
                'EffectiveAddressStateOrProvinceCode' => '',
                'EffectiveAddressPostalCode' => '',
                'EffectiveAddressUrbanizationCode' => 'NA',
                'EffectiveAddressCountryCode' => '',
                'SuiteRequiredButMissing' => 'false',
                'InvalidSuiteNumber' => 'false',
                'MultipleMatches' => 'false',
                'Resolved' => 'false',
                'DPV' => 'false'
            );

        try {
            $addressValidation = $clientAddressValidation->addressValidation($requestAddressValidation);
            if (isset($addressValidation->HighestSeverity) && $addressValidation->HighestSeverity == "SUCCESS") {
                $returnArray['SuccessfulCall'] = 'true';

                if (isset($addressValidation->AddressResults->State)) {
                    $returnArray['State'] = $addressValidation->AddressResults->State;
                    $returnArray['Classification'] = $addressValidation->AddressResults->Classification;

                    if (isset($addressValidation->AddressResults->EffectiveAddress->StreetLines)) {
                        if (is_array($addressValidation->AddressResults->EffectiveAddress->StreetLines)) {
                            foreach ($addressValidation->AddressResults->EffectiveAddress->StreetLines as $tmp) {
                                $returnArray['EffectiveAddressStreetLines'] .= $tmp . " ";
                            }
                            $returnArray['EffectiveAddressStreetLines'] = trim($returnArray['EffectiveAddressStreetLines']);
                        }
                        else {
                            $returnArray['EffectiveAddressStreetLines'] = $addressValidation->AddressResults->EffectiveAddress->StreetLines;
                        }
                    }

                    if (isset($addressValidation->AddressResults->EffectiveAddress->City)) {
                        $returnArray['EffectiveAddressCity'] = $addressValidation->AddressResults->EffectiveAddress->City;
                    }

                    if (isset($addressValidation->AddressResults->EffectiveAddress->StateOrProvinceCode)) {
                        $returnArray['EffectiveAddressStateOrProvinceCode'] = $addressValidation->AddressResults->EffectiveAddress->StateOrProvinceCode;
                    }

                    if (isset($addressValidation->AddressResults->EffectiveAddress->PostalCode)) {
                        $returnArray['EffectiveAddressPostalCode'] = $addressValidation->AddressResults->EffectiveAddress->PostalCode;
                    }

                    if (isset($addressValidation->AddressResults->EffectiveAddress->CountryCode)) {
                        $returnArray['EffectiveAddressCountryCode'] = $addressValidation->AddressResults->EffectiveAddress->CountryCode;
                    }

                    foreach ($addressValidation->AddressResults->Attributes as $tmp) {
                        $returnArray[$tmp->Name] = $tmp->Value;
                    }
                }
            }
        }
        catch (SoapFault $exception) { }

        $isValid = TRUE;
        if( $returnArray['EffectiveAddressCountryCode'] == "US" ) {

            if( $returnArray['Classification'] == "UNKNOWN" ||
                ( isset($returnArray['StreetValidated']) && $returnArray['StreetValidated'] == "false" ) ||
                ( isset($returnArray['CityStateValidated']) && $returnArray['CityStateValidated'] == "false") ||
                ( $returnArray['ZIP11Match'] == "false") ||
                $returnArray['ZIP4Match'] == "false"
            ) {
                $isValid = FALSE;
            }
        }

        return $isValid;
    }

    /**
     * @return bool
     * @throws \SoapFault
     */
    public function addressValidationFull()
    {
        $isValidUps = $this->addressValidationUsps();
        $isValidFedex = $this->addressValidationFedex();

        return ($isValidFedex && $isValidUps);
    }

    /**
     * @param $countryCode
     * @return mixed|string
     * @throws \Exception
     */
    public function checkCountry($countryCode)
    {
        $data = $this->getResource(SYN_DB)
                     ->where('countryCode', $countryCode)
                     ->get('countryWithLoc','1', 'id');

        return isset($data[0]) ? $data[0]['id'] : "";
    }

    /**
     * @param $stateName
     * @param $countryCode
     * @return mixed
     * @throws \Exception
     */
    public function convertStateNameToCode($stateName, $countryCode)
    {
        $data =
            $this->getResource(HD_DB)
                 ->where('countryId', $countryCode)
                 ->where('stateName', $stateName)
                 ->get('statesByCountry', 1, 'stateCode');

        return $data[0]['stateCode'];
    }

    /**
     * @return array
     * @throws \SoapFault
     */
    public function validateAddress()
    {
        $errorCode = '';
        $addressArray = $this->_request;
        $address = $addressArray["address1"];
        $city = $addressArray["city"];
        $postalCode = $addressArray["zip"];
        if (isset($addressArray["zip"])) {
            $postalCode = preg_replace("/\s+/", "", $addressArray["zip"]);
        }
        $state = $addressArray["state"];
        $country = $addressArray["country"];
        $address2 = "";
        if (isset($addressArray["address2"])) {
            $address2 = trim($addressArray["address2"]);
        }

        if ($this->isBlank($address)) {
            $errorCode = 7042;
        }
        elseif ($this->lessThanLimit($address . $address2, 3) and $country != "US") {
            //If less than 3 characters
            $errorCode = 7043;
        }
        elseif (!$this->atLeastOneAlphanumeric($address)) {
            $errorCode = 7044;
        }

        if ($this->isBlank($city)) {
            $errorCode = 7045;
        }
        elseif ($this->lessThanLimit($city, 2)) {
            $errorCode = 7046;
        }
        elseif (!$this->atLeastOneAlphanumeric($city)) {
            $errorCode = 7063;
        }
        elseif (is_numeric(str_replace(' ', '', $city))) {
            $errorCode = 7045;
        }

        if ($this->isBlank($country)) {
            $errorCode = 7056;
        }
        elseif ($this->differentLength($country, 2)) {
            $errorCode = 7056;
        }

        $returnStateCodeFlag = false;
        $countryToValidate = array("US", "CA", "GB");
        $country = strtoupper($country);
        $state = strtoupper($state);
        $postalCode = strtoupper($postalCode);
        $cityToValidate = array("APO", "FPO", "MPO", "DPO");
        $city = strtoupper($city);

        if (in_array($country, $countryToValidate)) {
            // dont need to validate state for GB
            if ($country == "US" || $country == "CA") {
                // State Validation
                if ($this->isBlank($state)) {
                    $errorCode = 7050;
                }
                elseif ($this->lessThanLimit($state, 2)) {
                    //If less than 2 characters
                    $errorCode = 7050;
                }
                elseif ($this->moreThanLimit($state, 2)) {
                    $stateCode = $this->convertStateNameToCode($state, $country);

                    if (!isset($stateCode)) {
                        $errorCode = 7051;
                    }
                    else {
                        $returnStateCodeFlag = true;
                        $state = $stateCode;
                    }
                }
                else if (!$returnStateCodeFlag && !$this->checkStates($state, $country)) {
                    // Check if state is one of the 51 states
                    $errorCode = 7050;
                }
            }

            // Postal code validation
            if ($this->isBlank($postalCode)) {
                $errorCode = 7053;
            }
            elseif ($this->moreThanLimit($postalCode, 10)) {
                //If more than 10 characters
                $errorCode = 7054;
            }

            if ($country == "GB" || $country == "CA") {
                if (!$this->checkZipCode($postalCode, $country)) {
                    $errorCode = 7054;
                }
            }
        }
        // for the rest of the countries, just check if valid country code
        else {
            if (!$this->checkCountry($country)) {
                $errorCode = 7056;
            }
        }

        // Validation for US only
        if ($country == "US") {
            if (!$this->validateStreetAddress($address, $address2)) {
                //Validate address
                $errorCode = 7057;
            }

            $postalCodeLength = strlen($postalCode);
            if ($postalCodeLength < 5) {
                $errorCode = 7054;
            }

            // Check if valid US postal code
            if ( $postalCode != "35487" )  {
                $cityStateResponse = $this->cityStateLookup($postalCode);
                if ($cityStateResponse["SuccessfulCall"] == "true") {
                    if ($cityStateResponse["ErrorFlag"] == "true") {
                        //Zip Code did not find
                        $errorCode = 7054;
                    }
                    else {
                        $stateUSPS = $cityStateResponse["EffectiveAddressStateOrProvinceCode"];

                        if ($stateUSPS != $state) {
                            //Zip Code for other state
                            $errorCode = 7060;
                        }
                    }
                }
                else {
                    $errorCode = 7060;
                }
            }

            if( !$this->addressValidationFull() ) {
                //Invalid address
                $errorCode = 7062;
            }
        }// Validation for US only

        if (($state == 'AA' || $state == 'AE' || $state == 'AP') && in_array($city, $cityToValidate)) {
            //$responseArray["status"] = "pending";
            $errorCode = 7062;
        }

        return
            array(
                "success" => ($errorCode == ''),
                "errorCode" => $errorCode
            );
    }

}//End of class