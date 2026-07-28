<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods:  POST');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization');



echo '{"error":{"text":"Wrong username or password."}}';