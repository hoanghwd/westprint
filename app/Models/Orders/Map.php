<?php


namespace App\Models\Orders;


use App\Models\Base;

class Map extends Base
{
    private $_synOrderId;
    private $_poNumber;
    private $_synOrderArray;
    private $_synOrderInfo;
    private $_productMap = array();
    CONST SPECIAL_CHARS_PATTERN = '/[\Â£$%*()}{@~?:><>|=+"[\]\/]/';

    /**
     * Map constructor.
     * @param $synOrderId
     * @throws \Exception
     */
    function __construct($synOrderId)
    {
        $this->_synOrderId = $synOrderId;
        $this->_poNumber = $this->getPONumber();
        $this->_synOrderArray = $this->getSYNOrderArray();
        $this->_synOrderInfo = $this->getShippingInfoBySYNOrderId($this->_synOrderId);
        $this->_updateSynOrder();
        $this->_productMap = $this->_buildProductParentCountArray();
    }

    /**
     * @return mixed
     * @throws \Exception
     */
    public function getPONumber()
    {
        $data =
            $this->getResource(SYN_DB)
                 ->where('id', $this->_synOrderId)
                 ->get('orders', 1, 'poNumber');

        return $data[0]['poNumber'];
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function getSYNOrderArray()
    {
        $sql = "SELECT                   
                    oi.id AS itemId, oi.itemNumber, oi.selectedItemCode,
                    oi.kitSku, oi.itemCode, oi.shipping, 
                    o.poNumber, oi.orderId, oi.qt qty                  
                FROM
                    orders o, orderItems oi 
                WHERE
                    o.poNumber = '$this->_poNumber'
                    AND o.id = oi.orderId
                    AND  oi.orderId = $this->_synOrderId";

        return $this->rawSYNQuery($sql);
    }

    /**
     * @throws \Exception
     */
    private function _updateSynOrder()
    {
        //Update orderArray with parentId
        foreach($this->_synOrderArray AS $itemId => $itemInfo) {
            $itemCode = $itemInfo['itemCode'];
            $parentId = $this->_getParentProduct($itemCode);
            //$this->dumpVar($parentId);

            if( $parentId == '' ) {
                //$productIdInfo = $this->getProductParentsByProductId($itemCode);
                //$parentId = $productIdInfo['id'];
            }

            //echo $itemCode.' => '.$parentId."\n";

            $this->_synOrderArray[$itemId]['parentId'] = $parentId;
            $this->_synOrderArray[$itemId]['itemCode'] = $itemCode;
        }
    }

    /**
     * @param $childProduct
     * @return array|string
     * @throws \Exception
     */
    public function _getParentProduct($childProduct)
    {
        $parentProductId = $childProduct;
        $userName = $this->_synOrderInfo['userName'];
        $sql =
            "SELECT id, productCodes, piece	
             FROM products 
             WHERE `name` = '$userName' AND productCodes LIKE '%$childProduct%'";

        $data = $this->rawSYNQuery($sql);
        $parentInfo = isset($data[0]) ? $data[0] : array() ;
        if( sizeof($parentInfo) > 0 ) {
            if($parentInfo['piece'] > 1) {
                $parentProductId = $parentInfo['id'];
            }
        }

        return $parentProductId;
    }

    /**
     * @param $productId
     */
    public function getProductParentsByProductId($productId)
    {
        $userName = $this->_synOrderInfo['userName'];
    }

    /**
     * @param $productId
     */
    public function getSkuChildByProductId($productId)
    {
        $userName = $this->_synOrderInfo['userName'];
    }

    /**
     * @return array
     */
    private function _buildProductParentCountArray()
    {
        $map = array();
        $i = 0;
        $kitSkuArray = array();
        $nonKitSkuArray = array();

        foreach($this->_synOrderArray AS $itemId => $itemInfo) {
            $isKitSku = ($itemInfo['kitSku'] == 0) ? false : true;
            $parentId = $itemInfo['parentId'];
            $isDynamicDku = false;
            //For dynamic SKU
            if( $itemInfo['selectedItemCode'] != '' ) {
                $parentId = $itemInfo['selectedItemCode'] ;
                $isDynamicDku = true;
            }
            if($isKitSku) {
                $currArray = array(
                    'parentId' => $parentId,
                    'itemId'   =>  $itemInfo['itemId'],
                    'isKitSku' => true,
                    'isDynamic' => $isDynamicDku,
                    'qty'      => $itemInfo['qty'],
                    'children' => array()
                );
                array_push($kitSkuArray, $currArray);
            }
            else {
                $currArray = array(
                    'parentId' => $parentId,
                    'itemId'   =>  $itemInfo['itemId'],
                    'isKitSku' => false,
                    'isDynamic' => $isDynamicDku,
                    'qty'      => $itemInfo['qty'],
                    'children' => array( $itemInfo['itemId'])
                );
                array_push($nonKitSkuArray, $currArray);
            }
            $i++;
        }//foreach

        $newKitSkuArray = array();
        if( sizeof($kitSkuArray) > 0 ) {
            $productSKURelateArray = array();
            foreach ($kitSkuArray AS $kitSkuItem) {
                $parentId = $kitSkuItem['parentId'] ;
                if(!array_key_exists($parentId, $productSKURelateArray)) {
                    $productSKURelateArray[$parentId] = array();
                    array_push( $productSKURelateArray[$parentId], $kitSkuItem['itemId'] );
                }
                else {
                    array_push( $productSKURelateArray[$parentId],$kitSkuItem['itemId']);
                }
            }

            foreach ($productSKURelateArray AS $parentId => $itemArray) {
                foreach ($kitSkuArray AS $item) {
                    if( $parentId == $item['parentId'] ) {
                        $currArray = array(
                            'parentId' => $parentId,
                            'itemId'   =>  '',
                            'isKitSku' => true,
                            'qty'      => $item['qty'],
                            'children' => $itemArray
                        );
                        array_push($newKitSkuArray, $currArray);
                        break;
                    }
                }
            }
        }

        $map = array_merge($nonKitSkuArray, $newKitSkuArray);

        //print_r($map);

        return $map;
    }

    /**
     * @return array
     */
    public function buildProductIdsFeed()
    {
        $productIds = array();
        foreach ($this->_productMap AS $item) {
            for ($i = 0; $i <  $item['qty']; $i++ ) {
                array_push($productIds, $item['parentId']);
            }
        }

        return $productIds;
    }

}//End of class