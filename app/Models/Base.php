<?php

namespace App\Models;

use \Firebase\JWT\JWT;

class Base extends Resource
{
    public function dumpVar($myVar, $title = '')
    {
        echo "<pre>";
        echo "PRINT_" . $title . "<br/>";
        var_dump($myVar);
        echo "</pre>";
    }

    public function test()
    {
        echo "This model is OK";
    }

    /**
     * @param $password
     * @return string
     */
    protected function encPassword($password)
    {
        return md5(ENC_KEY . $password);
    }

    /**
     * @param $data
     * @return string
     */
    protected function encrypt2($data)
    {
        $key = WAY_2_ENC_KEY;
        $plaintext = $data;
        $ivlen = openssl_cipher_iv_length($cipher = WAY_2_ENC_MODE);
        $iv = openssl_random_pseudo_bytes($ivlen);
        $ciphertext_raw = openssl_encrypt($plaintext, $cipher, $key, $options = OPENSSL_RAW_DATA, $iv);
        $hmac = hash_hmac(ALOG, $ciphertext_raw, $key, $as_binary = true);

        return base64_encode($iv . $hmac . $ciphertext_raw);
    }

    /**
     * @param $data
     * @return false|string
     */
    public function decrypt2($data)
    {
        $key = WAY_2_ENC_KEY;
        $c = base64_decode($data);
        $ivlen = openssl_cipher_iv_length($cipher = WAY_2_ENC_MODE);
        $iv = substr($c, 0, $ivlen);
        $hmac = substr($c, $ivlen, $sha2len = SHA_LEN);
        $ciphertext_raw = substr($c, $ivlen + $sha2len);
        $original_plaintext = openssl_decrypt($ciphertext_raw, $cipher, $key, $options = OPENSSL_RAW_DATA, $iv);
        $calcmac = hash_hmac(ALOG, $ciphertext_raw, $key, $as_binary = true);

        if (hash_equals($hmac, $calcmac)) {
            return $original_plaintext;
        }

        return '';
    }

    /**
     * @param $str1
     * @param $str2
     * @return bool
     */
    protected function is2StringIdentical($str1, $str2)
    {
        return (strcmp($str1, $str2) == 0);
    }

    /**
     * Compare 2 array
     * @param $arr1
     * @param $arr2
     * @return bool
     */
    public function is2ArrayTheSame($arr1, $arr2)
    {
        if (
            $this->isNotEmptiedArray($arr1) &&
            $this->isNotEmptiedArray($arr2)
        ) {
            $result = array_diff($arr1, $arr2);

            /**
             * 0 : matched user
             * > 0 : not matched user
             */
            return (sizeof($result) == 0);
        }

        return false;
    }

    /**
     * @param $myArray
     * @return bool
     */
    public function isNotEmptiedArray($myArray)
    {
        return (is_array($myArray) && sizeof($myArray) > 0);
    }

    /**
     * @param $payload
     * @return mixed
     */
    public function encodeJWT($payload)
    {
        $payload["exp"] = time() + JWTExpiration;

        return JWT::encode($payload, JWTKey);
    }

    /**
     * @param $jwt
     * @return array
     */
    public function decodeJWT($jwt)
    {
        try {
            $payload = JWT::decode($jwt, JWTKey, array('HS256'));
            //echo "Data payload: <pre>";
            //print_r($payload);
            //echo "</pre>";
            return array("response" => true, "payload" => $payload);

        }
        catch (Exception $e) {
            return array("response" => false, "message" => $e->getMessage());
        }
    }

    /**
     * @return array
     */
    public function validateJWT()
    {
        $jwt = false;
        foreach (getallheaders() as $name => $value) {
            if (strtolower($name) == "authorization") {
                $tmp = explode("Bearer ", $value);
                if (isset($tmp[1])) {
                    $jwt = trim($tmp[1]);
                }
                break;
            }
        }

        if (!$jwt) {
            return array("response" => false, "message" => "Wrong header.");
        }

        return $this->decodeJWT($jwt);
    }

