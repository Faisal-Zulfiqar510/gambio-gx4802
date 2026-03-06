<?php
/* --------------------------------------------------------------
   product_master_data.php 2021-09-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * #####################################################################################################################
 * Set GX-Customizer values.
 * #####################################################################################################################
 */
require_once('../gm/modules/gm_gprint_tables.php');
require_once('../gm/classes/GMGPrintProductManager.php');

$gmGPrintProductManagerObj = new GMGPrintProductManager();

$gmGPrintSurfacesGroups = $gmGPrintProductManagerObj->get_surfaces_groups();

$gmGPrintPullDownArray = array(
	array('id' => '', 'text' => '')
);

foreach($gmGPrintSurfacesGroups AS $gmGPrintKey => $gmGPrintValue)
{
	$gmGPrintPullDownArray[] = array(
		'id'   => $gmGPrintSurfacesGroups[$gmGPrintKey]['ID'],
		'text' => $gmGPrintSurfacesGroups[$gmGPrintKey]['NAME']
	);
}

$gmGPrintSurfacesGroupsId = $gmGPrintProductManagerObj->get_surfaces_groups_id($_GET['pID'] ?? null);

/**
 * #####################################################################################################################
 * Set site map arrays
 * #####################################################################################################################
 */
$siteMapPriorityArray = array(
	array('id' => '0.0', 'text' => '0.0'),
	array('id' => '0.1', 'text' => '0.1'),
	array('id' => '0.2', 'text' => '0.2'),
	array('id' => '0.3', 'text' => '0.3'),
	array('id' => '0.4', 'text' => '0.4'),
	array('id' => '0.5', 'text' => '0.5'),
	array('id' => '0.6', 'text' => '0.6'),
	array('id' => '0.7', 'text' => '0.7'),
	array('id' => '0.8', 'text' => '0.8'),
	array('id' => '0.9', 'text' => '0.9'),
	array('id' => '1.0', 'text' => '1.0'),
);

$siteMapChangeFreqArray = array(
	array('id' => 'always', 'text' => TITLE_ALWAYS),
	array('id' => 'hourly', 'text' => TITLE_HOURLY),
	array('id' => 'daily', 'text' => TITLE_DAILY),
	array('id' => 'weekly', 'text' => TITLE_WEEKLY),
	array('id' => 'monthly', 'text' => TITLE_MONTHLY),
	array('id' => 'yearly', 'text' => TITLE_YEARLY),
	array('id' => 'never', 'text' => TITLE_NEVER)
);

/**
 * #####################################################################################################################
 * Set product price status selection
 * #####################################################################################################################
 */
$priceStatusSelectionArray = array(
	array('id' => 0, 'text' => GM_PRICE_STATUS_0),
	array('id' => 1, 'text' => GM_PRICE_STATUS_1),
	array('id' => 2, 'text' => GM_PRICE_STATUS_2)
);

/**
 * #####################################################################################################################
 * Set product status value
 * #####################################################################################################################
 */
switch($pInfo->products_status ?? null)
{
	case '0' :
		$productStatus = 0;
		break;
	case '1' :
	default :
		$productStatus = 1;
}
$productStatusArray = array(
	array('id' => 0, 'text' => TEXT_PRODUCT_NOT_AVAILABLE),
	array('id' => 1, 'text' => TEXT_PRODUCT_AVAILABLE)
);

/**
 * #####################################################################################################################
 * Set manufactures array
 * #####################################################################################################################
 */
$manufacturersArray = array(array('id' => '', 'text' => TEXT_NONE));
$manufacturersQuery = xtc_db_query("select manufacturers_id, manufacturers_name from " . TABLE_MANUFACTURERS
                                   . " order by manufacturers_name");
while($manufacturers = xtc_db_fetch_array($manufacturersQuery))
{
	$manufacturersArray[] = array(
		'id'   => $manufacturers['manufacturers_id'],
		'text' => $manufacturers['manufacturers_name']
	);
}

/**
 * #####################################################################################################################
 * Set vpe array
 * #####################################################################################################################
 */
$vpeArray = array(array('id' => '', 'text' => TEXT_NONE));
$vpeQuery = xtc_db_query("select products_vpe_id, products_vpe_name from " . TABLE_PRODUCTS_VPE . " WHERE language_id='"
                         . $_SESSION['languages_id'] . "' order by products_vpe_name");
while($vpe = xtc_db_fetch_array($vpeQuery))
{
	$vpeArray[] = array('id' => $vpe['products_vpe_id'], 'text' => $vpe['products_vpe_name']);
}

