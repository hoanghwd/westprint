<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');

require_once "jondoerp_settings.php";
require_once("clientsWebPortal.inc.php");

$request = file_get_contents("php://input");
$requestArray = json_decode($request, true);


$validationError = False;
$errorMessage = "";

$clientsWebPortal = new clientsWebPortal();
/*
$decodeJWT = $clientsWebPortal->validateJWT();
//print_r($decodeJWT);

if (!$decodeJWT["response"]){
	echo '{"error":{"text":"'.$decodeJWT["message"].'"}}';
	exit();
}
*/

$userName = trim($requestArray['userName']);
//$userName = trim($_GET["userName"]);
//$userName = 'canvasPeople';/////  HARDCODE!!!!!!!!!!!!!!!!!!!!!!
if($userName == "" || $userName == "undefined"){
	$validationError = True;
	$errorMessage = "Wrong User Name.";
}


if($validationError){
	echo '{"error":{"text":"'.$errorMessage.'"}}';
	exit();
}

$clientsWebPortal->generateDynamicTestPlan($userName);
$clientsWebPortal->updateDynamicTestPlan($userName);

echo "{response:true}";

?>