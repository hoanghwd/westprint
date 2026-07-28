<?php


namespace App\Models\Ajax;
use App\Models\Base;
use App\Models\GlobalSearch;

class Search extends Base
{
    private $_request;

    /**
     * Search constructor.
     * @param $request
     */
    function __construct($request) {
        $this->_request = $request;
    }

    /**
     * @throws \Exception
     */
    public function getData()
    {
        $data = '';

        switch ($this->_request['key']) {
            case 'thumbnail':
                $data = $this->_getThumbnailArrayByHdId();
                break;
            default:
                $data = array();
                break;
        }

        return $data;
    }

    /**
     * @return array|false|mixed|string
     * @throws \Exception
     */
    private function _getThumbnailArrayByHdId()
    {
        $hdOrderId = $this->_request['hdOrderId'];
        $globalSearchHdl = new GlobalSearch();

        return $globalSearchHdl->getThumbnailArrayByHdId($hdOrderId);
    }

}//End of class