/**
 * #####################################################################################################################
 * Set quantity unit values
 * #####################################################################################################################
 */
$quantityUnitObj      = MainFactory::create_object('QuantityUnitControl');
$quantityUnitObjArray = $quantityUnitObj->get_quantity_unit_array();
$quantityUnitArray    = array();
foreach($quantityUnitObjArray as $unitObj)
{
	$id   = $unitObj->get_quantity_unit_id();
	$name = $unitObj->get_unit_name($_SESSION['languages_id']);
	if(!empty($name))
	{
		$quantityUnitArray[] = array('id' => $id, 'text' => $name);
	}
}
$basicArray      = array(array('id' => 0, 'text' => '-'));
$quantityUnit    = array_merge($basicArray, $quantityUnitArray);
$quantityUnitObj = null;

$unitObjHandler     = MainFactory::create_object('ProductQuantityUnitHandler');
$quantityUnitSelect = $unitObjHandler->get_quantity_unit_id(isset($_GET['pID']) ? (int)$_GET['pID'] : 0);
$unitObjHandler     = null;

/**
 * #####################################################################################################################
 * Set product file templates
 * #####################################################################################################################
 */
$productDetailFiles = array();

$templatePath = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
$productInfoTemplatePrefix = "product_info_template_";

if($dir = opendir($templatePath))
{
	while(($file = readdir($dir)) !== false)
	{
        if (is_file($templatePath . $file)
            && strpos($file, $productInfoTemplatePrefix) === 0
            && !xtc_is_extension_file($templatePath . $file)) {
            $parsedFile = substr($file, strlen($productInfoTemplatePrefix));
            $productDetailFiles[] = ['id' => $parsedFile, 'text' => $parsedFile];
		} //if
	} // while
	closedir($dir);
}
$productDetailsDefaultArray = array();
// set default value in dropdown!
if(count($productDetailFiles) > 0)
{
	$productDetailsDefaultArray[] = array('id' => 'default', 'text' => TEXT_SELECT);
	$productDetailsDefaultValue   = $pInfo->product_template ?? null;
	$productDetailFiles           = array_merge($productDetailsDefaultArray, $productDetailFiles);
}
else
{
	$productDetailsDefaultArray[] = array('id' => 'default', 'text' => TEXT_NO_FILE);
	$productDetailsDefaultValue   = $pInfo->product_template ?? null;
	$productDetailFiles           = array_merge($productDetailsDefaultArray, $productDetailFiles);
}

$optionTemplateFiles = array();

$templatePath = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
$productInfoOptionPrefix = "product_info_option_template_";

if($dir = opendir($templatePath))
{
	while(($file = readdir($dir)) !== false)
	{
        if (is_file($templatePath . $file)
            && strpos($file, $productInfoOptionPrefix) === 0
            && !xtc_is_extension_file($templatePath . $file)) {
            $parsedFile = substr($file, strlen($productInfoOptionPrefix));
			$optionTemplateFiles[] = array('id' => $parsedFile, 'text' => $parsedFile);
		} //if
	} // while
	closedir($dir);
}
// set default value in dropdown!
$optionTemplateDefaultArray = array();
if(count($optionTemplateFiles) > 0)
{
	$optionTemplateDefaultArray[] = array('id' => 'default', 'text' => TEXT_SELECT);
	$optionTemplateDefaultValue   = $pInfo->options_template ?? null;
	$optionTemplateFiles          = array_merge($optionTemplateDefaultArray, $optionTemplateFiles);
}
else
{
	$optionTemplateDefaultArray[] = array('id' => 'default', 'text' => TEXT_NO_FILE);
	$optionTemplateDefaultValue   = $pInfo->options_template ?? null;
	$optionTemplateFiles          = array_merge($optionTemplateDefaultArray, $optionTemplateFiles);
}

$optionTemplateOverviewFiles = array();

$templatePath = DIR_FS_CATALOG . StaticGXCoreLoader::getThemeControl()->getThemeHtmlPath();
$productListingOptionPrefix = "product_listing_option_template_";

