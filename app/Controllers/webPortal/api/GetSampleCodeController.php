<?php

namespace App\Controllers\webPortal\api;

use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;

class GetSampleCodeController extends baseController
{
    function __construct()
    {

    }

    public function GetSampleCodeAction(RouteCollection $routes)
    {
        $request = $this->getRequest()->query->all();
        $type = isset($request['type']) ? $request['type'] : 'create';

        $files = array(
            'create'       => 'createOrder.php',
            'cancel'       => 'cancelOrder.php',
            'redo'         => 'redoOrder.php',
            'statusUpdate' => 'receivingStatusUpdate.php',
            'token'        => 'generatingToken.php',
        );

        $file = isset($files[$type]) ? $files[$type] : $files['create'];
        $this->downloadWebPortalApiFile($file);
    }

    private function downloadWebPortalApiFile($relativeFile)
    {
        $baseDir = dirname(__DIR__, 4) . DIRECTORY_SEPARATOR . 'webPortal' . DIRECTORY_SEPARATOR . 'api';
        $basePath = realpath($baseDir);
        $filePath = realpath($baseDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeFile));

        if ($basePath === false || $filePath === false || strpos($filePath, $basePath . DIRECTORY_SEPARATOR) !== 0) {
            http_response_code(404);
            echo '{"error":{"text":"Sample code file not found."}}';
            return;
        }

        header("Pragma: no-cache");
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }
}
