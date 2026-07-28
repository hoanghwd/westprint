<?php


namespace App\Models;

use App\Models\Base;


class OrderLocation extends Base
{
    private $_request;
    public $premium = 0;
    public $capacity = 0;

    CONST LOC_ARRAY =
        array('ahh', 'hmh', 'wvh', 'juk', 'jmx', 'jca', 'jes', 'jce', 'jhi', 'jau', 'jut', 'jug', 'snc');
    const DEFAULT_LOC = 11;
    CONST COUNTRY_WITH_STATE = array("US", "CA");
    CONST DISTANCE = "DISTANCE";

    /**
     * OrderLocation constructor.
     * @param $request
     */
    function __construct($request)
    {
        /**
         * DEBUG_
         * array(18) {
         * ["orderId"]=>
         * int(16562297)
         * ["country"]=>
         * string(2) "US"
         * ["reason"]=>
         * string(44) "West Print Issues-shippingAddress-Late Order"
         * ["modifierUser"]=>
         * string(12) "canvasPeople"
         * ["hdRequest"]=>
         * string(1) "N"
         * ["firstName"]=>
         * string(9) "Christina"
         * ["lastName"]=>
         * string(6) "OBryan"
         * ["company"]=>
         * string(0) ""
         * ["address1"]=>
         * string(18) "495 Canongate Kirk"
         * ["address2"]=>
         * string(0) ""
         * ["city"]=>
         * string(10) "Alpharetta"
         * ["zip"]=>
         * string(5) "30004"
         * ["email"]=>
         * string(25) "christinaobryan@yahoo.com"
         * ["phone"]=>
         * string(10) "9376728485"
         * ["details"]=>
         * string(0) ""
         * ["state"]=>
         * string(2) "AL"
         * ["userName"]=>
         * string(12) "canvasPeople"
         * ["productFeed"]=>
         * array(3) {
         * [0]=>
         * string(5) "90107"
         * [1]=>
         * string(5) "90013"
         * [2]=>
         * int(90311)
         * }
         * }
         */
        $this->_request = $request;
    }

