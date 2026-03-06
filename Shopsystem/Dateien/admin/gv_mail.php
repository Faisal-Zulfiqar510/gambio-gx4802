<?php
/* --------------------------------------------------------------
   gv_mail.php 2022-12-26
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
   (c) 2002-2003 osCommerce (gv_mail.php,v 1.3.2.4 2003/05/12); www.oscommerce.com
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: gv_mail.php 1030 2005-07-14 20:22:32Z novalis $)

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

$t_page_token = $_SESSION['coo_page_token']->generate_token();

require DIR_WS_CLASSES . 'currencies.php';
/** @var currencies_ORIGIN $currencies */
$currencies = new currencies();

$db = StaticGXCoreLoader::getDatabaseQueryBuilder();

$amount           = '';
$voucherOrderItem = null;
$subject          = EMAIL_BILLING_SUBJECT;

/** @var GiftVouchersConfigurationStorage $giftVouchersConfiguration */
$giftVouchersConfiguration = MainFactory::create('GiftVouchersConfigurationStorage');
/** @var GiftVouchersService $giftVouchersService */
$giftVouchersService = MainFactory::create('GiftVouchersService', $giftVouchersConfiguration);
/** @var GiftVouchersMailService $giftVouchersMailService */
$giftVouchersMailService = MainFactory::create('GiftVouchersMailService', $giftVouchersService);

$gvQueueIds = [];
if (!empty($_GET['queue_ids']) && is_array($_GET['queue_ids'])) {
    $gvQueueIds = array_map(static function($queueId) { return (int)$queueId; }, $_GET['queue_ids']);
}
if (!empty($_GET['queue_id'])) {
	$gvQueueIds[] = (int)$_GET['queue_id'];
}

if (!empty($gvQueueIds)) {
    $gvQueueData = $db->from('coupon_gv_queue')
        ->where('unique_id IN (' . implode(',', $gvQueueIds) . ')')
        ->where('release_flag', 'N')
        ->get()
        ->result_array();
    if (empty($gvQueueData)) {
    	throw new RuntimeException('queue_ids are invalid');
    }
    $gvQueueDataAmount           = (float)$gvQueueData[0]['amount'];
    $gvQueueDataOrderId          = (int)$gvQueueData[0]['order_id'];
    $gvQueueDataOrdersProductsId = (int)$gvQueueData[0]['orders_products_id'];
    foreach ($gvQueueData as $queueEntry) {
    	if ((float)$queueEntry['amount'] !== $gvQueueDataAmount ||
	        (int)$queueEntry['order_id'] !== $gvQueueDataOrderId ||
	        (int)$queueEntry['orders_products_id'] !== $gvQueueDataOrdersProductsId) {
    		throw new RuntimeException('queue entries do not match');
	    }
    }
    
    /** @var OrderReadService $orderRead */
    $orderRead = StaticGXCoreLoader::getService('OrderRead');
    $order     = $orderRead->getOrderById(new IdType($gvQueueDataOrderId));
    $amount    = number_format($gvQueueDataAmount, 2, '.', '');
    if (!empty($gvQueueDataOrdersProductsId)) {
        $subject    = TEXT_SUBJECT_VOUCHER_ORDERED;
        $orderItems = $order->getOrderItems();
        /** @var StoredOrderItem $orderItem */
        foreach ($orderItems as $orderItem) {
            if ($orderItem->getOrderItemId() === $gvQueueDataOrdersProductsId) {
                $voucherOrderItem = $orderItem;
                break;
            }
        }
    }
}

if (isset($_POST['subject']) && !empty($_POST['subject'])) {
    $subject = xtc_db_prepare_input($_POST['subject']);
}

