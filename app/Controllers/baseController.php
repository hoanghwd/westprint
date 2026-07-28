<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\Request;

class baseController
{
    private $_view;

    CONST NO_SEARCH = array(
        'oauth/requesttoken', 'orders/postnewxml', 'orders/receipt'
    );

    /**
     * baseController constructor.
     * @param $view
     */
    function __construct($view) {
        $this->_view = $view;
    }

    /**
     * @param $myVar
     * @param string $title
     */
    public function myVarDump($myVar, $title = '')
    {
        echo "<pre>";
        echo "$title _DEBUG<br/>";
        var_dump($myVar);
        echo "</pre>";
    }

    /**
     * @param string $modelObj
     * @param bool $requireHeader
     * @param bool $requireFooter
     */
    public function render($modelObj = '', $requireHeader = TRUE, $requireFooter = TRUE)
    {
        //Header
        if($requireHeader) {
            if ( in_array($this->_view, self::NO_SEARCH) ) {
                require_once VIEW_DIR . 'templates/header_no_log_in.phtml';
            }
            else {
                require_once VIEW_DIR . 'templates/header.phtml';
            }
        }

        //Body
        require_once VIEW_DIR.($this->_view).'.phtml';

        //Footer
        if($requireFooter) {
            require_once VIEW_DIR . 'templates/footer.phtml';
        }
    }

    /**
     * Like request from XML, REACT
     * Get input request
     */
    public function getInputRequest()
    {
        $request = file_get_contents("php://input");

        return json_decode($request, true);
    }

    /**
     * @return Request
     */
    public function getRequest()
    {
        return Request::createFromGlobals();
    }

    /**
     * @return array
     */
    public function getHttpRequest()
    {
        //POST
        $allPost = $this->getRequest()->request->all();

        //GET
        $allGet = $this->getRequest()->query->all();

       return array_merge($allPost, $allGet);
    }

    public function test()
    {
        echo "Test Controller";
    }

}//End of class