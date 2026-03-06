<?php
/* --------------------------------------------------------------
   new_product.php 2023-04-26
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

$userConfigurationService = StaticGXCoreLoader::getService('UserConfiguration');
$userId                   = new IdType((int)$_SESSION['customer_id']);

$productId = (isset($_GET['pID']) ? (int)$_GET['pID'] : '');
$cPath = ($_GET['cPath'] ?? '');

/**
 * #####################################################################################################################
 * Set hermes values
 * #####################################################################################################################
 */
include_once(DIR_FS_CATALOG . 'gm/inc/gm_get_url_keywords.inc.php');
require_once(DIR_FS_INC . 'get_checkout_information.inc.php');
require_once(DIR_FS_CATALOG . 'gm/inc/gm_xtc_href_link.inc.php');
require_once DIR_FS_INC . 'xtc_product_link.inc.php';

$hermesShippingInstalled = defined('MODULE_SHIPPING_HERMESPROPS_STATUS');
if ($hermesShippingInstalled) {
    $hermes_pclasses = [
        'XS' => [
            'name'       => 'XS',
            'desc'       => 'a+b = max. 30 cm',
        ],
        'S'  => [
            'name'       => 'S',
            'desc'       => 'a+b = max. 50 cm',
        ],
        'M'  => [
            'name'       => 'M',
            'desc'       => 'a+b = max. 80 cm',
        ],
        'L'  => [
            'name'       => 'L',
            'desc'       => 'a+b = max. 120 cm',
        ],
        'XL' => [
            'name'       => 'XL',
            'desc'       => 'a+b = max. 150 cm',
        ],
        'XXL' => [
            'name'       => 'XXL',
            'desc'       => 'a+b > 150 cm',
        ],
    ];
    $hermes_min_pclass = 'XS';
}
$languagesArray = xtc_get_languages();
$languagesArray = array_filter($languagesArray, function($language) { return (int)$language['status_admin'] === 1; });

$fileManagerConfiguration = MainFactory::create('ResponsiveFileManagerConfigurationStorage');
$useFileManager           = $fileManagerConfiguration->isInstalled()
                            && $fileManagerConfiguration->get('use_in_product_and_category_pages');

/**
 * Set some unsorted values
 */
if(!empty($_GET['pID']))
{
	$query         = "SELECT
			p.*,
			pd.*,
			pic.code_isbn,
			pic.code_upc,
			pic.code_mpn,
			pic.code_jan,
            `gec`.`google_export_condition_id`,
			`gec`.`condition` as `google_export_condition`,
			pic.google_export_availability_id,
			pic.brand_name,
			pic.identifier_exists,
			pic.gender,
			pic.age_group,
			date_format(pic.expiration_date, '%Y-%m-%d') as expiration_date,
			date_format(p.products_date_available, '%Y-%m-%d') as products_date_available,
      pho.min_pclass
		FROM
			" . TABLE_PRODUCTS . " p
		LEFT JOIN " . TABLE_PRODUCTS_DESCRIPTION . " pd ON pd.products_id = p.products_id
		LEFT JOIN products_item_codes pic ON pic.products_id = p.products_id
		LEFT JOIN products_hermesoptions pho ON pho.products_id = p.products_id
		LEFT JOIN google_export_condition gec ON (
				pic.google_export_condition_id = gec.google_export_condition_id
				AND gec.language_id = '" . $_SESSION['languages_id'] . "'
			)
		WHERE
			p.products_id = '" . (int)$_GET['pID'] . "'
			AND pd.language_id = '" . $_SESSION['languages_id'] . "'
            ";
	$product_query = xtc_db_query($query);

	$product = xtc_db_fetch_array($product_query);
 
	$pInfo = new objectInfo($product);
}
elseif($_POST)
{
	$pInfo                      = new objectInfo($_POST);
	$products_name              = $_POST['products_name'];
	$products_description       = $_POST['products_description'];
	$products_short_description = $_POST['products_short_description'];
	$products_keywords          = $_POST['products_keywords'];
	$products_meta_title        = $_POST['products_meta_title'];
	$products_meta_description  = $_POST['products_meta_description'];
	$products_meta_keywords     = $_POST['products_meta_keywords'];
	$products_url               = $_POST['products_url'];
	$pInfo->products_startpage  = $_POST['products_startpage'];
	$products_startpage_sort    = $_POST['products_startpage_sort'];
	// BOF GM_MOD
	$gm_url_keywords = gm_prepare_string($_POST['gm_url_keywords']);
	// EOF GM_MOD
	// BEGIN Hermes
	$hermes_min_pclass = gm_prepare_string($_POST['hermes_minpclass']);
	// END Hermes
}
else
{
	$pInfo = new objectInfo(array());
}

