<?php
/* --------------------------------------------------------------
   gm_order_menu.php 2021-05-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

   based on: 
   (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
   (c) 2002-2003 osCommerce(orders.php,v 1.109 2003/05/28); www.oscommerce.com 
   (c) 2003	 nextcommerce (orders.php,v 1.19 2003/08/24); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: orders.php 1189 2005-08-28 15:27:00Z hhgag $)

   Released under the GNU General Public License 
   --------------------------------------------------------------
   Third Party contribution:
   OSC German Banktransfer v0.85a       	Autor:	Dominik Guder <osc@guder.org>
   Customers Status v3.x  (c) 2002-2003 Copyright Elari elari@free.fr | www.unlockgsm.com/dload-osc/ | CVS : http://cvs.sourceforge.net/cgi-bin/viewcvs.cgi/elari/?sortby=date#dirlist

   credit card encryption functions for the catalog module
   BMC 2003 for the CC CVV Module

   Released under the GNU General Public License
   --------------------------------------------------------------*/

	require ('includes/application_top.php');
	require_once('includes/gm/classes/GMOrderFormat.php');
	$gmFormat = new GMOrderFormat();

	if(empty($_GET['oID'])) { 
		$oID = $oInfo->orders_id;
	} else {
		$oID = $_GET['oID'];
	}

	$order_query_check = xtc_db_query("
										SELECT
											customers_email_address,
											customers_firstname,
											customers_lastname,
											date_purchased,
											orders_status
										FROM " .
											TABLE_ORDERS . "
										WHERE 
											orders_id='".(int)$oID."' 
									");

	$order_check = xtc_db_fetch_array($order_query_check);
	
	$customer_name			= $order_check['customers_firstname'] . ' ' . $order_check['customers_lastname'];
	$customer_email_address	= $order_check['customers_email_address'];
	$order_date = xtc_date_short($order_check['date_purchased']);
	$cancel_date = xtc_date_short(date("Y-m-d"));

if($_GET['type'] === 'order') {
	echo '
	<table border="0" width="100%" cellspacing="2" cellpadding="3" class="gx-container  normalize-table">
		<tr>
			<td colspan="2" valign="top" class="main">
				<strong>' . TITLE_ORDER . '</strong><br /><br />												  
			</td>
		</tr>
		<tr>
			<td colspan="2" valign="top" class="main">
				' . TITLE_ORDER_CONFIRM . '\'' . $customer_name . '\' \'' .  $customer_email_address . '\' ' . TITLE_ORDER_CONFIRMED . '<br /><br />												  
			</td>
		</tr>
		<tr>
			<td valign="top" class="main">
			' . TITLE_SUBJECT	. '
			</td>
			<td valign="top" class="main">
				<input type="text" id="gm_subject" value="' . ORDER_SUBJECT . $oID . ORDER_SUBJECT_FROM . $order_date . '" size="45" maxlength="255" />
			</td>
		</tr>
		<tr>
			<td valign="top" class="main">
			' . TITLE_MAIL	. '
			</td>
			<td valign="top" class="main">
				<input type="text" id="gm_mail"  value="' . $customer_email_address . '" size="45" maxlength="255" />
			</td>
		</tr>
		<tr>
			<td colspan="2" valign="top" class="main">
				<span onclick="gm_mail_send(\'gm_send_order.php\', \'&type=send_order\', \'ORDERS_MAIL\')" class="btn btn-primary float_right" id="gm_save">' . TITLE_SEND . '</span>
				<span onclick="gm_mail_close(\'ORDERS_MAIL\')" class="btn float_right" id="gm_close">' . BUTTON_CANCEL . '</span>												  
			</td>
		</tr>
	</table>';

} 