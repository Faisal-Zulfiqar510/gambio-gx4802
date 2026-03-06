<?php
/* --------------------------------------------------------------
   set_stored_product_data.inc.php 2023-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   -------------------------------------------------------------- 
*/

/**
 * This file is included in admin/categories.php for insert_- and update_product action
 */

/** @var LanguageProvider $languageProvider */

use Doctrine\DBAL\Connection;

$languageProvider = MainFactory::create('LanguageProvider', StaticGXCoreLoader::getDatabaseQueryBuilder());
$languages        = $languageProvider->getCodes();

// AddOn values
$identifierExists = isOptionChecked('identifier_exists')->asBool() ? '1' : '0';

$expirationDate = $_POST['expiration_date'] === '' ? '1000-01-01' : xtc_date_raw($_POST['expiration_date']);

$product->setAddonValue(new StringType('codeIsbn'), new StringType(xtc_db_prepare_input($_POST['code_isbn'])));
$product->setAddonValue(new StringType('codeUpc'), new StringType(xtc_db_prepare_input($_POST['code_upc'])));
$product->setAddonValue(new StringType('codeMpn'), new StringType(xtc_db_prepare_input($_POST['code_mpn'])));
$product->setAddonValue(new StringType('codeJan'), new StringType(xtc_db_prepare_input($_POST['code_jan'])));
$product->setAddonValue(new StringType('brandName'), new StringType(xtc_db_prepare_input($_POST['brand_name'])));
$product->setAddonValue(new StringType('googleExportAvailabilityId'), new StringType(xtc_db_prepare_input($_POST['google_export_availability_id'] ?: '0')));
$product->setAddonValue(new StringType('googleExportConditionId'), new StringType(xtc_db_prepare_input($_POST['google_export_condition_id'] ?: '1')));
$product->setAddonValue(new StringType('gender'), new StringType(xtc_db_prepare_input($_POST['gender'])));
$product->setAddonValue(new StringType('ageGroup'), new StringType(xtc_db_prepare_input($_POST['age_group'])));
$product->setAddonValue(new StringType('expirationDate'), new StringType(xtc_db_prepare_input($expirationDate)));
$product->setAddonValue(new StringType('identifierExists'), new StringType($identifierExists));

// URL rewrites
$urlRewriteContentType = new NonEmptyStringType('product');
$urlRewriteContentId   = new IdType($productId);
$product->setUrlRewrites(MainFactory::create('UrlRewriteCollection', array()));
foreach($_POST['url_rewrites'] as $language_id => $url_rewrite)
{
	if($url_rewrite === '')
	{
		continue;
	}
	
	$languageId      = new IdType($language_id);
	$languageCode    = $languageProvider->getCodeById($languageId);
	$rewriteUrl      = new NonEmptyStringType($url_rewrite);
	$targetUrlString = 'product_info.php?products_id=' . $urlRewriteContentId->asInt() . '&language='
	                   . strtolower($languageCode->asString());
	$targetUrl       = new NonEmptyStringType($targetUrlString);
	
	$urlRewrite = MainFactory::create('UrlRewrite', $urlRewriteContentType, $urlRewriteContentId, $languageId,
	                                  $rewriteUrl, $targetUrl);
	
	$product->setUrlRewrite($urlRewrite, $languageCode);
}

// Linked categories
$categories = array_key_exists('categories', $_POST) ? $_POST['categories'] : array($GLOBALS['current_category_id']);
if(isOptionChecked('products_startpage')->asBool())
{
	$categories[] = 0;
}
$categories = array_unique($categories);
$productWriteService->deleteProductLinks(new IdType((int)$productId));
foreach($categories as $category)
{
	if($category != -1)
	{
		$productWriteService->linkProduct(new IdType((int)$productId), new IdType((int)$category));
	}
}

// Additional fields
require DIR_FS_ADMIN . 'includes/modules/set_additional_field_data.inc.php';

// START: Slider
$productSliderId = (int)($_POST['product_slider'] ?? 0);
/** @var SliderWriteServiceInterface $sliderWriteService */
$sliderWriteService = StaticGXCoreLoader::getService('SliderWrite');
empty($productSliderId)
    ? $sliderWriteService->deleteSliderAssignmentByProductId(new IdType((int)$productId))
    : $sliderWriteService->saveSliderAssignmentForProductId(new IdType($productSliderId),
                                                            new IdType((int)$productId));

