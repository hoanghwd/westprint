<?php


namespace App\Models;

use App\Models\Base;

class Test extends Base
{

    public function getZoneName($request)
    {
        $sql = "SELECT id, zoneName FROM shippingZones WHERE countryCode = ? AND shippingZoneId = ?";
        if( $request['state'] != '' ) {
            $state = $request['state'];
            $sql .= " AND countryState = '$state' ";
        }

        $data = $this->rawSYNQuery($sql, array($request['country'], $request['shippingZoneId']) );

        if( isset($data[0]) && $this->isNotEmptiedArray($data[0]) ) {
            return $data[0];
        }
        else {
            $data =
                $this->getResource(SYN_DB)
                    ->where('countryCode',$request['country'])
                    ->get('shippingZones');

            return $data[0];
        }
    }

    public function getProductComponentDetails($componentId)
    {
        $sql = "SELECT *
                FROM productComponents 
                WHERE id = ? LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($componentId) );

        return $data;
    }

    public function getBrandFees($userId)
    {
        $sql = "SELECT brandPrice, brandType FROM brandingFees WHERE userId = ?";
        $data = $this->rawSYNQuery($sql, array($userId));
        $infoArray = array();

        if( $this->isNotEmptiedArray($data) ) {
            foreach ($data AS $row) {
                $brandType = $row['brandType'];
                $infoArray[$brandType] = $row['brandPrice'];
            }
        }
        return $infoArray;
    }

}