// eof gm
if ((($_GET['action']??null) === 'send_email_to_user') && (isset($_POST['customers_email_address']) || isset($_POST['email_to']))
    && (!($_POST['back']??null))
    && $_SESSION['coo_page_token']->is_valid($_POST['page_token'])) {
    switch ($_POST['customers_email_address'] ?? null) {
        case '***':
            $mail_query   = xtc_db_query("select customers_firstname, customers_lastname, customers_email_address from "
                                         . TABLE_CUSTOMERS);
            $mail_sent_to = TEXT_ALL_CUSTOMERS;
            break;
        case '**D':
            $mail_query   = xtc_db_query("select customers_firstname, customers_lastname, customers_email_address from "
                                         . TABLE_CUSTOMERS . " where customers_newsletter = '1'");
            $mail_sent_to = TEXT_NEWSLETTER_CUSTOMERS;
            break;
        default:
            
            if (!empty($_POST['email_to'])) {
                $mail_sent_to = $_POST['email_to'];
            } else {
                $customers_email_address = xtc_db_prepare_input($_POST['customers_email_address']);
                
                $mail_query   = xtc_db_query("select customers_firstname, customers_lastname, customers_email_address from "
                                             . TABLE_CUSTOMERS . " where customers_email_address = '"
                                             . xtc_db_input($customers_email_address) . "'");
                $mail_sent_to = $_POST['customers_email_address'];
            }
            break;
    }
    
    $voucherAmount = new DecimalType((float)str_replace(',', '.', $_POST['amount']));
    $toEmail = gm_prepare_string($_POST['message'], true);
    if (!empty($_POST['email_to'])) {
    	$gvQueueIds = [];
    	if (!empty($_POST['queue_ids'])) {
            $gvQueueIds = explode(',', $_POST['queue_ids']);
            foreach ($gvQueueIds as $gvQueueId) {
            	$gvQueueIdType = new IdType((int)$gvQueueId);
            	$coupon = $giftVouchersService->releaseQueueEntry($gvQueueIdType, $voucherAmount);
            	$giftVouchersMailService->sendMail($coupon->getCouponCode()->asString(), $_POST['email_to'], '', $toEmail, $subject);
            	$giftVouchersMailService->storeCouponEmailTrack($coupon->getCouponId(), $_POST['email_to']);
            }
	    } else {
    		$coupon = $giftVouchersService->createGiftVoucher($voucherAmount);
            $giftVouchersMailService->sendMail($coupon->getCouponCode()->asString(), $_POST['email_to'], '', $toEmail, $subject);
            $giftVouchersMailService->storeCouponEmailTrack($coupon->getCouponId(), $_POST['email_to']);
	    }
    } else {
        while ($mail = xtc_db_fetch_array($mail_query)) {
            $coupon = $giftVouchersService->createGiftVoucher($voucherAmount);
            $toName = $mail['customers_firstname'] . ' ' . $mail['customers_lastname'];
            $giftVouchersMailService->sendMail($coupon->getCouponCode()->asString(), $mail['customers_email_address'], $toName, $toEmail, $subject);
            $giftVouchersMailService->storeCouponEmailTrack($coupon->getCouponId(), $mail['customers_email_address']);
        }
    }
    xtc_redirect(xtc_href_link(FILENAME_GV_MAIL, 'mail_sent_to=' . urlencode($mail_sent_to)));
} elseif ((($_GET['action']??null) == 'preview') && (isset($_POST['customers_email_address']) || isset($_POST['email_to']))) {
    // stop script, if page_token is not valid
    $_SESSION['coo_page_token']->is_valid($_POST['page_token']);
}

if ((($_GET['action']??null) == 'preview') && (!($_POST['customers_email_address'] ?? null)) && (!($_POST['email_to'] ?? null))) {
    $messageStack->add(ERROR_NO_CUSTOMER_SELECTED, 'error');
}

if ((($_GET['action']??null) == 'preview') && (!$_POST['amount'])) {
    $messageStack->add(ERROR_NO_AMOUNT_SELECTED, 'error');
}

if ($_GET['mail_sent_to']??null) {
    $messageStack->add(sprintf(NOTICE_EMAIL_SENT_TO, $_GET['mail_sent_to']), 'notice');
}

