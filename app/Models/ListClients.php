<?php
namespace App\Models;
use App\Models\Base;


class ListClients extends Base
{
    private $_request;
    private $_ordersPerPageDisplay = 500;
    private $_daysBackAllow = 30;

    /**
     * ListClients constructor.
     * @param string $request
     */
    function __construct($request = '')
    {
        $this->_request = $request;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function doListClients()
    {
        return $this->_getClients();
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getClients()
    {
        /**
        DEBUG_
        array(9) {
            ["route"]=>
            string(25) "webPortal/api/listclients"
            ["userName"]=>
            string(0) ""
            ["companyName"]=>
            string(9) "undefined"
            ["clientStatus"]=>
            string(0) ""
            ["page"]=>
            string(1) "0"
            ["limit"]=>
            string(2) "20"
            ["orderBy"]=>
            string(2) "id"
            ["descAsc"]=>
            string(4) "desc"
            ["adminName"]=>
            string(3) "hdo"
            }
         */

        $request = $this->_request;
        $validationError = False;
        $totalRecord = 0;
        $errorMessage = "";
        $sql = '';
        $isAdvanceUser = FALSE;
        $clientArray = array();

        $clientStatus = isset($request["clientStatus"]) ? trim($request["clientStatus"]) : '';
        $userName = isset($request["userName"]) ? trim($request["userName"]) : '';
        $companyName = isset($request["companyName"]) ? trim($request["companyName"]) : '';
        $adminName = trim($request["adminName"]);

        $page = isset($request["page"]) ? trim($request["page"]) : '';
        $limit = isset($request["limit"]) ? trim($request["limit"]) : '';
        $orderBy = isset($request["orderBy"]) ? trim($request["orderBy"]) : '';
        $descAsc = isset($request["descAsc"]) ? trim($request["descAsc"]) : '';

        if($clientStatus == "" or $clientStatus == "undefined") {
            $clientStatus = "ALL";
        }

        if($userName == "" or $userName == "undefined") {
            $userName = "ALL";
        }

        if($companyName == "" or $companyName == "undefined") {
            $companyName = "ALL";
        }

        if($adminName == "" or $adminName == "undefined") {
            $validationError = True;
            $errorMessage = "Invalid Admin";
        }

        if($page == "" or $page == "undefined") {
            $page = 0;
        }

        if($limit == "" or $limit < 1) {
            $limit = $this->_ordersPerPageDisplay;
        }

        if($orderBy == "" or $orderBy == "undefined") {
            $orderBy = "id";
        }

        if($descAsc == "" or $descAsc == "undefined") {
            $descAsc = "desc";
        }

        //iF admin is not NULL
        if( $adminName != '' ) {
            $params = array();
            $userHdl = new User(array('userName' => $adminName));
            $userInfo = $userHdl->getUserInfoByUsername(SYN_DB);
            $level = $userInfo['level'];

            //Advance, salesAdmin and Accounting
            if ( $level == 'advanced' or $level == 'salesAdmin' or $level == 'accounting' ) {
                $isAdvanceUser = TRUE;
                $sql =
                    "SELECT syn.id, syn.userName, syn.apiKey, syn.clientStatus, hd.email, hd.phone, hd.companyName, syn.orderOrigin, 
                           oo.description, syn.shippingZoneId, sm.name , syn.pricingGroupId, spg.groupName, syn.useGeneralShippingRates, 
                           syn.shippingModelId, syn.level userNameLevel
                     FROM harvestd_harvestDigital.users hd, harvestd_synergize.users syn
                        LEFT JOIN harvestd_synergize.orderOrigins AS oo
                            ON syn.orderOrigin = oo.type
                        LEFT JOIN harvestd_synergize.shippingMaps AS sm
                            ON syn.shippingZoneId = sm.id
                        LEFT JOIN harvestd_synergize.shippingPricingGroups AS spg
                            ON spg.shippingZoneId = syn.shippingZoneId AND spg.pricingGroupId = syn.pricingGroupId
                     WHERE ";
                if( $companyName != 'ALL' ) {
                    $sql .=  " hd.companyName = '$companyName' AND ";
                }

                //All usernames
                if ( $userName == "ALL" ) {
                    $offset = $page * $limit;
                    //All client statuses
                    if ($clientStatus == "ALL") {
                        $sql .= " hd.apiFlag = 'Y' AND hd.userName = syn.userName ";
                        $sql .= " ORDER BY ".$orderBy." ".$descAsc."  LIMIT ?, ?";
                        $params =  array($offset, $limit);
                    }
                    //Specific client status -> Client status NOT = ALL like REGISTERED...
                    else {
                        $sql .= " hd.apiFlag = 'Y' AND hd.userName = syn.userName AND syn.clientStatus = ? ";
                        $sql .= " ORDER BY ".$orderBy." ".$descAsc."  LIMIT ?, ?";
                        $params =  array($clientStatus, $offset, $limit);
                    }
                }
                //If specific username
                else {
                    //All client statuses -> Client status = ALL
                    if ($clientStatus == "ALL") {
                        $sql .= " hd.apiFlag = 'Y' AND hd.userName = ? AND hd.userName = syn.userName ";
                        $params =  array($userName);
                    }
                    //Specific status
                    else {
                        $sql.=  "hd.apiFlag = 'Y' AND hd.userName = ? AND hd.userName = syn.userName AND syn.clientStatus = ? ";
                        $params =  array($userName, $clientStatus);
                    }
                }
            }
            //Sales/Basic role
            else {

            }

            //Ready to execute SQL
            $clients = $this->rawSYNQuery($sql, $params);
            $totalRecord = sizeof($clients);

            //If found clients the calculate total records
            if( $totalRecord > 0 ) {
                $clientArray = $this->_createClientArray($clients);

                //Calculate total if found multiple userNames
                if ( $userName == "ALL" ) {
                    $sqlTotal = '';
                    //Advance, salesAdmin and Accounting
                    if ( $isAdvanceUser ) {
                        //All client status
                        if ($clientStatus == "ALL") {
                            $sqlTotal =
                                "SELECT count(1) total 
							     FROM harvestd_synergize.users syn, harvestd_harvestDigital.users hd
							     WHERE hd.apiFlag = 'Y' AND hd.userName = syn.userName";
                            if( $companyName != 'ALL' ) {
                                $sqlTotal .=  " AND hd.companyName = '$companyName'";
                            }
                        }
                        //Specific status
                        else {
                            $sqlTotal =
                                "SELECT count(1) total
                                 FROM harvestd_synergize.users syn, harvestd_harvestDigital.users hd
                                 WHERE hd.apiFlag = 'Y' AND hd.userName = syn.userName AND syn.clientStatus = '$clientStatus'";
                            if( $companyName != 'ALL' ) {
                                $sqlTotal .=  " AND hd.companyName = '$companyName'";
                            }
                        }
                    }
                    //Sales/Basic role
                    else {

                    }

                    $totalArray = $this->rawSYNQuery($sqlTotal);
                    $totalRecord = ($totalArray[0]['total']);
                }///Calculate how many userNames
            }//if client array not NULL

        }//iF admin is not NULL

        return
            array(
                "clients" => $clientArray,
                "total" => $totalRecord
            );
    }

    /**
     * @param $clients
     * @return array
     * @throws \Exception
     */
    private function _createClientArray($clients)
    {
        $clientArray = array();

        if( sizeof($clients) > 0 ) {
            $i = 0;
            foreach ($clients as $client) {
                $orderOriginType = $client['orderOrigin'];
                $orderOriginDescription = $client['description'];
                $shippingZoneId = $client['shippingZoneId'];
                $shippingZoneName = $client['name'];
                $priceGroupId = $client['pricingGroupId'];
                $priceGroupName = $client['groupName'];
                $shippingModelId = $client['shippingModelId'];
                $clientStatusDB = $client['clientStatus'];
                $userName = $client['userName'];
                $userHdl = new User(array('userName' => $userName));
                $clientLevel = $userHdl->getClientLevelByUser();
                $integrationPercentage = $userHdl->getIntegrationPercentageByUserName();
                if ( $clientStatusDB == 'ENABLED' ) {
                    //Override percentage if client already Enabled
                    $integrationPercentage = 100;
                }

                $clientArray[$i]["id"] = $client['id'];
                $clientArray[$i]["userName"] = $userName;
                $clientArray[$i]["companyName"] = $client['companyName'];
                $clientArray[$i]["clientStatus"] = $clientStatusDB;
                $clientArray[$i]["userNameLevel"] = $clientLevel;
                $clientArray[$i]["email"] = $client['email'];
                $clientArray[$i]["phone"] = $client['phone'];
                $clientArray[$i]["integrationPercentage"] = $integrationPercentage;
                $clientArray[$i]["orderOriginType"] = ($orderOriginType == null ? "na" : $orderOriginType);
                $clientArray[$i]["orderOriginDescription"] = ($orderOriginDescription == null ? "na" : $orderOriginDescription);
                $clientArray[$i]["shippingZoneId"] = ($shippingZoneId == null ? "na" : $shippingZoneId);
                $clientArray[$i]["shippingZoneName"] = ($shippingZoneName == null ? "na" : $shippingZoneName);
                $clientArray[$i]["priceGroupId"] = ($priceGroupId == null ? "na" : $priceGroupId);
                $clientArray[$i]["priceGroupName"] = ($priceGroupName == null ? "na" : $priceGroupName);
                $clientArray[$i]["useGeneralShippingRates"] = $client['useGeneralShippingRates'];
                $clientArray[$i]["shippingModelId"] = ($shippingModelId == null ? "na" : $shippingModelId);
                $i += 1;
            }//foreach
        }//if client array not NULL

        return $clientArray;
    }

}//End of class