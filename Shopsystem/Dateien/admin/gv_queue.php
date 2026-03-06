<?php
/* --------------------------------------------------------------
   gv_queue.php 2022-05-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

   based on:
   (c) 2000-2001 The Exchange Project (earlier name of osCommerce)
   (c) 2002-2003 osCommerce (gv_queue.php,v 1.2.2.5 2003/05/05); www.oscommerce.com
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: gv_queue.php 1030 2005-07-14 20:22:32Z novalis $)

   Released under the GNU General Public License
   -----------------------------------------------------------------------------------------
   Third Party contribution:

   Credit Class/Gift Vouchers/Discount Coupons (Version 5.10)
   http://www.oscommerce.com/community/contributions,282
   Copyright (c) Strider | Strider@oscworks.com
   Copyright (c  Nick Stanko of UkiDev.com, nick@ukidev.com
   Copyright (c) Andre ambidex@gmx.net
   Copyright (c) 2001,2002 Ian C Wilson http://www.phesis.org


   Released under the GNU General Public License
   ---------------------------------------------------------------------------------------*/

require('includes/application_top.php');

if (($_GET['action']??null) === 'release') {
    xtc_redirect(xtc_href_link('gv_mail.php', 'queue_id=' . $_GET['gid']));
}

require(DIR_WS_CLASSES . 'currencies.php');
$currencies = new currencies();

$t_page_token = $_SESSION['coo_page_token']->generate_token();

if (isset($_GET['gid'], $_GET['action'])) {
    $_SESSION['coo_page_token']->is_valid($_GET['page_token']);
    
    if ($_GET['action'] === 'confirmrelease') {
        die('deprecated use case');
    }
    
    if ($_GET['action'] === 'delete') {
        xtc_db_query("DELETE FROM coupon_gv_queue WHERE unique_id = '" . (int)$_GET['gid'] . "'");
        xtc_redirect(xtc_href_link('gv_queue.php'));
    }
}

$currentPage             = max((int)($_GET['page']??null), 1);
$entriesPerPage          = 20;
$splitPageResultsNumRows = 0;
$splitPageResultsQuery   = 'select `unique_id` from `coupon_gv_queue`';
$gv_split                = new splitPageResults($currentPage,
                                                $entriesPerPage,
                                                $splitPageResultsQuery,
                                                $splitPageResultsNumRows);
$pageOffset = max(0, $entriesPerPage * ($currentPage - 1));

$db = StaticGXCoreLoader::getDatabaseQueryBuilder();
// determine number of unreleased vouchers
$countRow         = $db->from('coupon_gv_queue')
    ->select('COUNT(*) AS total_rows')
    ->where('release_flag', 'N')
    ->get()
    ->row_array();
$gv_query_numrows = $countRow['total_rows'];

// get list of unreleased vouchers and related data
$gvList = $db->from('coupon_gv_queue')
    ->join('orders', 'orders.orders_id = coupon_gv_queue.order_id')
    ->join('orders_status',
           'orders_status.orders_status_id = orders.orders_status AND orders_status.language_id = '
           . $_SESSION['languages_id'])
    ->where('coupon_gv_queue.release_flag', 'N')
    ->select('coupon_gv_queue.unique_id, coupon_gv_queue.amount, coupon_gv_queue.date_created')
    ->select('orders.orders_id, orders.customers_firstname, orders.customers_lastname')
    ->select('orders_status.orders_status_name, orders_status.color')
    ->limit($entriesPerPage, $pageOffset)
    ->get()
    ->result_array();

$currentEntryUniqueId = null;
$currentEntry         = null;
if (!empty($gvList)) {
    $currentEntryUniqueId = (int)($_GET['gid'] ?? $gvList[0]['unique_id']);
    $currentEntry         = $db->get_where('coupon_gv_queue', ['unique_id' => $currentEntryUniqueId])->row_array();
}

