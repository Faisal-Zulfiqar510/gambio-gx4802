<?php
/* --------------------------------------------------------------
  gm_pdf_order.php 2022-02-15
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2022 Gambio GmbH
  Released under the GNU General Public License

  IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
  MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
  NEW GX-ENGINE LIBRARIES INSTEAD.
  --------------------------------------------------------------
 */

require_once __DIR__ . '/includes/application_top.php';
require_once DIR_FS_INC . 'xtc_exit.inc.php';

$languageId = (int)($_SESSION['languages_id'] ?? null);
$language   = (string)$_SESSION['language'];
$result     = xtc_db_query('SELECT
                            l.languages_id,
                            o.language
                        FROM
                            languages l,
                            orders o
                        WHERE
                            o.orders_id = ' . (int)$_GET['oID'] . ' AND
                            l.directory = o.language');
if (xtc_db_num_rows($result)) {
    $row        = xtc_db_fetch_array($result);
    $languageId = (int)$row['languages_id'];
    $language   = $row['language'];
}

$orderPdfManager = MainFactory::create('OrderPdfManager',
                                       $languageId,
                                       $language,
                                       (int)$_SESSION['customer_id']);

$orderId         = (int)$_GET['oID'];
$type            = isset($_GET['type']) && $_GET['type'] === 'invoice' ? 'invoice' : 'packingslip';
$cancelInvoiceId = isset($_GET['cancel_invoice_id']) ? (int)$_GET['cancel_invoice_id'] : null;

if (!empty($_GET['mail'])) {
    /**
     * Sending an invoice mail with one or more invoice PDF documents attached
     */
    
    /**
     * If one or more invoice IDs are given, collect the related invoices.
     */
    $invoiceIds = $_POST['invoice_ids'] ?? (!empty($_GET['iID']) ? [$_GET['iID']] : []);
    $invoices   = $orderPdfManager->getInvoices($invoiceIds);
    
    /**
     * If no specific invoice was given, load the latest one.
     */
    if ($invoices->isEmpty()) {
        $invoices = $orderPdfManager->findLatestInvoice($orderId);
    }
    
    /**
     * Create a new invoice, if no invoice exists and load its data.
     */
    if ($invoices->isEmpty()) {
        $orderPdfManager->createInvoice($orderId);
        $invoices = $orderPdfManager->findLatestInvoice($orderId);
    }
    
    /**
     * Send the mail
     */
    if (!$invoices->isEmpty()) {
        $mailResult = $orderPdfManager->sendMail($orderId,
                                                 $invoices,
                                                 $_POST['gm_subject'] ?? null,
                                                 $_POST['gm_mail'] ?? null);
        if ($mailResult) {
            echo PDF_MAIL_SUCCESS
                 . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'INVOICE_MAIL\')" style="cursor:pointer">'
                 . PDF_MAIL_CLOSE . '</span>';
            
            $languageTextManager = MainFactory::create('LanguageTextManager', 'gm_pdf_order', $languageId);
            $comment             = $languageTextManager->get_text('PDF_INVOICING_COMMENT_MAIL',
                                                                  'gm_pdf_order',
                                                                  $languageId);
            $orderFormat         = MainFactory::create('GMOrderFormat');
            $orderFormat->update_orders_status($orderId,
                                               (int)gm_get_conf('GM_PDF_ORDER_STATUS_INVOICE_MAIL'),
                                               1,
                                               $comment,
                                               (int)$_SESSION['customer_id']);
        }
    }
} elseif (isset($_GET['preview'])) {
    /**
     * Create a PDF without storing it and just display it as a preview
     * Gambio Admin > Orders > Invoices > Settings > Preview
     */
    switch ($type) {
        case 'invoice':
            $orderPdfManager->previewInvoice($orderId);
            break;
        case 'packingslip':
            $orderPdfManager->previewPackingSlip($orderId);
            break;
    }
} elseif (!empty($cancelInvoiceId)) {
    /**
     * Cancel an invoice by creating a new cancellation invoice
     */
    $response = $orderPdfManager->createCancellationInvoice($cancelInvoiceId);
    $url      = 'request_port.php?module=OrderAdmin&action=showPdf&type=invoice&invoice_number='
                . rawurlencode($response['jsonResponseData']['invoiceNumber']) . '&order_id=' . $orderId;
    
    if (isset($_GET['ajax'])) {
        echo json_encode($response['jsonResponseData']);
        xtc_exit();
    }
    
    xtc_redirect($url);
} elseif (empty($_GET['mail'])) {
    /**
     * Create and store an invoice or a packing slip PDF document
     */
    switch ($type) {
        case 'invoice':
            $response = $orderPdfManager->createInvoice($orderId);
            
            $url = 'request_port.php?module=OrderAdmin&action=showPdf&type=invoice&invoice_number='
                   . rawurlencode($response['jsonResponseData']['invoiceNumber']) . '&order_id=' . $orderId;
            break;
        
        case 'packingslip':
            $response = $orderPdfManager->createPackingSlip($orderId);
            $url      = GM_HTTP_SERVER . DIR_WS_ADMIN
                        . 'request_port.php?module=OrderAdmin&action=showPdf&type=packingslip&file='
                        . rawurlencode(basename($response['pdfFilePath'])) . '&order_id=' . $orderId;
            break;
        default:
            xtc_exit();
            exit;
    }
    
    if (isset($_GET['ajax'])) {
        echo json_encode($response['jsonResponseData']);
        xtc_exit();
    }
    
    xtc_redirect($url);
}
