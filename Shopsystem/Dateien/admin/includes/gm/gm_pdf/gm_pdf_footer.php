<?php
/* --------------------------------------------------------------
   gm_pdf_footer.php 2018-04-12
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/
defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');
$langId = $_GET['lang_id'] ?? $_SESSION['languages_id'];
?>
<div class="gx-compatibility-table">
	<!-- <table border="0" width="100%" cellspacing="0" cellpadding="2" class="normalize-table">
		<tr>
			<td valign="top" align="left" class="main">
				<h2><?php echo MENU_TITLE_FOOTER; ?></h2>
			</td>
		</tr>
	</table> -->
	<div class="pull-right">
		<?php
			echo gm_get_language_link('gm_pdf_action.php', 'gm_pdf_content', 'gm_box_submenu_content', $langId);
		?>
	</div>
	<br />
	<form id="gm_pdf_form" class="remove-margin remove-padding">
		<table border="0" width="100%" cellspacing="0" cellpadding="2" id="gm_table" class="remove-margin"
		       data-gx-widget="single_checkbox"
		>
			<tr class="dataTableRow">
				<th style="width: 50%;"></th>
				<th valign="middle" align="left" style="width: 30%; text-align: center; height: 40px">
					<span style="margin-top: 10px">
						<?php echo GM_PDF_TABLE_HEADER_COLUMN_CONTENT; ?>
					</span>
				</th>
				<th valign="middle" align="center" style="width: 15%; text-align: center;">
						<?php echo GM_PDF_TABLE_HEADER_BANK_DATA_COLUMN; ?>
				</th>
				<th valign="top" align="middle" style="width: 5%; text-align: center; padding: 8px 30px 0 0;">
					<span class="gm-pdf-footer-table-tooltip"
					      data-gx-widget="tooltip_icon"
					      data-tooltip_icon-type="info"
					>
						<?php echo GM_PDF_TABLE_HEADER_BANK_DATA_TOOLTIP; ?>
					</span>
				</th>
			</tr>
			
			<?php
	            $columnCounter = 0;
	            $footerReplaceArray = gm_get_conf('PDF_FOOTER_REPLACE_ARRAY');
	            
				foreach($gm_values as $key => $value) { ?>
					<tr class="dataTableRow gm-pdf-footer-table-row">
						<td valign="top"
						    align="left"
						    class="main dataTableContent configuration-label"
						>
							<?php echo constant(str_replace('GM_PDF_', 'GM_PDF_TITLE_', $key)); ?>
						</td>
						<td valign="top" align="left" class="main dataTableContent">
							<textarea onClick="gm_fadeout_boxes('gm_status');"
							          style="width:400px;"
							          id="<?php echo $key; ?>"
							          rows="5"><?php echo $value; ?></textarea>
						</td>
						<td valign="top"
						    align="center"
						    class="main dataTableContent"
						    style="text-align: center;"
						    colspan="2"
						>
							<input type="checkbox" name="bankDataColumn" value="<?php echo $columnCounter; ?>"
							<?php
								
								if($footerReplaceArray === null || $footerReplaceArray === 'null'){
									echo (gm_get_conf('PDF_FOOTER_REPLACE_COLUMN') === (string)$columnCounter) ? 'checked' : '';
								}
								
								else{
									if(is_string($footerReplaceArray)){
                                        $footerReplaceArray = explode(', ', $footerReplaceArray);
                                        $footerReplaceArray = array_map('intval', $footerReplaceArray);
									}
									
									echo in_array($columnCounter, $footerReplaceArray, true) ? 'checked' : '';
								}
							
							
							?>
							/>
						</td>
					</tr>
					<?php $columnCounter++;
				}
			?>
		</table>
		<div style="display: block; margin-top: 12px; height: 30px;" class="bottom-save-bar-content">
			<input class="btn btn-primary pull-right remove-margin" type="button" value="<?php echo BUTTON_SAVE;?>" onClick="gm_fadeout_boxes('gm_status');gm_update_boxes('<?php echo xtc_href_link('gm_pdf_action.php', 'action=gm_pdf_update_lang&lang_id=' . $lang_id. '&page_token=' . $_SESSION['coo_page_token']->generate_token()); ?>', 'gm_status')">
			<span id="gm_status" class="pull-right add-padding-10" style="height:20px"></span>
		</div>
	</form>
</div>
