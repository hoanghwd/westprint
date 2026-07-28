<?php

namespace App\Models\Cron;
use App\Models\Base;

class MasterScheduler extends Base
{
    private $_request;

    /**
     * MasterScheduler constructor.
     * @param $request
     */
    function __construct($request)
    {
        $this->_request = $request;
    }

}//End of class