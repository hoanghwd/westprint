<?php
//Require files
require_once LIB_DIR."wp/utility.wp.php";
require_once LIB_DIR."mysql/MysqliDb.php";
require_once LIB_DIR."php-jwt/JWT.php";
require_once LIB_DIR."oauth2-server-php/src/OAuth2/Autoloader.php";
require_once LIB_DIR."fpdf/fpdf.php";
require_once LIB_DIR."wp/parallelcurl.wp.php";

//Require for registered modules
require_once CONTROLLER_DIR."Cron/cron_modules.php";
require_once CONTROLLER_DIR."Orders/orders_modules.php";
require_once CONTROLLER_DIR."webPortal/webportal_modules.php";
require_once CONTROLLER_DIR."Ajax/ajax_modules.php";
require_once CONTROLLER_DIR."Oauth/oauth_modules.php";
require_once CONTROLLER_DIR."LoginAction/loginaction_modules.php";
require_once CONTROLLER_DIR."parent_modules.php";