// Images
require DIR_FS_ADMIN . 'includes/modules/set_product_image_data.inc.php';


$coo_seo_boost = MainFactory::create_object('GMSEOBoost', [], true);
$coo_seo_boost->repair('products', (int)$productId);

$coo_categories_index = MainFactory::create_object('CategoriesIndex');
$coo_categories_index->build_categories_index($productId);

// BEGIN Hermes
if(isset($_POST['hermes_minpclass']))
{
    $dbConnection = LegacyDependencyContainer::getInstance()->get(Connection::class);
    $pclassQuery = "REPLACE INTO `products_hermesoptions` SET `products_id` = :products_id, `min_pclass` = :min_pclass";
    $statement = $dbConnection->prepare($pclassQuery);
    $statement->bindValue(':products_id', (int)$productId);
    $statement->bindValue(':min_pclass', $_POST['hermes_minpclass']);
    $statement->execute();
}
// END Hermes

// BOF Google
// delete google category from products
if(isset($_POST['delete_list']) && count($_POST['delete_list']) > 0)
{
	$coo_taxonomy_control = MainFactory::create_object('GoogleTaxonomyViewAjaxHandler');
	$coo_taxonomy_control->set_data('action', 'delete_products_google_category');
	$coo_taxonomy_control->set_data('POST', $_POST);
	if(empty($coo_taxonomy_control->v_data_array['POST']['products_id']))
	{
		$coo_taxonomy_control->v_data_array['POST']['products_id'] = (int)$productId;
	}
	$coo_taxonomy_control->proceed();
}

// add google category to a product
if(isset($_POST['category_list']) && count($_POST['category_list']) > 0)
{
	$coo_taxonomy_control = MainFactory::create_object('GoogleTaxonomyViewAjaxHandler');
	$coo_taxonomy_control->set_data('action', 'add_products_google_category');
	$coo_taxonomy_control->set_data('POST', $_POST);
	if(empty($coo_taxonomy_control->v_data_array['POST']['products_id']))
	{
		$coo_taxonomy_control->v_data_array['POST']['products_id'] = (int)$productId;
	}
	$coo_taxonomy_control->proceed();
}
// EOF Google