?>
<!DOCTYPE HTML>
<html <?php echo HTML_PARAMS; ?>>
<head>
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
	<title><?php echo TITLE; ?></title>
	<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
	<style>
		.order-status {
			padding:       2px 4px;
			border-radius: 2px;
		}
	</style>
</head>
<body marginwidth="0" marginheight="0" topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" bgcolor="#FFFFFF">
<!-- header //-->
<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
<!-- header_eof //-->

<!-- body //-->
<!-- <pre><?php print_r($gvList) ?></pre> -->
<table border="0" style="width:100%; height:100%;" cellspacing="2" cellpadding="2">
	<tr>
		<td width="<?php echo BOX_WIDTH; ?>" valign="top">
			<table border="0" width="<?php echo BOX_WIDTH; ?>" cellspacing="1" cellpadding="1" class="columnLeft">
				<!-- left_navigation //-->
                <?php require(DIR_WS_INCLUDES . 'column_left.php'); ?>
				<!-- left_navigation_eof //-->
			</table>
		</td>
		<!-- body_text //-->
		<td class="boxCenter" width="100%" valign="top">
			<table border="0" width="100%" cellspacing="0" cellpadding="2">
				<tr>
					<td width="100%">
						<div class="pageHeading"
						     style="background-image:url(html/assets/images/legacy/gm_icons/hilfsprogr2.png)"><?php echo HEADING_TITLE; ?></div>
					</td>
				</tr>
				<tr>
					<td>
						<table border="0" width="100%" cellspacing="0" cellpadding="0">
							<tr>
								<td valign="top">
									<table class="gx-modules-table left-table" border="0" width="100%" cellspacing="0"
									       cellpadding="2">
										<tr class="dataTableHeadingRow">
											<td class="dataTableHeadingContent"><?php echo TABLE_HEADING_CUSTOMERS; ?></td>
											<td class="dataTableHeadingContent"
											    align="center"><?php echo TABLE_HEADING_ORDERS_ID; ?></td>
											<td class="dataTableHeadingContent"
											    align="right"><?php echo TABLE_HEADING_VOUCHER_VALUE; ?></td>
											<td class="dataTableHeadingContent"
											    align="right"><?php echo TABLE_HEADING_DATE_PURCHASED; ?></td>
											<td class="dataTableHeadingContent"></td>
										</tr>
                                        <?php
                                        if (empty($gvList)) {
                                            $gmLangEditTextManager = MainFactory::create('LanguageTextManager',
                                                                                         'gm_lang_edit',
                                                                                         $_SESSION['languages_id']);
                                            echo '<tr class="gx-container no-hover"><td colspan="6" class="text-center">'
                                                 . $gmLangEditTextManager->get_text('TEXT_NO_RESULT') . '</td></tr>';
                                        }
                                        foreach ($gvList as $gv_list):
                                            if ((int)$gv_list['unique_id'] === $currentEntryUniqueId) {
                                                echo '              <tr class="dataTableRowSelected active" data-gx-extension="link" data-link-url="'
                                                     . xtc_href_link('gv_queue.php',
                                                                     xtc_get_all_get_params(['gid', 'action']) . 'gid='
                                                                     . $gv_list['unique_id']) . '">'
                                                     . "\n";
                                            } else {
                                                echo '              <tr class="dataTableRow" data-gx-extension="link" data-link-url="'
                                                     . xtc_href_link('gv_queue.php',
                                                                     xtc_get_all_get_params(['gid', 'action']) . 'gid='
                                                                     . $gv_list['unique_id']) . '">' . "\n";
                                            }
                                            ?>
											<td class="dataTableContent"><?php echo $gv_list['customers_firstname']
                                                                                    . ' '
                                                                                    . $gv_list['customers_lastname']; ?></td>
											<td class="dataTableContent"
											    align="left">
                                                <?php echo $gv_list['orders_id']; ?>
												<span class="order-status"
												      style="background-color: #<?php echo $gv_list['color'] ?>"><?php echo $gv_list['orders_status_name']; ?></span>
											</td>
											<td class="dataTableContent"
											    align="left"><?php echo $currencies->format($gv_list['amount']); ?></td>
											<td class="dataTableContent"
											    align="left"><?php echo xtc_datetime_short($gv_list['date_created']); ?></td>
											<td></td>
											</tr>
                                        <?php
                                        endforeach;
                                        ?>
									</table>
									
									<table class="gx-container paginator left-table table-paginator">
										<tr>
											<td class="pagination-control">
                                                <?php echo $gv_split->display_count($gv_query_numrows,
                                                                                    $entriesPerPage,
                                                                                    $currentPage,
                                                                                    TEXT_DISPLAY_NUMBER_OF_GIFT_VOUCHERS); ?>
												<span class="page-number-information">
													<?php echo $gv_split->display_links($gv_query_numrows,
                                                                                        $entriesPerPage,
                                                                                        MAX_DISPLAY_PAGE_LINKS,
                                                                                        $currentPage); ?>
												</span>
											</td>
										</tr>
									</table>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
		<!-- body_text_eof //-->
	</tr>
