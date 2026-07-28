<?php
namespace App\Models;

use App\Models\Base;


class User extends Base
{
    private $_request;
    private $_userInfo;

    /**
     * User constructor.
     * @param $request
     * @throws \Exception
     */
    function __construct($request)
    {
        /**
         * Incoming request
         * array(4) { ["userName"]=> string(3) "hdo" ["password"]=> string(15) "1234" ["rememberMe"]=> bool(false) ["recaptchaToken"]=> string(0) "" }
         */
        $this->_request = $request;

        if (isset($this->_request['userName'])) {
            //From HD.user
            $this->_userInfo = $this->getUserInfoByUsername();
        }
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function verifyRequestLogin()
    {
        $userInfoByRequest = $this->getUserFromRequest();

        return $this->is2ArrayTheSame($this->_userInfo, $userInfoByRequest);
    }

    /**
     * @param array $db
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    public function getUserInfoByUsername($db = HD_DB)
    {
        $db = $this->getResource($db)
                   ->where("userName", $this->_request['userName']);

        return $db->getOne("users");
    }

    /**
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    public function getUserFromRequest()
    {
        $userName = $this->_request['userName'];
        $password = $this->_request['password'];
        $encPassword = $this->encPassword($password);

        $db = $this->getResource(HD_DB)
                   ->where("userName", $userName)
                   ->where("password", $encPassword);

        return $db->getOne("users");
    }

    /**
     * @param bool $reqPassword
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    public function getSYNUserInfo($reqPassword)
    {
        $params = array($this->_userInfo['userName']);
        $db = $this->getResource(SYN_DB);
        $sql = "SELECT 
                      u.id, u.Username, u.apiKey, u.shipUrl, u.level, u.clientStatus, u.orderOrigin, u.shippingZoneId, u.pricingGroupId, u.shippingModelId,
                      u.mapProductUsingSku, u.isXMLResponse, u.sendUpdateInXML, p.exposeShippingService
                FROM users as u
                    LEFT JOIN permissions as p on u.userName = p.userName 
                WHERE u.userName = ?";

        if ($reqPassword) {
            $password = $this->_request['password'];
            $encPassword = $this->encPassword($password);
            array_push($params, $encPassword);
            $sql .= " AND u.password = ?";
        }

        $data = $db->rawQuery($sql, $params);

        //$this->dumpVar($data, "getSYNUserInfo");

        return $data[0];
    }

    /**
     * @param bool $reqPassword
     * @return array
     * @throws \Exception
     */
    public function getUserInfo($reqPassword = TRUE)
    {
        $synUserInfo = $this->getSYNUserInfo($reqPassword);
        $hdUserInfo = $this->getUserInfoByUsername();

        return
            array(
                'id' => $synUserInfo['id'],
                'userName' => $synUserInfo['Username'],
                'apiKey' => $this->encrypt2($synUserInfo['apiKey']),

                //Setting
                'level' => $synUserInfo['level'],
                'userStatus' => $synUserInfo['clientStatus'],
                'orderOrigin' => $synUserInfo['orderOrigin'],
                'mapProductUsingSku' => $synUserInfo['mapProductUsingSku'],
                'isXMLResponse' => $synUserInfo['isXMLResponse'],
                'sendUpdateInXML' => $synUserInfo['sendUpdateInXML'],

                //Contact
                'firstName' => $hdUserInfo['firstName'],
                'lastName' => $hdUserInfo['lastName'],
                'company' => $hdUserInfo['companyName'],
                'phone' => $hdUserInfo['phone'],
                'email' => $hdUserInfo['email'],
                'street' => $hdUserInfo['address'],
                'city' => $hdUserInfo['city'],
                'state' => $hdUserInfo['state'],
                'zip' => $hdUserInfo['zip'],
                'country' => $hdUserInfo['country'],

                //Shipping
                'shipUrl' => $synUserInfo['shipUrl'],
                'shippingZoneId' => $synUserInfo['shippingZoneId'],
                'pricingGroupId' => $synUserInfo['pricingGroupId'],
                'shippingModelId' => $synUserInfo['shippingModelId'],

                //Sale
                "salesRepId" => $hdUserInfo['salesRepId'],
                "salesRepEmail" => $hdUserInfo['salesRepEmail'],
                "gpCustomerId" => $hdUserInfo['gpCustomerId'],
                "alternateGpCustomerId" => $hdUserInfo['alternateGpCustomerId'],

                //Return Address Section
                'raCompanyName' => $hdUserInfo['raCompanyName'],
                'raAddress' => $hdUserInfo['raAddress'],
                'raCity' => $hdUserInfo['raCity'],
                'raState' => $hdUserInfo['raState'],
                'raZip' => $hdUserInfo['raZip'],
                'raCountry' => $hdUserInfo['raCountry'],
                'useReturnAddress' => $hdUserInfo['useReturnAddress'],

                //Premium Components section
                'premium' => $hdUserInfo['useReturnAddress'],
                'frontPackingSlip' => $hdUserInfo['useReturnAddress'],
                'backPackingSlip' => $hdUserInfo['backPackingSlip'],
                'packingSlipFooterText' => $hdUserInfo['packingSlipFooterText'],
                'outsideInsertCard' => $hdUserInfo['outsideInsertCard'],
                'insideInsertCard' => $hdUserInfo['insideInsertCard'],
                'frontSticker' => $hdUserInfo['frontSticker'],
                'templatePackingSlip' => $hdUserInfo['templatePackingSlip'],
                'customLogo' => $hdUserInfo['customLogo'],
                'allowPremiumHybrid' => $hdUserInfo['allowPremiumHybrid'],

                //Permissions
                'exposeShippingService' => $synUserInfo['exposeShippingService']
            );
    }

    /**
     * Get client SYN.apiUsersStatuses
     * @return array|\MysqliDb|string|null
     * @throws \Exception
     */
    public function getClientStatuses()
    {
        $statusArray = $this->getResource(SYN_DB)
                            ->where("userName", $this->_request['userName'])
                            ->get("apiUsersStatuses");

        $userStatusArray = array();
        $integrationPercentage = 0;

        if( isset($statusArray[0]) ) {
            $userStatusArray = $statusArray[0];
            $integrationPercentage = $userStatusArray['integrationPercentage'];
            if($integrationPercentage > 100){
                $integrationPercentage = 100;
            }
        }

        if( sizeof($userStatusArray) == 0 ) {
            $this->_insertNewApiUserStatus();
            $sectionArray['create'] = 'Started';
            $sectionArray['cancel'] = 'Started';
            $sectionArray['redo'] = 'Started';
            $sectionArray['status'] = 'Started';

            return
                array(
                    "sectionStatus" => $sectionArray,
                    "curStage" => "",
                    "curPage" => '',
                    "integrationPercentage" => $integrationPercentage
                );
        }
        else {
            $sectionName = $userStatusArray['sectionName'];
            $sectionStatus = $userStatusArray['sectionStatus'];
            $statusArray["sectionStatus"][$sectionName] = $sectionStatus;
            $statusArray["curStage"] = $userStatusArray['curStage'];
            $statusArray["curPage"] = $userStatusArray['curPage'];
            $statusArray["integrationPercentage"] = $integrationPercentage;

            return $statusArray;
        }
    }

    /**
     * @throws \Exception
     */
    private function _insertNewApiUserStatus()
    {
        $userName = $this->_request['userName'];
        $sqlInsert = "INSERT INTO  apiUsersStatuses  (userName, sectionName, sectionStatus) 
                      VALUES 
                      ('$userName', 'create', 'Started'),
                      ('$userName', 'cancel', 'Started'), 
                      ('$userName', 'redo', 'Started'), 
                      ('$userName', 'status', 'Started')";
        $this->rawSYNQuery($sqlInsert);
    }

    /**
     * @return array
     * @throws \Exception
     */
    protected function getLocationInfo()
    {
        $sqlLocation = "SELECT locationCode, name FROM locations";
        $allLocations = $this->rawHDQuery($sqlLocation);

        $locations = array();
        foreach ($allLocations AS $row) {
            $locationCode = $row['locationCode'];
            $name = $row['name'];
            $locations[] = "$locationCode - $name";
        }

        return $locations;
    }

    /**
     * @param string $type
     * @return array
     * @throws \Exception
     */
    protected function getStatus($type = 'all')
    {
        $sqlStatus = "SELECT name, type FROM jondoApiStatus";
        if( $type != 'all' ) {
            $sqlStatus = " AND type='$type'";
        }
        $allStatus = $this->rawSYNQuery($sqlStatus);

        $status = array();
        foreach ($allStatus AS $row) {
            $type = $row['type'];
            $name = $row['name'];
            $status[$type][] = $name;
        }

        return $status;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function getLoginData()
    {
        $reqPassword = isset($this->_request['requirePassword']) ? $this->_request['requirePassword'] : TRUE;
        $userInfo = $this->getUserInfo($reqPassword);
        $status = $this->getStatus();

        /**
         * id, apiKey, phone, email, street, city, zip, state, country, shipUrl, level, userStatus,
         * clientPortalStatuses, jwt, locations, order, request, status, clientStatuses, company, orderOrigin
         */

        return
            array (
                "id" => $userInfo['id'],
                "apiKey" => $userInfo['apiKey'],
                "phone" => $userInfo['phone'],
                "email" => $userInfo['email'],
                "street" => $userInfo['street'],
                "city" => $userInfo['city'],
                "state" => $userInfo['state'],
                "zip" => $userInfo['zip'],
                "country" => $userInfo['country'],
                "shipUrl" =>  $userInfo['shipUrl'],
                "level" => $userInfo['level'],
                "userStatus" => $userInfo['userStatus'],
                "company" => $userInfo['company'],
                "orderOrigin" => $userInfo['orderOrigin'],
                "locations" => $this->getLocationInfo(),
                "order" => $status['Order'],
                "status" => $status['Status'],
                "request" => $status['Request'],
                "clientStatuses" => $status['Client'],
                "jwt" => $this->encodeJWT($userInfo),
                "JWTExpires" => JWTExpiration - 20,
                "clientPortalStatuses" => $this->getClientStatuses()
            );
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    public function getClientLevelByUser()
    {
        $sql = "SELECT `level` FROM users WHERE userName = ? LIMIT 1";
        $results = $this->rawSYNQuery($sql, array($this->_request['userName']));
        if( isset($results[0]) ) {
            return $results[0]['level'];
        }

        return '';
    }

    /**
     * @return mixed|string
     * @throws \Exception
     */
    public function getIntegrationPercentageByUserName()
    {
        $sql = "SELECT integrationPercentage FROM apiUsersStatuses WHERE userName = ? LIMIT 1";
        $results = $this->rawSYNQuery($sql, array($this->_request['userName']));
        if( isset($results[0]) ) {
            return $results[0]['integrationPercentage'];
        }

        return '';
    }

    /**
     * @param $tagName
     * @return bool
     * @throws \Exception
     */
    public function checkXmlPermission($tagName)
    {
        $sql = "SELECT id 
                FROM xmlPermissions 
                WHERE userName = ? AND $tagName = 1 LIMIT 1";
        $data = $this->rawSYNQuery($sql, array($this->_request['userName']));

        return isset($data[0]);
    }

    /**
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    public function getUserPermission()
    {
        $data =
            $this->getResource(SYN_DB)
                 ->where('userName', $this->_request['userName'])
                 ->get('permissions', 1);

        return isset( $data[0] ) ? $data[0] : '';
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function getSimpleClientInfo()
    {
        $sql = "SELECT 
                    u.userName, u.discountPercent, u.level, u.thirdPartyERPApi, u.orderOrigin, u.clientStatus, 
                    u.shippingModelId, s.accountBilled, u.useGeneralShippingRates, u.shippingZoneId, u.pricingGroupId, u.mapProductUsingSKU  
                FROM users u
                    INNER JOIN shippingModels s ON  u.shippingModelId = s.id 
                WHERE u.userName = ? 
                LIMIT 1";
        /**
         * pre>DEBUG_<br/>array(1) {
        [0]=>
        array(12) {
        ["userName"]=>
        string(12) "canvasPeople"
        ["discountPercent"]=>
        string(0) ""
        ["level"]=>
        string(5) "basic"
        ["thirdPartyERPApi"]=>
        string(29) "http://ak-jondo.jondodev.com/"
        ["orderOrigin"]=>
        string(6) "retail"
        ["clientStatus"]=>
        string(7) "ENABLED"
        ["shippingModelId"]=>
        int(2)
        ["accountBilled"]=>
        string(5) "jondo"
        ["useGeneralShippingRates"]=>
        string(1) "N"
        ["shippingZoneId"]=>
        int(1)
        ["pricingGroupId"]=>
        int(6)
        ["mapProductUsingSKU"]=>
        string(1) "N"
        }
        }
         */
        $data = $this->rawSYNQuery($sql, array($this->_request['userName']));

        return
            array(
                'accounts'   => $data[0],
                'permission' => $this->getUserPermission()
            );

    }

    /**
     * @return int|mixed
     * @throws \Exception
     */
    public function getLoginAttempts()
    {
        $userName = $this->_request['userName'];
        $data =
            $this->getResource(HD_DB)
                 ->where('userName', $userName)
                 ->get('users', 1, 'loginAttempts');

        return isset($data[0]) ? $data[0]['loginAttempts'] : 0;
    }

    /**
     * @param false $reset
     * @throws \Exception
     */
    public function setLoginAttempt($reset = false)
    {
        $userName = $this->_request['userName'];
        $ip = requestIp();
        $timeStamp = getTimeStamp();

        if ($reset) {
            $sqlLoginAttempts = "UPDATE users SET lastLoginIp = ?, lastLogin = ?, loginAttempts = 0 WHERE userName = ?";
        }
        else {
            $sqlLoginAttempts = "UPDATE users SET lastLoginIp = ?, lastLogin = ?, loginAttempts = loginAttempts + 1 WHERE userName = ?";
        }

        $this->rawHDQuery($sqlLoginAttempts, array($ip, $timeStamp, $userName));
    }

}//End of class