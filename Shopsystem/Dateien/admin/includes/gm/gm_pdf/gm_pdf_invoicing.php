<?php
/* --------------------------------------------------------------
   gm_pdf_protection.php 2016-10-11
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2016 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/
defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');
?>
<div class="gx-compatibility-table">
	<!-- <table border="0" width="100%" cellspacing="0" cellpadding="2" class="normalize-table">
		<tr>
			<td valign="top" align="left" class="main">
				<h2><?php echo MENU_TITLE_INVOICING; ?></h2>
			</td>
		</tr>
	</table> -->
	<br />
	<form id="gm_pdf_form" class="remove-margin remove-padding">
		<table border="0" width="100%" cellspacing="0" cellpadding="2" id="gm_table" class="remove-margin" data-gx-widget="checkbox">
			<tr class="dataTableRow">
				<td valign="top" align="left" class="main dataTableContent configuration-label" style="width: 50%;">
					<?php echo GM_PDF_ORDER_STATUS_INVOICE; ?>
				</td>
				<td valign="top" align="left" class="main dataTableContent" style="width: 50%;">
					<?php echo xtc_draw_pull_down_menu('GM_PDF_ORDER_STATUS_INVOICE', $t_order_status_list, gm_get_conf('GM_PDF_ORDER_STATUS_INVOICE', 'ASSOC', true), 'id="GM_PDF_ORDER_STATUS_INVOICE" style="width:200px;"'); ?>
				</td>
			</tr>
			<tr class="dataTableRow">
				<td valign="top" align="left" class="main dataTableContent configuration-label" style="width: 50%;">
					<?php echo GM_PDF_ORDER_STATUS_INVOICE_MAIL; ?>
				</td>
				<td valign="top" align="left" class="main dataTableContent" style="width: 50%;">
					<?php echo xtc_draw_pull_down_menu('GM_PDF_ORDER_STATUS_INVOICE_MAIL', $t_order_status_list, gm_get_conf('GM_PDF_ORDER_STATUS_INVOICE_MAIL', 'ASSOC', true), 'id="GM_PDF_ORDER_STATUS_INVOICE_MAIL" style="width:200px;"'); ?>
				</td>
			</tr>
			<tr class="dataTableRow">
				<td valign="top" align="left" class="main dataTableContent configuration-label" style="width: 50%;">
					<label for="GM_PDF_INVOICE_USE_CURRENT_DATE"><?php echo GM_PDF_INVOICE_USE_CURRENT_DATE; ?></label>
				</td>
				<td valign="top" align="left" class="main dataTableContent" style="width: 50%;">
					<select id="GM_PDF_INVOICE_USE_CURRENT_DATE" name="GM_PDF_INVOICE_USE_CURRENT_DATE" style="width: 200px;">
						<option value="1" 
								<?php if(gm_get_conf('GM_PDF_INVOICE_USE_CURRENT_DATE') === '1'){echo 'selected';}?>
						><?php echo GM_PDF_INVOICE_USE_CURRENT_DATE_TRUE ?></option>
						<option value="0"
								<?php if(gm_get_conf('GM_PDF_INVOICE_USE_CURRENT_DATE') === '0'){echo 'selected';}?>
						><?php echo GM_PDF_INVOICE_USE_CURRENT_DATE_FALSE ?></option>
					</select>
					
					<input id="GM_PDF_INVOICE_DATE" 
					       type="text"
					       data-jse-widget="datepicker" 
					       data-datepicker-gx-container
					       data-gx-compatibility="gm_pdf/switch_datepicker_field"
					       placeholder="<?php echo gm_get_conf('GM_PDF_INVOICE_DATE')?>"
					/>
					<span class="manual-invoice-date-notice" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
						<?php echo GM_PDF_INVOICE_USE_MANUAL_DATE_INFO ?>
					</span>
				</td>
			</tr>
			<tr class="dataTableRow">
				<td valign="top" align="left" class="main dataTableContent configuration-label" style="width: 50%;">
					<label for="GM_PDF_PACKING_SLIP_USE_CURRENT_DATE"><?php echo GM_PDF_PACKING_SLIP_USE_CURRENT_DATE; ?></label>
				</td>
				<td valign="top" align="left" class="main dataTableContent" style="width: 50%;">
					<select id="GM_PDF_PACKING_SLIP_USE_CURRENT_DATE" name="GM_PDF_PACKING_SLIP_USE_CURRENT_DATE" style="width: 200px;">
						<option value="1"
							<?php if(gm_get_conf('GM_PDF_PACKING_SLIP_USE_CURRENT_DATE') === '1'){echo 'selected';}?>
						><?php echo GM_PDF_PACKING_SLIP_USE_CURRENT_DATE_TRUE ?></option>
						<option value="0"
							<?php if(gm_get_conf('GM_PDF_PACKING_SLIP_USE_CURRENT_DATE') === '0'){echo 'selected';}?>
						><?php echo GM_PDF_PACKING_SLIP_USE_CURRENT_DATE_FALSE ?></option>
					</select>
					
					<input id="GM_PDF_PACKING_SLIP_DATE"
					       type="text"
					       data-jse-widget="datepicker"
					       data-datepicker-gx-container
					       data-gx-compatibility="gm_pdf/switch_datepicker_field"
					       data-switch_datepicker_field-current_select = '#GM_PDF_PACKING_SLIP_USE_CURRENT_DATE'
					       data-switch_datepicker_field-notice = '.manual-packing-slip-date-notice'
					       placeholder="<?php echo gm_get_conf('GM_PDF_PACKING_SLIP_DATE')?>"
					/>
					<span class="manual-packing-slip-date-notice" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
						<?php echo GM_PDF_PACKING_SLIP_USE_MANUAL_DATE_INFO ?>
					</span>
				</td>
			</tr>
		</table>
		<div style="display: block; margin-top: 12px; height: 30px;" class="bottom-save-bar-content">
			<input class="btn btn-primary pull-right remove-margin" type="button" value="<?php echo BUTTON_SAVE;?>" onClick="gm_hide_boxes('gm_color_box');gm_fadeout_boxes('gm_status');gm_update_boxes('<?php echo xtc_href_link('gm_pdf_action.php', 'action=gm_pdf_update&page_token=' . $_SESSION['coo_page_token']->generate_token()); ?>', 'gm_status')">
			<span id="gm_status" class="pull-right add-padding-10" style="height:20px"></span>
		</div>
	</form>
</div>
