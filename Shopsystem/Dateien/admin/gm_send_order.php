<?php
/* --------------------------------------------------------------
   gm_send_order.php 2023-01-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------*/

	require(						'includes/application_top.php');
	require_once(DIR_FS_INC			. 'xtc_php_mail.inc.php');
	require_once(DIR_FS_INC			. 'xtc_get_attributes_model.inc.php');
	require_once(DIR_FS_INC			. 'xtc_not_null.inc.php');
	require_once(DIR_FS_INC			. 'xtc_format_price_order.inc.php');
	require_once(DIR_WS_CLASSES		. 'order.php');
	require_once(DIR_FS_CATALOG		. 'gm/inc/gm_prepare_number.inc.php');
	require_once(DIR_FS_CATALOG		. 'gm/inc/gm_save_order.inc.php');

	/* magnalister v1.0.1 */
	if (function_exists('magnaExecute')) magnaExecute('magnaSubmitOrderStatus', array('action' => 'gm_send_order'), array('order_details.php'));
	/* END magnalister */

	$smarty = MainFactory::create('GXSmarty');

	/*
	* -> create order
	*/
	$order = new order($_GET['oID']);

	$order_query_check = xtc_db_query("
										SELECT
											customers_email_address,
											customers_firstname,
											customers_lastname,
											gm_order_html,
											gm_order_txt
										FROM " .
											TABLE_ORDERS . "
										WHERE
											orders_id='".(int)$_GET['oID']."'
									");

	$order_check = xtc_db_fetch_array($order_query_check);
	$smarty->assign('order_titel', TITLE_ORDER);
	$smarty->assign('order_body', $order_check['gm_order_html']);
	$smarty->assign('oID', $_GET['oID']);

	$smarty->caching = false;
	$smarty->template_dir=DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
	$smarty->config_dir=DIR_FS_CATALOG.'lang';

if(array_key_exists('orders_multi_cancel', $_POST) && $_POST['orders_multi_cancel'] === 'true')
{
	$cancelIdArray = $_POST['gm_multi_status'];

	foreach($cancelIdArray as $oID)
	{
		$order         = new order($oID);
		$order_updated = false;
		$gm_status     = gm_get_conf('GM_ORDER_STATUS_CANCEL_ID');
		$gm_comments   = xtc_db_prepare_input($_POST['gm_comments']);

		$check_status_query = xtc_db_query("
											SELECT
												o.customers_name,
												o.customers_email_address,
												o.orders_status,
												o.language,
												o.date_purchased,
												l.languages_id
											FROM
												" . TABLE_ORDERS . " o
												LEFT JOIN languages l ON (o.language = l.directory)
											WHERE
												o.orders_id = '" . xtc_db_input($oID) . "'
											LIMIT 1
											");

		$check_status = xtc_db_fetch_array($check_status_query);

		if($check_status['orders_status'] != $gm_status)
		{

			xtc_db_query("
						UPDATE " . TABLE_ORDERS . "
						SET
							orders_status	= '" . $gm_status . "',
							last_modified	= now(),
							gm_cancel_date	= now()
						WHERE
							orders_id = '" . xtc_db_input($oID) . "'
						");

			if($_POST['gm_notify'] == 'on')
			{
				$notify_comments = '';

				if($_POST['gm_notify_comments'] == 'on')
				{
					$notify_comments = $gm_comments;
				}
				else
				{
					$notify_comments = '';
				}

				// assign language to template for caching
				$smarty->assign('language', $_SESSION['language']);
				$smarty->caching = false;

				// set dirs manual
				$smarty->template_dir = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
				$smarty->config_dir   = DIR_FS_CATALOG . 'lang';
				
				$themeControl = StaticGXCoreLoader::getThemeControl();
				$smarty->assign('tpl_path', DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath());
				$smarty->assign('logo_path', HTTP_SERVER . DIR_WS_CATALOG . $themeControl->getThemeImagePath());
                
                $gm_logo_mail = MainFactory::create_object('GMLogoManager', array("gm_logo_mail"));
                if($gm_logo_mail->logo_use == '1') {
                    $smarty->assign('gm_logo_mail', $gm_logo_mail->get_logo());
                }
				
				$smarty->assign('NAME', $check_status['customers_name']);
				$smarty->assign('GENDER', $order->customer['gender']);
				$smarty->assign('ORDER_NR', $oID);
				$smarty->assign('ORDER_LINK',
				                xtc_catalog_href_link(FILENAME_CATALOG_ACCOUNT_HISTORY_INFO, 'order_id=' . $oID,
				                                      'SSL'));
				$smarty->assign('ORDER_DATE', xtc_date_long($check_status['date_purchased'], (int)$check_status['languages_id']));
				$smarty->assign('NOTIFY_COMMENTS', $notify_comments);
				$smarty->assign('ORDER_STATUS', xtc_get_orders_status_name($gm_status, $check_status['languages_id']));
                
                if (defined('EMAIL_SIGNATURE') && defined('EMAIL_HTML_SIGNATURE')) {
                    $smarty->assign('EMAIL_SIGNATURE_HTML', EMAIL_HTML_SIGNATURE);
                    $smarty->assign('EMAIL_SIGNATURE_TEXT', EMAIL_SIGNATURE);
                }

				$html_mail = fetch_email_template($smarty, 'change_order_mail', 'html', '', $check_status['languages_id']);
				$txt_mail  = fetch_email_template($smarty, 'change_order_mail', 'txt', '', $check_status['languages_id']);

				$languageTextManager = MainFactory::create('LanguageTextManager', 'gm_order_menu', $check_status['languages_id']);
				$subject = $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_1')
					. $oID
					. $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_2')
					. xtc_date_short(date('Y-m-d'), (int)$check_status['languages_id'])
					. $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_3');
				
				$result = xtc_php_mail(EMAIL_BILLING_ADDRESS, EMAIL_BILLING_NAME, $check_status['customers_email_address'],
				             $check_status['customers_name'], '', EMAIL_BILLING_REPLY_ADDRESS,
				             EMAIL_BILLING_REPLY_ADDRESS_NAME, '', '', $subject, $html_mail, $txt_mail);
				
				if ($result === false) {
					throw new RuntimeException('The mail could not be sent, check the debug logs for more information.');
				}

				$customer_notified = '1';

				xtc_db_query("INSERT INTO " . TABLE_ORDERS_STATUS_HISTORY
				             . " (orders_id, orders_status_id, date_added, customer_notified, comments) values ('"
				             . xtc_db_input($oID) . "', '" . xtc_db_input($gm_status) . "', '" . date('Y-m-d H:i:s') . "', '"
				             . $customer_notified . "', '" . xtc_db_input($gm_comments) . "')");

				$order_updated = true;

				if($order_updated)
				{
					// // BOF GM_MOD products_status:
					$gm_reactivateArticle = false;
					if($_POST['gm_reactivateArticle'] == 'on')
					{
						$gm_reactivateArticle = true;
					}
					// BOF GM_MOD products_status:
					// BOF GM_MOD products_shippingtime:
					$gm_reshipp = false;
					if($_POST['gm_reshipp'] == 'on')
					{
						$gm_reshipp = true;
					}
					// BOF GM_MOD products_shippingtime:
					if($_POST['gm_restock'] == 'on')
					{
						xtc_remove_order($oID, true, true, $gm_reshipp, $gm_reactivateArticle);
					}
				}
			}
			else
			{

				$customer_notified = '0';
                $customer_id = (int)($_SESSION['customer_id'] ?? null);

				xtc_db_query("INSERT INTO " . TABLE_ORDERS_STATUS_HISTORY
				             . " (orders_id, orders_status_id, date_added, customer_notified, comments, customer_id) values ('"
				             . xtc_db_input($oID) . "', '" . xtc_db_input($gm_status) . "', '" . date('Y-m-d H:i:s') . "', '"
				             . $customer_notified . "', '" . xtc_db_input($gm_comments) . "', " . $customer_id . ")");

				$order_updated = true;

				if($order_updated)
				{
					// BOF GM_MOD products_status:
					$gm_reactivateArticle = false;
					if($_POST['gm_reactivateArticle'] == 'on')
					{
						$gm_reactivateArticle = true;
					}
					// BOF GM_MOD products_status:
					// BOF GM_MOD products_shippingtime:
					$gm_reshipp = false;
					if($_POST['gm_reshipp'] == 'on')
					{
						$gm_reshipp = true;
					}
					// BOF GM_MOD products_shippingtime:
					if($_POST['gm_restock'] == 'on')
					{
						xtc_remove_order($oID, true, true, $gm_reshipp, $gm_reactivateArticle);
					}
				}
			}
		}
	}
	if(array_key_exists('origin', $_GET) && $_GET['origin'] === 'old_orders_overview')
	{
		xtc_redirect('orders.php');
	}
	else
	{
		xtc_redirect('admin.php?do=OrdersOverview');
	}
}

	if($_GET['type'] == 'order') {

		echo $order_check['gm_order_html'];

	} elseif($_GET['type'] == 'recreate_order') {
		// recreate order
		$coo_recreate_order = MainFactory::create_object('RecreateOrder', array($_GET['oID']));
		$t_html = $coo_recreate_order->getHtml();

		echo $t_html;
	} elseif($_GET['type'] == 'send_order') {
		$t_query = xtc_db_query("
										SELECT
											*
										FROM " .
											TABLE_ORDERS . "
										WHERE
											orders_id= '" . (int)$_GET['oID'] . "'
										LIMIT 1
		");

		$t_row = xtc_db_fetch_array($t_query);

		$t_result = xtc_db_query('SELECT languages_id FROM languages WHERE directory = "' . xtc_db_input($t_row['language']) . '"');
		$t_language_row = xtc_db_fetch_array($t_result);

		$coo_shop_content_control = MainFactory::create_object('ShopContentContentControl');
		$coo_shop_content_control->set_language_id($t_language_row['languages_id']);
		$coo_shop_content_control->set_customer_status_id((int)$t_row['customers_status']);
		$t_mail_attachment_array = array();

		if (gm_get_conf('ATTACH_CONDITIONS_OF_USE_IN_ORDER_CONFIRMATION') == 1)
		{
			$coo_shop_content_control->set_content_group('3');
			$t_mail_attachment_array[] = $coo_shop_content_control->get_file();
		}
		
		if(gm_get_conf('ATTACH_PRIVACY_NOTICE_IN_ORDER_CONFIRMATION') == 1)
		{
			$coo_shop_content_control->set_content_group('2');
			$t_mail_attachment_array[] = $coo_shop_content_control->get_file();
		}

		if(gm_get_conf('ATTACH_WITHDRAWAL_INFO_IN_ORDER_CONFIRMATION') == '1')
		{
			$coo_shop_content_control->set_content_group(gm_get_conf('GM_WITHDRAWAL_CONTENT_ID'));
			$t_mail_attachment_array[] = $coo_shop_content_control->get_file();
		}

		if(gm_get_conf('ATTACH_WITHDRAWAL_FORM_IN_ORDER_CONFIRMATION') == '1')
		{
			$coo_shop_content_control->set_content_group(gm_get_conf('GM_WITHDRAWAL_CONTENT_ID'));
			$coo_shop_content_control->set_withdrawal_form('1');
			$t_mail_attachment_array[] = $coo_shop_content_control->get_file();
		}

		if(xtc_php_mail(
						EMAIL_FROM,
						STORE_NAME,
						$_POST['gm_mail'],
						'',
						EMAIL_BILLING_FORWARDING_STRING,
						'',
						'',
						$t_mail_attachment_array,
						'',
						$_POST['gm_subject'],
						$order_check['gm_order_html'],
						$order_check['gm_order_txt']
						))
		{
			xtc_db_query("
							UPDATE
								" . TABLE_ORDERS . "
							SET
								gm_send_order_status		= '1',
								gm_order_send_date			= NOW()
							WHERE
								orders_id = '" . (int)$_GET['oID'] . "'
						");
      
			$orderStatusHistoryStorage = MainFactory::create(OrderStatusHistoryStorage::class, StaticGXCoreLoader::getDatabaseQueryBuilder());
   
			$orderIdType = new IdType((int)$_GET['oID']);
			
			$orderStatusHistory = $orderStatusHistoryStorage->getStatusHistory($orderIdType)->getArray();
            /** @var OrderStatusHistoryListItem $lastEntry */
			$lastEntry = array_pop($orderStatusHistory);
			
            $orderStatusId = new IdType($lastEntry->getOrderStatusId());
            $comment = new StringType($lastEntry->getComment());
			$customerNotified = new BoolType(true);
			$customerId = new IdType($lastEntry->getCustomerId());
            
            $status = $orderStatusHistoryStorage->addStatusUpdate($orderIdType, $orderStatusId, $comment, $customerNotified, $customerId);

			echo MAIL_SUCCESS . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'ORDERS_MAIL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
		}
		else
		{
			throw new RuntimeException('The mail could not be sent, check the debug logs for more information.');
			echo MAIL_UNSUCCESS . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'ORDERS_MAIL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
		}

	} elseif($_GET['type'] == 'cancel') {

		$order_updated = false;
		$gm_status = gm_get_conf('GM_ORDER_STATUS_CANCEL_ID');
		$gm_comments = xtc_db_prepare_input($_POST['gm_comments']);

		$oID = xtc_db_prepare_input($_GET['oID']);

		$check_status_query = xtc_db_query("
											SELECT
												o.customers_name,
												o.customers_email_address,
												o.orders_status,
												o.language,
												o.date_purchased,
												l.languages_id
											FROM
												" . TABLE_ORDERS . " o
												LEFT JOIN languages l ON (o.language = l.directory)
											WHERE
												o.orders_id = '" . xtc_db_input($oID) . "'
											LIMIT 1
											");

		$check_status = xtc_db_fetch_array($check_status_query);

		if ($check_status['orders_status'] != $gm_status) {

			xtc_db_query("
						UPDATE " .
							TABLE_ORDERS . "
						SET
							orders_status	= '" . $gm_status ."',
							last_modified	= now(),
							gm_cancel_date	= now()
						WHERE
							orders_id = '" . xtc_db_input($oID) . "'
						");

			if($_GET['gm_notify'] == 'on') {
				$notify_comments = '';

				if ($_GET['gm_notify_comments'] == 'on') {
					$notify_comments = $gm_comments;
				} else {
					$notify_comments = '';
				}

				// assign language to template for caching
				$smarty->assign('language', $_SESSION['language']);
				$smarty->caching = false;

				// set dirs manual
				$smarty->template_dir = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
				$smarty->config_dir = DIR_FS_CATALOG.'lang';
				
				$smarty->assign('tpl_path', DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath());
				$smarty->assign('logo_path', HTTP_SERVER . DIR_WS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeImagePath());
                
                $gm_logo_mail = MainFactory::create_object('GMLogoManager', array("gm_logo_mail"));
                if($gm_logo_mail->logo_use == '1') {
                    $smarty->assign('gm_logo_mail', $gm_logo_mail->get_logo());
                }
				
				$smarty->assign('NAME', $check_status['customers_name']);
				$smarty->assign('GENDER', $order->customer['gender']);
				$smarty->assign('ORDER_NR', $oID);
				$smarty->assign('ORDER_LINK', xtc_catalog_href_link(FILENAME_CATALOG_ACCOUNT_HISTORY_INFO, 'order_id='.$oID, 'SSL'));
				$smarty->assign('ORDER_DATE', xtc_date_long($check_status['date_purchased'], (int)$check_status['languages_id']));
				$smarty->assign('NOTIFY_COMMENTS', $notify_comments);
				$smarty->assign('ORDER_STATUS', xtc_get_orders_status_name($gm_status, $check_status['languages_id']));
                
                if (defined('EMAIL_SIGNATURE') && defined('EMAIL_HTML_SIGNATURE')) {
                    $smarty->assign('EMAIL_SIGNATURE_HTML', EMAIL_HTML_SIGNATURE);
                    $smarty->assign('EMAIL_SIGNATURE_TEXT', EMAIL_SIGNATURE);
                }

				$html_mail = fetch_email_template($smarty, 'change_order_mail', 'html', '', $check_status['languages_id']);
				$txt_mail = fetch_email_template($smarty, 'change_order_mail', 'txt', '', $check_status['languages_id']);

				$languageTextManager = MainFactory::create('LanguageTextManager', 'gm_order_menu', $check_status['languages_id']);
				$subject = $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_1')
					. $oID
					. $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_2')
					. xtc_date_short(date('Y-m-d'), (int)$check_status['languages_id'])
					. $languageTextManager->get_text('TITLE_GM_CANCEL_SUBJECT_3');

				$result = xtc_php_mail(EMAIL_BILLING_ADDRESS, EMAIL_BILLING_NAME, $check_status['customers_email_address'], $check_status['customers_name'], '', EMAIL_BILLING_REPLY_ADDRESS, EMAIL_BILLING_REPLY_ADDRESS_NAME, '', '', $subject, $html_mail, $txt_mail);
				
				if ($result === false) {
					throw new RuntimeException('The mail could not be sent, check the debug logs for more information.');
				}

				$customer_notified = '1';

				xtc_db_query("INSERT INTO " . TABLE_ORDERS_STATUS_HISTORY . " (orders_id, orders_status_id, date_added, customer_notified, comments) values ('".xtc_db_input($oID)."', '".xtc_db_input($gm_status)."', '" . date('Y-m-d H:i:s') . "', '".$customer_notified."', '".xtc_db_input($gm_comments)."')");

				$order_updated = true;

				if ($order_updated) {
                    // // BOF GM_MOD products_status:
					$gm_reactivateArticle = false;
					if($_GET['gm_reactivateArticle'] == 'on')
					{
						$gm_reactivateArticle = true;
					}
					// BOF GM_MOD products_status:
					// BOF GM_MOD products_shippingtime:
					$gm_reshipp = false;
					if($_GET['gm_reshipp'] == 'on')
					{
						$gm_reshipp = true;
					}
					// BOF GM_MOD products_shippingtime:
					if($_GET['gm_restock'] == 'on')
					{
						xtc_remove_order($oID, true, true, $gm_reshipp, $gm_reactivateArticle);
					}
					echo UPDATE_MAIL_SUCCESS . '<br /><br /><span class="button" onclick="gm_mail_close(\'CANCEL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
				} else {
					echo UPDATE_UNSUCCESS . '<br><br><span class="button" onclick="gm_mail_close(\'CANCEL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
				}

			} else {

				$customer_notified = '0';

				xtc_db_query("INSERT INTO " . TABLE_ORDERS_STATUS_HISTORY . " (orders_id, orders_status_id, date_added, customer_notified, comments) values ('".xtc_db_input($oID)."', '".xtc_db_input($gm_status)."', '" . date('Y-m-d H:i:s') . "', '".$customer_notified."', '".xtc_db_input($gm_comments)."')");

				$order_updated = true;

				if ($order_updated) {
                    // BOF GM_MOD products_status:
					$gm_reactivateArticle = false;
					if($_GET['gm_reactivateArticle'] == 'on')
					{
						$gm_reactivateArticle = true;
					}
					// BOF GM_MOD products_status:
					// BOF GM_MOD products_shippingtime:
					$gm_reshipp = false;
					if($_GET['gm_reshipp'] == 'on')
					{
						$gm_reshipp = true;
					}
					// BOF GM_MOD products_shippingtime:
					if($_GET['gm_restock'] == 'on')
					{
						xtc_remove_order($oID, true, true, $gm_reshipp, $gm_reactivateArticle);
					}
					echo UPDATE_SUCCESS . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'CANCEL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
				} else {
					echo UPDATE_UNSUCCESS . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'CANCEL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
				}
			}

		} else {
			echo CANCEL_UNSUCCESS . '<br><br><span class="btn pull-right" onclick="gm_mail_close(\'CANCEL\')" style="cursor:pointer">' . MAIL_CLOSE . '</span>';
		}
	}
