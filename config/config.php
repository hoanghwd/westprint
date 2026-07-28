<?php
//App Root
define('APP_ROOT', dirname(dirname(__FILE__)));
define('URL_ROOT', '/');
define('URL_SUBFOLDER', '');

//site name
define('SITE_ROOT_SHORT', 'https://dev.huynhdous.com');
define('SITE_NAME', 'West Print');
define('SITE_ROOT', '/');
define('SITE_WSDL', SITE_ROOT_SHORT . '/wsdl/');
define('SITE_WEB_LOGIN_API_PORTAL', SITE_ROOT_SHORT . '/loginapiportal');
define('SITE_WEB_PORTAL', SITE_ROOT_SHORT . '/webPortal/');
define('WESTPRINT_API', 'webPortal/api');
define('ENC_KEY', '2slasher2');

//DB Params
define('DB_HOST', 'www.huynhdous.com');
define('DB_USER', 'webappuser');
define('DB_PASS', '!webAppuser2024@');

const HD_DB = array(
    'host' => DB_HOST,
    'username' => DB_USER,
    'password' => DB_PASS,
    'db' => 'harvestd_harvestDigital',
    'port' => 3306,
    'charset' => 'utf8');
const SYN_DB = array(
    'host' => DB_HOST,
    'username' => DB_USER,
    'password' => DB_PASS,
    'db' => 'harvestd_synergize',
    'port' => 3306,
    'charset' => 'utf8');

//WP address
CONST WP_ADDRESS = "1 Print Wy";
CONST WP_CITY = "Los Angeles";
const WP_STATE = "CA";
CONST WP_COUNTRY = "US";
CONST WP_ZIP = 92001;
const WP_PHONE = "800-1WP-FAST";
CONST WP_EMAIL = "info@westprint.com";

//DIR
const VIEW_DIR = APP_ROOT . '/views/';
const MODELS_DIR = APP_ROOT. '/app/Models/';
const LIB_DIR = APP_ROOT . '/app/Lib/';
CONST CONTROLLER_DIR = APP_ROOT. '/app/Controllers/';
CONST WP_IMAGES_SAVE_FOLDER = APP_ROOT."/public/images/customers/";

//Encryption
const WAY_2_ENC_KEY = "eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZC";
CONST WAY_2_ENC_MODE = "AES-128-CBC";
CONST ALOG = "sha256";
CONST SHA_LEN = 32;

//URL
const CSS_URL = SITE_ROOT . 'public/css/';
const JS_URL = SITE_ROOT . 'public/js/';
const IMAGES_URL = SITE_ROOT . 'public/images/';
CONST CUSTOMER_IMAGES_URL = SITE_ROOT . 'public/images/customers/';

//JWT
CONST JWTKey = "eyJpc3MiOiJodHRwOlwvXC9leGFtcGxlLm9yZyIsImF1ZC"; //Any large key for encode/decode
CONST JWTExpiration = 86400; //In seconds 60 * 60 * 24 =86400
CONST SPECIAL_CHARS_PATTERN = '/[\Â£$%*()}{@~?:><>|=+"[\]\/]/';
CONST COOKIE_DOMAIN = 'www.huynhdo.us';

//Params
// Add 23:59:59 to date
const TIME_INTERVAL = 'PT23H59M59S';
CONST SECS_DAY = 86400;
CONST UPS_ACCOUNT = "606JONDO1738";
const MAX_BACKlINE_PRINT = 60;

//Destination country adjust
CONST US_TERITORY = array("PR", "AS", "FM", "GU", "MH", "MP", "PW" , "VI");
CONST ALLOW_PO_COUNTRIES = array("US", "CA", "GB", "AU");
CONST ALLOW_SHIPPING_WITH_PO = array("Basic", "Standard", "Amazon Basic");

//MENU
CONST MENU_SYSTEM = array(
    array(
        'title' => "MENU",
        'l1'    => array(
            array(
                'title' => 'Admin',
                'l2' =>
                    array(
                        array( 'title' => 'Master Scheduler', 'link' => SITE_ROOT.'cron/masterscheduler', 'blank' => true )
                    )
            ),
            /*
            array(
                'title' => 'Printing',
                'l2' =>
                    array(
                        array( 'title' => 'Reprint Logs', 'link' => 'reprintlogs' ),
                        array( 'title' => 'Zen', 'link' => 'zencp' )
                    )
            ),
            */
            array(
                'title' => 'Customer',
                'l2' =>
                    array(
                        array( 'title' => 'Customer Portal', 'link' => SITE_WEB_LOGIN_API_PORTAL, 'blank' => true ),
                        array( 'title' => 'Request Token', 'link' => SITE_ROOT.'oauth/requesttoken', 'blank' => true ),
                        array( 'title' => 'Post New Order', 'link' => SITE_ROOT.'orders/postnewxml', 'blank' => true )
                    )
            ),
        )
    ),
    /*
    array(
        'title' => "JOB BOARD",
        'link'  => 'jobboard'
    ),
    */
);

//Error codes
CONST ERROR_CODE = array(
    0   => "",
    2   => "Failed to update address, please try again!",
    4   => "PO BOX is not allowed for this shipping type.",
    17  => "This account is billed to customer.",
    18  => "Invalid Order ID",
    19  => "PO Boxes are not supported for Shipping Type/Destination.",
    20  => "There's nothing to update.",
    84  => "Invalid Shipping Type.",
    202 => "Order is already completed.",
    203 => "Order is already cancelled.",
    204 => "Order is locked, please unlock first.",
    7011 => 'Order already in printing',
    7012 => 'Order already in shipping',
    7042 => "Incomplete Shipping Address: Invalid/Missing Street Address",
    7043 => "Shipping Address Error: Invalid Street Address",
    7044 => "Shipping Address Error: Invalid Street Address",
    7045 => "Shipping Address Error: Invalid City",
    7046 => "Less than limit",
    7050 => "Incomplete Shipping Address: Invalid or missing State",
    7054 => "Shipping Address Error: Invalid/Missing Zip Code",
    7056 => "Incomplete Shipping Address: Country Code Invalid",
    7060 => 'Invalid Zip Code',
    7063 => "Must have 1 numerical",
    7062 => "Address not found"
);