$shippingStatuses = xtc_get_shipping_status();
$graduatedQty     = 1;
if(!empty($pInfo->gm_graduated_qty))
{
	$graduatedQty = (double)$pInfo->gm_graduated_qty;
}
$minOrder = 1;
if(!empty($pInfo->gm_min_order))
{
	$minOrder = (double)$pInfo->gm_min_order;
}

$editorIdentifier      = !empty($_GET['pID'])
	? 'editor-product-' . $_GET['pID'] . '-'
	: 'editor-product-{id}-';
$editorWidgetAttribute = (USE_WYSIWYG == 'true')
	? 'data-gx-widget="editor" data-editor-selector="textarea.wysiwyg" '
	: '';


/**
 * Load AdminEditProductExtenderComponent output
 */
$adminEditProductExtenderComponent = MainFactory::create('AdminEditProductExtenderComponent');
$adminEditProductExtenderComponent->set_data('GET', $_GET);
$adminEditProductExtenderComponent->set_data('POST', $_POST);
$adminEditProductExtenderComponent->set_data('product_data', $pInfo);
$adminEditProductExtenderComponent->proceed();

$adminEditProductExtenderComponentTopOutputArray = $adminEditProductExtenderComponent->get_output('top');
$adminEditProductExtenderComponentBottomOutputArray = $adminEditProductExtenderComponent->get_output('bottom');
/**
 * #####################################################################################################################
 * Set form section array
 * #####################################################################################################################
 */
$form_action            = !empty($_GET['pID']) ? 'update_product' : 'insert_product';
$formActionSectionArray = array(
	'cPath=' . ($_GET['cPath'] ?? ''),
	'pID=' . ($_GET['pID'] ?? ''),
	'action=' . $form_action,
);
if(array_key_exists('search', $_GET))
{
	$formActionSectionArray[] = 'search=' . $_GET['search'];
}