    /**
     * @return string
     */
    private function _buildInStatement()
    {
        $in = "(";
        foreach ($this->_request['productFeed'] as $productCode) {
            $in .= $productCode . ",";
        }
        $in = trim($in, ",");
        $in .= ")";

        return $in;
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getValidLocations()
    {
        $validLocationsArray = array();
        $sql = "SELECT id, countryCode FROM locations";
        if( $this->premium == 1 ) {
            $sql .= " WHERE premium = 1";
        }
        $data = $this->rawHDQuery($sql);
        foreach ($data AS $row) {
            array_push($validLocationsArray, $row['id']);
        }

        //Not valid location
        $notValidLocationsArray = $this->_getNotValidLocation();

        return array_diff($validLocationsArray, $notValidLocationsArray);
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getNotValidLocation()
    {
        $noValidLocationsArray = array();
        $inStatement = $this->_buildInStatement();
        $sql = "SELECT 
                    ahh, hmh, wvh, juk, jmx, jca, jes, jce, jhi, jau, jut, jug, snc 
                FROM products 
                WHERE id IN ".$inStatement;
        $data = $this->rawSYNQuery($sql);

        //Foreach productCode
        foreach ($data AS $location) {
            $i = 0;
            foreach (OrderLocation::LOC_ARRAY AS $locName) {
                if( $location[$locName] ) {
                    $noValidLocationsArray[] = $i+1;
                }
                $i++;
            }
        }//foreach

        return array_unique($noValidLocationsArray);
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    private function _getZipWithLoc()
    {
        $country = $this->_request['country'];
        $zipCode = $this->_request['zip'];
        $destZip = strtoupper(substr($zipCode, 0, 3));

        $sql = "SELECT 
                    locId, locId2, locId3, locId4, locId5, locId6, 
                    locId7, locId8, locId9, locId10, locId11, locId12 
                FROM zipWithLoc 
                WHERE countryCode = '$country' AND zip = '$destZip'";
        $data = $this->rawSYNQuery($sql);

        return $data[0];
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    private function _getCountryWithLoc()
    {
        $country = $this->_request['country'];
        $sql =
            "SELECT 
                locId, locId2, locId3, locId4, locId5, locId6, 
                locId7, locId8, locId9, locId10, locId11, locId12 
            FROM countryWithLoc 
            WHERE countryCode='$country'";

        $data = $this->rawSYNQuery($sql);

        return $data[0];
    }

    /**
     * @param string $priority
     * @return int|mixed|string
     * @throws \Exception
     */
    public function assignLocation($priority = "distance")
    {
        $country = $this->_request['country'];
        $zipCode = $this->_request['zip'];

        if( strtoupper($priority) == self::DISTANCE) {
            $distanceHdl = new Distance();
            $locId = $distanceHdl->getPreferLocIdByTargetZip($zipCode);
            if( $locId != '' ) {
                return $locId;
            }
        }

        /**
        <pre>DEBUG_<br/>array(3) {
        [1]=>
        int(2)
        [8]=>
        int(9)
        [12]=>
        int(13)
        }
        $validLocationsArray
         */
        $validLocationsArray = $this->_getValidLocations();

        /**
        <pre>DEBUG_locIdArray<br/>array(12) {
        ["locId"]=>
        int(3)
        ["locId2"]=>
        int(11)
        ["locId3"]=>
        int(12)
        ["locId4"]=>
        int(11)
        ["locId5"]=>
        int(11)
        ["locId6"]=>
        int(11)
        ["locId7"]=>
        int(11)
        ["locId8"]=>
        int(13)
        ["locId9"]=>
        int(11)
        ["locId10"]=>
        int(11)
        ["locId11"]=>
        int(11)
        ["locId12"]=>
        int(11)
        }
         */
        $locIdArray = ( in_array( $country, OrderLocation::COUNTRY_WITH_STATE) ) ?
            $this->_getZipWithLoc() : $this->_getCountryWithLoc();

        //Multiple locations
        if( $this->isNotEmptiedArray($validLocationsArray) ) {
            $locId = $this->_calculateNewLocIdWithMultipleLocIds($locIdArray, $validLocationsArray);
        }
        //All the products only can be fullfill in this location
        else if( sizeof($validLocationsArray) == 1 ) {
            //echo "The ONLY location that can fulfill ALL the items is: ".$locId."<br><br>";
            $locId = $this->_calculateNewLocWithExact1($locIdArray, $validLocationsArray);
        }
        //There is no location then will pick the closet one
        else {
            $distanceHdl = new Distance();
            $locId = $distanceHdl->getPreferLocIdByTargetZip($zipCode);
            if( $locId == '' ) {
                $locId = OrderLocation::DEFAULT_LOC;
            }
        }

        return $locId;
    }

    /**
     * @param $locIdArray
     * @param $validLocationsArray
     * @return int|mixed|string
     */
    private function _calculateNewLocWithExact1($locIdArray, $validLocationsArray)
    {
        $matched = false;
        $locId = OrderLocation::DEFAULT_LOC;

        foreach ($locIdArray AS $locId => $value) {
            if( in_array($value, $validLocationsArray) ) {
                $matched = TRUE;
                break;
            }
        }

        if( $matched ) {
            $reverseArray = array_reverse($validLocationsArray);
            $locId = array_pop($reverseArray);
            $validLocationsArray = $reverseArray;

        }
        else {
            if( isset($this->_request['locationPriority']) ) {
                $locationPriority = 1;
            }
        }

        return $locId;
    }

    /**
     * More than one possible locations
     * @param $locIdArray
     * @param $validLocationsArray
     * @return string
     */
    private function _calculateNewLocIdWithMultipleLocIds($locIdArray, $validLocationsArray)
    {
        $allLocationsArray = array();
        $candidateLocationsArray = array();

        array_push($allLocationsArray, 0);
        foreach ($locIdArray AS $locId => $value) {
            array_push($allLocationsArray, $value);
        }
        /**
        <pre>DEBUG_<br/>array(3) {
        [1]=>
        int(2)
        [8]=>
        int(9)
        [12]=>
        int(13)
        }
        $validLocationsArray
         */

        /**
        <pre>DEBUG_<br/>array(5) {
        [0]=>
        int(0)
        [1]=>
        int(3)
        [2]=>
        int(11)
        [3]=>
        int(12)
        [8]=>
        int(13)
        }
        $allLocationsArray
        */
        $allLocationsArray = array_unique($allLocationsArray);
        foreach ($allLocationsArray AS $locId) {
            if( in_array($locId, $validLocationsArray) ) {
                array_push($candidateLocationsArray, $locId);
            }
        }

        if( $this->isNotEmptiedArray($candidateLocationsArray) ) {
            $newLocId = $candidateLocationsArray[0];
        }
        else {
            $newLocId = OrderLocation::DEFAULT_LOC;
        }

        return $newLocId;
    }

    /**
     * @param $hdOrderId
     * @param $newLocId
     * @return int|string
     * @throws \Exception
     */
    public function updateOrderSkuNewLocationIdByHdId($hdOrderId, $newLocId)
    {
        $db =
        $this->getResource(HD_DB)
             ->where('orderId', $hdOrderId);

        if( $db->update('orderSkus', array( 'locId' => $newLocId)) ) {
            return $db->count;
        }

        return 0;
    }

}//End of class