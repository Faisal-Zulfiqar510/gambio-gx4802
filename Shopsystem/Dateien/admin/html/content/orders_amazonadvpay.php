<style>
	.gx-container table.amazonadvpay tbody tr td { padding: 0 1em; height: 24px; }
	.gx-container table.amazonadvpay form { display: inline; }
	.gx-container table.amazonadvpay div.actions { margin-top: 1em; margin-bottom: 1em; }
	.gx-container table.amazonadvpay input.btn { margin: 0; padding: 0 1ex; height: 25px;  }
	.gx-container table.amazonadvpay input { padding: 2px; height: 25px; margin: 2px 0;}
	.gx-container table.amazonadvpay table.amazonadvpay_authorizations { margin-bottom: 1em; }
	.gx-container table.amazonadvpay table.amazonadvpay_authorizations th { text-align: left; padding: 0 1em; }
	.gx-container table.amazonadvpay h2 { margin: 1ex 0; }
	.gx-container table.amazonadvpay table.billing_address { margin: 1ex 0; }
	.gx-container table.amazonadvpay td.actions form { display: block; margin: 2px 0; }
	.gx-container table.amazonadvpay table.action_capture { margin: 1ex 0; }
	.gx-container table.amazonadvpay tbody table.amazonadvpay_authorizations > tbody > tr:nth-child(2n+1) { background-color: #ffffff; }
	.gx-container table.amazonadvpay tbody table.amazonadvpay_captures > tbody > tr:nth-child(2n+1) { background-color: #ffffff; }
	.gx-container table.amazonadvpay tbody table.amazonadvpay_refunds > tbody > tr:nth-child(2n+1) { background-color: #ffffff; }
	.gx-container table.amazonadvpay tbody th.actions,
	.gx-container table.amazonadvpay tbody td.actions { width: 400px; }
	.gx-container table.amazonadvpay tr.authrow_0 { background: #f9f9f9 !important; }
	.gx-container table.amazonadvpay th { background: #f9f9f9 !important; }
	/* .gx-container table.amazonadvpay tbody td { border: 1px solid #EEEEEE; } */
</style>
<table border="0" width="100%" cellspacing="0" cellpadding="0" class="pdf_menu">
	<tr>
		<td width="120" class="dataTableHeadingContent" style="border-right: 0px;">
			##orders_amazonadvpay_heading
		</td>
	</tr>
</table>
<table border="0" width="100%" cellspacing="0" cellpadding="2" class="amazonadvpay">
	<tr>
		<td width="80" class="main" valign="top">
			<?php if(!empty($t_messages)): ?>
				<?php foreach($t_messages as $msg): ?>
					<p class="message"><?php echo $msg ?></p>
				<?php endforeach ?>
			<?php endif ?>
			
			<div class="actions inline-half">
				<form action="<?php echo $t_page_url ?>" method="POST">
					<input type="hidden" name="amazonadvpay[update_data]" value="1">
					<input type="submit" class="button" value="##update_data">
				</form>
			</div>
			<div class="inline-half">
				<table class="amzadvpay_orderinfo">
					<tr>
						<td class="label">##order_reference_id</td>
						<td><?php echo $t_order_reference_id ?></td>
					</tr>
					<tr>
						<td class="label">##order_status</td>
						<td><?php echo $t_order_reference_status . $t_order_reference_status_reason ?></td>
					</tr>
					<tr>
						<td class="label">##amount</td>
						<td><?php echo $t_order_amount .' '. $t_order_currency ?></td>
					</tr>
					<tr>
						<td class="label">##creation_timestamp</td>
						<td><span title="<?= $t_order_creation_timestamp ?>"><?= $t_order_creation_timestamp_localtime ?></span></td>
					</tr>
				</table>
			</div>
			
			<?php if(empty($t_authorizations) !== true): ?>
				<h2>##authorizations</h2>
				<table class="amazonadvpay_authorizations">
					<tr>
						<th>##amazon_authorization_id</th>
						<th>##authorization_state</th>
						<th>##expiration_timestamp</th>
						<th>##authorization_amount</th>
						<th>##captured_amount</th>
						<th class="actions">##actions</th>
					</tr>
					<?php $authrow = 0; ?>
					<?php foreach($t_authorization_details as $t_auth_ref_id => $t_auth_details): ?>
						<tr class="authrow_<?= (++$authrow) % 2 ?>">
							<td><?php echo (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AmazonAuthorizationId ?></td>
							<td><?php
								echo $t_auth_state = (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AuthorizationStatus->State;
								if(empty($t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AuthorizationStatus->ReasonCode) != true)
								{
									echo ' ('.(string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AuthorizationStatus->ReasonCode.')';
								}
							?></td>
							<td>
								<span title="<?= (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->ExpirationTimestamp; ?>"><?= date('Y-m-d H:i:s', strtotime((string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->ExpirationTimestamp)); ?></span>
							</td>
							<td class="amount"><?php
								echo ($t_auth_amount = (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AuthorizationAmount->Amount) .' '.
									($t_currency_code = (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->AuthorizationAmount->CurrencyCode)
							?></td>
							<td class="amount"><?php
								echo (string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->CapturedAmount->Amount .' '.
									(string)$t_auth_details->GetAuthorizationDetailsResult->AuthorizationDetails->CapturedAmount->CurrencyCode
							?></td>
							<td class="actions">
								<?php if(isset($t_billing_addresses[$t_auth_ref_id]) &&
								         strtolower(preg_replace('/\s/', '', implode('', $t_billing_addresses[$t_auth_ref_id]))) !== $billingAddressNormalized): ?>
									<form action="<?php echo $t_page_url ?>" method="POST">
										<table class="billing_address">
											<tr><th colspan="2">##billing_address</th></tr>
											<tr><td>##name</td><td><input type="hidden" name="amazonadvpay[billing_address][name]" value="<?php echo $t_billing_addresses[$t_auth_ref_id]['name'] ?>"><?php echo $t_billing_addresses[$t_auth_ref_id]['name'] ?></td></tr>
											<tr><td>##street</td><td><input type="hidden" name="amazonadvpay[billing_address][street]" value="<?php echo $t_billing_addresses[$t_auth_ref_id]['street'] ?>"><?php echo $t_billing_addresses[$t_auth_ref_id]['street'] ?></td></tr>
											<tr><td>##postcode</td><td><input type="hidden" name="amazonadvpay[billing_address][postcode]" value="<?php echo $t_billing_addresses[$t_auth_ref_id]['postcode'] ?>"><?php echo $t_billing_addresses[$t_auth_ref_id]['postcode'] ?></td></tr>
											<tr><td>##city</td><td><input type="hidden" name="amazonadvpay[billing_address][city]" value="<?php echo $t_billing_addresses[$t_auth_ref_id]['city'] ?>"><?php echo $t_billing_addresses[$t_auth_ref_id]['city'] ?></td></tr>
											<tr><td>##country_iso2</td><td><input type="hidden" name="amazonadvpay[billing_address][country_iso2]" value="<?php echo $t_billing_addresses[$t_auth_ref_id]['country_iso2'] ?>"><?php echo $t_billing_addresses[$t_auth_ref_id]['country_iso2'] ?></td></tr>
										</table>
										<div style="text-align: right;">
											<input type="submit" class="button" value="##update_billing_address">
										</div>
									</form>
								<?php endif ?>
								<?php if($t_auth_state == 'Open'): ?>
									<form action="<?php echo $t_page_url ?>" method="POST">
										<input type="hidden" name="amazonadvpay[capture][auth_ref_id]" value="<?php echo $t_auth_ref_id ?>">
										<input type="hidden" name="amazonadvpay[capture][currency]" value="<?php echo $t_currency_code ?>">
										<table class="action_capture">
											<tr><th>##capture_amount</th></tr>
											<tr>
												<td>
													##amount
													<input type="text" class="amzadvpay_amount" name="amazonadvpay[capture][amount]" value="<?php echo $t_auth_amount ?>">&nbsp;<?php echo $t_currency_code ?>
													<input type="submit" class="button" value="##capture_btn">
												</td>
											</tr>
										</table>
									</form>
								<?php endif ?>
								<?php if(in_array($t_auth_state, array('Open', 'Pending'))): ?>
									<div class="actions" style="text-align: right;">
										<form action="<?php echo $t_page_url ?>" method="POST">
											<input type="hidden" name="amazonadvpay[closeauth][auth_ref_id]" value="<?php echo $t_auth_ref_id ?>">
											<input type="submit" class="button" name="amazonadvpay_close_auth" value="##close_auth">
										</form>
									</div>
								<?php endif ?>
							</td>
						</tr>
						<?php if(empty($t_capture_details[$t_auth_ref_id]) !== true): ?>
							<tr class="authrow_<?= $authrow % 2 ?>">
								<td>&nbsp;</td>
								<td colspan="5" style="padding: 0 0 1ex 0;">
									<table class="amazonadvpay_captures">
										<tr>
											<th>##capture_id</th>
											<th>##capture_status</th>
											<th>##captured_amount</th>
											<th>##refunded_amount</th>
											<th class="actions">##actions</th>
										</tr>
										<?php foreach($t_capture_details[$t_auth_ref_id] as $capture_id => $capture_details): ?>
											<tr>
												<td><?php echo $capture_id ?></td>
												<td><?php echo $t_capture_state = (string)$capture_details->GetCaptureDetailsResult->CaptureDetails->CaptureStatus->State ?></td>
												<td class="amount"><?php
													echo (string)$capture_details->GetCaptureDetailsResult->CaptureDetails->CaptureAmount->Amount .' '.
														($t_capture_currency = (string)$capture_details->GetCaptureDetailsResult->CaptureDetails->CaptureAmount->CurrencyCode)
												?></td>
												<td class="amount"><?php
													echo (string)$capture_details->GetCaptureDetailsResult->CaptureDetails->RefundedAmount->Amount .' '.
														(string)$capture_details->GetCaptureDetailsResult->CaptureDetails->RefundedAmount->CurrencyCode
												?></td>
												<td class="actions">
													<?php if($t_capture_state == 'Completed'): ?>
														<form action="<?php echo $t_page_url ?>" method="POST">
															<input type="hidden" name="amazonadvpay[refund][capture_id]" value="<?php echo $capture_id ?>">
															<input type="hidden" name="amazonadvpay[refund][currency]" value="<?php echo $t_capture_currency ?>">
															<table>
																<tr><th>##refund_amount</th></tr>
																<tr><td>##amount <input type="text" class="amzadvpay_amount" name="amazonadvpay[refund][amount]">&nbsp;<?php echo $t_capture_currency ?>&nbsp;<input type="submit" class="button" value="##refund_btn"></td></tr>
															</table>
														</form>
													<?php endif ?>
												</td>
											</tr>
											<?php if(empty($t_refund_details[$capture_id]) !== true): ?>
												<tr>
													<td>&nbsp;</td>
													<td colspan="3" style="padding: 0;">
														<table class="amazonadvpay_refunds">
															<tr>
																<th>##refund_id</th>
																<th>##refund_status</th>
																<th>##refunded_amount</th>
															</tr>
															<?php foreach($t_refund_details[$capture_id] as $refund_id => $refund_details): ?>
																<tr>
																	<td><?php echo $refund_id ?></td>
																	<td><?php echo (string)$refund_details->GetRefundDetailsResult->RefundDetails->RefundStatus->State ?></td>
																	<td><?php
																		echo (string)$refund_details->GetRefundDetailsResult->RefundDetails->RefundAmount->Amount .' '.
																		     (string)$refund_details->GetRefundDetailsResult->RefundDetails->RefundAmount->CurrencyCode
																		?></td>
																</tr>
															<?php endforeach?>
														</table>
													</td>
													<td>&nbsp;</td>
												</tr>
											<?php endif ?>
										<?php endforeach ?>
									</table>
								</td>
							</tr>
						<?php endif ?>
					<?php endforeach ?>
				</table>
			<?php endif ?>
			
			<?php if($t_order_reference_status == 'Open'): ?>
				<div class="actions">
					<form action="<?php echo $t_page_url ?>" method="POST">
						<input type="hidden" name="amazonadvpay[auth][currency]" value="<?php echo $t_order_currency ?>">
						<label for="amzadvpay_auth_amount">##auth_amount</label>
						<input id="amzadvpay_auth_amount" name="amazonadvpay[auth][amount]" value="<?php echo $t_order_amount ?>">&nbsp;<?php echo $t_order_currency ?>
						<input type="submit" class="button" name="amzadvpay_authorize" value="##authorize_payment">
					</form>
				</div>
			<?php endif ?>
			
			<?php if($t_order_reference_status != 'Closed'): ?>
				<div class="actions" style="text-align: right;">
					<form action="<?php echo $t_page_url ?>" method="POST">
						<input type="hidden"
						       name="amazonadvpay[close_order][order_ref_id]"
						       value="<?php echo $t_order_reference_id ?>"> <input type="submit"
						                                                           class="button"
						                                                           value="##close_order">
					</form>
				</div>
			<?php endif ?>

			<?php if(empty($t_debug) !== true): ?>
				<pre><?php echo $t_debug ?></pre>
			<?php endif ?>
		</td>
	</tr>
</table>

<script>
$(function() {
	$('body').delegate('.toggle_head', 'click', function(e) {
		var toggle_body = $(this).next('.toggle_body');
		toggle_body.slideToggle('fast');
	});
});
</script>
