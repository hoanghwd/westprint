<?php


namespace App\Models;
use App\Models\Base;

class Menu extends Base
{
    public function renderMenu()
    {
        $menuHtml = $this->_generateMenuHtml();
        require_once VIEW_DIR . 'menu.phtml';
    }

    private function _getUserPermissionSettings()
    {

    }

    /**
     * @return string
     */
    private function _generateMenuHtml()
    {
        $html = '';

        foreach (MENU_SYSTEM AS $menu) {
            $title = $menu['title'];
            $hasL1 = FALSE;

            if( isset($menu['link']) ) {
                $title = '<a class="menuHeader" href="'.SITE_ROOT.$menu['link'].'">'.$menu['title'].'</a>';
            }
            else if( isset($menu['l1']) && $this->isNotEmptiedArray($menu['l1']) )  {
                $hasL1 = TRUE;
                $title = '<a class="menuHeader" href="#">'.$menu['title'].'<span class="down-arrow">▼</span></a>';
            }

            $html .=
            //MENU
            '<li>';
            $html .= $title; //<a>..</a>
            if($hasL1) {
                $html .=
                    '<ul>';
                foreach ($menu['l1'] AS $l1) {
                    $html .=
                        '<li>'.
                            '<a href="#">'.$l1['title'].'<span class="right-arrow"> ▶</span></a>'.
                            '<ul style="left:92px;">';
                    foreach ($l1['l2'] AS $l2) {
                        $blank = isset($l2['blank']) ? " target='_blank' " : '';
                        $html .=
                                '<li><a '.$blank.' href="'.$l2['link'].'">'.$l2['title'].'</a></li>';
                    }//L2
                    $html .=
                            '</ul>'.
                        '</li>';
                }
                $html .=
                    '</ul>';
            }//has L1
            $html .=
            '</li>';
        }

        return $html;
    }

}//End of class