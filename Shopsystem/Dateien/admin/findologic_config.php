<?php
/* --------------------------------------------------------------
   findologic_config.php 2020-06-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/

require('includes/application_top.php');

AdminMenuControl::connect_with_page('admin.php?do=ModuleCenter');

defined('GM_HTTP_SERVER') or define('GM_HTTP_SERVER', HTTP_SERVER);
define('PAGE_URL', GM_HTTP_SERVER.DIR_WS_ADMIN.basename(__FILE__));

function replaceTextPlaceholders($content) {
	$txt = new LanguageTextManager('findologic', $_SESSION['languages_id']);
	while(preg_match('/##(\w+)\b/', $content, $matches) == 1) {
		$replacement = $txt->get_text($matches[1]);
		if(empty($replacement)) {
			$replacement = $matches[1];
		}
		$content = preg_replace('/##'.$matches[1].'/', $replacement.'$1', $content, 1);
	}
	return $content;
}

function getCustomersGroups() {
	$query = "SELECT cs.* FROM `customers_status` cs join languages l on l.languages_id = cs.language_id and l.directory = '".xtc_db_input($_SESSION['language'])."'";
	$groups = array();
	$result = xtc_db_query($query);
	while($row = xtc_db_fetch_array($result)) {
		$groups[] = $row;
	}
	return $groups;
}

function getLanguageCodes()
{
	$query = 'SELECT `code` FROM `languages` WHERE `status` = 1';
	$result = xtc_db_query($query);
	$lcodes = array();
	while($row = xtc_db_fetch_array($result))
	{
		$lcodes[] = $row['code'];
	}
	return $lcodes;
}

$cfg = array(
	'fl_use_search' => '0',
	'fl_shop_id' => '',
	'fl_shop_url' => HTTP_SERVER.DIR_WS_CATALOG,
	'fl_service_url' => '',
	'fl_net_price' => '0',
	'fl_export_filename' => 'findologic.csv',
	'fl_customer_group' => 1, // Gaeste
	'fl_smartsuggest_snippet' => '',
);

$t_langcodes = getLanguageCodes();
foreach($t_langcodes as $lc)
{
	$cfg['fl_shop_id_'.$lc] = '';
}

foreach($cfg as $key => $value) {
	$cfg_value = gm_get_conf(strtoupper($key));
	if(!empty($cfg_value)) {
		$cfg[$key] = $cfg_value;
	}
}

if($_SERVER['REQUEST_METHOD'] == 'POST') {
	foreach($cfg as $key => $value) {
		$confkey = strtoupper($key);
		switch($key) {
			case 'fl_use_search':
			case 'fl_net_price':
				gm_set_conf($confkey, isset($_POST[$key]) ? '1' : '0');
				break;
			case 'fl_smartsuggest_snippet':
				gm_set_conf($confkey, $_POST[$key]);
				break;
			default:
				if(isset($_POST[$key])) {
					gm_set_conf($confkey, trim(xtc_db_input($_POST[$key])));
				}
		}
	}
	xtc_redirect(PAGE_URL);
}

ob_start();
?>
<!DOCTYPE html>
<html <?php echo HTML_PARAMS; ?>>
	<head>
		<meta http-equiv="x-ua-compatible" content="IE=edge">
		<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
		<title><?php echo TITLE; ?></title>
		<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
	</head>
	<body>
		<!-- header //-->
		<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
		<!-- header_eof //-->

		<!-- body //-->
		<table border="0" width="100%" cellspacing="2" cellpadding="2">
			<tr>
				<td class="columnLeft2" width="<?php echo BOX_WIDTH; ?>" valign="top">
					<!-- left_navigation //-->
					<?php require(DIR_WS_INCLUDES . 'column_left.php'); ?>
					<!-- left_navigation_eof //-->
				</td>

				<!-- body_text //-->
				
				<td class="boxCenter" width="100%" valign="top">
					<div class="pageHeading">Findologic ##configuration</div>
					<div class="template-configuration-configuration gx-container breakpoint-small">
						<form class="adminform" action="<?php echo PAGE_URL ?>" method="POST"
						      data-gx-extension="visibility_switcher">
							<table class="gx-configuration gx-configuration-table main-table odd" border="0"
							       width="100%" cellpadding="2">
								<tr>
									<th class="dataTableContent_gm" colspan="3">
										##configuration
									</th>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="use_search">##use_search</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div data-gx-widget="checkbox">
											<input id="use_search" name="fl_use_search"
											       type="checkbox" <?php echo $cfg['fl_use_search'] ? 'checked' : '' ?>>
										</div>
									</td>
								</tr>
                                
                                <?php foreach ($t_langcodes as $lc): ?>
									<tr>
										<td class="dataTableContent_gm configuration-label">
											<label for="shop_id">##shop_id <?php echo strtoupper($lc) ?></label>
										</td>
										<td class="dataTableContent_gm" colspan="2">
											<div>
												<input id="shop_id" name="fl_shop_id_<?php echo $lc ?>" type="text"
												       value="<?php echo $cfg['fl_shop_id_' . $lc] ?>">
											</div>
										</td>
									</tr>
                                <?php endforeach ?>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="shop_url">##shop_url</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div>
											<input id="shop_url" name="fl_shop_url" type="text"
											       value="<?php echo $cfg['fl_shop_url'] ?>">
										</div>
									</td>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="service_url">##service_url</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div>
											<input id="service_url" name="fl_service_url" type="text"
											       value="<?php echo $cfg['fl_service_url'] ?>">
										</div>
									</td>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="export_filename">##export_filename</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div>
											<input id="export_filename" name="fl_export_filename" type="text"
											       value="<?php echo $cfg['fl_export_filename'] ?>">
										</div>
									</td>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="net_price">##net_price</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div data-gx-widget="checkbox">
											<input id="net_price" name="fl_net_price"
											       type="checkbox" <?php echo $cfg['fl_net_price'] ? 'checked="checked"' : '' ?>>
										</div>
									</td>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="customer_group">##customer_group</label>
									</td>
									<td class="dataTableContent_gm" colspan="2">
										<div>
											<select name="fl_customer_group">
                                                <?php foreach (getCustomersGroups() as $cgroup): ?>
													<option
														value="<?php echo $cgroup['customers_status_id'] ?>" <?php echo $cgroup['customers_status_id']
                                                                                                                        == $cfg['fl_customer_group'] ? 'selected="selected"' : '' ?>>
                                                        <?php echo $cgroup['customers_status_name'] ?>
													</option>
                                                <?php endforeach ?>
											</select>
										</div>
									</td>
								</tr>
								
								<tr>
									<td class="dataTableContent_gm configuration-label">
										<label for="smartsuggest_snippet">##smartsuggest_snippet</label>
									</td>
									<td class="dataTableContent_gm">
										<div>
										<textarea class="form-control"
										          style="width: 100%; height: 15em;"
										          name="fl_smartsuggest_snippet"><?= $cfg['fl_smartsuggest_snippet'] ?></textarea>
										</div>
									</td>
									<td class="visibility_switcher">
										<span class="tooltip-icon add-padding-right-24" data-gx-widget="tooltip_icon"
										      data-tooltip_icon-type="info">##smartsuggest_snippet_hint</span>
									</td>
								</tr>
							</table>
							
							<div class="grid" style="margin-top: 24px">
								<div class="pull-right bottom-save-bar-content">
									<input type="submit"
									       class="button btn btn-primary pull-right"
									       name="save"
									       value="##save"/>
								</div>
							</div>
						</form>
					</div>
				</td>
			</tr>
		</table><!-- body layout table -->
		<script>
		// test
		</script>
		
		<!-- footer //-->
		<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
		<!-- footer_eof //-->
	</body>
</html>
<?php
echo replaceTextPlaceholders(ob_get_clean());
require(DIR_WS_INCLUDES . 'application_bottom.php');
