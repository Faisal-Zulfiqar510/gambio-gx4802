<?php
/* --------------------------------------------------------------
   advanced_configuration.php 2022-08-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Most of logic values are set in the product_master_data.php
 */

/** @var SliderReadService $sliderReadService */
$sliderReadService = StaticGXCoreLoader::getService('SliderRead');
$sliderArray       = $sliderReadService->getAllSlider()->getArray();
  $activeSliderId    = $sliderReadService->findAssignedSliderIdForProductId(new IdType(isset($_GET['pID']) ? (int)$_GET['pID'] : 0));

include DIR_FS_ADMIN . 'html/compatibility/product/product_slider_selection_v2.inc.php';

?>
<!--
	LEFT COLUMN OF ADVANCED ARTICLE CONFIGURATION
-->
<div class="span6">
    <div class="grid control-group hidden">
        <?php echo xtc_draw_input_field('options_template', $optionTemplateDefaultValue, '', false, 'hidden'); ?>
        <?php echo xtc_draw_input_field(
            'gm_options_template',
            $optionTemplateOverviewDefaultValue,
            '',
            false,
            'hidden'
        ); ?>
    </div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_CHOOSE_INFO_TEMPLATE; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('info_template', $productDetailFiles, $productDetailsDefaultValue); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_PRODUCT_TYPE; ?></label>
		</div>
		<div class="span5">
			<?php echo xtc_draw_pull_down_menu('product_type', $productTypesArray, $pInfo->product_type ?? null); ?>
		</div>
		<div class="span1">
			<span class="pull-right" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
				<?php echo TEXT_PRODUCT_TYPE_TOOLTIP ?>
			</span>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TITLE_PRODUCT_SLIDER; ?></label>
		</div>
		<div class="span6">
			<?php if(count($sliderArray) > 0): ?>
				<?php echo generateSliderInput($activeSliderId); ?>
			<?php else: ?>
				<input type="text" disabled placeholder="<?php echo TEXT_NO_TEASER_SLIDER_AVAILABLE; ?>" />
			<?php endif; ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo GM_PRICE_STATUS; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('gm_price_status', $priceStatusSelectionArray,
			                                   $pInfo->gm_price_status ?? null); ?>
		</div>
	</div>

  <?php if ($hermesShippingInstalled): ?>
  <div class="grid control-group">
		<div class="span6">
			<label><?= HEADING_HERMES_PARCEL_CLASS ?></label>
		</div>
		<div class="span6">
			<select id="hermes_minpclass" name="hermes_minpclass" size="1">
				<?php foreach($hermes_pclasses as $pclass): ?>
					<option value="<?php echo $pclass['name'] ?>"
						<?php echo $pclass['name'] === (property_exists($pInfo, 'min_pclass') ? $pInfo->min_pclass : null) ? 'selected' : '' ?>>
						<?php echo $pclass['name'] . ' - ' . $pclass['desc'] ?></option>
				<?php endforeach ?>
			</select>
		</div>
	</div>
  <?php endif ?>

	<div class="grid control-group">
		<div class="span6">
			<label><?php echo HEADING_GX_CUSTOMIZER; ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('gm_gprint_surfaces_groups_id', $gmGPrintPullDownArray,
			                                   $gmGPrintSurfacesGroupsId); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_expiration_date', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<input type="text"
				class="cursor-pointer"
				name="expiration_date"
				data-jse-widget="datepicker"
				data-datepicker-format="yy-mm-dd"
				data-datepicker-gx-container
				   value="<?php echo (isset($pInfo->expiration_date) && $pInfo->expiration_date !== '1000-01-01') ? xtc_date_short($pInfo->expiration_date) : ''; ?>"
			/>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_condition', 'product_item_codes'); ?>
				(GoogleExportPflicht)
			</label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('google_export_condition_id', $googleExportConditionArray, $pInfo->google_export_condition_id ?? null); ?>
		</div>
	</div>
    <div class="grid control-group remove-border">
        <div class="span6">
            <label><?php echo $languageTextManager->get_text('label_age_group', 'product_item_codes'); ?></label>
        </div>
        <div class="span6">
            <?php echo xtc_draw_pull_down_menu('age_group', $ageGroupsArray,
                (empty($pInfo->age_group) ? $defaultAgeGroup : $pInfo->age_group)); ?>
        </div>
    </div>
</div>

<!--
	RIGHT COLUMN OF ADVANCED ARTICLE CONFIGURATION
-->
<div class="span6">
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo TEXT_FSK18; ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<select name="fsk18" data-convert-checkbox="true">
				<option value="1" <?php echo !empty($pInfo->products_fsk18) ? 'selected' : '' ?>>on</option>
				<option value="0" <?php echo empty($pInfo->products_fsk18) ? 'selected' : '' ?>>off</option>
			</select>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_identifier_exists',
			                                                 'product_item_codes'); ?></label>
		</div>
		<div class="span6" data-gx-widget="checkbox">
			<?php echo xtc_draw_checkbox_field('identifier_exists', 1, ((isset($_GET['pID'])
			                                                             && !empty($_GET['pID'])) ? (boolean)$pInfo->identifier_exists : true)); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_isbn', 'product_item_codes') . ' '
			                  . $languageTextManager->get_text('label_isbn_info', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('code_isbn', $pInfo->code_isbn ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_upc', 'product_item_codes') . ' '
			                  . $languageTextManager->get_text('label_upc_info', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('code_upc', $pInfo->code_upc ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_mpn', 'product_item_codes') . ' '
			                  . $languageTextManager->get_text('label_mpn_info', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('code_mpn', $pInfo->code_mpn ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_jan', 'product_item_codes') . ' '
			                  . $languageTextManager->get_text('label_jan_info', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('code_jan', $pInfo->code_jan ?? null); ?>
		</div>
	</div>
	<div class="grid control-group">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_brand', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_input_field('brand_name', $pInfo->brand_name ?? null); ?>
		</div>
	</div>
	<div class="grid control-group remove-border">
		<div class="span6">
			<label><?php echo $languageTextManager->get_text('label_gender', 'product_item_codes'); ?></label>
		</div>
		<div class="span6">
			<?php echo xtc_draw_pull_down_menu('gender', $gendersArray,
				(empty($pInfo->gender) ? $defaultGenderArray : $pInfo->gender)); ?>
		</div>
	</div>
</div>