if($dir = opendir($templatePath))
{
	while(($file = readdir($dir)) !== false)
	{
        if (is_file($templatePath . $file)
            && strpos($file, $productListingOptionPrefix) === 0
            && !xtc_is_extension_file($templatePath . $file)) {
            $parsedFile = substr($file, strlen($productListingOptionPrefix));
			$optionTemplateOverviewFiles[] = ['id' => $parsedFile, 'text' => $parsedFile];
		} //if
	} // while
	closedir($dir);
}
// set default value in dropdown!
$optionTemplateOverviewDefaultArray = array();
if(count($optionTemplateOverviewFiles) > 0)
{
	$optionTemplateOverviewDefaultArray[] = array('id' => 'default', 'text' => TEXT_SELECT);
	$optionTemplateOverviewDefaultValue   = $pInfo->gm_options_template ?? null;
	$optionTemplateOverviewFiles          = array_merge($optionTemplateOverviewDefaultArray,
	                                                    $optionTemplateOverviewFiles);
}
else
{
	$optionTemplateOverviewDefaultArray[] = array('id' => 'default', 'text' => TEXT_NO_FILE);
	$optionTemplateOverviewDefaultValue   = $pInfo->gm_options_template ?? null;
	$optionTemplateOverviewFiles          = array_merge($optionTemplateOverviewDefaultArray,
	                                                    $optionTemplateOverviewFiles);
}

/**
 * #####################################################################################################################
 * Set product types array
 * #####################################################################################################################
 */
$productTypesArray  = array();
$productTypesQuery  = 'SELECT * FROM product_types AS pt LEFT JOIN product_type_descriptions AS ptd USING(product_type_id) WHERE ptd.language_id="'
                      . $_SESSION['languages_id'] . '" ORDER BY pt.product_type_id ASC';
$productTypesResult = xtc_db_query($productTypesQuery);
while($row = xtc_db_fetch_array($productTypesResult))
{
	$productTypesArray[] = array('id' => $row['product_type_id'], 'text' => $row['name']);
}

/**
 * #####################################################################################################################
 * Set google export condition values
 * #####################################################################################################################
 */
$conditionSql    = "SELECT `google_export_condition_id` AS `id`, `condition` FROM `google_export_condition` WHERE `language_id` = '"
                   . $_SESSION['languages_id'] . "'";
$conditionResult = xtc_db_query($conditionSql);

while ($conditionResultArray = xtc_db_fetch_array($conditionResult)) {
    $googleExportConditionArray[] = [
        'id'   => $conditionResultArray['id'],
        'text' => $conditionResultArray['condition'],
    ];
}

//$googleExportConditionArray[] = array(
//	'id'   => $languageTextManager->get_text('condition_value_new', 'product_item_codes'),
//	'text' => $languageTextManager->get_text('condition_value_new', 'product_item_codes')
//);
//$googleExportConditionArray[] = array(
//	'id'   => $languageTextManager->get_text('condition_value_used', 'product_item_codes'),
//	'text' => $languageTextManager->get_text('condition_value_used', 'product_item_codes')
//);
//$googleExportConditionArray[] = array(
//	'id'   => $languageTextManager->get_text('condition_value_refurbished', 'product_item_codes'),
//	'text' => $languageTextManager->get_text('condition_value_refurbished', 'product_item_codes')
//);

/**
 * #####################################################################################################################
 * Set google export availability values
 * #####################################################################################################################
 */

$googleExportAvailabilityArray[] = array('id' => '0', 'text' => $languageTextManager->get_text('text_please_select','product_item_codes') );

$availabilitySql = "SELECT google_export_availability_id, availability FROM google_export_availability WHERE `language_id` = " . $_SESSION['languages_id'] . " ORDER BY google_export_availability_id";
$availabilityResult = xtc_db_query($availabilitySql);
while($availabilityResultArray = xtc_db_fetch_array($availabilityResult))
{
	$googleExportAvailabilityArray[] = array('id' => $availabilityResultArray['google_export_availability_id'], 'text' => $availabilityResultArray['availability'] );
}


/**
 * #####################################################################################################################
 * Set gender and age values
 * #####################################################################################################################
 */
$defaultGenderArray = array('id' => '', 'text' => '---');
$gendersArray       = array(
	0 => array('id' => '', 'text' => '---'),
	1 => array('id' => 'Herren', 'text' => 'Herren'),
	2 => array('id' => 'Damen', 'text' => 'Damen'),
	3 => array('id' => 'Unisex', 'text' => 'Unisex')
);
$defaultAgeGroup    = array('id' => '', 'text' => '---');
$ageGroupsArray     = array(
	0 => array('id' => '', 'text' => '---'),
	1 => array('id' => 'Erwachsene', 'text' => 'Erwachsene'),
	2 => array('id' => 'Kinder', 'text' => 'Kinder')
);

?>

<!--
	LEFT COLUMN OF ARTICLE MASTER DATA