if ($_POST['customer']??null) {
    //echo 'you are here';
    $customerTerm = $_POST['customer'];
    $result       = [];
    
    //$result[] = array('value' => '', 'label' => TEXT_SELECT_CUSTOMER);
    $result[] = ['value' => '***', 'label' => TEXT_ALL_CUSTOMERS];
    $result[] = ['value' => '**D', 'label' => TEXT_NEWSLETTER_CUSTOMERS];
    
    $select = "where customers_firstname like '%{$customerTerm}%'";
    $select .= " or customers_lastname like '%{$customerTerm}%'";
    $select .= " or customers_email_address like '%{$customerTerm}%'";
    
    $mail_query = xtc_db_query("select customers_id,
                                       customers_email_address,
                                       customers_firstname,
                                       customers_lastname
                                from " . TABLE_CUSTOMERS . "
                                " . $select . "
                                order by customers_lastname");
    
    while ($customers_values = xtc_db_fetch_array($mail_query)) {
        $result[] = [
            'value' => $customers_values['customers_email_address'],
            'label' => $customers_values['customers_lastname'] . ', ' . $customers_values['customers_firstname'] . ' ('
                       . $customers_values['customers_email_address'] . ')'
        ];
    }
    echo json_encode($result);
    exit;
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html <?php echo HTML_PARAMS; ?>>
<head>
	<meta http-equiv="x-ua-compatible" content="IE=edge">
	<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
    <?php
    if (preg_match('/MSIE [\d]{2}\./i', $_SERVER['HTTP_USER_AGENT'])) {
        ?>
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE9"/>
        <?php
    }
    ?>
	<title><?php echo TITLE; ?></title>
	<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
</head>
<body marginwidth="0" marginheight="0" topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" bgcolor="#FFFFFF">
<!-- header //-->
<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
<!-- header_eof //-->

<!-- body //-->
<table border="0" width="100%" cellspacing="2" cellpadding="2">
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
			<table border="0" width="100%" cellspacing="0" cellpadding="0">
				<tr>
					<td width="100%">
						<div class="pageHeading"
						     style="background-image:url(html/assets/images/legacy/gm_icons/hilfsprogr2.png)"><?php echo HEADING_TITLE; ?></div>
						<br/>
					</td>
				</tr>
				<tr>
					<td>
						<table border="0" width="100%" cellspacing="0" cellpadding="2">
                            <?php
                            if ((($_GET['action']??null) == 'preview')
                                && (isset($_POST['customers_email_address'])
                                    || isset($_POST['email_to']))) {
                                switch (($_POST['customers_email_address']??'')) {
                                    case '***':
                                        $mail_sent_to = TEXT_ALL_CUSTOMERS;
                                        break;
                                    case '**D':
                                        $mail_sent_to = TEXT_NEWSLETTER_CUSTOMERS;
                                        break;
                                    default:
                                        $mail_sent_to = $_POST['customers_email_address'] ?? null;
                                        if ($_POST['email_to']) {
                                            $mail_sent_to = $_POST['email_to'];
                                        }
                                        break;
                                }
                                ?>
								<tr><?php echo xtc_draw_form('mail', FILENAME_GV_MAIL, 'action=send_email_to_user'); ?>
									<td>
										<table border="0" width="100%" cellpadding="0" cellspacing="2"
										       class="gm_border dataTableRow">
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td class="smallText">
													<b><?php echo TEXT_CUSTOMER; ?></b><br/><?php echo $mail_sent_to; ?>
												</td>
											</tr>
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td class="smallText">
													<b><?php echo TEXT_SUBJECT; ?></b><br/><?php echo htmlspecialchars_wrapper($subject); ?>
												</td>
											</tr>
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td class="smallText">
													<b><?php echo TEXT_AMOUNT; ?></b><br/><?php echo nl2br(htmlspecialchars_wrapper(stripslashes(str_replace(',',
                                                                                                                                                             '.',
                                                                                                                                                             $_POST['amount'])))); ?>
												</td>
											</tr>
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td class="smallText">
													<b><?php echo TEXT_MESSAGE; ?></b><br/><?php echo gm_prepare_string($_POST['message'],
                                                                                                                        true); ?>
												</td>
											</tr>
											<tr>
												<td>&nbsp;</td>
											</tr>
											<tr>
												<td>
                                                    <?php
                                                    /* Re-Post all POST'ed variables */
                                                    reset($_POST);
                                                    foreach ($_POST as $key => $value) {
                                                        if (!is_array($_POST[$key]) && $key != 'page_token') {
                                                            echo xtc_draw_hidden_field($key,
                                                                                       htmlspecialchars_wrapper(stripslashes($value)));
                                                        }
                                                    }
                                                    
                                                    echo xtc_draw_hidden_field('page_token', $t_page_token);
                                                    ?>
													<table border="0" width="100%" cellpadding="0" cellspacing="2">
														<tr>
															<td class="bottom-save-bar-content"><?php echo '<input type="submit" class="button" name="back" onClick="this.blur();" value="'
                                                                                                           . BUTTON_BACK
                                                                                                           . '"/>'; ?></td>
															<td class="bottom-save-bar-content"
															    align="right"><?php echo '<input type="submit" class="btn btn-primary float_right" onClick="this.blur();" value="'
                                                                                         . BUTTON_SEND_EMAIL
                                                                                         . '"/>'; ?></td>
														</tr>
													</table>
												</td>
											</tr>
										</table>
									</td>
									</form></tr>
                                <?php
                            } else {
                                ?>
								<tr><?php echo xtc_draw_form('mail', FILENAME_GV_MAIL, 'action=preview'); ?>
									<td>
										<table border="0" cellpadding="0" cellspacing="2" class="gm_border dataTableRow"
										       style="border: 0; background-color: transparent;">
                                            <?php
                                            if ($_GET['cID']??null) {
                                                $customers  = [];
                                                $select     = 'where customers_id=' . (int)$_GET['cID'];
                                                $mail_query = xtc_db_query("select customers_id, customers_email_address, customers_firstname, customers_lastname from "
                                                                           . TABLE_CUSTOMERS . " " . $select
                                                                           . " order by customers_lastname");
                                                while ($customers_values = xtc_db_fetch_array($mail_query)) {
                                                    $customers[] = [
                                                        'value' => $customers_values['customers_email_address'],
                                                        'label' => $customers_values['customers_lastname'] . ', '
                                                                   . $customers_values['customers_firstname'] . ' ('
                                                                   . $customers_values['customers_email_address'] . ')'
                                                    ];
                                                }
                                            }
                                            ?>
                                            <?php if (empty($gvQueueData) && empty($orderId)): ?>
												<tr>
													<td class="main" style="min-width: 150px;"
													    style="min-width: 150px;"><?php echo TEXT_CUSTOMER; ?></td>
													<td>
														<input type="text" id="autocomplete"
														       placeholder="<?php echo TEXT_SELECT_CUSTOMER; ?>"<?php if (isset($_GET['cID'])) { ?> value="<?php echo $customers[0]['label']; ?>"<?php } ?>>
														<input type="hidden" id="selectuser_id"
														       name="customers_email_address"<?php if (isset($_GET['cID'])) { ?> value="<?php echo $customers[0]['value']; ?>"<?php } ?>>
														<script>
															jQuery(document).ready(function($) {
																$("#autocomplete").autocomplete({
																	minLength: 0,
																	source: function(request, response) {
																		// If no value added make a request with blank query
																		let searchTerm = request.term;
																		if (!searchTerm.length) {
																			searchTerm = ' ';
																		}
																		// Make request with term
																		$.ajax({
																			url: "gv_mail.php",
																			type: 'post',
																			data: {
																				customer: searchTerm
																			},
																			success: function(data) {
																				response(JSON.parse(data));
																			}
																		});
																	},
																	select: function(event, ui) {
																		// Set the correct value
																		$('#autocomplete').val(ui.item.label);
																		$('#selectuser_id').val(ui.item.value);
																		return false;
																	}
																}).bind('focus', function() {
																	// Show default suggestions on focus
																	$(this).autocomplete("search");
																});
																
																$("#autocomplete").focusout(function() {
																	let value = $(this).val();
																	if (!value.length) {
																		$('#selectuser_id').val('');
																	}
																})
															});
														</script>
														<span style="padding-left: 12px;">
                            <?php echo TEXT_AUTOCOMPLETE; ?>
			              </span>
													</td>
												</tr>
                                            <?php endif ?>
											<tr>
												<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                              '1',
                                                                                              '10'); ?></td>
											</tr>
											<tr>
												<td class="main" style="min-width: 150px;"><?php echo TEXT_TO; ?></td>
												<td>
                                                    <?php if (!empty($gvQueueData)): ?>
                                                        <?php echo xtc_draw_input_field('email_to',
                                                                                        $order->getCustomerEmail()); ?>
                                                        <?php echo xtc_draw_hidden_field('queue_ids', implode(',', $gvQueueIds)); ?>
                                                    <?php elseif (!empty($orderId)): ?>
                                                        <?php echo xtc_draw_input_field('email_to',
                                                                                        $order->getCustomerEmail()); ?>
                                                        <?php echo xtc_draw_hidden_field('oid', $orderId->asInt()); ?>
                                                    <?php else: ?>
                                                        <?php echo xtc_draw_input_field('email_to'); ?>
														<span style="padding-left: 12px;">
	                        <?php echo sprintf(TEXT_SINGLE_EMAIL, TEXT_CUSTOMER); ?>
                        </span>
                                                    <?php endif ?>
												</td>
											</tr>
											<tr>
												<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                              '1',
                                                                                              '10'); ?></td>
											</tr>
											<tr>
												<td class="main"
												    style="min-width: 150px;"><?php echo TEXT_SUBJECT; ?></td>
												<td><?php echo xtc_draw_input_field('subject',
                                                                                    htmlspecialchars_wrapper($subject)); ?></td>
											</tr>
											<tr>
												<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                              '1',
                                                                                              '10'); ?></td>
											</tr>
											<tr>
												<td valign="top" class="main"
												    style="min-width: 150px;"><?php echo TEXT_AMOUNT; ?></td>
												<td><?php echo xtc_draw_input_field('amount', $amount); ?></td>
											</tr>
                                            <?php if (!empty($voucherOrderItem)): ?>
												<tr>
													<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                                  '1',
                                                                                                  '10'); ?></td>
												</tr>
												<tr>
													<td valign="top" class="main"
													    style="min-width: 150px;"><?php echo TEXT_PRODUCT; ?></td>
													<td>
                                                        <?php echo $voucherOrderItem->getName() . ' ('
                                                                   . $voucherOrderItem->getProductModel() . ')'; ?>
                                                        <?php echo xtc_draw_hidden_field('opid',
                                                                                         $voucherOrderItem->getOrderItemId()); ?>
													</td>
												</tr>
	                                            <tr>
		                                            <td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                                  '1',
                                                                                                  '10'); ?></td>
	                                            </tr>
	                                            <tr>
		                                            <td valign="top" class="main"
		                                                style="min-width: 150px;"><?php echo TEXT_QTY; ?></td>
		                                            <td>
			                                            <?php echo count($gvQueueIds) ?>
		                                            </td>
	                                            </tr>
                                            <?php endif ?>
											<tr>
												<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                              '1',
                                                                                              '10'); ?></td>
											</tr>
											<tr>
												<td valign="top" class="main"
												    style="min-width: 150px;"><?php echo TEXT_MESSAGE; ?></td>
												<td>
													<div
                                                        <?php
                                                        if (USE_WYSIWYG == 'true') {
                                                            echo 'data-gx-widget="ckeditor" data-ckeditor-height="400px" data-ckeditor-width="700px" data-ckeditor-use-rel-path="false"';
                                                        }
                                                        ?>>
														<textarea name="message" class="wysiwyg"></textarea>
													</div>
												</td>
											</tr>
											<tr>
												<td colspan="2"><?php echo xtc_draw_separator('pixel_trans.gif',
                                                                                              '1',
                                                                                              '10'); ?></td>
											</tr>
											<tr>
												<td colspan="2" align="right" class="bottom-save-bar-content">
                                                    <?php
                                                    echo '<input type="submit" class="btn btn-primary" onClick="this.blur();" value="'
                                                         . BUTTON_SEND_EMAIL . '"/>';
                                                    echo xtc_draw_hidden_field('page_token', $t_page_token);
                                                    ?>
												</td>
											</tr>
										</table>
									</td>
									</form></tr>
                                <?php
                            }
                            ?>
							<!-- body_text_eof //-->
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
<!-- body_eof //-->

<!-- footer //-->
<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
<!-- footer_eof //-->
<br/>
</body>
</html>
<?php require(DIR_WS_INCLUDES . 'application_bottom.php'); ?>
