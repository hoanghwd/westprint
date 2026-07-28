<?php
namespace App\Controllers\webPortal\api;

use App\Controllers\baseController;
use App\Models\Orders\UpdateAddress;
use Symfony\Component\Routing\RouteCollection;

class UpdateAddressController extends baseController
{
    function __construct() {

    }

    public function UpdateAddressAction(RouteCollection $routes)
    {
        /**
         * <pre>DEBUG_<br/>array(16) {
        ["orderId"]=>
        int(16562260)
        ["country"]=>
        string(2) "US"
        ["reason"]=>
        string(48) "Customer Issues-shippingAddress-Formatting issue"
        ["modifierUser"]=>
        string(12) "canvasPeople"
        ["hdRequest"]=>
        string(1) "N"
        ["firstName"]=>
        string(4) "John"
        ["lastName"]=>
        string(3) "Doe"
        ["company"]=>
        string(12) "Company Name"
        ["address1"]=>
        string(18) "115 Canongate Kirk"
        ["address2"]=>
        string(0) ""
        ["city"]=>
        string(10) "Alpharetta"
        ["zip"]=>
        string(5) "30004"
        ["email"]=>
        string(14) "test@jondo.com"
        ["phone"]=>
        string(10) "5627898767"
        ["details"]=>
        string(0) ""
        ["state"]=>
        string(2) "GA"
        }
        </pre>
         */
        $request = $this->getInputRequest();
        $updateAddressHdl = new UpdateAddress($request);
        $results = $updateAddressHdl->updateAddress();

        echo json_encode($results);
    }

}//End of class