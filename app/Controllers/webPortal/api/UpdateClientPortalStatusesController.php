<?php


namespace App\Controllers\webPortal\api;

use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;

class UpdateClientPortalStatusesController extends baseController
{
    /**
     * UpdateClientPortalStatusesController constructor.
     */
    function __construct()
    {
        //parent::__construct("loginaction/verify");
    }

    public function doUpdateStatusesAction(RouteCollection $routes)
    {
        $request = $this->getInputRequest();
        $this->myVarDump($request);
    }

}//End of class