<?php


namespace App\Controllers;

use App\Models\GlobalSearch;
use App\Models\Search;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;


class SearchController extends baseController
{
    /**
     * ProductController constructor.
     */
    function __construct() {
        parent::__construct("search");
    }

    /**
     * @param RouteCollection $routes
     */
    public function searchAction(RouteCollection $routes)
    {
        /**
         *  _DEBUG
            array(4) {
            ["whereToSearch"]=>
            string(5) "inSYN"
            ["searchByKeyWord"]=>
            string(8) "username"
            ["whatToSearch"]=>
            string(12) "canvasPeople"
            ["submit"]=>
            string(2) "Go"
        }
         */
        $request = $this->getHttpRequest();
        $searchHdl = new GlobalSearch($request);

        $this->render($searchHdl);
    }

}//End of class