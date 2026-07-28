<?php

namespace App\Controllers\Ajax;
use App\Controllers\baseController;
use App\Models\Ajax\Search;
use Symfony\Component\Routing\RouteCollection;

class SearchController extends baseController
{
    /**
     * SearchController constructor.
     */
    function __construct() {
        parent::__construct("ajax/search");
    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function searchAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $newAjaxSearchHdl = new Search($request);
        $thumbnailArray = $newAjaxSearchHdl->getData();

        echo json_encode($thumbnailArray);
    }

}//End of class