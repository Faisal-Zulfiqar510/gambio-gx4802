<?php
/* --------------------------------------------------------------
   modules.php 2021-05-11
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
   (c) 2002-2003 osCommerce(modules.php,v 1.45 2003/05/28); www.oscommerce.com 
   (c) 2003	 nextcommerce (modules.php,v 1.23 2003/08/19); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: modules.php 1060 2005-07-21 18:32:58Z mz $)

   Released under the GNU General Public License 
   --------------------------------------------------------------*/

use Gambio\Admin\Modules\AccessGroup\Model\ValueObjects\AccessGroupItem;
use Gambio\Admin\Modules\AccessRole\Model\ValueObjects\PermissionAction;
use Gambio\Admin\Modules\Configuration\App\Data\Repositories\Compatibility\ModuleCenterRepository;
use Gambio\Core\Configuration\Services\ConfigurationService;
use Gambio\Core\Permission\Services\PermissionService;

require('includes/application_top.php');

/** @var ModuleCenterRepository $moduleCenterRepository */
/** @var ConfigurationService $configurationService */
$legacyContainer        = LegacyDependencyContainer::getInstance();
$moduleCenterRepository = $legacyContainer->get(ModuleCenterRepository::class);
$configurationService   = $legacyContainer->get(ConfigurationService::class);

$languageTextManager = MainFactory::create_object(LanguageTextManager::class);
$shippingCostTitle = $languageTextManager->get_text('TITLE_SHIPPING', 'general');

// include needed functions (for modules)

// Admin Access Service
/** @var PermissionService $adminAccessService Will be initialized in the application_top.php */
$permissionsGranted = [
    'configurations' => $adminAccessService->checkAdminPermission((int)$_SESSION['customer_id'],
                                                                  PermissionAction::READ,
                                                                  AccessGroupItem::PAGE_TYPE,
                                                                  'configuration.php'),
];

//Eingefügt um Fehler in CC Modul zu unterdrücken. 
require(DIR_FS_CATALOG.DIR_WS_CLASSES . 'xtcPrice.php');
$xtPrice = new xtcPrice($_SESSION['currency'],'');

switch ($_GET['set']) {
	case 'shipping':
		$module_type = 'shipping';
		$module_directory = DIR_FS_CATALOG_MODULES . 'shipping/';
		$module_key = 'MODULE_SHIPPING_INSTALLED';
		define('HEADING_TITLE', HEADING_TITLE_MODULES_SHIPPING);
		break;

	case 'ordertotal':
	case 'order_total':
		$module_type = 'order_total';
		$module_directory = DIR_FS_CATALOG_MODULES . 'order_total/';
		$module_key = 'MODULE_ORDER_TOTAL_INSTALLED';
		define('HEADING_TITLE', HEADING_TITLE_MODULES_ORDER_TOTAL);
		break;

	case 'payment':
	default:
		$module_type = 'payment';
		$module_directory = DIR_FS_CATALOG_MODULES . 'payment/';
		$module_key = 'MODULE_PAYMENT_INSTALLED';
		define('HEADING_TITLE', HEADING_TITLE_MODULES_PAYMENT);
		if (isset($_GET['error'])) {
			$messageStack->add($_GET['error'], 'error');
		}
		PayPalDeprecatedCheck::ppDeprecatedCheck($messageStack);
		break;
}

// BOF GM_MOD
require_once(DIR_FS_ADMIN . 'includes/gm/classes/GMModulesManager.php');
require_once(DIR_FS_ADMIN . 'includes/gm/gm_modules/gm_modules_structure.php');
$coo_module_manager = new GMModuleManager($module_type, $t_show_installed_modules_menu, $t_display_installed_modules, $t_show_missing_modules_menu, $t_display_missing_modules_menu, $t_ignore_files_array);
// EOF GM_MOD		

$actionQueryParam = !empty($_GET['action']) ? $_GET['action'] : '';