// Here we go, lets write Group prices into db
// start
$i = 0;
$group_data = array();
$group_query = xtc_db_query("SELECT customers_status_id
										FROM " . TABLE_CUSTOMERS_STATUS . "
										WHERE
											language_id = '" . (int)($_SESSION['languages_id'] ?? null) . "' AND
											customers_status_id != '0'");
while($group_values = xtc_db_fetch_array($group_query))
{
	// load data into array
	$i ++;
	$group_data[$i] = array('STATUS_ID' => $group_values['customers_status_id']);
}
for($col = 0, $n = sizeof($group_data); $col < $n + 1; $col ++)
{
	if(($group_data[$col]['STATUS_ID'] ?? null) != '')
	{
		$personal_price = xtc_db_prepare_input($_POST['products_price_' . $group_data[$col]['STATUS_ID']]);
		$personal_price = str_replace(',','.',$personal_price);
		if($personal_price == '' || $personal_price == '0.0000')
		{
			$personal_price = '0.00';
		}
		else
		{
			if(PRICE_IS_BRUTTO == 'true')
			{
				$personal_price = ($personal_price / (xtc_get_tax_rate($_POST['products_tax_class_id']) + 100) * 100);
			}
			$personal_price = xtc_round($personal_price, PRICE_PRECISION);
		}
		
		if($_GET['action'] === 'insert_product')
		{
			xtc_db_perform('personal_offers_by_customers_status_' . $group_data[$col]['STATUS_ID'], array(), 'delete', 'products_id = \'' . (int)$productId . '\'and quantity = \'1\'');
			
			$insert_array = array('personal_offer' => $personal_price,
			                      'quantity' => '1',
			                      'products_id' => $productId);
			xtc_db_perform("personal_offers_by_customers_status_" . $group_data[$col]['STATUS_ID'], $insert_array);
		}
		else
		{
			
			xtc_db_perform('personal_offers_by_customers_status_' . $group_data[$col]['STATUS_ID'], array('personal_offer' => $personal_price), 'update', 'products_id = \'' . (int)$productId . '\'and quantity = \'1\'');
		}
	}
}
// end
// ok, lets check write new staffelpreis into db (if there is one)
$i = 0;
$group_query = xtc_db_query("SELECT customers_status_id
										FROM " . TABLE_CUSTOMERS_STATUS . "
										WHERE
											language_id = '" . (int)($_SESSION['languages_id'] ?? null) . "' AND
											customers_status_id != '0'");
while($group_values = xtc_db_fetch_array($group_query))
{
	// load data into array
	$i ++;
	$group_data[$i] = array('STATUS_ID' => $group_values['customers_status_id']);
}
for($col = 0, $n = sizeof($group_data); $col < $n + 1; $col ++)
{
	if(($group_data[$col]['STATUS_ID'] ?? null) != '')
	{
		// delete
		if(isset($_POST['delete_products_quantity_staffel_' . $group_data[$col]['STATUS_ID']]) && is_array($_POST['delete_products_quantity_staffel_' . $group_data[$col]['STATUS_ID']]))
		{
			foreach($_POST['delete_products_quantity_staffel_' . $group_data[$col]['STATUS_ID']] as $t_quantity)
			{
				xtc_db_perform('personal_offers_by_customers_status_' . $group_data[$col]['STATUS_ID'], array(), 'delete', 'products_id = \'' . (int)$productId . '\'and quantity = \'' . (double)$t_quantity . '\'');
			}
		}
		
		// insert/update
		if(isset($_POST['products_quantity_staffel_' . $group_data[$col]['STATUS_ID']]) && is_array($_POST['products_quantity_staffel_' . $group_data[$col]['STATUS_ID']]))
		{
			foreach($_POST['products_quantity_staffel_' . $group_data[$col]['STATUS_ID']] as $t_key => $t_quantity)
			{
				$c_quantity = (double)$t_quantity;
				$c_personal_offer = (double)($_POST['products_price_staffel_' . $group_data[$col]['STATUS_ID']][$t_key]);
				if(PRICE_IS_BRUTTO == 'true')
				{
					$c_personal_offer = ($c_personal_offer / (xtc_get_tax_rate($_POST['products_tax_class_id'] ?? null) + 100) * 100);
				}
				$c_personal_offer = xtc_round($c_personal_offer, PRICE_PRECISION);
				
				if($c_quantity > 0 && $c_quantity != 1)
				{
					$check_query = xtc_db_query("SELECT quantity
															FROM personal_offers_by_customers_status_" . $group_data[$col]['STATUS_ID'] . "
															WHERE
																products_id = '" . $productId . "' AND
																quantity    = '" . $c_quantity . "'");
					// dont insert if same qty!
					if(xtc_db_num_rows($check_query) == 0)
					{
						$insert_array = array('price_id' => '',
						                      'products_id' => (int)$productId,
						                      'quantity' => $c_quantity,
						                      'personal_offer' => $c_personal_offer);
						
						xtc_db_perform('personal_offers_by_customers_status_' . $group_data[$col]['STATUS_ID'], $insert_array);
					}
					else
					{
						xtc_db_perform('personal_offers_by_customers_status_' . $group_data[$col]['STATUS_ID'], array('personal_offer' => $c_personal_offer), 'update', 'products_id = \'' . (int)$productId . '\'and quantity = \'' . $c_quantity . '\'');
					}
				}
			}
		}
	}
}

//TODO: Destroy!
$customers_statuses_array = xtc_get_customers_statuses();

$permission = array();

foreach($customers_statuses_array AS $t_gm_key => $t_gm_value)
{
	if(isset($t_gm_value['id']))
	{
		$permission[$t_gm_value['id']] = 0;
	}
}

if(isset($_POST['groups']))
{
	foreach($_POST['groups'] AS $dummy => $b)
	{
		$permission[$b] = 1;
	}
}
// build array
if(($permission['all'] ?? null) == 1)
{
	$permission = array();
	reset($customers_statuses_array);
	
	foreach($customers_statuses_array AS $t_gm_key => $t_gm_value)
	{
		if(isset($t_gm_value['id']))
		{
			$permission[$t_gm_value['id']] = 1;
		}
	}
}

$permission_array = array();

reset($customers_statuses_array);
foreach($customers_statuses_array AS $t_gm_key => $t_gm_value)
{
	if(isset($t_gm_value['id']))
	{
		$permission_array = array_merge($permission_array, array('group_permission_' . $t_gm_value['id'] => $permission[$t_gm_value['id']]));
	}
}

xtc_db_perform(TABLE_PRODUCTS, $permission_array, 'update', 'products_id = ' . (int)$productId);