    /**
     * @param $orderId
     * @return mixed
     * @throws \Exception
     */
    public function getShippingInfoBySYNOrderId($orderId)
    {
        $sql = "SELECT
                    synORD.id synId, USR.apiKey, USR.id userId, USR.userName,
                    synORD.country, synORD.state,synORD.locId, hdORDERS.lockedAt,
	                USR.useGeneralShippingRates, synORD.shippingType,
	                synORD.shippingZoneId, synORD.pricingGroupId, hdORDERS.shipping,
	                hdORDERS.shippingModelId, hdORDERS.carrier,
	                hdORDERS.id hdId, hdORDERS.orderReferenceId, hdORDERS.gallery, hdORDERS.groupId,
	                hdORDERS.departmentStatus, hdORDERS.departmentList,
	                hdORDERS.locId, hdORDERS.slaDays, hdORDERS.slaStartDate, hdORDERS.slaEndDate, 
	                hdORDERS.cancelTime, hdORDERS.slaEndTime, hdORDERS.unixTs, synORD.locId AS myLocId
                FROM
                    harvestd_synergize.orders synORD
                    INNER JOIN harvestd_synergize.users USR ON USR.userName = synORD.`owner` 
                    LEFT JOIN harvestd_harvestDigital.orders hdORDERS ON hdORDERS.poNumber = synORD.id
                WHERE	
                    synORD.id = ?
                LIMIT 1";

        $data = $this->rawSYNQuery($sql, array($orderId));
        $shippingInfo = $data[0];
        $shippingInfo['apiKey'] = $this->encrypt2($shippingInfo['apiKey']);
        //Strange!! why DB couldn't read locId but myLocId is OK
        $shippingInfo['locId'] = $shippingInfo['myLocId'];
        unset($shippingInfo['myLocId']);

        return $shippingInfo;
    }

    /**
     * @return false|mixed
     */
    public function getUserInfoJWTData()
    {
        if ($this->isLoggedIn()) {
            $userInfoJWT = object_to_array($this->decodeJWT($_COOKIE['jwt']));
            return $userInfoJWT['payload'];
        }

        return FALSE;
    }

    /**
     * @return bool
     */
    public function isLoggedIn()
    {
        if (isset($_COOKIE['jwt'])) {
            $userInfoJWT = object_to_array($this->decodeJWT($_COOKIE['jwt']));
            $isJWTConfirmed = $userInfoJWT['response'];
            $userInfo = $userInfoJWT['payload'];

            return
                $isJWTConfirmed && $this->isNotEmptiedArray($userInfo) &&
                isset($_SESSION['userName']) && $this->is2StringIdentical($_SESSION['userName'], $userInfo['userName']) &&
                isset($_SESSION['loginSuccess']) && $_SESSION['loginSuccess'] == TRUE;
        }

        return FALSE;
    }

