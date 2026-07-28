<?php


namespace App\Models;

use App\Models\Base;
use Dompdf\Exception;


class GlobalSearch extends Base
{
    const searchField =
        array(
            'username' => 'By Owner',
            'poNumber' => 'By PO Number',
            'id' => 'By Order Id',
            'locId' => 'By Loc ID',
        );
    const PER_PAGE = 100;
    const CLIENT_SUGGEST_LIMIT = 50;

    /**
     * @var string
     * /**
     * PRINT_$this->_request
     * array(4) {
     * ["whereToSearch"]=>
     * string(5) "inSYN"
     * ["searchByKeyWord"]=>
     * string(8) "username"
     * ["whatToSearch"]=>
     * string(12) "canvasPeople"
     * ["submit"]=>
     * string(2) "Go"
     * }
     */
    private $_request;
    private $_whereToSearch;

    /**
     * Search constructor.
     * @param string $request
     */
    function __construct($request = '')
    {
        /**
         * @var string
         * /**
         * PRINT_$this->_request
         * array(4) {
         * ["whereToSearch"]=>
         * string(5) "inSYN"
         * ["searchByKeyWord"]=>
         * string(8) "username"
         * ["whatToSearch"]=>
         * string(12) "canvasPeople"
         * ["submit"]=>
         * string(2) "Go"
         * }
         */
        $this->_request = $request;
        $this->_whereToSearch = isset($this->_request['whereToSearch']) ?
            $this->_request['whereToSearch'] : '';
    }

