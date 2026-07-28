<?php
session_start();

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

date_default_timezone_set('America/Los_Angeles');

// Autoloader
require_once '../vendor/autoload.php';

// Load Config
require_once '../config/config.php';

require_once 'init.php';

// Routes
require_once '../routes/web.php';
require_once '../app/Router.php';