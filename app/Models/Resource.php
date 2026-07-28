<?php
namespace App\Models;

class Resource
{
    public function getResource($dbName)
    {
        return new \MysqliDb($dbName);
    }

    /**
     * @param $dbName
     * @param $tableName
     * @param string $limit
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    public function getTableResource($dbName, $tableName, $limit = '')
    {
        if ($limit != '') {
            return $this->getResource($dbName)->get($tableName, $limit);
        }

        return $this->getResource()->get($tableName);
    }

    /**
     * @param $dbName
     * @param $table
     * @param $fieldName
     * @param $value
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    public function queryOne($dbName, $table, $fieldName, $value)
    {
        $db = $this->getResource($dbName)->where($fieldName, $value);

        return $db->getOne($table);
    }

    /**
     * @param $sql
     * @param string $param
     * @return array|string
     * @throws \Exception
     */
    public function rawSYNQuery($sql, $param = '')
    {
        return $this->getResource(SYN_DB)->rawQuery($sql, $param);
    }

    /**
     * @param $sql
     * @param string $param
     * @return array|string
     * @throws \Exception
     */
    public function rawHDQuery($sql, $param = '')
    {
        return $this->getResource(HD_DB)->rawQuery($sql, $param);
    }

    /**
     * @param $editSubGroupName
     * @return \MysqliDb
     * @throws \Exception
     */
    private function _doGetEditGroup($editSubGroupName)
    {
        $data =
            $this->getResource(HD_DB)
                ->where('editSubGroup', $editSubGroupName)
                ->orderBy('editGroup')->orderBy('editSubGroup')->orderBy('reason', 'ASC')
                ->get('editOrderReasons');
        $reasonArray = array();
        foreach ($data AS $row) {
            $reasonArray[] = array(
                "reasonId"        => $row['id'],
                "reasonGroup"     => $row['editGroup'],
                "reason"          => $row['reason'],
                "detailsRequired" => $row['detailsRequired'],
                "editSubGroup"    => $row['editSubGroup']
            );
        }

        //Re-arrage making sure Other always at the bottom
        $newShippingTypeArray = array();
        $foundIndexArray = array();
        foreach ($reasonArray AS $shipping) {
            if($shipping["reason"] != "Other") {
                array_push($newShippingTypeArray, $shipping);
            }
            else {
                array_push($foundIndexArray, $shipping);
            }
        }

        $j = 0;
        $k = 0;
        $finalArray = array();
        foreach ($newShippingTypeArray AS $info) {
            $currReasonGroup = $info['reasonGroup'];
            $nextReasonGroup = isset($newShippingTypeArray[$k+1]) ? $newShippingTypeArray[$k+1]['reasonGroup'] : '';

            array_push($finalArray, $info);
            if( $nextReasonGroup != $currReasonGroup ) {
                array_push($finalArray, $foundIndexArray[$j]);
                $j++;
            }
            $k++;
        }

        return $finalArray;
    }

    /**
     * @param $editSubGroupName
     * @return \MysqliDb
     * @throws \Exception
     */
    public function getGroupEditOrderReasons($editSubGroupName)
    {
        return $this->_doGetEditGroup($editSubGroupName);
    }

    /**
     * @param $countryCode
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    public function getFullNameCountryByCode($countryCode)
    {
        $data =
            $this->getResource(SYN_DB)
                 ->where('countryCode', $countryCode)
                 ->getOne('countryWithLoc', 'DISTINCT(name) AS countryName');

        return $data['countryName'];
    }

    /**
     * @param $stateCode
     * @return mixed
     * @throws \Exception
     */
    public function getFullNameStatueByCode($stateCode)
    {
        $data =
            $this->getResource(SYN_DB)
                 ->where('code', $stateCode)
                 ->getOne('usStates');

        return isset($data['code']) ? $data['code'] : '';
    }

    /**
     * @param string $priority
     * @return array|string
     * @throws \Exception
     */
    public function getCountryCollection($priority = "US")
    {
        $sql = "SELECT DISTINCT(countryCode), name 
                FROM countryWithLoc 
                ORDER BY countryCode ASC";
        $dataArray = $this->rawSYNQuery($sql);

        $countries = array();
        $i = 0;
        foreach($dataArray AS $row) {
            $code = strtoupper($row['countryCode']);
            if( $code != strtoupper($priority) ) {
                $countries[$i]['countryCode'] = $code;
                $countries[$i]['countryName'] =  $code.' - '.$row['name'];
                $i++;
            }
            $i++;
        }

        //Put priority in front of array
        $countryName = $this->getFullNameCountryByCode($priority);
        array_unshift($countries, array('countryCode' => $priority, 'countryName' => $priority.' - '.$countryName));

        return $countries;
    }

    /**
     * @param $priority
     * @return array
     * @throws \Exception
     */
    public function getUSStates($priority)
    {
        $states = array();
        $data = $this->getResource(SYN_DB)
                     ->get('usStates');
        $i = 0;
        foreach ($data AS $row) {
            $code =  $row['code'];
            if( strtoupper($code) != strtoupper($priority) ) {
                $states[$i]['code'] = $code;
                $states[$i]['name'] = $code.' - '.$row['name'];
                $i++;
            }
        }

        $stateName = $this->getFullNameStatueByCode($priority);
        array_unshift($states, array('code' => $priority, 'name' => $stateName));

        return $states;
    }

    /**
     * @param $priority
     * @return array
     * @throws \Exception
     */
    public function getStatesCanada($priority)
    {
        $states = array();
        $data = $this->getResource(SYN_DB)
                     ->where('countryId', 36)
                     ->get("statesByCountry");
        $i = 0;
        foreach ($data AS $row) {
            $code = $row['stateCode'];
            $states[$i]['code'] = $code;
            $states[$i]['name'] = $code.' - '.$row['stateName'];
            $i++;
        }

        return $states;
    }

}//End of class