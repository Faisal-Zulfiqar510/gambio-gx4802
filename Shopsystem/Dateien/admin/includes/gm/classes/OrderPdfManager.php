<?php
/* --------------------------------------------------------------
  OrderPdfManager.php 2022-09-29
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2022 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

require_once DIR_FS_INC . 'xtc_get_attributes_model.inc.php';
require_once DIR_FS_INC . 'xtc_not_null.inc.php';
require_once DIR_FS_INC . 'xtc_format_price_order.inc.php';
require_once DIR_FS_CATALOG . 'gm/inc/gm_pdf_adress_format.inc.php';
require_once DIR_FS_CATALOG . 'gm/inc/gm_prepare_number.inc.php';
require_once DIR_FS_ADMIN . 'includes/gm/classes/gmOrderPDF.php';
require_once DIR_WS_CLASSES . 'order.php';
require_once DIR_FS_ADMIN . 'includes/gm/classes/GMOrderFormat.php';

/**
 * Class OrderPdfManager
 */
class OrderPdfManager
{
    /**
     * @var int
     */
    protected $languageId;
    
    /**
     * @var string
     */
    protected $language;
    
    /**
     * @var int
     */
    protected $adminCustomerId;
    
    /**
     * @var GMOrderFormat_ORIGIN|null
     */
    protected $orderFormat;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    
    /**
     * OrderPdfManager constructor.
     *
     * @param int    $languageId
     * @param string $language
     * @param int    $adminCustomerId
     */
    public function __construct(int $languageId, string $language, int $adminCustomerId)
    {
        $this->languageId          = $languageId;
        $this->language            = $language;
        $this->adminCustomerId     = $adminCustomerId;
        $this->languageTextManager = MainFactory::create('LanguageTextManager', 'gm_pdf_order', $this->languageId);
    }
    
    
    /**
     * @param int $orderId
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function previewPackingSlip(int $orderId): void
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID $orderId is invalid.");
        }
        
        $this->createPdf($orderId, 'packingslip', null, false, true);
    }
    
    
    /**
     * @param int $orderId
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    public function previewInvoice(int $orderId): void
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID $orderId is invalid.");
        }
        
        $this->createPdf($orderId, 'invoice', null, false, true);
    }
    
    
    /**
     * @param int $orderId
     *
     * @return array[]
     * @throws \Doctrine\DBAL\DBALException
     */
    public function createPackingSlip(int $orderId): array
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID $orderId is invalid.");
        }
        
        return $this->createPdf($orderId, 'packingslip');
    }
    
    
    /**
     * @param int $orderId
     *
     * @return array[]
     * @throws \Doctrine\DBAL\DBALException
     */
    public function createInvoice(int $orderId): array
    {
        if ($orderId <= 0) {
            throw new InvalidArgumentException("Order ID $orderId is invalid.");
        }
        
        return $this->createPdf($orderId, 'invoice');
    }
    
    
    /**
     * @param int $invoiceId
     *
     * @return array|array[]
     * @throws Exception
     */
    public function createCancellationInvoice(int $invoiceId): array
    {
        $invoices = $this->getInvoices([$invoiceId]);
        
        if ($invoices->isEmpty()) {
            throw new InvalidArgumentException("Invoice with ID $invoiceId does not exist.");
        }
        
        $orderId = 0;
        
        /** @var InvoiceListItem $invoice */
        foreach ($invoices as $invoiceListItem) {
            $orderId = $invoiceListItem->getOrderId();
        }
        
        return $this->createPdf($orderId, 'invoice', $invoiceId);
    }
    
    
    /**
     * @param int                       $orderId
     * @param InvoiceListItemCollection $invoices
     * @param string                    $subject
     * @param string|null               $emailRecipient
     *
     * @return bool
     * @throws Exception
     */
    public function sendMail(
        int $orderId,
        InvoiceListItemCollection $invoices,
        string $subject,
        ?string $emailRecipient = null
    ) {
        require_once DIR_FS_INC . 'xtc_php_mail.inc.php';
        
        $order     = MainFactory::create('order', $orderId);
        $orderData = $this->getOrderData($orderId);
        
        /** @var InvoiceListItem $invoice */
        foreach ($invoices as $invoiceListItem) {
            if ($invoiceListItem->getOrderId() !== $orderId) {
                throw new Exception('Sending invoice email to ' . ($emailRecipient ??
                                                                   $orderData['customers_email_address'])
                                    . ' was canceled, because invoice ID ' . $invoiceListItem->getInvoiceId()
                                    . ' does not belong to order with ID ' . $orderId . ' (invoice order ID: '
                                    . $invoiceListItem->getOrderId() . ')', 500);
            }
        }
        
        $smarty = MainFactory::create('GXSmarty');
        
        $logoManager = MainFactory::create('GMLogoManager', 'gm_logo_mail');
        if ($logoManager->logo_use == '1') {
            $smarty->assign('gm_logo_mail', $logoManager->get_logo());
        }
        
        if ($orderData['customers_gender'] === 'f') {
            $salutationFemale = gm_get_content('GM_PDF_SALUTATION_FEMALE', $this->languageId);
            $smarty->assign('SALUTATION', $salutationFemale);
        } else {
            $salutationMale = gm_get_content('GM_PDF_SALUTATION_MALE', $this->languageId);
            $smarty->assign('SALUTATION', $salutationMale);
        }
        
        $smarty->assign('CUSTOMER_GENDER', $orderData['customers_gender']);
        
        $customerName = '';
        
        if (isset($orderData['customers_firstname'])) {
            $customerName = $orderData['customers_firstname'] . ' ' . $orderData['customers_lastname'];
        } elseif (isset($invoiceListItem)) {
            $customerName = $invoiceListItem->getCustomerName();
        }
        
        $smarty->assign('CUSTOMER', $customerName);
        $smarty->assign('ORDER_ID', $orderId);
        
        if (empty($order->info['date_purchased']) && isset($invoiceListItem)) {
            $smarty->assign('DATE',
                            xtc_date_short($invoiceListItem->getOrderDatePurchased()->format('Y-m-d H:i:s'),
                                           $this->languageId));
        } else {
            $smarty->assign('DATE', xtc_date_short($order->info['date_purchased'], $this->languageId));
        }
    
        if (defined('EMAIL_SIGNATURE') && defined('EMAIL_HTML_SIGNATURE')) {
            $smarty->assign('EMAIL_SIGNATURE_HTML', EMAIL_HTML_SIGNATURE);
            $smarty->assign('EMAIL_SIGNATURE_TEXT', EMAIL_SIGNATURE);
        }
        
        $attachments    = [];
        $invoiceNumbers = [];
        
        $pdfConfiguration = [];
        $this->addHeading('invoice', $pdfConfiguration);
        
        foreach ($invoices as $invoice) {
            $invoiceNumbers[] = [
                'number' => $invoice->getInvoiceNumber(),
                'date'   => xtc_date_short($invoice->getInvoiceDate()->format('Y-m-d H:i:s'), $this->languageId),
            ];
            
            $fileName = xtc_cleanName(trim($pdfConfiguration['GM_PDF_HEADING']), '_') . '_'
                        . $invoice->getInvoiceNumber() . '.pdf';
            $filePath = DIR_FS_CATALOG . 'export/invoice/' . $invoice->getInvoiceFilename();
            
            $attachments[] = [
                'name' => $fileName,
                'path' => $filePath,
            ];
            
            $smarty->assign('INVOICE_ID', $invoice->getInvoiceNumber());
            
            $subject = str_replace('{DATE}',
                                   xtc_date_short($order->info['date_purchased'], $this->languageId),
                                   $subject);
            $subject = str_replace('{INVOICE_ID}', $invoice->getInvoiceNumber(), $subject);
            $subject = str_replace('{ORDER_ID}', $orderId, $subject);
        }
        
        $smarty->assign('INVOICE_NUMBERS', $invoiceNumbers);
        
        $smarty->caching = 0;
        $htmlBody        = $this->fetchEmailTemplate($smarty, 'html');
        $textBody        = $this->fetchEmailTemplate($smarty, 'txt');
        
        if ($emailRecipient !== null) {
            $orderData['customers_email_address'] = $emailRecipient;
            $orderData['customers_firstname']     = '';
            $orderData['customers_lastname']      = '';
        }
        
        if (!filter_var($orderData['customers_email_address'], FILTER_VALIDATE_EMAIL)) {
            throw new Exception('Invalid email address provided: ', $orderData['customers_email_address']);
        }
        
        return $this->sendInvoiceMail($subject, $htmlBody, $textBody, $attachments, $orderData);
    }
    
    
    /**
     * @param array $invoiceIds
     *
     * @return InvoiceListItemCollection
     * @throws Exception
     */
    public function getInvoices(array $invoiceIds): InvoiceListItemCollection
    {
        /** @var InvoiceArchiveReadService $invoiceArchiveReadService */
        $invoiceArchiveReadService = StaticGXCoreLoader::getService('InvoiceArchiveRead');
        
        $items = [];
        
        foreach ($invoiceIds as $invoiceId) {
            $singleInvoices = $invoiceArchiveReadService->getInvoiceListByConditions(['invoice_id' => $invoiceId]);
            if (!$singleInvoices->isEmpty()) {
                /** @var InvoiceListItem $invoice */
                $invoice = $singleInvoices->getItem(0);
                
                $items[] = $invoice;
            } else {
                throw new Exception("Invoice with ID $invoiceId does not exist.", 500);
            }
        }
        
        return MainFactory::create('InvoiceListItemCollection', $items);
    }
    
    
    /**
     * @param int $orderId
     *
     * @return InvoiceListItemCollection
     */
    public function findLatestInvoice(int $orderId): InvoiceListItemCollection
    {
        $invoiceArchiveReadService = StaticGXCoreLoader::getService('InvoiceArchiveRead');
        
        return $invoiceArchiveReadService->getInvoiceListByConditions(['order_id' => $orderId],
                                                                      new IntType(0),
                                                                      new IntType(1),
                                                                      new StringType('invoice_date DESC'));
    }
    
    
    /**
     * @param int      $orderId
     * @param string   $type
     * @param int|null $cancelInvoiceId
     * @param bool     $download
     * @param bool     $preview
     *
     * @return array|array[]
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function createPdf(
        int $orderId,
        string $type,
        ?int $cancelInvoiceId = null,
        bool $download = false,
        bool $preview = false
    ): array {
        $order = MainFactory::create('order', $orderId);
        
        $orderData         = $this->getOrderData($orderId);
        $orderPdfData      = $this->getOrderPdfData($orderId, $order);
        $useProductsModel  = $this->useProductsModel();
        $orderTotal        = $this->getOrderTotal($orderId);
        $orderInfo         = $this->getOrderInfo($order, $type);
        $pdfFooter         = $this->getPdfFooter();
        $pdfTexts          = $this->getPdfTexts();
        $pdfConfiguration  = $this->getPdfConfiguration($orderId,
                                                        $order,
                                                        $pdfTexts,
                                                        $type,
                                                        $cancelInvoiceId);
        $fontConfiguration = $this->getFontConfiguration();
        
        $nextId = $this->getNextId($type);
        
        if ($type === 'invoice') {
            $invoiceNumber = $this->getInvoiceNumber($nextId, $cancelInvoiceId);
            
            $orderData['invoice_number'] = $invoiceNumber;
        } else {
            $orderData['packing_slip_number'] = $this->getPackingSlipNumber($nextId);
        }
        
        $date       = $this->getDate($type);
        $orderRight = $this->getPdfTopRightContent($order,
                                                   $orderId,
                                                   $type,
                                                   $orderData,
                                                   $date,
                                                   $pdfTexts);
        
        $pdfProtectionConfiguration = $this->getPdfProtectionConfiguration();
        $usePdfProtection           = $this->usePdfProtection($pdfProtectionConfiguration);
        $pdfValues                  = $this->getPdfValues($usePdfProtection, !empty($pdfFooter));
        
        if (!$preview) {
            $pdfExtender = MainFactory::create_object('PDFOrderExtenderComponent');
            $pdfExtender->set_data('GET', $_GET);
            $pdfExtender->set_data('POST', $_POST);
            $pdfExtender->set_data('order', $order);
            $pdfExtender->set_data('order_id', $orderId);
            $pdfExtender->set_data('type', $type);
            $pdfExtender->set_data('order_check', $orderData);
            $orderRight        = $pdfExtender->extendOrderRight($orderRight);
            $orderPdfData      = $pdfExtender->extendOrderData($orderPdfData);
            $orderTotal        = $pdfExtender->extendOrderTotal($orderTotal);
            $orderInfo         = $pdfExtender->extendOrderInfo($orderInfo);
            $pdfFooter         = $pdfExtender->extendPdfFooter($pdfFooter);
            $fontConfiguration = $pdfExtender->extendPdfFonts($fontConfiguration);
            $pdfValues         = $pdfExtender->extendGmPdfValues($pdfValues);
            $pdfConfiguration  = $pdfExtender->extendGmOrderPdfValues($pdfConfiguration);
            $useProductsModel  = $pdfExtender->extendGmUseProductsModel($useProductsModel);
        }
        
        if ($cancelInvoiceId !== null) {
            $this->adjustOrderDataForCancellation($orderPdfData, $orderTotal);
        }
        
        $response = ['jsonResponseData' => []];
        
        $response['pdfFilePath'] = $this->createPdfDocument($type,
                                                            $orderRight,
                                                            $orderPdfData,
                                                            $orderTotal,
                                                            $orderInfo,
                                                            $pdfFooter,
                                                            $fontConfiguration,
                                                            $pdfValues,
                                                            $pdfConfiguration,
                                                            $useProductsModel,
                                                            $orderId,
                                                            $usePdfProtection,
                                                            $pdfProtectionConfiguration,
                                                            $download,
                                                            $preview,
                                                            $orderData['invoice_number'] ?? '');
        
        if (!$preview) {
            $response['pdfFilename'] = $this->getPdfName($pdfConfiguration['GM_PDF_HEADING'], $nextId);
            
            $pathArray          = explode('/', $response['pdfFilePath']);
            $unpreparedFilename = $pathArray[count($pathArray) - 1];
            
            $fileNameArray                                  = explode('__', $unpreparedFilename);
            $response['jsonResponseData']['filenameSuffix'] = $fileNameArray[count($fileNameArray) - 1];
            $response['jsonResponseData']['filename']       = str_replace('__'
                                                                          . $response['jsonResponseData']['filenameSuffix'],
                                                                          '',
                                                                          $unpreparedFilename);
            $this->storeInDb($type,
                             $orderId,
                             $response['pdfFilePath'],
                             $orderData,
                             $date,
                             $cancelInvoiceId,
                             $response,
                             $nextId);
            
            // (xycons.de - Additional Extenders) (START)
            $pdfExtender->set_data('filename', $response['pdfFilename']);
            $pdfExtender->proceed();
            // (xycons.de - Additional Extenders) (END)
        }
        
        return $response;
    }
    
    
    /**
     * @param order  $order
     * @param string $type
     *
     * @return string
     */
    protected function getCustomerAddress(order $order, string $type): string
    {
        if ($type === 'invoice') {
            return strip_tags(xtc_address_format($order->billing['format_id'], $order->billing, 0, '', "\n"));
        }
        
        return strip_tags(xtc_address_format($order->delivery['format_id'], $order->delivery, 0, '', "\n"));
    }
    
    
    /**
     * @param string $type
     *
     * @return DateTime
     * @throws Exception
     */
    protected function getDate(string $type): DateTime
    {
        $date = new DateTime();
        
        /* determine invoice date */
        if (gm_get_conf('GM_PDF_USE_DATE') === '1') {
            if ($type === 'invoice' && gm_get_conf('GM_PDF_INVOICE_USE_CURRENT_DATE') === '0') {
                $date = new DateTime(gm_get_conf('GM_PDF_INVOICE_DATE'));
            } elseif ($type === 'packingslip' && gm_get_conf('GM_PDF_PACKING_SLIP_USE_CURRENT_DATE') === '0') {
                $date = new DateTime(gm_get_conf('GM_PDF_PACKING_SLIP_DATE'));
            }
        }
        
        return $date;
    }
    
    
    /**
     * @param array  $orderInfo
     * @param string $type
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function addInfoText(array &$orderInfo, string $type): void
    {
        if (gm_get_conf('GM_PDF_USE_INFO_TEXT') === '1') {
            if ($type === 'invoice') {
                
                
                $orderInfo['GM_PDF_INFO'][0] = gm_get_content('GM_PDF_INFO_TITLE_INVOICE',
                                                              $this->languageId);
                $orderInfo['GM_PDF_INFO'][1] = gm_get_content('GM_PDF_INFO_TEXT_INVOICE',
                                                              $this->languageId);
                
                return;
            }
            
            $orderInfo['GM_PDF_INFO'][0] = gm_get_content('GM_PDF_INFO_TITLE_PACKINGSLIP',
                                                          $this->languageId);
            $orderInfo['GM_PDF_INFO'][1] = gm_get_content('GM_PDF_INFO_TEXT_PACKINGSLIP',
                                                          $this->languageId);
        }
    }
    
    
    /**
     * @param string   $type
     * @param array    $pdfConfiguration
     * @param int|null $cancelInvoiceId
     */
    protected function addHeading(string $type, array &$pdfConfiguration, ?int $cancelInvoiceId = null): void
    {
        if ($type === 'invoice') {
            if ($cancelInvoiceId) {
                /** @var InvoiceArchiveReadService $invoiceArchiveReadService */
                $invoiceArchiveReadService          = StaticGXCoreLoader::getService('InvoiceArchiveRead');
                $invoiceListItem                    = $invoiceArchiveReadService->getInvoiceListItemById(new IdType($cancelInvoiceId));
                $invoiceDate                        = xtc_date_short($invoiceListItem->getInvoiceDate()
                                                                         ->format('Y-m-d H:i:s'),
                                                                     $this->languageId);
                $pdfHeading                         = gm_get_content('GM_PDF_HEADING_CANCELLATION_INVOICE',
                                                                     $this->languageId);
                $pdfHeading                         = str_replace('{INVOICE_ID}',
                                                                  $invoiceListItem->getInvoiceNumber(),
                                                                  $pdfHeading);
                $pdfHeading                         = str_replace('{DATE}', $invoiceDate, $pdfHeading);
                $pdfConfiguration['GM_PDF_HEADING'] = $pdfHeading;
                
                return;
            }
            $pdfConfiguration['GM_PDF_HEADING']      = gm_get_content('GM_PDF_HEADING_INVOICE',
                                                                      $this->languageId);
            $pdfConfiguration['GM_PDF_HEADING_INFO'] = gm_get_content('GM_PDF_HEADING_INFO_TEXT_INVOICE',
                                                                      $this->languageId);
            
            return;
        }
        $pdfConfiguration['GM_PDF_HEADING']      = gm_get_content('GM_PDF_HEADING_PACKINGSLIP',
                                                                  $this->languageId);
        $pdfConfiguration['GM_PDF_HEADING_INFO'] = gm_get_content('GM_PDF_HEADING_INFO_TEXT_PACKINGSLIP',
                                                                  $this->languageId);
    }
    
    
    /**
     * @param array $orderPdfData
     * @param array $orderTotal
     */
    protected function adjustOrderDataForCancellation(array &$orderPdfData, array &$orderTotal): void
    {
        foreach ($orderPdfData as &$orderItem) {
            /**
             * Replace the first occurrence of '-' with '+' temporarily.
             *
             * E.g.: '- 5,67 EUR' => '+ 5,67 EUR'
             */
            $orderItem['PRODUCTS_PRICE_SINGLE'] = preg_replace('/(.*?)-(.+)/',
                                                               '$1+$2',
                                                               $orderItem['PRODUCTS_PRICE_SINGLE']);
            $orderItem['PRODUCTS_PRICE']        = preg_replace('/(.*?)-(.+)/', '$1+$2', $orderItem['PRODUCTS_PRICE']);
            
            /**
             * Add a minus sign ('-') before the first digit if there is not already a minus sign ('-') or a plus sign ('+').
             *
             * E.g.:
             * - ' 113,49 EUR' => ' -113,49 EUR'
             * - ' -113,49 EUR' won't be modified.
             * - ' +113,49 EUR' won't be modified.
             */
            if (1 !== preg_match('/[-+][\s]*[\d]/', $orderItem['PRODUCTS_PRICE_SINGLE'])) {
                $orderItem['PRODUCTS_PRICE_SINGLE'] = preg_replace('/(.*?)(\d)(.*)/',
                                                                   '$1-$2$3',
                                                                   $orderItem['PRODUCTS_PRICE_SINGLE']);
                $orderItem['PRODUCTS_PRICE']        = preg_replace('/(.*?)(\d)(.*)/',
                                                                   '$1-$2$3',
                                                                   $orderItem['PRODUCTS_PRICE']);
            }
            
            /**
             * Remove the temporary plus sign ('+') after all negative values became positive and all unsigned positive values became negative.
             *
             * E.g.: '+ 5,67 EUR' => ' 5,67 EUR'
             */
            $orderItem['PRODUCTS_PRICE_SINGLE'] = preg_replace('/(.*)\+(.+)/',
                                                               '$1$2',
                                                               $orderItem['PRODUCTS_PRICE_SINGLE']);
            $orderItem['PRODUCTS_PRICE']        = preg_replace('/(.*)\+(.+)/', '$1$2', $orderItem['PRODUCTS_PRICE']);
        }
        
        foreach ($orderTotal as &$orderTotalItem) {
            /**
             * Replace the first occurrence of '-' with '+' temporarily.
             *
             * E.g.: '- 5,67 EUR' => '+ 5,67 EUR'
             */
            $orderTotalItem['TEXT'] = preg_replace('/(.*?)-(.+)/', '$1+$2', $orderTotalItem['TEXT']);
            
            /**
             * Add a minus sign ('-') before the first digit if there is not already a minus sign ('-') or a plus sign ('+').
             *
             * E.g.:
             * - ' 113,49 EUR' => ' -113,49 EUR'
             * - ' -113,49 EUR' won't be modified.
             * - ' +113,49 EUR' won't be modified.
             */
            if (1 !== preg_match('/[-+][\s]*[\d]/', $orderTotalItem['TEXT'])) {
                $orderTotalItem['TEXT'] = preg_replace('/(.*?)(\d)(.*)/', '$1-$2$3', $orderTotalItem['TEXT']);
            }
            
            /**
             * Removes the temporary plus sign ('+') after all negative values became positive and all unsigned positive values became negative.
             *
             * E.g.: '+ 5,67 EUR' => ' 5,67 EUR'
             */
            $orderTotalItem['TEXT'] = preg_replace('/(.*)\+(.+)/', '$1$2', $orderTotalItem['TEXT']);
        }
    }
    
    
    /**
     * @param int $orderId
     *
     * @return array
     */
    protected function getOrderData(int $orderId): array
    {
        $result = xtc_db_query("SELECT
                                    `customers_email_address`,
                                    `customers_firstname`,
                                    `customers_lastname`,
                                    `customers_gender`,
                                    `gm_cancel_date`,
                                    `orders_status`
                                FROM `orders`
                                WHERE
                                    `orders_id` = $orderId");
        
        return xtc_db_num_rows($result) > 0 ? xtc_db_fetch_array($result) : [];
    }
    
    
    /**
     * @param int $orderId
     *
     * @return array
     */
    protected function getTaxStatus(int $orderId): array
    {
        $result = xtc_db_query("SELECT
                                    1 AS tax
                                FROM `orders_total`
                                WHERE
                                    `orders_id` = $orderId AND
                                    `class` = 'ot_tax' AND
                                    `value` > 0");
        
        if (xtc_db_num_rows($result)) {
            $taxStatus = xtc_db_fetch_array($result);
        } else {
            $taxStatus = ['tax' => '0'];
        }
        
        return $taxStatus;
    }
    
    
    /**
     * @param int          $orderId
     * @param order_ORIGIN $order
     *
     * @return array
     */
    protected function getOrderPdfData(int $orderId, order_ORIGIN $order): array
    {
        $orderPdfData = [];
        $orderResult  = xtc_db_query($this->getOrderPdfDataQuery($orderId));
        
        while ($orderRow = xtc_db_fetch_array($orderResult)) {
            $attributesResult = xtc_db_query("SELECT
                                                    `products_options`,
                                                    `products_options_values`,
                                                    `price_prefix`,
                                                    `options_values_price`
                                                FROM `orders_products_attributes`
                                                WHERE
                                                    `orders_products_id` = {$orderRow['orders_products_id']} AND
                                                    `orders_id` = $orderId");
            
            $attributeData = [];
            while ($attributeRow = xtc_db_fetch_array($attributesResult)) {
                $attributeData[] = [
                    xtc_get_attributes_model($orderRow['products_id'],
                                             $attributeRow['products_options_values'],
                                             $attributeRow['products_options']),
                    $attributeRow['products_options'] . ': ' . $attributeRow['products_options_values'],
                ];
            }
            
            require_once DIR_FS_CATALOG . 'gm/modules/gm_gprint_tables.php';
            require_once DIR_FS_CATALOG . 'gm/classes/GMGPrintConfiguration.php';
            require_once DIR_FS_CATALOG . 'gm/classes/GMGPrintContentManager.php';
            
            $customizerContentManager = MainFactory::create('GMGPrintContentManager');
            $customizerOrderData      = $customizerContentManager->get_orders_products_content($orderRow['orders_products_id']);
            
            $countIndex = 0;
            
            reset($attributeData);
            foreach ($attributeData as $key => $value) {
                $countIndex = $key;
                if ($value[1] === ': ') {
                    // delete empty attributes (random id)
                    unset($attributeData[$key]);
                    $countIndex--;
                }
            }
            
            foreach ($customizerOrderData as $customizerAttribute) {
                $countIndex++;
                $attributeData[$countIndex] = [
                    '',
                    str_replace('&euro;',
                                chr(128),
                                $customizerAttribute['NAME']) . ': ' . str_replace('&euro;',
                                                                                   chr(128),
                                                                                   $customizerAttribute['VALUE']),
                ];
            }
            
            $propertiesResult = xtc_db_query("SELECT
                                                    `properties_name`,
                                                    `values_name`
                                                FROM `orders_products_properties`
                                                WHERE `orders_products_id` = {$orderRow['orders_products_id']}");
            while ($propertyRow = xtc_db_fetch_array($propertiesResult)) {
                $attributeData[] = [
                    '',
                    html_entity_decode_wrapper($propertyRow['properties_name']) . ': '
                    . html_entity_decode_wrapper($propertyRow['values_name']),
                ];
            }
            
            if ($orderRow['products_quantity'] == 0) {
                $singlePrice = xtc_format_price_order(0.0, 1, $order->info['currency']);
            } else {
                $singlePrice = xtc_format_price_order($orderRow['final_price'] / $orderRow['products_quantity'],
                                                      1,
                                                      $order->info['currency']);
            }
            $orderPdfData[] = [
                'PRODUCTS_MODEL'        => $orderRow['products_model'],
                'PRODUCTS_NAME'         => $orderRow['products_name'],
                'PRODUCTS_QTY'          => gm_prepare_number($orderRow['products_quantity']),
                'PRODUCTS_UNIT'         => $orderRow['unit_name'],
                'PRODUCTS_TAX'          => xtc_display_tax_value($orderRow['products_tax']) . "%",
                'PRODUCTS_PRICE_SINGLE' => $singlePrice,
                'PRODUCTS_PRICE'        => xtc_format_price_order($orderRow['final_price'],
                                                                  1,
                                                                  $order->info['currency']),
                'PRODUCTS_ATTRIBUTES'   => $attributeData,
            ];
        }
        
        return $orderPdfData;
    }
    
    
    /**
     * @return bool
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function useProductsModel(): bool
    {
        return gm_get_conf('GM_PDF_USE_PRODUCTS_MODEL') === '1';
    }
    
    
    /**
     * @param int $orderId
     *
     * @return array
     */
    protected function getOrderTotal(int $orderId): array
    {
        $result = xtc_db_query("SELECT
                                     `title`,
                                     `text`,
                                     `class`,
                                     `value`,
                                     `sort_order`
                                FROM `orders_total`
                                WHERE `orders_id` = $orderId
                                ORDER BY `sort_order` ASC");
        
        $orderTotal = [];
        while ($row = xtc_db_fetch_array($result)) {
            $orderTotal[] = [
                'TITLE' => html_entity_decode_wrapper($row['title']),
                'TEXT'  => $row['text'],
            ];
        }
        
        return $orderTotal;
    }
    
    
    /**
     * @param order_ORIGIN $order
     * @param string       $type
     *
     * @return array
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getOrderInfo(order_ORIGIN $order, string $type): array
    {
        $orderInfo = [];
        
        if (gm_get_conf('GM_PDF_USE_INFO') === '1') {
            $deliveryName    = trim($order->delivery['name']);
            $deliveryCompany = trim($order->delivery['company']);
            
            if (!empty($deliveryName) || !empty($deliveryCompany)) {
                $orderInfo['ADR_LABEL_SHIPPING'][0] = $this->languageTextManager->get_text('PDF_INFO_ADR_LABEL_SHIPPING',
                                                                                           'gm_pdf_order',
                                                                                           $this->languageId);
                $orderInfo['ADR_LABEL_SHIPPING'][1] = strip_tags(gm_pdf_adress_format(xtc_address_format($order->delivery['format_id'],
                                                                                                         $order->delivery,
                                                                                                         0,
                                                                                                         '',
                                                                                                         "###")));
            } else {
                $orderInfo['ADR_LABEL_SHIPPING'][0] = $this->languageTextManager->get_text('PDF_INFO_ADR_LABEL_SHIPPING',
                                                                                           'gm_pdf_order',
                                                                                           $this->languageId);
                $orderInfo['ADR_LABEL_SHIPPING'][1] = strip_tags(gm_pdf_adress_format(xtc_address_format($order->customer['format_id'],
                                                                                                         $order->customer,
                                                                                                         0,
                                                                                                         '',
                                                                                                         "###")));
            }
            
            // remove duplicated commas
            $orderInfo['ADR_LABEL_SHIPPING'][1] = implode(', ',
                                                          array_filter(array_map('trim',
                                                                                 explode(',',
                                                                                         $orderInfo['ADR_LABEL_SHIPPING'][1]))));
            
            if ($order->info['payment_method'] !== '' && $order->info['payment_method'] !== 'no_payment') {
                $orderInfo['PAYMENT_METHOD'][0] = $this->languageTextManager->get_text('PDF_INFO_PAYMENT',
                                                                                       'gm_pdf_order',
                                                                                       $this->languageId);
                $orderInfo['PAYMENT_METHOD'][1] = PaymentTitleProvider::getStrippedTagsTitle($order->info['payment_method'],
                                                                                             $this->language);
            }
            
            if (!empty($order->info['shipping_class'])) {
                
                $shippingModuleName = $order->info['shipping_class'];
                if (strpos($order->info['shipping_class'], '_') !== false) {
                    $gm_shipping_class  = explode('_', $order->info['shipping_class']);
                    $shippingModuleName = $gm_shipping_class[0];
                }
                
                $section                         = $shippingModuleName;
                $phraseName                      = 'MODULE_SHIPPING_' . strtoupper($shippingModuleName) . '_TEXT_TITLE';
                $orderInfo['SHIPPING_METHOD'][0] = $this->languageTextManager->get_text('PDF_INFO_SHIPPING',
                                                                                        'gm_pdf_order',
                                                                                        $this->languageId);
                if ($this->languageTextManager->get_text($phraseName, $section, $this->languageId) !== $phraseName) {
                    $orderInfo['SHIPPING_METHOD'][1] = trim(html_entity_decode_wrapper(strip_tags($this->languageTextManager->get_text($phraseName,
                                                                                                                                       $section,
                                                                                                                                       $this->languageId))));
                } elseif ($this->languageTextManager->get_text($phraseName, 'shipping_' . $section, $this->languageId)
                          !== $phraseName) {
                    $orderInfo['SHIPPING_METHOD'][1] = trim(html_entity_decode_wrapper(strip_tags($this->languageTextManager->get_text($phraseName,
                                                                                                                                       'shipping_'
                                                                                                                                       . $section,
                                                                                                                                       $this->languageId))));
                } else {
                    $orderInfo['SHIPPING_METHOD'][1] = $shippingModuleName;
                }
            }
            
            if (!empty($order->info['comments']) && gm_get_conf('GM_PDF_USE_CUSTOMER_COMMENT') === '1') {
                $orderInfo['CUSTOMER_COMMENTS'][0] = $this->languageTextManager->get_text('PDF_INFO_CUSTOMER_COMMENTS',
                                                                                          'gm_pdf_order',
                                                                                          $this->languageId);
                $orderInfo['CUSTOMER_COMMENTS'][1] = strip_tags($order->info['comments']);
            }
            
            $this->addInfoText($orderInfo, $type);
        }
        
        return $orderInfo;
    }
    
    
    /**
     * @return array
     */
    protected function getPdfFooter(): array
    {
        $pdfFooter   = [];
        $footerCells = gm_get_content([
                                          'GM_PDF_FOOTER_CELL_1',
                                          'GM_PDF_FOOTER_CELL_2',
                                          'GM_PDF_FOOTER_CELL_3',
                                          'GM_PDF_FOOTER_CELL_4',
                                      ],
                                      $this->languageId,
                                      'NUMERIC');
        
        foreach ($footerCells as $cell) {
            if (!empty($cell)) {
                $pdfFooter[] = $cell;
            }
        }
        
        return $pdfFooter;
    }
    
    
    /**
     * @return array
     */
    protected function getPdfTexts(): array
    {
        $pdfTexts = gm_get_content([
                                       'GM_PDF_COMPANY_ADRESS_RIGHT',
                                       'GM_PDF_COMPANY_ADRESS_LEFT',
                                       'GM_PDF_HEADING_CONDITIONS',
                                       'GM_PDF_HEADING_WITHDRAWAL',
                                       'GM_PDF_CONDITIONS',
                                       'GM_PDF_WITHDRAWAL',
                                   ],
                                   $this->languageId);
        
        return $pdfTexts;
    }
    
    
    /**
     * @param int          $p_orderId
     * @param order_ORIGIN $order
     * @param array        $gm_order_pdf_values_lang
     * @param string       $type
     * @param int|null     $cancelInvoiceId
     *
     * @return array
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getPdfConfiguration(
        int $p_orderId,
        order_ORIGIN $order,
        array $gm_order_pdf_values_lang,
        string $type,
        ?int $cancelInvoiceId
    ): array {
        $taxStatus        = $this->getTaxStatus($p_orderId);
        $customerAddress  = $this->getCustomerAddress($order, $type);
        $pdfConfiguration = gm_get_conf([
                                            'GM_PDF_DRAW_COLOR',
                                            'GM_PDF_CUSTOMER_ADR_POS',
                                            'GM_PDF_HEADING_MARGIN_BOTTOM',
                                            'GM_PDF_HEADING_MARGIN_TOP',
                                            'GM_PDF_ORDER_INFO_MARGIN_TOP',
                                            'GM_LOGO_PDF_USE',
                                            'GM_LOGO_PDF',
                                            'GM_PDF_USE_CONDITIONS',
                                            'GM_PDF_USE_WITHDRAWAL',
                                        ]);
        
        $pdfConfiguration['GM_PDF_SHOW_TAX']            = $taxStatus['tax'];
        $pdfConfiguration['GM_PDF_CUSTOMER_ADRESS']     = $customerAddress;
        $pdfConfiguration['GM_PDF_COMPANY_ADRESS_LEFT'] = $gm_order_pdf_values_lang['GM_PDF_COMPANY_ADRESS_LEFT'];
        $pdfConfiguration['GM_PDF_HEADING_CONDITIONS']  = $gm_order_pdf_values_lang['GM_PDF_HEADING_CONDITIONS'];
        
        require_once DIR_FS_CATALOG . 'gm/classes/GMJanolaw.php';
        $janolaw = MainFactory::create('GMJanolaw');
        
        if ($janolaw->get_status()) {
            if (MODULE_GAMBIO_JANOLAW_USE_IN_PDF !== 'False') {
                $termsAndConditions                    = $janolaw->get_page_content('terms', false, false);
                $termsAndConditions                    = preg_replace('!^§(.*?)\n( |)!',
                                                                      "§$1\n\n",
                                                                      $termsAndConditions);
                $termsAndConditions                    = preg_replace('!(.*?)\n§(.*?)\n( |)!',
                                                                      "$1\n\n§$2\n\n",
                                                                      $termsAndConditions);
                $termsAndConditions                    = trim($termsAndConditions);
                $pdfConfiguration['GM_PDF_CONDITIONS'] = $termsAndConditions;
            } else {
                $pdfConfiguration['GM_PDF_CONDITIONS'] = $gm_order_pdf_values_lang['GM_PDF_CONDITIONS'];
            }
            
            if (MODULE_GAMBIO_JANOLAW_USE_IN_PDF !== 'False') {
                $withdrawal                            = $janolaw->get_page_content('revocation', false, false);
                $withdrawal                            = preg_replace('!^§(.*?)\n!', "§$1\n\n", $withdrawal);
                $withdrawal                            = preg_replace('!(.*?)\n§(.*?)\n!',
                                                                      "$1\n\n§$2\n\n",
                                                                      $withdrawal);
                $withdrawal                            = trim($withdrawal);
                $pdfConfiguration['GM_PDF_WITHDRAWAL'] = $withdrawal;
            } else {
                $pdfConfiguration['GM_PDF_WITHDRAWAL'] = $gm_order_pdf_values_lang['GM_PDF_WITHDRAWAL'];
            }
        } else {
            $pdfConfiguration['GM_PDF_CONDITIONS'] = $gm_order_pdf_values_lang['GM_PDF_CONDITIONS'];
            $pdfConfiguration['GM_PDF_WITHDRAWAL'] = $gm_order_pdf_values_lang['GM_PDF_WITHDRAWAL'];
        }
        
        $pdfConfiguration['GM_PDF_HEADING_WITHDRAWAL'] = $gm_order_pdf_values_lang['GM_PDF_HEADING_WITHDRAWAL'];
        $pdfConfiguration['GM_PDF_LINK']               = HTTP_CATALOG_SERVER . DIR_WS_CATALOG;
        
        // check if logo exists
        if (!empty($pdfConfiguration['GM_LOGO_PDF'])) {
            if (file_exists(DIR_FS_CATALOG_IMAGES . 'logos/' . $pdfConfiguration['GM_LOGO_PDF'])) {
                $pdfConfiguration['GM_PDF_LOGO_LINK'] = DIR_FS_CATALOG_IMAGES . 'logos/'
                                                        . $pdfConfiguration['GM_LOGO_PDF'];
            } else {
                $pdfConfiguration['GM_LOGO_PDF_USE'] = 0;
            }
        } else {
            $pdfConfiguration['GM_LOGO_PDF_USE'] = 0;
        }
        
        $this->addHeading($type, $pdfConfiguration, $cancelInvoiceId);
        
        return $pdfConfiguration;
    }
    
    
    /**
     * @return array
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getFontConfiguration(): array
    {
        return [
            'DEFAULT'            => gm_get_conf([
                                                    'GM_PDF_DEFAULT_FONT_FACE',
                                                    'GM_PDF_DEFAULT_FONT_STYLE',
                                                    'GM_PDF_DEFAULT_FONT_SIZE',
                                                    'GM_PDF_DEFAULT_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'CUSTOMER'           => gm_get_conf([
                                                    'GM_PDF_CUSTOMER_FONT_FACE',
                                                    'GM_PDF_CUSTOMER_FONT_STYLE',
                                                    'GM_PDF_CUSTOMER_FONT_SIZE',
                                                    'GM_PDF_CUSTOMER_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'COMPANY_LEFT'       => gm_get_conf([
                                                    'GM_PDF_COMPANY_LEFT_FONT_FACE',
                                                    'GM_PDF_COMPANY_LEFT_FONT_STYLE',
                                                    'GM_PDF_COMPANY_LEFT_FONT_SIZE',
                                                    'GM_PDF_COMPANY_LEFT_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'COMPANY_RIGHT'      => gm_get_conf([
                                                    'GM_PDF_COMPANY_RIGHT_FONT_FACE',
                                                    'GM_PDF_COMPANY_RIGHT_FONT_STYLE',
                                                    'GM_PDF_COMPANY_RIGHT_FONT_SIZE',
                                                    'GM_PDF_COMPANY_RIGHT_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'HEADING'            => gm_get_conf([
                                                    'GM_PDF_HEADING_FONT_FACE',
                                                    'GM_PDF_HEADING_FONT_STYLE',
                                                    'GM_PDF_HEADING_FONT_SIZE',
                                                    'GM_PDF_HEADING_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'HEADING_ORDER'      => gm_get_conf([
                                                    'GM_PDF_HEADING_ORDER_FONT_FACE',
                                                    'GM_PDF_HEADING_ORDER_FONT_STYLE',
                                                    'GM_PDF_HEADING_ORDER_FONT_SIZE',
                                                    'GM_PDF_HEADING_ORDER_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'ORDER'              => gm_get_conf([
                                                    'GM_PDF_ORDER_FONT_FACE',
                                                    'GM_PDF_ORDER_FONT_STYLE',
                                                    'GM_PDF_ORDER_FONT_SIZE',
                                                    'GM_PDF_ORDER_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'ORDER_TOTAL'        => gm_get_conf([
                                                    'GM_PDF_ORDER_TOTAL_FONT_FACE',
                                                    'GM_PDF_ORDER_TOTAL_FONT_STYLE',
                                                    'GM_PDF_ORDER_TOTAL_FONT_SIZE',
                                                    'GM_PDF_ORDER_TOTAL_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'HEADING_ORDER_INFO' => gm_get_conf([
                                                    'GM_PDF_HEADING_ORDER_INFO_FONT_FACE',
                                                    'GM_PDF_HEADING_ORDER_INFO_FONT_STYLE',
                                                    'GM_PDF_HEADING_ORDER_INFO_FONT_SIZE',
                                                    'GM_PDF_HEADING_ORDER_INFO_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'ORDER_INFO'         => gm_get_conf([
                                                    'GM_PDF_ORDER_INFO_FONT_FACE',
                                                    'GM_PDF_ORDER_INFO_FONT_STYLE',
                                                    'GM_PDF_ORDER_INFO_FONT_SIZE',
                                                    'GM_PDF_ORDER_INFO_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'FOOTER'             => gm_get_conf([
                                                    'GM_PDF_FOOTER_FONT_FACE',
                                                    'GM_PDF_FOOTER_FONT_STYLE',
                                                    'GM_PDF_FOOTER_FONT_SIZE',
                                                    'GM_PDF_FOOTER_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'HEADING_CONDITIONS' => gm_get_conf([
                                                    'GM_PDF_HEADING_CONDITIONS_FONT_FACE',
                                                    'GM_PDF_HEADING_CONDITIONS_FONT_STYLE',
                                                    'GM_PDF_HEADING_CONDITIONS_FONT_SIZE',
                                                    'GM_PDF_HEADING_CONDITIONS_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'CONDITIONS'         => gm_get_conf([
                                                    'GM_PDF_CONDITIONS_FONT_FACE',
                                                    'GM_PDF_CONDITIONS_FONT_STYLE',
                                                    'GM_PDF_CONDITIONS_FONT_SIZE',
                                                    'GM_PDF_CONDITIONS_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
            'CANCEL'             => gm_get_conf([
                                                    'GM_PDF_CANCEL_FONT_FACE',
                                                    'GM_PDF_CANCEL_FONT_STYLE',
                                                    'GM_PDF_CANCEL_FONT_SIZE',
                                                    'GM_PDF_CANCEL_FONT_COLOR',
                                                ],
                                                'NUMERIC'),
        ];
    }
    
    
    /**
     * @param string $type
     *
     * @return mixed
     */
    protected function getNextId(string $type)
    {
        if ($type === 'invoice') {
            $this->getOrderFormat()->ensure_next_invoice_id_is_free();
            $nextId = $this->getOrderFormat()->get_next_id('GM_NEXT_INVOICE_ID');
        } else {
            $nextId = $this->getOrderFormat()->get_next_id('GM_NEXT_PACKINGS_ID');
        }
        
        return $nextId;
    }
    
    
    /**
     * @param int      $orderStatusId
     * @param int|null $cancelInvoiceId
     * @param int      $orderId
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function updateOrderStatus(
        int $orderStatusId,
        ?int $cancelInvoiceId,
        int $orderId
    ): void {
        $changeStatus = true;
        
        $orderStatusExists = xtc_db_query("SELECT *
                                            FROM `orders_status`
                                            WHERE `orders_status_id` = "
                                          . (int)gm_get_conf('GM_PDF_ORDER_STATUS_INVOICE'))->num_rows > 0;
        
        $invoiceOrderStatusId = $orderStatusExists ? gm_get_conf('GM_PDF_ORDER_STATUS_INVOICE') : 149;
        $notifyCustomer       = 0;
        $comment              = $this->languageTextManager->get_text('PDF_INVOICING_COMMENT',
                                                                     'gm_pdf_order',
                                                                     $this->languageId);
        if ($orderStatusId == $invoiceOrderStatusId) {
            $changeStatus = false;
        }
        
        if ($changeStatus && $cancelInvoiceId === null) {
            $this->getOrderFormat()->update_orders_status($orderId,
                                                          $invoiceOrderStatusId,
                                                          $notifyCustomer,
                                                          $comment,
                                                          $this->adminCustomerId);
        } else {
            $this->getOrderFormat()->update_orders_status($orderId,
                                                          $orderStatusId,
                                                          0,
                                                          $this->languageTextManager->get_text('PDF_INVOICING_COMMENT',
                                                                                               'gm_pdf_order',
                                                                                               $this->languageId),
                                                          $this->adminCustomerId);
        }
    }
    
    
    /**
     * @param int      $id
     * @param int|null $cancelInvoiceId
     *
     * @return string
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getInvoiceNumber(int $id, ?int $cancelInvoiceId): string
    {
        $invoiceNumber = str_replace('{INVOICE_ID}', $id, gm_get_conf('GM_INVOICE_ID'));
        
        if ($cancelInvoiceId !== null) {
            $invoiceNumber .= '_STORNO';
        }
        
        return $invoiceNumber;
    }
    
    
    /**
     * @param int $id
     *
     * @return string
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getPackingSlipNumber(int $id): string
    {
        return str_replace('{DELIVERY_ID}', $id, gm_get_conf('GM_PACKINGS_ID'));
    }
    
    
    /**
     * @param order_ORIGIN $order
     * @param int          $orderId
     * @param string       $type
     * @param array        $orderData
     * @param DateTime     $date
     * @param array        $pdfTexts
     *
     * @return string
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getPdfTopRightContent(
        order_ORIGIN $order,
        int $orderId,
        string $type,
        array $orderData,
        DateTime $date,
        array $pdfTexts
    ): string {
        $content = '';
        
        // -> use customer id?
        if (!empty($order->customer['csID']) && gm_get_conf('GM_PDF_USE_CUSTOMER_CODE') === '1') {
            $content .= $this->languageTextManager->get_text('PDF_TITLE_CUSTOMER_CODE',
                                                             'gm_pdf_order',
                                                             $this->languageId) . ' ' . $order->customer['csID'] . "\n";
        }
        
        // -> use order date?
        if (gm_get_conf('GM_PDF_USE_ORDER_DATE') === '1') {
            $content .= $this->languageTextManager->get_text('PDF_TITLE_ORDER_DATE', 'gm_pdf_order', $this->languageId)
                        . ' ' . xtc_date_short($order->info['date_purchased'] ?? null, $this->languageId) . "\n";
        }
        
        // -> use order id?
        if (gm_get_conf('GM_PDF_USE_ORDER_CODE') === '1') {
            $content .= $this->languageTextManager->get_text('PDF_TITLE_ORDER_CODE', 'gm_pdf_order', $this->languageId)
                        . ' ' . $orderId . "\n";
        }
        
        if ($type === 'invoice') {
            if (gm_get_conf('GM_PDF_USE_INVOICE_CODE') === '1') {
                $content .= $this->languageTextManager->get_text('PDF_TITLE_INVOICE_CODE',
                                                                 'gm_pdf_order',
                                                                 $this->languageId) . ' ' . $orderData['invoice_number']
                            . "\n";
            }
            
            // add vat id if exists
            if (!empty($order->customer['vat_id'])) {
                $content .= $this->languageTextManager->get_text('PDF_TITLE_VAT_ID', 'gm_pdf_order', $this->languageId)
                            . ' ' . $order->customer['vat_id'] . "\n";
            }
        } elseif (gm_get_conf('GM_PDF_USE_PACKING_CODE') === '1') {
            $content .= $this->languageTextManager->get_text('PDF_TITLE_PACKING_CODE',
                                                             'gm_pdf_order',
                                                             $this->languageId) . ' '
                        . $orderData['packing_slip_number'] . "\n";
        }
        
        /* determine invoice date */
        if (gm_get_conf('GM_PDF_USE_DATE') === '1') {
            $content .= $this->languageTextManager->get_text('PDF_TITLE_DATE', 'gm_pdf_order', $this->languageId) . ' '
                        . xtc_date_short($date->format('Y-m-d H:i:s'), $this->languageId);
        }
        
        if (!empty($content)) {
            $content = $pdfTexts['GM_PDF_COMPANY_ADRESS_RIGHT'] . "\n\n" . $content;
        } else {
            $content = $pdfTexts['GM_PDF_COMPANY_ADRESS_RIGHT'];
        }
        
        return $content;
    }
    
    
    /**
     * @return array
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function getPdfProtectionConfiguration(): array
    {
        $configuration = [];
        
        if (gm_get_conf('GM_PDF_ALLOW_MODIFYING') === '0') {
            $configuration[] = 'modify';
        }
        
        if (gm_get_conf('GM_PDF_ALLOW_NOTIFYING') === '0') {
            $configuration[] = 'annot-forms';
        }
        
        if (gm_get_conf('GM_PDF_ALLOW_COPYING') === '0') {
            $configuration[] = 'copy';
        }
        
        return $configuration;
    }
    
    
    /**
     * @param array $pdfProtectionConfiguration
     *
     * @return bool
     */
    protected function usePdfProtection(array $pdfProtectionConfiguration): bool
    {
        $useProtection = count($pdfProtectionConfiguration) > 0;
        
        // If we are accessing this script from AJAX (Orders Overview) then do not use protection on the sub-files
        // cause the final file will be encrypted (see OrderActions class).
        if (isset($_GET['ajax']) && filter_var($_GET['ajax'], FILTER_VALIDATE_BOOLEAN)) {
            $useProtection = false;
        }
        
        return $useProtection;
    }
    
    
    /**
     * @param bool $usePdfProtection
     * @param bool $useFooter
     *
     * @return array|string|null
     */
    protected function getPdfValues(bool $usePdfProtection, bool $useFooter)
    {
        $pdfValues = gm_get_conf([
                                     'GM_PDF_TOP_MARGIN',
                                     'GM_PDF_LEFT_MARGIN',
                                     'GM_PDF_RIGHT_MARGIN',
                                     'GM_PDF_BOTTOM_MARGIN',
                                     'GM_PDF_FIX_HEADER',
                                     'GM_PDF_USE_HEADER',
                                     'GM_PDF_USE_FOOTER',
                                     'GM_PDF_DISPLAY_ZOOM',
                                     'GM_PDF_DISPLAY_LAYOUT',
                                     'GM_PDF_CELL_HEIGHT',
                                 ]);
        
        $pdfValues['GM_PDF_USE_PROTECTION'] = $usePdfProtection;
        $pdfValues['GM_PDF_USE_FOOTER']     = $useFooter;
        
        return $pdfValues;
    }
    
    
    /**
     * @param string $type
     * @param string $pdfTopRightContent
     * @param array  $orderData
     * @param array  $orderTotal
     * @param array  $orderInfo
     * @param array  $pdfFooter
     * @param array  $fontConfiguration
     * @param array  $pdfValues
     * @param array  $pdfConfiguration
     * @param bool   $useProductModel
     * @param int    $orderId
     * @param bool   $usePdfProtection
     * @param array  $pdfProtectionConfiguration
     * @param bool   $download
     * @param bool   $preview
     * @param string $invoiceNumber
     *
     * @return string
     */
    protected function createPdfDocument(
        string $type,
        string $pdfTopRightContent,
        array $orderData,
        array $orderTotal,
        array $orderInfo,
        array $pdfFooter,
        array $fontConfiguration,
        array $pdfValues,
        array $pdfConfiguration,
        bool $useProductModel,
        int $orderId,
        bool $usePdfProtection,
        array $pdfProtectionConfiguration,
        bool $download,
        bool $preview,
        string $invoiceNumber = ''
    ): string {
        $pdf = MainFactory::create('gmOrderPDF',
                                   $type,
                                   $pdfTopRightContent,
                                   $orderData,
                                   $orderTotal,
                                   $orderInfo,
                                   $pdfFooter,
                                   $fontConfiguration,
                                   $pdfValues,
                                   $pdfConfiguration,
                                   $useProductModel);
        
        $pdf->Body();
        
        if ($type === 'invoice') {
            $pdfFilePath = DIR_FS_CATALOG . 'export/invoice/' . $orderId . '__' . str_replace('/',
                                                                                              '_',
                                                                                              $invoiceNumber) . '__'
                           . date("Y-m-d-H-i-s") . '__' . FileLog::get_secure_token() . '.pdf';
        } else {
            $pdfFilePath = DIR_FS_CATALOG . 'export/packingslip/' . $orderId . '__' . date("Y-m-d-H-i-s") . '__'
                           . FileLog::get_secure_token() . '.pdf';
        }
        
        if ($usePdfProtection) {
            $pdf->SetProtection($pdfProtectionConfiguration);
        }
        
        $pdf->Output($pdfFilePath, $download ? 'D' : ($preview ? 'FI' : 'F'), 'create_order');
        
        return $pdfFilePath;
    }
    
    
    /**
     * @param string   $type
     * @param int      $orderId
     * @param string   $pdfFilePath
     * @param array    $orderData
     * @param DateTime $date
     * @param int|null $cancelInvoiceId
     * @param array    $response
     * @param int      $nextId
     *
     * @throws \Doctrine\DBAL\DBALException
     */
    protected function storeInDb(
        string $type,
        int $orderId,
        string $pdfFilePath,
        array $orderData,
        DateTime $date,
        ?int $cancelInvoiceId,
        array &$response,
        int $nextId
    ): void {
        if ($type === 'invoice') {
            $orderReadService = StaticGXCoreLoader::getService('OrderRead');
            $orderId          = new IdType($orderId);
            $order            = $orderReadService->getOrderById($orderId);
            
            $orderTotalCollection = $order->getOrderTotals();
            $totalSum             = null;
            foreach ($orderTotalCollection as $orderTotal) {
                /** @var OrderTotal $orderTotal */
                if ($orderTotal->getClass() === 'ot_total') {
                    $totalSum = $orderTotal->getValue();
                    
                    if ($cancelInvoiceId !== null) {
                        $totalSum *= -1;
                    }
                    
                    $totalSum = new DecimalType($totalSum);
                }
            }
            
            $invoiceInfo = MainFactory::create('InvoiceInformation',
                                               new StringType($orderData['invoice_number']),
                                               $date,
                                               $order->getCurrencyCode(),
                                               $totalSum,
                                               new IdType($order->getCustomerId()),
                                               $order->getCustomerStatusInformation(),
                                               $order->getBillingAddress(),
                                               $order->getDeliveryAddress(),
                                               $orderId,
                                               $order->getPurchaseDateTime(),
                                               $order->getPaymentType());
            
            /* @var InvoiceArchiveWriteService $invoiceArchiveWriteService */
            $invoiceArchiveWriteService                = StaticGXCoreLoader::getService('InvoiceArchiveWrite');
            $invoiceFile                               = MainFactory::create('ExistingFile',
                                                                             new NonEmptyStringType($pdfFilePath));
            $response['jsonResponseData']['invoiceId'] = $invoiceArchiveWriteService->importInvoiceFile($invoiceFile,
                                                                                                        $invoiceInfo);
            @unlink($pdfFilePath);
            $response['jsonResponseData']['invoiceNumber'] = $invoiceInfo->getInvoiceNumber();
            
            $this->getOrderFormat()->save_id('invoice',
                                             $nextId,
                                             $orderData['invoice_number']);
            $nextFreeId = $this->getOrderFormat()->get_next_free_id('invoice');
            $this->getOrderFormat()->set_next_id('GM_NEXT_INVOICE_ID', $nextFreeId);
            
            $this->updateOrderStatus($orderData['orders_status'], $cancelInvoiceId, $orderId->asInt());
        } else {
            $db = StaticGXCoreLoader::getDatabaseQueryBuilder();
            $db->insert('packing_slips',
                        [
                            'number'   => $orderData['packing_slip_number'],
                            'date'     => $date->format('Y-m-d H:i:s'),
                            'filename' => basename($pdfFilePath),
                            'order_id' => $orderId,
                        ]);
            
            $this->getOrderFormat()->save_id('packing_slip',
                                             $nextId,
                                             $orderData['packing_slip_number']);
            $nextFreeId = $this->getOrderFormat()->get_next_free_id('packing_slip');
            $this->getOrderFormat()->set_next_id('GM_NEXT_PACKINGS_ID', $nextFreeId);
        }
    }
    
    
    /**
     * @param string $name
     * @param int    $id
     *
     * @return string
     */
    protected function getPdfName(string $name, int $id): string
    {
        return xtc_cleanName(trim($name), '_') . '_' . $id . '.pdf';
    }
    
    
    /**
     * @return GMOrderFormat_ORIGIN
     */
    protected function getOrderFormat(): GMOrderFormat_ORIGIN
    {
        if ($this->orderFormat === null) {
            $this->orderFormat = MainFactory::create('GMOrderFormat');
        }
        
        return $this->orderFormat;
    }
    
    
    /**
     * @param GXSmarty $smarty
     * @param string   $type
     *
     * @return string
     */
    protected function fetchEmailTemplate(GXSmarty $smarty, string $type): string
    {
        return fetch_email_template($smarty, 'invoice_mail', $type, '', $this->languageId);
    }
    
    
    /**
     * @param string $subject
     * @param string $htmlBody
     * @param string $textBody
     * @param array  $attachments
     * @param array  $orderData
     *
     * @return bool
     */
    protected function sendInvoiceMail(
        string $subject,
        string $htmlBody,
        string $textBody,
        array $attachments,
        array $orderData
    ): bool {
        return xtc_php_mail(EMAIL_FROM,
                            STORE_NAME,
                            $orderData['customers_email_address'],
                            $orderData['customers_firstname'] . ' ' . $orderData['customers_lastname'],
                            EMAIL_BILLING_FORWARDING_STRING,
                            '',
                            '',
                            $attachments,
                            '',
                            $subject,
                            $htmlBody,
                            strip_tags($textBody));
    }
    
    
    /**
     * @param int $orderId
     *
     * @return string
     */
    protected function getOrderPdfDataQuery(int $orderId): string
    {
        return "SELECT
                    op.`products_id`,
                    op.`orders_products_id`,
                    op.`products_model`,
                    op.`products_name`,
                    op.`final_price`,
                    op.`products_tax`,
                    op.`products_quantity`,
                    opqu.`quantity_unit_id`,
                    opqu.`unit_name`
                FROM `orders_products` op
                LEFT JOIN `orders_products_quantity_units` opqu USING (`orders_products_id`)
                WHERE op.`orders_id` = $orderId
                ORDER BY op.`orders_products_id` ASC";
    }
}
