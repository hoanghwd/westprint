<?php


namespace App\Models;

use App\Models\Base;


class Distance extends Base
{
    /**
     * @return array
     * @throws \Exception
     */
    private function _getWestPrintLocZipCodeCollection()
    {
        $wpLocArray = array();
        $data =
            $this->getResource(HD_DB)
                ->get('locations', NULL, 'zip');

        foreach ($data as $row) {
            array_push($wpLocArray, $row['zip']);
        }

        return $wpLocArray;
    }

    /**
     * @param $zipCode
     * @return mixed
     * @throws \Exception
     */
    private function _getGeoByZip($zipCode)
    {
        $sql = "SELECT 
                    hdLoc.id locId,name,active,hdLoc.streetAddress,geo.city,geo.state,geo.zip, 
                    geo.lat,geo.lng
                FROM 
                    harvestd_synergize.geo 
                    LEFT join harvestd_harvestDigital.locations  as hdLoc ON geo.zip = hdLoc.zip
                WHERE 
                    geo.zip = ?";
        $data = $this->rawHDQuery($sql, array($zipCode));

        return isset($data[0]) ? $data[0] : '';
    }

    /**
     * @param $lat1
     * @param $lon1
     * @param $lat2
     * @param $lon2
     * @param $unit
     * @return float|int
     */
    private function _doCalculateDistance($lat1, $lon1, $lat2, $lon2, $unit)
    {
        if (($lat1 == $lat2) && ($lon1 == $lon2)) {
            return 0;
        }
        else {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);

            if ($unit == "K") {
                return ($miles * 1.609344);
            }
            else if ($unit == "N") {
                return ($miles * 0.8684);
            }
            else {
                return $miles;
            }
        }
    }

    /**
     * @param $fromZip
     * @param $toZip
     * @return int
     * @throws \Exception
     */
    public function calculateDistance($fromZip, $toZip)
    {
        $geoFromArray = $this->_getGeoByZip($fromZip);
        $geoToArray = $this->_getGeoByZip($toZip);

        //$this->dumpVar($geoFromArray, "my_from_geo_$fromZip");
        //$this->dumpVar($geoToArray, "my_to_geo_$toZip");

        if ($this->isNotEmptiedArray($geoFromArray) && $this->isNotEmptiedArray($geoToArray)) {
            $distance =
                $this->_doCalculateDistance(
                    $geoFromArray['lat'], $geoFromArray['lng'],
                    $geoToArray['lat'], $geoToArray['lng'],
                    "Mile"
                );

            return round($distance, 0);
        }
        else {
            return 0;
        }
    }

    /**
     * @param $arr
     * @param $col
     * @param int $dir
     * @return mixed
     */
    private function _array_sort_by_column(&$arr, $col, $dir = SORT_ASC)
    {
        $sort_col = array();
        foreach ($arr as $key => $row) {
            $sort_col[$key] = $row[$col];
        }

        array_multisort($sort_col, $dir, $arr);

        return $arr;
    }

    /**
     * @param $targetZipCode
     * @return array
     * @throws \Exception
     */
    public function calculateDistanceWPToZip($targetZipCode)
    {
        $geoTargetZip = $this->_getGeoByZip($targetZipCode);
        $distanceArray = array();
        $wpLocArray = $this->_getWestPrintLocZipCodeCollection();
        foreach ($wpLocArray as $fromZip) {
            $distance = $this->calculateDistance($fromZip, $targetZipCode);
            if ($distance > 0) {
                $currentArray = array(
                    'fromZip'  => $this->_getGeoByZip($fromZip),
                    'toZip'    => $geoTargetZip,
                    'distance' => $distance
                );
                array_push($distanceArray, $currentArray);
            }
        }

        return $this->_array_sort_by_column($distanceArray, 'distance');
    }

    /**
     * @param $targetZipCode
     * @return mixed
     * @throws \Exception
     */
    public function getShortestWPToClient($targetZipCode)
    {
        $distanceArray = $this->calculateDistanceWPToZip($targetZipCode);

        return $distanceArray[0];
    }

    /**
     * @param $targetZipCode
     * @return mixed
     * @throws \Exception
     */
    public function getPreferLocIdByTargetZip($targetZipCode)
    {
        $distanceArray = $this->calculateDistanceWPToZip($targetZipCode);

        return isset($distanceArray[0]) ? $distanceArray[0]['fromZip']['locId'] : '' ;
    }

}//End of class