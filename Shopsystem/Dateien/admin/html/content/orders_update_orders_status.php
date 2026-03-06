<form class="grid hidden"
      data-gx-widget="checkbox"
      name="update_orders_status_form"
      action="<?php echo xtc_href_link(FILENAME_ORDERS,
                                       xtc_get_all_get_params(array('action')) . '&action=gm_multi_status') ?>"
      method="post"
      id="update_orders_status_form">
	<fieldset class="span12">
		<div class="control-group">
			<label><?php echo TEXT_SELECTED_ORDERS ?></label>
			<span class="selected_orders"></span>
		</div>
		
		<div class="control-group">
			<label><?php echo ENTRY_NEW_ORDER_STATUS ?></label>
			<select id="status-dropdown" name="gm_status" class="form-control">
				<option value><?php echo TEXT_GM_STATUS; ?></option>
				<optgroup label="<?php echo TEXT_MOST_USED_ORDER_STATUS; ?>">
                    <?php
                    foreach ($mostUsedchangeOrderStatusValuesArray as $status) {
                        echo '<option value="' . $status['id'] . '">' . $status['text'] . '</option>';
                    }
                    ?>
				</optgroup>
				<optgroup label="<?php echo TEXT_OTHER_ORDER_STATUS; ?>">
                    <?php
                    foreach ($changeOrderStatusValuesArray as $status) {
                        echo '<option value="' . $status['id'] . '">' . $status['text'] . '</option>';
                    }
                    ?>
				</optgroup>
			</select>
		</div>
		
		<div class="control-group">
			<label><?php echo ENTRY_NOTIFY_CUSTOMER ?></label>
			<input type="checkbox" name="gm_notify" value="on" data-single_checkbox/>
		</div>
		
		<div class="control-group">
			<label><?php echo ENTRY_SEND_PARCEL_TRACKING_CODES ?></label>
			<input type="checkbox" name="send_parcel_tracking_codes" value="on" data-single_checkbox/>
		</div>

		<div class="control-group">
			<label><?php echo ENTRY_NOTIFY_COMMENTS ?></label>
			<input type="checkbox" name="gm_notify_comments" value="on" data-single_checkbox />
		</div>

		<div class="control-group">
			<label><?php echo TABLE_HEADING_COMMENTS ?></label>
			<textarea name="gm_comments"><?php echo htmlspecialchars_wrapper($_GET['comments'] ?? '') ?></textarea>
		</div>
		
		<?php
		if(isset($GLOBALS['orderExtender']))
		{
			$orderStatusOverloads = $GLOBALS['orderExtender']->get_output('order_status');
			foreach($orderStatusOverloads as $orderStatusOverload)
			{
				echo '<div>' . $orderStatusOverload . '</div>';
			}
		}
		?>
		
		<?php
		echo xtc_draw_hidden_field('page_token', $t_page_token);
		echo xtc_draw_hidden_field('action', 'gm_multi_status');
		echo xtc_draw_hidden_field('page', isset($_GET['page']) ? (int)$_GET['page'] : 0);
		?>
	</fieldset>
</form>