</table>
<!-- body_eof //-->

<!-- footer //-->
<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
<!-- footer_eof //-->
<div class="hidden">
    <?php
    if ($currentEntryUniqueId !== null && $currentEntry !== null) {
        $heading        = [];
        $contents       = [];
        $buttons        = '';
        $formIsEditable = false;
        $formAction     = '';
        $formMethod     = 'post';
        $formAttributes = [];
        
        if (!empty($gv_query_numrows)) {
            $buttons = '<a class="button btn btn-primary" onClick="this.blur();" href="' . xtc_href_link('gv_queue.php',
                                                                                                         xtc_get_all_get_params([
                                                                                                                                    'action',
                                                                                                                                    'gid'
                                                                                                                                ])
                                                                                                         . '&action=release&gid='
                                                                                                         . $currentEntryUniqueId,
                                                                                                         'NONSSL')
                       . '">' . BUTTON_RELEASE . '</a>';
            
            $buttons .= '<a class="btn" href="' . xtc_href_link('gv_queue.php',
                                                                xtc_get_all_get_params([
                                                                                           'action',
                                                                                           'gid',
                                                                                           'page_token'
                                                                                       ]) . '&action=delete&gid='
                                                                . $currentEntryUniqueId . '&page_token='
                                                                . $t_page_token,
                                                                'NONSSL') . '" onclick="return confirm(\''
                        . GM_GV_DELETE . '\')">' . BUTTON_DELETE . '</a>';
            
            $heading[] = [
                'text' => TABLE_HEADING_GID . ': ' . $currentEntryUniqueId,
            ];
            $contents[] = [
                'text' => TABLE_HEADING_ORDERS_ID . ': ' . $currentEntry['order_id'] . '<br>' .
                          TABLE_HEADING_VOUCHER_VALUE . ': ' . $currencies->format($currentEntry['amount']) . '<br>' .
                          TABLE_HEADING_DATE_PURCHASED . ': ' . $currentEntry['date_created'],
            ];
        }
        
        $configurationBoxContentView = MainFactory::create_object('ConfigurationBoxContentView');
        $configurationBoxContentView->setOldSchoolHeading($heading);
        $configurationBoxContentView->setOldSchoolContents($contents);
        $configurationBoxContentView->setFormAttributes($formAttributes);
        $configurationBoxContentView->set_content_data('buttons', $buttons);
        $configurationBoxContentView->setFormEditable($formIsEditable);
        $configurationBoxContentView->setFormAction($formAction);
        echo $configurationBoxContentView->get_html();
    }
    ?>
</div>
</body>
</html>
<?php require(DIR_WS_INCLUDES . 'application_bottom.php'); ?>
