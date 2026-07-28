<?php

namespace App\Controllers\webPortal\api;

use Symfony\Component\Routing\RouteCollection;
use App\Controllers\baseController;

class GetSampleTemplateController extends baseController
{
    function __construct()
    {

    }

    public function GetSampleTemplateAction(RouteCollection $routes)
    {
        $request = $this->getRequest()->query->all();
        $type = isset($request['type']) ? $request['type'] : '';

        $files = array(
            'card-insert-landscape' => 'premiumBrandingTemplates/card-insert-landscape.psd',
            'card-insert-portrait'  => 'premiumBrandingTemplates/card-insert-portrait.psd',
            'logo'                  => 'premiumBrandingTemplates/logo.psd',
            'packing-slip-back'     => 'premiumBrandingTemplates/packing-slip-back.psd',
            'packing-slip-front'    => 'premiumBrandingTemplates/packing-slip-front.psd',
            'premium-branding'      => 'premiumBrandingTemplates/premium-branding.pdf',
            'sticker-landscape'     => 'premiumBrandingTemplates/sticker-landscape.psd',
            'sticker-portrait'      => 'premiumBrandingTemplates/sticker-portrait.psd',
        );

        if (!isset($files[$type])) {
            http_response_code(404);
            echo '{"error":{"text":"Sample template type not found."}}';
            return;
        }

        $this->downloadWebPortalApiFile($files[$type]);
    }

    private function downloadWebPortalApiFile($relativeFile)
    {
        $baseDir = dirname(__DIR__, 4) . DIRECTORY_SEPARATOR . 'webPortal' . DIRECTORY_SEPARATOR . 'api';
        $basePath = realpath($baseDir);
        $filePath = realpath($baseDir . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeFile));

        if ($basePath === false || $filePath === false || strpos($filePath, $basePath . DIRECTORY_SEPARATOR) !== 0) {
            http_response_code(404);
            echo '{"error":{"text":"Sample template file not found."}}';
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