-->
<div class="span6">
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_STATUS; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('products_status', 'checkbox', '1', (bool)$productStatus); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_MODEL; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_model', $pInfo->products_model ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_QUANTITY; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_quantity', isset($pInfo->products_quantity) ? (double)$pInfo->products_quantity : 0); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_WEIGHT . TEXT_PRODUCTS_WEIGHT_INFO; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_weight', $pInfo->products_weight ?? null); ?>
		</div>
	</div>

	<?php if(ACTIVATE_SHIPPING_STATUS == 'true'): ?>
		<div class="grid control-group">
			<div class="span6">
				<label><?php echo BOX_SHIPPING_STATUS; ?></label>
			</div>
			<div class="span6">
				<?php
				$shippingStatusId = $pInfo->products_shippingtime ?? DEFAULT_SHIPPING_STATUS_ID;
				echo xtc_draw_pull_down_menu('shipping_status', $shippingStatuses, $shippingStatusId); ?>
			</div>
		</div>
	<?php endif; ?>

	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_MANUFACTURER; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('manufacturers_id', $manufacturersArray, $pInfo->manufacturers_id ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_VPE; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('products_vpe', $vpeArray,
			                                   empty($pInfo->products_vpe) ? DEFAULT_PRODUCTS_VPE_ID : $pInfo->products_vpe); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_VPE_VALUE; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_vpe_value', $pInfo->products_vpe_value ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_QUANTITYUNIT; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('quantityunit', $quantityUnit, $quantityUnitSelect); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_MIN_ORDER . '(' . GM_TEXT_INPUT_ADVICE . ')'; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('gm_min_order', $minOrder); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_GRADUATED_QTY . '(' . GM_TEXT_INPUT_ADVICE . ')'; ?></label>
		</div>
		<div class="span5">
			<?php echo xtc_draw_input_field('gm_graduated_qty', $graduatedQty) ?>
		</div>
		<div class="span1">
			<span class="pull-right" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
				<?php echo GM_TEXT_GRADUATED_QTY_TOOLTIP ?>
			</span>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_EAN; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_ean', $pInfo->products_ean ?? null); ?>
		</div>
	</div>
	<div class="grid control-group remove-border">
		<div class="span6">
			<label><?php echo TEXT_NC_GAMBIOULTRA_COSTS; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('nc_ultra_shipping_costs', $pInfo->nc_ultra_shipping_costs ?? null); ?>
		</div>
	</div>
</div>

<!--
	RIGHT COLUMN OF ARTICLE MASTER DATA
-->
<div class="span6">
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_STARTPAGE; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('products_startpage', 'checkbox', '1',
				!empty($pInfo->products_startpage)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_SHOW_PRICE_OFFER; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('gm_show_price_offer', 'checkbox', '1',
				!empty($pInfo->gm_show_price_offer)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_SHOW_QTY_INFO; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('gm_show_qty_info', 'checkbox', '1',
                                                !empty($pInfo->gm_show_qty_info)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_SHOW_WEIGHT; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('gm_show_weight', 'checkbox', '1',
                                                !empty($pInfo->gm_show_weight)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_SITEMAP_ENTRY; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php
			echo xtc_draw_checkbox_field('gm_sitemap_entry', '1', ((isset($_GET['pID']) && !empty($_GET['pID'])) ? !empty($pInfo->gm_sitemap_entry) : true));
			?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_TEXT_SHOW_DATE_ADDED; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('gm_show_date_added', 'checkbox', '1',
				!empty($pInfo->gm_show_date_added)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_VPE_VISIBLE; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_selection_field('products_vpe_status', 'checkbox', '1',
                                                !empty($pInfo->products_vpe_status)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_DATE_AVAILABLE; ?></label>
		</div>
		<div class="span6">
			<input type="text"
				class="cursor-pointer"
				name="products_date_available"
				data-jse-widget="datepicker"
				data-datepicker-format="yy-mm-dd"
				data-datepicker-gx-container
				value="<?php echo (isset($pInfo->products_date_available) && $pInfo->products_date_available !== '1000-01-01') ? $pInfo->products_date_available : ''; ?>"
			/>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_SORT; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_sort', $pInfo->products_sort ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCTS_STARTPAGE_SORT; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('products_startpage_sort', $pInfo->products_startpage_sort ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_SITEMAP_PRIORITY; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('gm_priority', $siteMapPriorityArray, $pInfo->gm_priority ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_SITEMAP_CHANGEFREQ; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('gm_changefreq', $siteMapChangeFreqArray, $pInfo->gm_changefreq ?? null); ?>
		</div>
	</div>
	<div class="grid control-group remove-border">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_availability','product_item_codes') ?>:</label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('google_export_availability_id', $googleExportAvailabilityArray, $pInfo->google_export_availability_id ?? null); ?>
		</div>
	</div>
</div>