    public function createCustomModal($type, $styleArr = array())
    {
        //Default shared CLASS styling if $styleArr is empty
        $main = (isset($styleArr["main"])) ? $styleArr["main"] : "modal";
        $body = (isset($styleArr["body"])) ? $styleArr["body"] : "modalBody";
        $header = (isset($styleArr["header"])) ? $styleArr["header"] : "modalHeader";
        $form = (isset($styleArr["form"])) ? $styleArr["form"] : "modalForm";
        $divider = (isset($styleArr["divider"])) ? $styleArr["divider"] : "modalDivider";
        $confirmArea = (isset($styleArr["confirm"])) ? $styleArr["confirm"] : "modalConfirmation";
        $acceptBtn = (isset($styleArr["acceptBtn"])) ? $styleArr["acceptBtn"] : "navyBtn";
        $formTxt = (isset($styleArr["formTxt"])) ? $styleArr["formTxt"] : "";

        $modalObjId = '';
        $headerTxtId = '';
        $headerTxt = '';
        $formTxtId = '';
        $cancelBtn = '';
        $cancelId = '';
        $confirmId = '';

        //Default ID styling/identification if $styleArr is empty
        if ($type == "alert") {
            $modalObjId = (isset($styleArr["modalObjId"])) ? $styleArr["modalObjId"] : "modalAlert";
            $headerTxtId = (isset($styleArr["headerTxtId"])) ? $styleArr["headerTxtId"] : "alertHeaderTxtId";
            $headerTxt = (isset($styleArr["headerTxt"])) ? $styleArr["headerTxt"] : "Note";
            $formTxtId = (isset($styleArr["formTxtId"])) ? $styleArr["formTxtId"] : "msgAlert";
            $confirmId = (isset($styleArr["confirmId"])) ? $styleArr["confirmId"] : "acceptAlert";
        }
        else if ($type == "confirm") {
            $modalObjId = (isset($styleArr["modalObjId"])) ? $styleArr["modalObjId"] : "modalConfirm";
            $headerTxtId = (isset($styleArr["headerTxtId"])) ? $styleArr["headerTxtId"] : "confirmHeaderTxtId";
            $headerTxt = (isset($styleArr["headerTxt"])) ? $styleArr["headerTxt"] : "Confirm your action";
            $formTxtId = (isset($styleArr["formTxtId"])) ? $styleArr["formTxtId"] : "msgConfirm";
            $cancelBtn = (isset($styleArr["cancelBtn"])) ? $styleArr["cancelBtn"] : "whiteBtn";
            $cancelId = (isset($styleArr["cancelId"])) ? $styleArr["cancelId"] : "cancelConfirm";
            $confirmId = (isset($styleArr["confirmId"])) ? $styleArr["confirmId"] : "acceptConfirm";
        }

        //Optional CLASS and ID styling
        $addSubHeader = "";
        if (isset($styleArr["subHeader"]) || isset($styleArr["subHeaderId"]))
            $addSubHeader = "<div class='row {$styleArr["subHeader"]}' id='{$styleArr["subHeaderId"]}'></div>";

        $html =
            "<div class='$main' id='$modalObjId'>"
            . "<div class='$body'>"
                . "<div class='row $header'><span id='$headerTxtId'>$headerTxt</span></div>"
                    . $addSubHeader . "<div class='$form' id='$formTxtId' style='overflow-wrap:break-word;'>$formTxt</div>"
                    . "<hr class='$divider'>"
                    . "<div class='$confirmArea'>";

        if ($type == "confirm") $html .= "<button class='$cancelBtn' id='$cancelId'>Cancel</button> ";
        $html .= "<button class='$acceptBtn' id='$confirmId'>OK</button>";

        echo $html .    "</div>
                    </div>
               </div>";  //close up divs for [confirmArea], [body], and [main]
    }

    /**
     * @param $myPage
     * @param string $modelObj
     */
    public function renderPage($myPage, $modelObj = '')
    {
        require_once VIEW_DIR.($myPage).'.phtml';
    }

    /**
     * @param $tableName
     * @param $columnName
     * @param $where
     * @param $whereValue
     * @return mixed|string
     * @throws \Exception
     */
    public function getHDExactOne($tableName, $columnName, $where, $whereValue)
    {
        $data =
            $this->getResource(HD_DB)
                ->where($where, $whereValue)
                ->get($tableName, 1, $columnName);

        return isset($data[0]) ? $data[0][$columnName] : '';
    }

    /**
     * @param $tableName
     * @param $columnName
     * @param $where
     * @param $whereValue
     * @return mixed|string
     * @throws \Exception
     */
    public function getSYNExactOne($tableName, $columnName, $where, $whereValue)
    {
        $data =
            $this->getResource(SYN_DB)
                ->where($where, $whereValue)
                ->get($tableName, 1, $columnName);

        return isset($data[0]) ? $data[0][$columnName] : '';
    }

    /**
     * @param $userId
     * @param $token
     * @return bool
     * @throws \Exception
     */
    public function verifyAccessToken($userId, $token)
    {
        $expire = '';

        if( $userId != '' && $token != '' ) {
            $sql = "SELECT expires 
                    FROM oauth_access_tokens
                    WHERE access_token = '$token' AND client_id = $userId";

            $data = $this->rawSYNQuery($sql);
            $expire = isset($data[0]) ? $data[0]['expires'] : '';
        }

        //echo $sql."<br/>";
        //echo "expire=".$expire.' - now in server='. date('m/d/Y H:i:s', time())."<br/>";

        if ( $expire != '' && strtotime($expire) >= time() ) {
            return true;
        }

        return false;
    }

    /**
     * @param $myString
     * @return string
     * @throws \Exception
     */
    public function myEscape($myString)
    {
        return $this->getResource(SYN_DB)->escape($myString);
    }

}//End of class