switch ($actionQueryParam) {
	case 'save':
		if(isset($_POST['configuration']) && is_array($_POST['configuration']))
		{
			foreach($_POST['configuration'] as $key => $value) {
				if(preg_match('/(MODULE_)\w*(_ALLOWED|_COUNTRIES_\d+)/i', $key)){
					$value = preg_replace('/[^A-Za-z,]/', '', $value);
					$value = strtoupper($value);
					$value = trim($value, ',');
				}
				
				if(preg_match('/MODULE_PAYMENT_COD_UPPER_LIMIT/', $key) && !empty($value))
				{
					$value = preg_replace('/[a-zA-Z]/', '', $value);
					$value = number_format((double)str_replace(',', '.', $value), 2, '.', '');
				}

				if(is_array($value))
				{
					$value = implode('|', $value);
				}

				$configurationPrefix = 'configuration/';
				$configurationKeyPrefix = static function(string $key) use ($configurationPrefix): string {
				  return strpos($key, $configurationPrefix) === 0 ? $key : "{$configurationPrefix}{$key}";
        };
				
				switch($key)
				{
					case 'configuration/MODULE_ORDER_TOTAL_GV_INC_SHIPPING' :
					case 'configuration/MODULE_ORDER_TOTAL_COUPON_INC_SHIPPING' :
						xtc_db_query("update `gx_configurations` set `value` = '" . xtc_db_input(addslashes($value))
						             . "' where `key` IN ('configuration/MODULE_ORDER_TOTAL_GV_INC_SHIPPING', 'configuration/MODULE_ORDER_TOTAL_COUPON_INC_SHIPPING')");
						break;
				}
				if(preg_match('/MODULE_[A-Z]*_[A-Z0-9_]*_ALIAS/', $key))
				{
					if(trim($value) === '')
					{
						xtc_db_query('DELETE FROM `gx_configurations` WHERE `key` = "' . $key . '"');
					}
					else
					{
					  $configurationService->save($configurationKeyPrefix($key), $value);
					}
				} else {
					if (!preg_match('/MODULE_[A-Z]*_[A-Z0-9_]*_SORT_ORDER/', $key)
					    || (preg_match('/MODULE_[A-Z]*_[A-Z0-9_]*_SORT_ORDER/', $key) && is_numeric($value)
					        && (string)(int)$value === (string)$value)
					) {
					  $configurationService->save($configurationKeyPrefix($key), $value);
					}
				}
			}
			// BOF GM_MOD:
			$coo_module_manager->save_sort_order($coo_module_manager->get_modules_installed());
		}

		xtc_redirect(xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $_GET['module']));
		break;

	case 'install':
	case 'remove':
		$file_extension = substr($_SERVER['PHP_SELF'], strrpos($_SERVER['PHP_SELF'], '.'));
		$class = basename($_GET['module']);
		if (file_exists($module_directory . $class . $file_extension)) {
			include($module_directory . $class . $file_extension);
			$module = new $class(0);
			if ($_GET['action'] == 'install') {
				// clean up:
				$module->remove();
				$module->install();
			} elseif ($_GET['action'] == 'remove') {
				$module->remove();
			}
		}

		xtc_redirect(xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $class));
		break;
}
?>
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
	<html <?php echo HTML_PARAMS; ?>>
		<head>
			<meta http-equiv="x-ua-compatible" content="IE=edge">
			<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
			<title><?php echo TITLE; ?></title>
			<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
		</head>
		<body marginwidth="0" marginheight="0" topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" bgcolor="#FFFFFF">
			<!-- header //-->
			<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
			<script type="text/javascript" src="html/assets/javascript/legacy/gm/gm_modules.js"></script>
			<!-- header_eof //-->

			<!-- body //-->
			<table border="0" width="100%" cellspacing="2" cellpadding="2">
				<tr>
					<td class="columnLeft2" width="<?php echo BOX_WIDTH; ?>" valign="top"><table border="0" width="<?php echo BOX_WIDTH; ?>" cellspacing="1" cellpadding="1" class="columnLeft">
							<!-- left_navigation //-->
							<?php require(DIR_WS_INCLUDES . 'column_left.php'); ?>
							<!-- left_navigation_eof //-->
						</table></td>
					<!-- body_text //-->
					<td class="boxCenter" width="100%" valign="top"><table border="0" width="100%" cellspacing="0" cellpadding="2">
							<tr class="hidden">
								<td>
									<div class="pageHeading" style="background-image:url(html/assets/images/legacy/gm_icons/module.png); float: left;"><?php echo HEADING_TITLE; ?></div>

									<?php
										if($_GET['set']=='shipping'){
											echo '
												<table>
													<tr>
														<td class="dataTableHeadingContent">
															' . BOX_SHIPPING . '
														</td>';
										
											if($permissionsGranted['configurations'])
											{
												echo'
														<td class="dataTableHeadingContent">
															<a href="configurations?query=' . $shippingCostTitle . '">
																' . BOX_CONFIGURATION_7 . '
															</a>
														</td>';
											}
											echo '
													</tr>
												</table>
											';
										}
									?>
									<br />
								</td>
							</tr>
							<tr>
								<td>
									<table border="0" width="100%" cellspacing="0" cellpadding="0">
										<tr>
											<td valign="top">
												<?php
												// BOF GM_MOD
												?>
												<div class="gx-container">
													<table data-gx-compatibility="modules/modules_overview" class="gx-modules-table left-table <?php echo htmlentities_wrapper($_GET['set']); ?>" cellpadding="0" cellspacing="0" width="100%">
														<tr class="dataTableHeadingRow">
															<td class="dataTableHeadingContent" style="width: 12px"></td>
															<td class="dataTableHeadingContent" style="width: 300px"><?php echo TABLE_HEADING_MODULES ?></td>
															<td class="dataTableHeadingContent" style="width: 130px"></td><!-- Module logo -->
															<td class="dataTableHeadingContent" style="width: 200px"><?php echo TABLE_HEADING_FILENAME ?></td>
															<td class="dataTableHeadingContent" style="width: 72px"><?php echo TABLE_HEADING_STATUS ?></td>
															<td class="dataTableHeadingContent" style="width: 96px"><?php echo TABLE_HEADING_SORT_ORDER ?></td>
															<td class="dataTableHeadingContent"></td>
														</tr>
	
														<?php
														$coo_module_manager->repair();
														$coo_module_manager->show_modules($t_gm_structure_array);
	
														if(!empty($_GET['module']))
														{
															$mInfo = new objectInfo($coo_module_manager->get_module_data_by_name($_GET['module']));
														}
														?>
	
													</table>
												</div>
												<?php
												// EOF GM_MOD
												?>
											</td>
										</tr>
									</table></td>
							</tr>
						</table></td>
					<!-- body_text_eof //-->
				</tr>
			</table>
			<!-- body_eof //-->

			<!-- footer //-->
			<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
			<!-- footer_eof //-->
			<div class="hidden">
				<?php
				if(isset($_GET['module']) && !empty($_GET['module']))
				{
					$heading = array();
					$contents = array();
	
					$languageTextManager = MainFactory::create_object('LanguageTextManager', [], true);
					$formIsEditable = false;
	
					switch ($actionQueryParam) {
						case 'edit':
							// the code below handles the modules alias.
							if($_GET['set'] === 'payment' || $_GET['set'] === 'shipping')
							{
								$moduleType       = $_GET['set'];
								$moduleName       = $_GET['module'];
								$configurationKey =
									'configuration/MODULE_' . strtoupper($moduleType) . '_' . strtoupper($moduleName) . '_ALIAS';

								$query =
									'SELECT `value` FROM `gx_configurations` WHERE `key` = "'
									. $configurationKey . '"';
								$result = xtc_db_query($query);

								$oldAlias = xtc_db_num_rows($result) > 0 ? xtc_db_fetch_array($result)['value'] : '';

								$keys = '<span class="options-title">' . ORDERS_OVERVIEW_ALIAS_TITLE . '</span>';
								$keys .= '<input type="text" name="configuration[' . $configurationKey . ']" value="'
								         . $oldAlias . '" />';
							}
							else
							{
								$keys = '';
							}

							$formIsEditable = true;
							reset($mInfo->keys);

							foreach($mInfo->keys as $key => $value) {
								if(preg_match('/_ALIAS$/', $key))
								{
									continue;
								}
								if (!isset($moduleName)) {
									$moduleName = $_GET['module'];
								}
								
								$configurationItem  = $moduleCenterRepository->getByKey("configuration/$key")->jsonSerialize();
								$configurationType  = $configurationItem['type']->jsonSerialize();
								$configurationTitle = $value['title'] ?? '';
								$configurationDesc  = $value['description'] ?? '';
								
								$keys .= '<span class="options-title">' . $configurationTitle . '</span>' .  $configurationDesc;
        
								// rendering of dropdown items
                                if ($configurationType['id'] === 'dropdown') {
                                    $options = '';
                                    foreach ($configurationType['params']['items'] as $configurationOption) {
                                        if ($configurationOption['value'] === $configurationItem['value']) {
                                            $optionMarkup = <<<HTML
<option value="{$configurationOption['value']}" selected>{$configurationOption['text']}</option>
HTML;
                                        } else {
                                            $optionMarkup = <<<HTML
<option value="{$configurationOption['value']}">{$configurationOption['text']}</option>
HTML;
                                        }
                                        $options .= $optionMarkup;
                                    }
                                    $selectMarkup = <<<HTML
<select name="configuration[{$configurationItem['key']}]" title="{$configurationTitle}">
{$options}
</select>
HTML;
                                    $keys .= $selectMarkup;
                                } elseif($configurationType['id'] === 'checkbox' || $configurationType['id'] === 'switcher') {
                                	$isChecked = strtolower($configurationItem['value']) === 'true';
                                	$isCheckedStr = $isChecked ? 'true' : 'false';
                                	$isCheckedMarkup = $isChecked ? ' checked' : '';
                                 
                                	$checkboxMarkup = <<<HTML
<div data-gx-widget="checkbox" data-checkbox-checked="{$isCheckedStr}">
	<input type="hidden"
		name="configuration[{$configurationItem['key']}]" value="false">
	<input type="checkbox"
		name="configuration[{$configurationItem['key']}]"
		value="true"
        $isCheckedMarkup
		title="{$configurationTitle}"/>
</div>
HTML;
                                    $keys .= $checkboxMarkup;

                                } elseif($configurationType['id'] === 'textarea') {
                                    $textareaMarkup = <<<HTML
<textarea name="configuration[{$configurationItem['key']}]"
	title="{$configurationTitle}"
	class="form-control">{$configurationItem['value']}</textarea>
HTML;
                                    $keys .= $textareaMarkup;
                                } elseif($configurationType['id'] === 'cod-fee') {
                                    foreach ($configurationType['params']['items'] as $configurationOption) {
                                        $codFeeInputMarkup = <<<HTML
<strong>{$configurationOption['text']}</strong>
<br>
<input type="hidden" name="configuration[{$configurationItem['key']}][]" value="{$configurationOption['context']['key']}">
<input type="text" name="configuration[{$configurationItem['key']}][]" value="{$configurationOption['value']}">
<br><br>
HTML;
                                        
                                        $keys .= $codFeeInputMarkup;
                                    }
                                	
                                	
                                } else {
                                	// fallback for configurations without type
	                                $keys .= '<input type="text" name="configuration[' . $configurationItem['key'] . ']" value="' . $configurationItem['value'] . '">';
                                }
							}
	
							$heading[] = array('text' => strip_tags($mInfo->title));
	
							$contents[] = array('text' => $keys);
							if($_GET['module'] == 'moneyorder')
							{
								$buttons = '<button type="submit" id="moneyorder_submit" class="btn btn-primary" onClick="this.blur();">' . BUTTON_UPDATE . '</button>';
								$buttons .= '<a class="btn" onClick="this.blur();" href="' . xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $_GET['module']) . '">' . BUTTON_CANCEL . '</a>';
							}
							else
							{
								$buttons = '<button type="submit" class="btn btn-primary" onClick="this.blur();">' . BUTTON_UPDATE . '</button>';
								$buttons .= '<a class="button btn" onClick="this.blur();" href="' . xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $_GET['module']) . '">' . BUTTON_CANCEL . '</a>';
							}
							break;
	
						default:
							if($mInfo->status == '1')
							{
								$buttons = '<a class="btn btn-edit btn-primary" href="' . xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $_GET['module'] . '&action=edit') . '">' . BUTTON_EDIT . '</a>';
								$buttons .= '<a href="' . xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $mInfo->code . '&action=remove') . '" class="btn">' . htmlspecialchars_wrapper($languageTextManager->get_text('uninstall', 'buttons')) . '</a>';
							}
							else
							{
								$buttons = '<a href="' . xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $mInfo->code . '&action=install') . '" class="btn btn-primary">' . htmlspecialchars_wrapper($languageTextManager->get_text('install', 'buttons')) . '</a>';
							}
	
							$heading[] = array('text' => '<b>' . strip_tags($mInfo->title) . '</b><br/>');
	
							if ($mInfo->status == '1') {
								$keys = '';
								reset($mInfo->keys);
								
								$moduleName = $_GET['module'];
								foreach($mInfo->keys as $key => $value) {
									$configurationItem = $moduleCenterRepository->getByKey("configuration/$key")->jsonSerialize();
									$configurationType = $configurationItem['type']->jsonSerialize();
									$configurationTitle = $value['title'] ?? '';
									
									$keys .= '<b>' . $configurationTitle . '</b><br />';
									if (!empty($value['use_function'])) {
										$use_function = $value['use_function'];
										if (strpos($use_function, '->') !== false) {
											$class_method = explode('->', $use_function);
											if (!is_object(${$class_method[0]})) {
												include(DIR_WS_CLASSES . $class_method[0] . '.php');
												${$class_method[0]} = new $class_method[0]();
											}
											$keys .= xtc_call_function($class_method[1], $value['value'], ${$class_method[0]});
										} else {
											$keys .= xtc_call_function($use_function, $value['value']);
										}
									} elseif($value['type'] === 'cod-fee') {
										$codFeeValues = [];

                                        $params = $configurationItem['type']->jsonSerialize()['params'];
                                        if (isset($params['items'])) {
                                            foreach ($params['items'] as $item) {
                                                $codFeeValue    = strlen($item['value']) > 30 ? substr($item['value'],
                                                                                                       0,
                                                                                                       30)
                                                                                                . '...' : $item['value'];
                                                $codFeeValues[] = $item['text'] . '<br />' . $codFeeValue;
                                            }
                                        }
										
										$keys .= implode('<br /><br />', $codFeeValues);
									} elseif($configurationType['id'] === 'dropdown') {
									  $configValue = $configurationItem['value'];
										foreach ($configurationType['params']['items'] as $configOption) {
											if ($configValue === $configOption['value']) {
											  $configValue = $configOption['text'];
											}
										}
										$keys .= $configValue;
									} else {
										if(strlen_wrapper($value['value']) > 30) {
											$keys .=  substr($value['value'],0,30) . ' ...';
										} else {
											$keys .=  $value['value'];
										}
									}
									$keys .= '<br/><br/>';
								}
								// handles display of alias names in the module configuration
								if($_GET['set'] === 'payment' || $_GET['set'] === 'shipping')
								{
									$moduleType       = $_GET['set'];
									$moduleName       = $_GET['module'];
									$aliasConfigurationKey =
										'configuration/MODULE_' . strtoupper($moduleType) . '_' . strtoupper($moduleName) . '_ALIAS';

									$query =
										'SELECT `value` FROM `gx_configurations` WHERE `key` = "'
										. $aliasConfigurationKey . '"';
									$result = xtc_db_query($query);

									$oldAlias =
										xtc_db_num_rows($result)
										> 0 ? xtc_db_fetch_array($result)['value'] : TEXT_NONE;

									$content = '<b>' . ORDERS_OVERVIEW_ALIAS_TITLE . '</b>';
									$content .= '<br/><span>' . $oldAlias . '</span>';
									$contents[] = array('text' => $content);
									$contents[] = array('text' => ''); // added empty text area to increase the margin
								}
								$contents[] = array('text' => '' . $mInfo->description);
								$contents[] = array('text' => $keys);
							} else {
								$contents[] = array('text'  => $mInfo->description);
							}
							break;
					}
	
					$configurationBoxContentView = MainFactory::create_object('ConfigurationBoxContentView');
					$configurationBoxContentView->setOldSchoolHeading($heading);
					$configurationBoxContentView->setOldSchoolContents($contents);
					$configurationBoxContentView->set_content_data('buttons', $buttons);
					$configurationBoxContentView->setFormEditable($formIsEditable);
					$configurationBoxContentView->setFormAction(xtc_href_link(FILENAME_MODULES, 'set=' . $_GET['set'] . '&module=' . $_GET['module'] . '&action=save'));
					echo $configurationBoxContentView->get_html();
				}
				?>
			</div>
		</body>
	</html>
<?php require(DIR_WS_INCLUDES . 'application_bottom.php'); ?>
