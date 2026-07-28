<?php


namespace App\Controllers;

use App\Models\AddressValidation;
use App\Models\Distance;
use App\Models\Test;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\HttpFoundation\Request;

class TestController extends baseController
{
    function __construct()
    {

    }

    /**
     * @param RouteCollection $routes
     * @throws \SoapFault
     */
    public function testAction(RouteCollection $routes)
    {
        $testHdl = new Test();

        $requestAddress = array(
            "orderId" => 16562288,
            "country" => "US",
            "address1" => "7702 TRASK AVE",
            "address2" => "",
            "city" => "Westminster",
            "zip" => "92683",
            "state" => "CA",
            "userName" => "canvasPeople",
            "shippingType" => "Basic",
            "locId" => 1,
            "carrier" => "FEDEX"
        );
        $result = "NOT THING TO TEST";
        $testAddHdl = new AddressValidation($requestAddress);
        //$result = $testAddHdl->validateAddress();
        //$result = $testAddHdl->cityStateLookup();
        //$result = $testAddHdl->getCountryIdFromCountryCode();
        //$result = $testAddHdl->checkStates();
        //$result = $testAddHdl->checkZipCode();
        //$result = $testAddHdl->addressValidationUsps();
        //$result = $testAddHdl->addressValidationFedex();
        //$result = $testAddHdl->addressValidationFull();

        /**
        $request = array(
            'country' => 'AU',
            'state' => 'QLD',
            'shippingZoneId' => 1
        );
        $result = $testHdl->getZoneName($request);
         */


        $testGeoHdl = new Distance();
        //$distance = $testGeoHdl->calculateDistance(95765, 95132);
        //$targetZip = 83646;
        //$result = $testGeoHdl->getShortestWPToClient($targetZip);
        //$result = $testGeoHdl->getPreferLocIdByTargetZip(49525);

        //Test token
        //$userId = 90;
        //$apiKey = "hs6fYcBz564sHj";
        //$result = generateNewToken($userId, $apiKey);



        //$result = $testHdl->getProductComponentDetails(11);

        $result = $testHdl->getBrandFees("01");


        $this->myVarDump($result, "my_test_result");

    }
}