if(array_key_exists('page',$_GET))
{
    $formActionSectionArray[]	= 'page=' . $_GET['page'];
}
?>
<div class="pageHeadingWrapper">
    <div class="pageHeading">
        <div class="page-nav-title">
            <?php
            (!empty($products_name[$_SESSION['languages_id']]) ? $t_products_name = stripslashes($products_name[$_SESSION['languages_id']]) : $t_products_name = xtc_get_products_name($pInfo->products_id ?? null,
                $_SESSION['languages_id']));
            if(trim($t_products_name ?? '') != '')
            {
                echo htmlspecialchars($t_products_name);
            }
            else
            {
                echo TEXT_INFO_HEADING_NEW_PRODUCT;
            }
            ?>
        </div>
        <div class="page-nav-tabs">
            <div class="nav-tab no-link">
                <?php echo $GLOBALS['coo_lang_file_master']->get_text('TAB_GENERAL', 'admin_product_page');?>
            </div>
            <div class="nav-tab <?php echo $form_action=== 'insert_product' ? 'no-link disabled' : ''?>">
                <?php
                if ($form_action === "insert_product") {
                    echo $GLOBALS['coo_lang_file_master']->get_text('TAB_VARIANTS', 'admin_product_page');
                } else {
                    echo "<a href=" . htmlspecialchars_wrapper(xtc_href_link('properties_combis.php', "products_id={$productId}&cPath={$cPath}&action=edit_category")) .">" . $GLOBALS['coo_lang_file_master']->get_text('TAB_VARIANTS', 'admin_product_page') . "</a>";
                }
                ?>
            </div>
            <div class="nav-tab <?php echo $form_action=== 'insert_product' ? 'no-link disabled' : ''?>">
                <?php
                if ($form_action === "insert_product") {
                    echo $GLOBALS['coo_lang_file_master']->get_text('TAB_OPTIONS', 'admin_product_page');
                } else {
                    echo "<a href=" . htmlspecialchars_wrapper(xtc_href_link("products/{$productId}/options", "&cPath={$cPath}")) .">" . $GLOBALS['coo_lang_file_master']->get_text('TAB_OPTIONS', 'admin_product_page') . "</a>";
                }
                ?>
            </div>
	        <div class="nav-tab <?php echo $form_action=== 'insert_product' ? 'no-link disabled' : ''?>">
		        <?php
		        if ($form_action === "insert_product") {
		        	echo $GLOBALS['coo_lang_file_master']->get_text('TAB_DOWNLOADS', 'admin_product_page');
		        } else {
		        	echo "<a href=" . htmlspecialchars_wrapper(xtc_href_link("products/{$productId}/downloads", "&cPath={$cPath}")) .">" . $GLOBALS['coo_lang_file_master']->get_text('TAB_DOWNLOADS', 'admin_product_page') . "</a>";
		        }
		        ?>
	        </div>
	        <div class="nav-tab <?php echo $form_action=== 'insert_product' ? 'no-link disabled' : ''?>">
                <?php
        
                if(isset($_GET['pID']))
                {
                    $query = 'SELECT specials_id FROM specials WHERE products_id = ' . (int)$_GET['pID'];
                    $result = xtc_db_query($query);
                    $specialId = 0;
                    if(xtc_db_num_rows($result))
                    {
                        $row = xtc_db_fetch_array($result);
                        $specialId = (int)$row['specials_id'];
                    }
            
                    $specialUrl = xtc_href_link(FILENAME_SPECIALS, 'action=new&pID=' . (int)$_GET['pID']);
                    if($specialId)
                    {
                        $specialUrl = xtc_href_link(FILENAME_SPECIALS, 'action=edit&pID=' . (int)$_GET['pID'] . '&sID=' . $specialId);
                    }
                }
                
		        if ($form_action === "insert_product") {
		        	echo $GLOBALS['coo_lang_file_master']->get_text('BUTTON_SPECIAL', 'admin_buttons');
		        } else {
		        	echo "<a href=" . htmlspecialchars_wrapper($specialUrl ?? '') .">" . $GLOBALS['coo_lang_file_master']->get_text('BUTTON_SPECIAL', 'admin_buttons') . "</a>";
		        }
		        ?>
	        </div>
            <div class="nav-tab<?=$form_action === "insert_product" ? ' no-link disabled' : '' ?>">
                <?php if ($form_action === "insert_product") : ?>
                <?php echo $GLOBALS['coo_lang_file_master']->get_text('TAB_CROSSSELLING', 'admin_product_page'); ?>
                <?php elseif ($form_action === "update_product") : ?>
                    <a href="<?php echo xtc_href_link("categories.php",
                                                      'current_product_id=' . ($_GET['pID'] ?? '') . '&cPath='
                                                      . ($_GET['cPath'] ?? '') . '&action=edit_crossselling'); ?>">
                        <?php echo $GLOBALS['coo_lang_file_master']->get_text('TAB_CROSSSELLING',
                                                                              'admin_product_page'); ?>
                    </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
