<form class="grid hidden" name="specials"
	  action="<?php echo xtc_href_link(FILENAME_SPECIALS, xtc_get_all_get_params(array('sID')) . 'action=bulk-delete-confirmed') ?>"
	  method="post" id="bulk_delete_confirm_form">
	<fieldset class="span12">
		<p class="modal-info-text"><?php echo defined('TEXT_INFO_BULK_DELETE_INTRO') ? TEXT_INFO_BULK_DELETE_INTRO : '' ?></p>
		<ul class="control-group products-to-delete"></ul>
		<?php echo xtc_draw_hidden_field('page_token', $t_page_token) ?>
	</fieldset>
</form>