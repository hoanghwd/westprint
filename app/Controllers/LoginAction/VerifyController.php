<?php
namespace App\Controllers\LoginAction;

use App\Controllers\baseController;
use App\Models\LoginAction\Verify;
use Symfony\Component\Routing\RouteCollection;

class VerifyController extends baseController
{
    /**
     * VerifyController constructor.
     */
    function __construct() {
        parent::__construct("loginaction/verify");
    }

    /**
     * @param RouteCollection $routes
     */
    public function verifyAction(RouteCollection $routes)
    {
        $request = $this->getRequest()->request->all();
        $verifyHdl = new Verify($request);

        $this->render($verifyHdl, false, false);
    }

}//End of class