<style>.pageHeading > .page-nav-title { margin-top: 0 !important; }</style>
<div class="gx-container gx-category-details breakpoint-large"
     data-gx-widget="button_dropdown"
     data-button_dropdown-config_keys="relatedProductActionDropdownBtn"
     data-button_dropdown-user_id="<?php echo $userId; ?>">
	<?php
	$imagesInputController = $useFileManager ? 'data-gx-controller="product/images_input" ' : '';
	
	echo xtc_draw_form('new_product', FILENAME_CATEGORIES, implode('&', $formActionSectionArray), 'post',
	                         'enctype="multipart/form-data" ' . $imagesInputController . $editorWidgetAttribute); ?>
	<!--
		LINKED CATEGORIES
	-->
	<div class="grid hidden">

		<!--
			DROPDOWN SECTION
		-->
		<input type="submit"
		       class="button float_right"
		       name="save_original"
		       value="<?php echo BUTTON_SAVE; ?>">
		<input type="submit" class="button float_right" name="gm_update" value="<?php echo BUTTON_UPDATE; ?>" />
		<div class="gx-container grid display-inline">
			<div data-use-button_dropdown="true"
			     data-custom_caret_btn_class="btn-primary"
			     data-gx-compatibility="categories/categories_product_controller categories/categories_color_dropdown_controller"
			     class="pull-right save-button_dropdown">
				<button class="btn btn-primary"></button>
				<ul></ul>
			</div>
		</div>

		<!--
			CANCEL / SPECIALS/PROPERTIES/ATTRIBUTES
		-->
	</div>

    <!--
		CATEGORIES
	-->
    <div class="frame-wrapper default">
        <div class="frame-head"
             data-gx-widget="collapser"
             data-collapser-target_selector=".frame-content"
             data-collapser-user_id="<?php echo $userId; ?>"
             data-collapser-section="product_category_data"
             data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
                 'product_category_data_collapse'); ?>">
            <label><?php echo str_replace(':', '', TEXT_CATEGORIES); ?></label>
        </div>
        <div class="frame-content grid">
            <?php include DIR_FS_ADMIN . 'html/compatibility/product/linked_categories.inc.php'; ?>
        </div>
    </div>
    
	<!--
		ARTICLE MASTER DATA
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_master_data"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_master_data_collapse'); ?>">
			<label><?php echo HEADING_PRODUCT_MASTER_DATA; ?></label>
		</div>
		<div class="frame-content grid">
			<?php include DIR_FS_ADMIN . 'html/compatibility/product/product_master_data.inc.php'; ?>
		</div>
	</div>

	<!--
		ADVANCED ARTICLE CONFIGURATION
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_advanced_configuration"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_advanced_configuration_collapse'); ?>">
			<label><?php echo HEADING_ADVANCED_CONFIGURATION; ?></label>
		</div>
		<div class="frame-content grid">
			<?php include DIR_FS_ADMIN . 'html/compatibility/product/advanced_configuration.inc.php'; ?>
		</div>
	</div>

	<!--
		ADDITIONAL FIELDS
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_additional_fields"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_additional_fields_collapse'); ?>">
			<label><?php echo $GLOBALS['coo_lang_file_master']->get_text('additional_fields_heading',
			                                                             'new_product') ?></label>
		</div>
		<div class="frame-content grid addtional_fields_wrapper" data-gx-compatibility="additional_fields">
			<?php include DIR_FS_ADMIN . 'html/compatibility/product/additional_fields.inc.php'; ?>
		</div>
	</div>

	
	
	
	<!--
		AdminEditProduct top overloads
	-->
	<?php
	foreach($adminEditProductExtenderComponentTopOutputArray as $outputArray):
		$title     = '';
		if(isset($outputArray['title']))
		{
			$title = $outputArray['title'];
		}
		$content = '';
		if(isset($outputArray['content']))
		{
			$content = $outputArray['content'];
		}
		
		$configKey = 'overload_top_' . strtolower(preg_replace('/[^a-zA-Z]/', '', strip_tags($title)));
		?>
		
		<div class="frame-wrapper default">
			<div class="frame-head"
			     data-gx-widget="collapser"
			     data-collapser-target_selector=".frame-content"
			     data-collapser-user_id="<?php echo $userId; ?>"
			     data-collapser-section="product_<?php echo $configKey; ?>"
			     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
			                                                                                          'product_'
			                                                                                          . $configKey
			                                                                                          . '_collapse'); ?>">
				<label><?php echo $title; ?></label>
			</div>
			<div class="frame-content grid">
				<?php echo $content; ?>
			</div>
		</div>
		
		<?php
	endforeach;
	?>

	<!--
		GOOGLE CATEGORY SECTION
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_google_category"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_google_category_collapse'); ?>">
			<label><?php echo $languageTextManager->get_text('category_headline',
			                                                 'google_categories_administration'); ?></label>
		</div>
		<div class="frame-content grid">
			<div class="google_categories_administration" id="product_id_<?php echo $_GET['pID'] ?? ''; ?>"></div>
		</div>
	</div>

	<!--
		PRODUCT DETAILS SECTION
	-->
	<?php foreach($languagesArray as $language): ?>
		<?php
		$editorTypeProductsDescription[$language['code']] = $userConfigurationService->getUserConfiguration(new IdType(0), $editorIdentifier . 'products_description-'
		                                                                                                                      . $language['code']) ?: 'ckeditor';
		$editorTypeProductsShortDescription[$language['code']] = $userConfigurationService->getUserConfiguration(new IdType(0), $editorIdentifier . 'products_short_description-'
		                                                                                                                      . $language['code']) ?: 'ckeditor';
		$editorTypeProductsCheckoutInformation[$language['code']] = $userConfigurationService->getUserConfiguration(new IdType(0), $editorIdentifier . 'checkout_information-'
		                                                                                                                           . $language['code']) ?: 'ckeditor';
		?>
		<div class="frame-wrapper default">
			<div class="frame-head"
			     data-gx-widget="collapser"
			     data-collapser-target_selector=".frame-content"
			     data-collapser-user_id="<?php echo $userId; ?>"
			     data-collapser-section="product_details_<?php echo $language['code']; ?>"
			     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
			                                                                                          'product_details_'
			                                                                                          . $language['code']
			                                                                                          . '_collapse'); ?>">
				<label><span class="flag-icon flag-icon-<?= $language['code'] ?>"></span>&nbsp;<?= HEADING_PRODUCT_DETAILS ?></label>
			</div>
			<div class="frame-content grid">
				<?php include DIR_FS_ADMIN . 'html/compatibility/product/product_details.inc.php'; ?>
			</div>
		</div>
	<?php endforeach; ?>

	<!--
		PRODUCT IMAGES SECTION
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_images"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_images_collapse'); ?>">
			<label><?php echo HEADING_PRODUCT_IMAGES; ?></label>
		</div>
		<div class="frame-content grid">
			<?php include DIR_FS_ADMIN . 'html/compatibility/product/product_images.inc.php'; ?>
		</div>
	</div>

	<!--
		CUSTOMER GROUPS
	 -->
	<?php if (GROUP_CHECK == 'true'): ?>
		<div class="frame-wrapper default customer-groups">
			<div class="frame-head"
			     data-gx-widget="collapser"
			     data-collapser-target_selector=".frame-content"
			     data-collapser-user_id="<?php echo $userId; ?>"
			     data-collapser-section="product_images"
			     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
			                                                                                          'product_images_collapse'); ?>">
				<label><?php echo ENTRY_CUSTOMERS_STATUS; ?></label>
			</div>
			<div class="frame-content grid" data-gx-widget="checkbox">
				<?php
				$customers_statuses_array = xtc_get_customers_statuses();
				$customers_statuses_array = array_merge(array (array ('id' => 'all', 'text' => TXT_ALL)), $customers_statuses_array);
				for ($i = 0; $n = sizeof($customers_statuses_array), $i < $n; $i ++)
				{
					$checked = '';
					$singleCheckbox = '';
					
					if($customers_statuses_array[$i]['id'] === 'all')
					{
						$singleCheckbox = 'data-single_checkbox';
					}
					else
					{
                        $id = null;
                        if (property_exists($pInfo, 'group_permission_' . (int)$customers_statuses_array[$i]['id'])) {
                            $id = $pInfo->{'group_permission_' . (int)$customers_statuses_array[$i]['id']};
                        }
						$checked = ($id==1) ? 'checked' : '';
					}
					
					$removeBorder = ($i === $n - 1) ? ' remove-border' : '';
					
					echo '
						<div class="span12">
							<div class="control-group span6 grid customer-groups-setting' . $removeBorder . '">
								<div class="span4">
									<label>' . $customers_statuses_array[$i]['text'] . '</label>
								</div>
								<div class="span4">
									<input type="checkbox" name="groups[]"
										value="' . $customers_statuses_array[$i]['id'] . '"' . $checked . $singleCheckbox . '>
								 </div>
							</div>
						</div>
			        ';
				}
				?>
			</div>
		</div>
	<?php endif; ?>
	
	<!--
		AdminEditProduct bottom overloads
	-->
	<?php
	foreach($adminEditProductExtenderComponentBottomOutputArray as $bottomOutputArray):
		$bottomTitle     = '';
		if(isset($bottomOutputArray['title']))
		{
			$bottomTitle = $bottomOutputArray['title'];
		}
		$bottomContent = '';
		if(isset($bottomOutputArray['content']))
		{
			$bottomContent = $bottomOutputArray['content'];
		}
		$configKey = 'overload_bottom_' . strtolower(preg_replace('/[^a-zA-Z]/', '', strip_tags($bottomTitle)));
		?>
		
		<div class="frame-wrapper default">
			<div class="frame-head"
			     data-gx-widget="collapser"
			     data-collapser-target_selector=".frame-content"
			     data-collapser-user_id="<?php echo $userId; ?>"
			     data-collapser-section="product_<?php echo $configKey; ?>"
			     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
			                                                                                          'product_'
			                                                                                          . $configKey
			                                                                                          . '_collapse'); ?>">
				<label><?php echo $bottomTitle; ?></label>
			</div>
			<div class="frame-content grid">
				<?php echo $bottomContent; ?>
			</div>
		</div>
		
		<?php
	endforeach;
	?>
	
	<!--
		PRICE OPTIONS SECTION
	-->
	<div class="frame-wrapper default">
		<div class="frame-head"
		     data-gx-compatibility="products/edit_product_controller"
		     data-gx-widget="collapser"
		     data-collapser-target_selector=".frame-content"
		     data-collapser-user_id="<?php echo $userId; ?>"
		     data-collapser-section="product_price_options"
		     data-collapser-collapsed="<?php echo $userConfigurationService->getUserConfiguration($userId,
		                                                                                          'product_price_options_collapse'); ?>">
			<label><?php echo HEADING_PRICES_OPTIONS; ?></label>
		</div>
		<div class="frame-content grid">
			<?php include DIR_FS_ADMIN . 'html/compatibility/product/price_options.inc.php'; ?>
		</div>
	</div>

	<!--
		DROPDOWN SECTION
	-->
	<div class="bottom-save-bar-content">
		<div data-gx-widget="button_dropdown">
			<div data-use-button_dropdown="true"
			     data-custom_caret_btn_class="btn-primary"
			     data-gx-compatibility="categories/categories_product_controller categories/categories_color_dropdown_controller"
			     class="pull-right">
				<button type="submit" class="btn btn-primary"></button>
				<ul></ul>
			</div>
			
			<?php
			if(isset($_GET['pID']) && $_GET['pID'] > 0)
			{
				$productLink = gm_xtc_href_link('product_info.php', xtc_product_link((int)$_GET['pID']));
				echo '<a class="btn pull-right" href="' . $productLink . '" target="_blank">' . TEXT_GO_TO_PRODUCT . '</a>';
			}
			?>
			
			<?php
			if(empty($_GET['search']))
			{
				echo '<a class="button float_right add-margin-left-5 add-margin-right-5" href="' . xtc_href_link(FILENAME_CATEGORIES, 'cPath=' . $cPath . '&pID=' . ($_GET['pID'] ?? '')) . '">' . BUTTON_CANCEL . '</a>';
			}
			else
			{
				echo '<a class="button float_right add-margin-left-5 add-margin-right-5" href="' . xtc_href_link(FILENAME_CATEGORIES, 'search=' . rawurlencode($_GET['search']) . '&pID=' . ($_GET['pID'] ?? '')) . '">' . BUTTON_CANCEL . '</a>';
			}
			?>
		</div>
	</div>
	
	<div class="gx-container grid hidden">
		<!--
			PROPERTIES
		-->
		<?php
		if (!empty($_GET['pID']))
		{
			echo "<a class='button pull-right' href='" . xtc_href_link('properties_combis.php', 'products_id=' . $_GET['pID'] . '&cPath=' . ($_GET['cPath'] ?? '') . '&action=edit_category') . "'>" . BUTTON_PROPERTIES . "</a>";
		}
		?>
	</div>

	<?php
	echo xtc_draw_hidden_field('products_date_added',
		(!empty($pInfo->products_date_added) ? $pInfo->products_date_added : date('Y-m-d')));
	echo xtc_draw_hidden_field('products_id', $pInfo->products_id ?? null);
	echo xtc_draw_hidden_field('page_token', $_SESSION['coo_page_token']->generate_token());
	?>
	</form>
</div>
