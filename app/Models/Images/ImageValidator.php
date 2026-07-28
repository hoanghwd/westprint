<?php


namespace App\Models\Images;


use App\Models\Base;

class ImageValidator extends Base
{
    private $_request;
    private $_orderId;
    private $_userName;
    private $_thumpNailSize;
    private $_maxAttempts;
    private $_reportContent;
    private $_writeReport;
    private $_htmlProcessReport;

    /**
     * ImageValidator constructor.
     * @param string $request
     */
    function __construct($request = '')
    {
        $this->_request = $request;
        if (isset($this->_request['orderId'])) {
            $this->_orderId = $this->_request['orderId'];
        }

        if (isset($this->_request['userName'])) {
            $this->_userName = $this->_request['userName'];
        }

        $this->_writeReport = isset($this->_request['writeReport']) && $this->_request['writeReport'] == 1;
        $this->_thumpNailSize = 100;
        $this->_maxAttempts = 3;
        $this->_reportContent = '';
        $this->_htmlProcessReport = '';
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function validateImages()
    {
        $nothingToReport = false;
        $results = $this->_getOrderMapArray();

        if ($results['success']) {
            $orderMapArray = $results['orderArray'];

            //Foreach Order Id found
            $i = 0;
            foreach ($orderMapArray as $orderId => $orderBody) {
                $itemArray = $orderBody['items'];
                $numberItems = sizeof($itemArray);
                $msg =
                    "Processing orderId: " . $orderId . "\n" .
                    "Found " . $numberItems . " itemId(s) in this order \n";
                $this->_reportContent .= $msg;
                $this->_htmlProcessReport .= $msg;

                if ($numberItems > 0) {
                    $itemSuccessCounts = 0;
                    $itemFailedCounts = 0;

                    //Foreach orderItem in current syn.orderId
                    foreach ($itemArray as $orderItem) {
                        $imageStatus = 1;
                        $latchFlag = 2;
                        $itemId = $orderItem['itemId'];

                        if ($orderItem['fileHighResSize'] > 0) {
                            $this->_reportContent .= "Item Id $itemId has valid image and downloaded to WP drive.\n";
                            $itemSuccessCounts++;
                        }
                        //Failed to download image
                        else {
                            $attempts = $orderItem['attempts'];
                            //Max attempts not reached yet, just increase attempts by 1 and wait for next call
                            if ($attempts < ($this->_maxAttempts - 1)) {
                                $fieldArray['_attempts'] = $attempts + 1;
                                $this->_reportContent .= "Item Id $itemId failed to download image WP drive with attempted = $attempts\n";
                            }
                            //I have reached max attempts allowed
                            else {
                                $imageStatus = "-1";
                                $latchFlag = "3";
                                $this->_reportContent .= "Item Id $itemId has reached maximum download attempts " . $this->_maxAttempts . "\n";
                            }
                            $itemFailedCounts++;
                        }

                        //Ready to UPDATE
                        $fieldData['imgLocation'] = $orderItem['imgLocation']; //Full link with extension
                        $fieldData['imageLocation'] = $orderItem['imageLocation']; //Just file name
                        $fieldData['thumbLocation'] = $orderItem['thumbLocation'];
                        $fieldData['largeThumbLocation'] = $orderItem['largeThumbLocation'];
                        $fieldData['latchDownloadTime'] = time();
                        $fieldData['imageStatus'] = $imageStatus;
                        $fieldData['latchFlag'] = $latchFlag;

                        $db = $this->getResource(SYN_DB);
                        $db->where('id', $itemId);
                        if ($db->update('orderItems', $fieldData)) {
                            //Do nothing
                        }
                    }//foreach item in the order

                    $this->_htmlProcessReport .=
                        "Items downloaded : $itemSuccessCounts <br/>".
                        "Items failed : $itemFailedCounts <br/>";
                }
                else {
                    $msg = "Order Id: " . $orderId . " has no items in it\n";
                    $this->_reportContent .= $msg;
                    $this->_htmlProcessReport .= $msg;
                }
                $i++;

                $this->_reportContent .= "-------\n";
                $this->_htmlProcessReport .= "-------\n";
            }//foreach
        }
        else {
            $msg = "There's nothing to report for image validation. \n";
            $this->_reportContent .= $msg;
            $this->_htmlProcessReport .= $msg;
            $nothingToReport = true;
        }

        $htmlReport = $this->_generateHtmlReport($this->_htmlProcessReport);

        //If there's something to report
        if( !$nothingToReport ) {
            $htmlReport =
                $this->_generateHtmlReport($this->_htmlProcessReport).
                $this->_writeReportFile();
        }

        return
            array(
                'htmlReport' => $htmlReport,
                'htmlReportDetails' => $this->_generateHtmlReport($this->_reportContent),
                'dateReport' => friendlyDateNow()
            );
    }

    /**
     * @param $myReportContent
     * @return string|string[]|null
     */
    private function _generateHtmlReport($myReportContent)
    {
        return preg_replace("/\r?\n/", "<br/>", $myReportContent);
    }

    /**
     * @param $orgX
     * @param $orgY
     * @return array
     */
    private function _createJoinDimension($orgX, $orgY)
    {
        $xArray = explode(".", $orgX);
        if (sizeof($xArray) == 2) {
            $orgX = ($xArray[0]) . '_' . ($xArray[1]);
        }

        $yArray = explode(".", $orgY);
        if (sizeof($yArray) == 2) {
            $orgY = ($yArray[0]) . '_' . ($yArray[1]);
        }

        return array('x' => $orgX, 'y' => $orgY);
    }

    /**
     * @return array
     * @throws \Exception
     */
    private function _getOrderMapArray()
    {
        $success = FALSE;
        $errorMsg = '';
        $ordersArray = array();

        $orderItems = $this->_getEligibleOrderItems();
        if ($this->isNotEmptiedArray($orderItems)) {
            foreach ($orderItems as $item) {
                $orderId = $item['orderId'];
                $itemBody = $item;
                $itemId = $itemBody['itemId'];
                $newXY = $this->_createJoinDimension($item['x'], $item['y']);
                $itemBody['newX'] = $newXY['x'];
                $itemBody['newY'] = $newXY['y'];
                $locLeadingZero = addLeadingZero($item['locId'], 3);
                $oderDate = date("Ymd", strtotime($item['orderDate']));
                $uploadFolder = ($item['userName']) . "/" . $locLeadingZero . "/" . $oderDate . "/" . $orderId . "/";
                $customerImgUrl = $item['imageLocation'];

                //Prepare names and folder
                $currHighResFileName = $itemId . '_' . ($itemBody['newX']) . 'x' . ($itemBody['newY']);
                //Unix FOLDER
                $currImgFolder = WP_IMAGES_SAVE_FOLDER . ($item['userName']) . "/" . $locLeadingZero . "/" . $oderDate . "/" . $orderId . "/";
                if (!is_dir($currImgFolder)) {
                    exec("mkdir -p " . $currImgFolder);
                }

                //File name only
                $itemBody['highResFileName'] = $currHighResFileName;
                //Absolute Unix structure file
                $itemBody['highResFullPathFileName'] = $currImgFolder . $currHighResFileName;

                //Download this to this file from customer's url
                $fileInfo = downloadImgUrlToWPDrive($customerImgUrl, $itemBody['highResFullPathFileName']);
                $ext = $fileInfo['ext'];
                $itemBody['fileHighResSize'] = $fileInfo['fileSize'];

                //Prepare high res
                //Full url link
                $itemBody['imgLocation'] = CUSTOMER_IMAGES_URL . $uploadFolder . $currHighResFileName . "." . $ext;
                $itemBody['imageLocation'] = $currHighResFileName; //Just file name
                $itemBody['largeThumbLocation'] = $itemBody['imgLocation'];

                //Thumbnail
                $currThumbNailFullPath = 'sm' . $itemId;
                $thumbNailFullPath = $currImgFolder . $currThumbNailFullPath . "." . $ext;
                $commandThumb = "convert " . $itemBody['highResFullPathFileName'] . " -size 200x200 -auto-orient -thumbnail " . ($this->_thumpNailSize) . "x" . ($this->_thumpNailSize) . " " . $thumbNailFullPath;
                exec($commandThumb);
                $itemBody['thumbLocation'] = CUSTOMER_IMAGES_URL . $uploadFolder . $currThumbNailFullPath . "." . $ext;

                //Rename High Res to ext
                $commandHigRes = "mv " . $itemBody['highResFullPathFileName'] . ' ' . $itemBody['highResFullPathFileName'] . "." . $ext;
                exec($commandHigRes);

                if (!isset($ordersArray[$orderId])) {
                    $ordersArray[$orderId] =
                        array(
                            "orderId" => $item['orderId'],
                            "userName" => $item['userName'],
                            "poNumber" => $item['poNumber'],
                            "testMode" => $item['testMode'],
                        );
                    $ordersArray[$orderId]["items"][0] = $itemBody;
                }
                else {
                    // Order with multiple Items
                    $ordersArray[$orderId]["items"][] = $itemBody;
                }

            }//foreach

            $success = TRUE;
        }
        else {
            $errorMsg = "Image validation: No items fround";
        }

        return
            array(
                'success' => $success,
                'errorMsg' => $errorMsg,
                'orderArray' => $ordersArray
            );
    }

    /**
     * @return array|string
     * @throws \Exception
     */
    public function _getEligibleOrderItems()
    {
        $sql = "SELECT
                    o.OWNER userName,
                    o.id orderId, i.id itemId, i.itemNumber,
                    o.active, o.poNumber, o.testMode, o.orderDate,
                    i.itemCode, i.imageLocation,
                    i.customerItemCode,
                    i.x, i.y,
                    i.qt, i.piece, i.numberOfComponents, i.locId, i._attempts attempts,
                    i.thumbLocation, i.largeThumbLocation, i.jointThumbLocation, i.imageStatus, i.thumbnail, i.copy_img_loc                    
                FROM
                    orderItems i
                    INNER JOIN orders o ON i.orderId = o.id 
                    INNER JOIN users u ON u.userName = o.OWNER
                    INNER JOIN permissions p ON  p.userName = u.userName
                WHERE
                    i.imageStatus = '-2' 
                    AND o.active = 0
                    AND i.validatingImage = 0
                    AND o.complete = 0 
                    AND o.deleted = 0 
                    AND o.validatedStatus = 'N'
                    AND p.useImageValidation = 'Y'
                    AND p.runImageValidator = 'Y'";

        if ($this->_orderId != '') {
            $sql .= " AND  o.id = $this->_orderId ";
        }

        if ($this->_userName != '') {
            $sql .= " AND o.`OWNER`  = $this->_userName ";
        }

        return $this->rawSYNQuery($sql);
    }

    /**
     * @return string
     */
    private function _writeReportFile()
    {
        $baseDir = WP_IMAGES_SAVE_FOLDER;
        $fileName = "Image_Validate_CronReport_" . (date("Ymd_His")) . ".txt";
        $fullPathFileName = $baseDir . $fileName;
        $myFile = fopen($fullPathFileName, "w") or die("Unable to open file!");
        fwrite($myFile, $this->_reportContent);
        fclose($myFile);

        return "Detail image validation report is at $fullPathFileName \n";
    }

}//End of class