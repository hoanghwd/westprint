<?php


namespace App\Controllers\Cron;


use App\Controllers\baseController;
use App\Models\Images\ImageValidator;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class ImageValidationController extends baseController
{
    /**
     * ImageValidationController constructor.
     */
    function __construct()
    {

    }

    /**
     * @param RouteCollection $routes
     * @throws \Exception
     */
    public function imagevalidationAction(RouteCollection $routes)
    {
        $request = $this->getHttpRequest();
        $newImageHdl = new ImageValidator($request);
        $data = $newImageHdl->validateImages();

        echo json_encode($data);
    }

}//End of class