    /**
     * Render search
     */
    public function renderTopSearchHtml()
    {
        require_once VIEW_DIR . 'templates/search.phtml';
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function getClientNames()
    {
        $clientNamesArray = array();
        $request = array(
            "limit" => self::CLIENT_SUGGEST_LIMIT,
            "orderBy" => "userName",
            "descAsc" => "asc",
            "adminName" => $_SESSION['userName']
        );
        //https://www.huynhdo.us/westprint/webPortal/api/listclients?orderBy=userName&descAsc=desc&adminName=hdo&limit=100
        $listClientsHld = new ListClients($request);
        $data = $listClientsHld->doListClients();

        if (sizeof($data['clients']) > 0) {
            foreach ($data['clients'] as $row) {
                array_push($clientNamesArray, $row['userName']);
            }
        }

        return $clientNamesArray;
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    private function _doGetSearchResultData()
    {
        $remainingQuery = $this->_createRemainingSql();
        $page = (isset($this->_request['page'])) ? $this->_request['page'] : 1;
        $perPage = self::PER_PAGE;
        $limitMin = ($page - 1) * $perPage;

        $query =
            "SELECT 
                hdORD.id hdId, synORD.id synId, hdORD.poNumber, synORD.poNumber synPO,hdORD.`unixTs`, hdORD.gallery, hdORD.numberPrints, 
                hdORD.locId, hdORD.departmentStatus, hdORD.departmentList, hdORD.invoiceNumber, hdORD.customerPo, 
                hdORD.isRedo, hdORD.shipTime, hdORD.slaStartDate, hdORD.slaEndTime,
                loc.`name` locName
             FROM harvestd_harvestDigital.users usr  
                LEFT JOIN harvestd_harvestDigital.orders hdORD ON hdORD.gallery = usr.userName 
                INNER JOIN harvestd_synergize.orders synORD on hdORD.poNumber = synORD.id
                INNER JOIN locations loc ON loc.id = hdORD.locId
             WHERE $remainingQuery
             GROUP BY hdORD.id 
             ORDER BY `unixTs` DESC 
             LIMIT $limitMin, $perPage";

        if( !$remainingQuery ) {
            return '';
        }
        //echo $query;
        try {
            return $this->rawHDQuery($query);
        }
        catch (Exception $e) {
        }
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function getSearchResultData()
    {
        /**
         * @var string
         * /**
         * PRINT_$request
         * array(4) {
         * ["searchByKeyWord"]=>
         * string(8) "username"
         * ["whatToSearch"]=>
         * string(12) "canvasPeople"
         * }
         */
        return $this->_doGetSearchResultData();
    }

    /**
     * @param $hdOrderId
     * @return false|mixed|string
     * @throws \Exception
     */
    public function getThumbnailArrayByHdId($hdOrderId)
    {
        $data = $this->_getThumbnailDataByHdId($hdOrderId);
        $thumbArray = array();

        if( $this->isNotEmptiedArray($data) ) {
            foreach ($data AS $images) {
                $thumbLocation = $images['thumbLocation'];
                if (filter_var($thumbLocation, FILTER_VALIDATE_URL)) {
                    $error = getImgThumbnailErrorXML($thumbLocation);
                    if( $error != '' ) {
                        $thumbLocation = $error;
                    }
                }

                array_push($thumbArray, $thumbLocation);
            }//foreach
        }

        return $thumbArray;
    }

    /**
     * @param $hdOrderId
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    private function _getThumbnailDataByHdId($hdOrderId)
    {
        $data =
            $this->getResource(HD_DB)
                 ->where('orderId', $hdOrderId)
                 ->get('orderSkus', NULL, array('id', 'thumbLocation'));

        return $this->isNotEmptiedArray($data) ? $data : '';
    }

    /**
     * @param $hdOrderId
     * @return string
     * @throws \Exception
     */
    public function getTicketStatusByHdOrderId($hdOrderId)
    {
        $ticketIssueArray = $this->_getOrderIssueType($hdOrderId);

        $ticketIssue = '';
        if( $this->isNotEmptiedArray($ticketIssueArray) ) {
            foreach ($ticketIssueArray as $ticket) {
                $ticketIssue .= $ticket['issue_type']. ' : ' . upperCaseFirst($ticket['status']) . "<br/>";
            }
        }

        return $ticketIssue;
    }

    /**
     * @param $hdOrderId
     * @return array|\MysqliDb|string
     * @throws \Exception
     */
    private function _getOrderIssueType($hdOrderId)
    {
        $data =
            $this->getResource(HD_DB)
                ->where('order_id', $hdOrderId)
                ->get('tickets', NULL, array('issue_type', 'status'));

        return $this->isNotEmptiedArray($data) ? $data : '';
    }

    /**
     * @return false|string
     */
    private function _createRemainingSql()
    {
        $request = $this->_request;
        unset($request['submit']);
        unset($request['whereToSearch']);

        $searchByKeyWord = $request['searchByKeyWord'];
        $whatToSearch = $request['whatToSearch'];
        $searchValueArray = explode(',', $whatToSearch);
        $arrayIsString = array("gallery", "poNumber", "owner");
        $dbAlias = '';

        if( !array_key_exists($searchByKeyWord, self::searchField) ) {
            return FALSE;
        }

        //In SYN
        if ($this->_whereToSearch == "inSYN") {
            $dbAlias = "synORD.";
            if ($searchByKeyWord == "username") {
                $searchByKeyWord = "owner";
            }
        }
        else if ($this->_whereToSearch == "inHD") {
            $dbAlias = "hdORD.";
            if ($searchByKeyWord == "username") {
                $searchByKeyWord = "gallery";
            }
        }

        if ($this->isNotEmptiedArray($searchValueArray)) {
            $newSearchString = '';
            foreach ($searchValueArray as $value) {
                //string
                if (in_array($searchByKeyWord, $arrayIsString)) {
                    $newSearchString .= "'" . $value . "',";
                }
                else {
                    $newSearchString .= $value . ',';
                }
            }//foreach

            $whatToSearch = rtrim($newSearchString, ",");
        }
        else if (in_array($searchByKeyWord, $arrayIsString)) {
            $newSearchString = "'" . $whatToSearch . "'";
            $whatToSearch = $newSearchString;
        }

        return " ( $dbAlias$searchByKeyWord IN ($whatToSearch) ) ";
    }

}//End of class