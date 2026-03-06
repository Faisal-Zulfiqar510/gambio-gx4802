<?php
/* --------------------------------------------------------------
   gm_miscellaneous.php 2022-07-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

   based on:
   (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
   (c) 2002-2003 osCommerce(configuration.php,v 1.40 2002/12/29); www.oscommerce.com
   (c) 2003	 nextcommerce (configuration.php,v 1.16 2003/08/19); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: configuration.php 1125 2005-07-28 09:59:44Z novalis $)

   Released under the GNU General Public License
   --------------------------------------------------------------*/

use Gambio\ProductImageList\Interfaces\ProductImageListReadServiceInterface;

require('includes/application_top.php');

  $t_page_token = $_SESSION['coo_page_token']->generate_token();
  $coo_text_manager = MainFactory::create_object('LanguageTextManager', array('countries', $_SESSION['languages_id']), true);

	function gm_update_prd_table($col, $value) {

		$gm_query = xtc_db_query("
									UPDATE
										products
									SET " .
										$col . " = '" . $value . "'
								");

		return;
	}

	if(isset($_POST['go_images']) && !empty($_POST['delete_images']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			if($gm_handle = opendir(DIR_FS_CATALOG_ORIGINAL_IMAGES))
			{
				$gm_deleted_images = 0;
				$gm_images_count   = 0;
				while(false !== ($gm_file = readdir($gm_handle)))
				{
					if(is_file(DIR_FS_CATALOG_ORIGINAL_IMAGES . $gm_file)
					   && $gm_file != '.'
					   && $gm_file != '..'
					   && $gm_file != 'index.html')
					{
						if(@unlink(DIR_FS_CATALOG_ORIGINAL_IMAGES . $gm_file))
						{
							$gm_deleted_images++;
							$gm_images_count++;
						}
						else
						{
							$gm_images_count++;
						}
					}
				}
				closedir($gm_handle);
			}
		}
	}

	elseif(isset($_POST['go_images2']) && !empty($_POST['delete_unused_images']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			// get all used images from db
			$usedImagesQuery   = 'SELECT p.products_image FROM products p
								UNION 
								SELECT pi.image_name FROM products_images pi';
			$usedImagesResults = xtc_db_query($usedImagesQuery);
			$usedImages        = [];
			while($row = xtc_db_fetch_array($usedImagesResults))
			{
				$usedImages[] = $row['products_image'];
			}
			
			// get all used images in a product image list
			/** @var ProductImageListReadServiceInterface $imageListService */
            $imageListService = StaticGXCoreLoader::getService('ProductImageListRead');
            
            foreach ($imageListService->getImageLists() as $imageList) {
    
                foreach ($imageList as $image) {
    
                    $usedImages[] = basename($image->localFilePath()->value());
            	}
            }
            
            $usedImages = array_unique($usedImages);
            
			// delete images
			$gm_deleted_images = 0;
			$gm_images_count   = 0;
			$imageDir          = [
				DIR_FS_CATALOG_ORIGINAL_IMAGES,
				DIR_FS_CATALOG_THUMBNAIL_IMAGES,
				DIR_FS_CATALOG_POPUP_IMAGES,
				DIR_FS_CATALOG_INFO_IMAGES,
				DIR_FS_CATALOG . DIR_WS_IMAGES . 'product_images/gallery_images/'
			];
			foreach($imageDir as $dir)
			{
				if($gm_handle = opendir($dir))
				{
					while(false !== ($gm_file = readdir($gm_handle)))
					{
						if(is_file($dir . $gm_file)
						   && $gm_file != '.'
						   && $gm_file != '..'
						   && $gm_file != 'index.html'
						   && !in_array($gm_file, $usedImages))
						{
							if(@unlink($dir . $gm_file))
							{
								$gm_deleted_images++;
								$gm_images_count++;
							}
							else
							{
								$gm_images_count++;
							}
						}
					}
					closedir($gm_handle);
				}
			}
		}
	}
	
	elseif(isset($_POST['go_cat_stock']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			if($_POST['show_cat_stock'] == 1) xtc_db_query("UPDATE categories SET gm_show_qty_info = 1");
			else xtc_db_query("UPDATE categories SET gm_show_qty_info = 0");

			$success = GM_CAT_STOCK_SUCCESS;
		}
	}

	elseif(isset($_POST['go_product_stock']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			if($_POST['show_product_stock'] == 1) xtc_db_query("UPDATE products SET gm_show_qty_info = 1");
			else xtc_db_query("UPDATE products SET gm_show_qty_info = 0");

			$success = GM_PRODUCT_STOCK_SUCCESS;
		}
	}

	elseif(isset($_POST['go_save']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			if(!empty($_POST['tell_a_friend']))
			{
				gm_set_conf('GM_TELL_A_FRIEND', 'true');
			}
			else
			{
				gm_set_conf('GM_TELL_A_FRIEND', 'false');
			}
			if(!empty($_POST['tax_info_tax_free']))
			{
				gm_set_conf('TAX_INFO_TAX_FREE', 'true');
			}
			else
			{
				gm_set_conf('TAX_INFO_TAX_FREE', 'false');
			}
			if(!empty($_POST['show_attr_stock']))
			{
				gm_set_conf('GM_SHOW_ATTRIBUTES_STOCK', 1);
			}
			else
			{
				gm_set_conf('GM_SHOW_ATTRIBUTES_STOCK', 0);
			}
			if(!empty($_POST['hide_attr_out_of_stock']))
			{
				gm_set_conf('GM_HIDE_ATTR_OUT_OF_STOCK', 1);
			}
			else
			{
				gm_set_conf('GM_HIDE_ATTR_OUT_OF_STOCK', 0);
			}
			if(!empty($_POST['set_products_inactive']))
			{
				gm_set_conf('GM_SET_OUT_OF_STOCK_PRODUCTS_INACTIVE', 1);
			}
			else
			{
				gm_set_conf('GM_SET_OUT_OF_STOCK_PRODUCTS_INACTIVE', 0);
			}
			if(!empty($_POST['truncate_products_name']))
			{
				gm_set_conf('TRUNCATE_PRODUCTS_NAME', (int)$_POST['truncate_products_name']);
			}
			if(!empty($_POST['truncate_products_name_history']))
			{
				gm_set_conf('TRUNCATE_PRODUCTS_HISTORY', (int)$_POST['truncate_products_name_history']);
			}
			if(!empty($_POST['truncate_flyover']))
			{
				gm_set_conf('TRUNCATE_FLYOVER', (int)$_POST['truncate_flyover']);
			}
			if(!empty($_POST['truncate_flyover_text']))
			{
				gm_set_conf('TRUNCATE_FLYOVER_TEXT', (int)$_POST['truncate_flyover_text']);
			}
			if(!empty($_POST['GM_ORDER_STATUS_CANCEL_ID']))
			{
				gm_set_conf('GM_ORDER_STATUS_CANCEL_ID', (int)$_POST['GM_ORDER_STATUS_CANCEL_ID']);
			}

			if(isset($_POST['SHOW_OLD_SPECIAL_PRICE'])) gm_set_conf('SHOW_OLD_SPECIAL_PRICE', 1);
			else gm_set_conf('SHOW_OLD_SPECIAL_PRICE', 0);

			if(isset($_POST['SHOW_OLD_DISCOUNT_PRICE'])) gm_set_conf('SHOW_OLD_DISCOUNT_PRICE', 1);
			else gm_set_conf('SHOW_OLD_DISCOUNT_PRICE', 0);

			if(isset($_POST['SHOW_OLD_GROUP_PRICE'])) gm_set_conf('SHOW_OLD_GROUP_PRICE', 1);
			else gm_set_conf('SHOW_OLD_GROUP_PRICE', 0);
			
			if(isset($_POST['GRADUATED_ASSIGN'])) gm_set_conf('GRADUATED_ASSIGN', 1);
			else gm_set_conf('GRADUATED_ASSIGN', 0);
			
			if(isset($_POST['ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING'])) gm_set_conf('ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING', 'true');
			else gm_set_conf('ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING', 'false');
			
			if(isset($_POST['PRODUCT_REVIEW_NAME'])) gm_set_conf('PRODUCT_REVIEW_NAME', $_POST['PRODUCT_REVIEW_NAME']);
			else gm_set_conf('PRODUCT_REVIEW_NAME', 'short_nothing');

			isset($_POST['MANUAL_ORDER_PAYMENT']) ? gm_set_conf('MANUAL_ORDER_PAYMENT', $_POST['MANUAL_ORDER_PAYMENT']) : gm_set_conf('MANUAL_ORDER_PAYMENT', 'cod');
		}

	}

	elseif(isset($_POST['go_home']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			if($_POST['GM_CHECK_PRIVACY_CALLBACK']	== 1)				{	gm_set_conf('GM_CHECK_PRIVACY_CALLBACK',				1);		} else { gm_set_conf('GM_CHECK_PRIVACY_CALLBACK',				0);	}
			if($_POST['GM_CHECK_PRIVACY_CONTACT']	== 1)				{	gm_set_conf('GM_CHECK_PRIVACY_CONTACT',					1);		} else { gm_set_conf('GM_CHECK_PRIVACY_CONTACT',				0);	}
			if($_POST['GM_CHECK_PRIVACY_TELL_A_FRIEND']	== 1)			{	gm_set_conf('GM_CHECK_PRIVACY_TELL_A_FRIEND',			1);		} else { gm_set_conf('GM_CHECK_PRIVACY_TELL_A_FRIEND',			0);	}
			if($_POST['GM_CHECK_PRIVACY_FOUND_CHEAPER']	== 1)			{	gm_set_conf('GM_CHECK_PRIVACY_FOUND_CHEAPER',			1);		} else { gm_set_conf('GM_CHECK_PRIVACY_FOUND_CHEAPER',			0);	}
			if($_POST['GM_CHECK_PRIVACY_REVIEWS']	== 1)				{	gm_set_conf('GM_CHECK_PRIVACY_REVIEWS',					1);		} else { gm_set_conf('GM_CHECK_PRIVACY_REVIEWS',				0);	}
			if($_POST['GM_CHECK_PRIVACY_ACCOUNT_CONTACT']	== 1)		{	gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_CONTACT',			1);		} else { gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_CONTACT',		0);	}
			if($_POST['GM_CHECK_PRIVACY_ACCOUNT_ADDRESS_BOOK']	== 1)	{	gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_ADDRESS_BOOK',	1);		} else { gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_ADDRESS_BOOK',	0);	}
			if($_POST['GM_CHECK_PRIVACY_ACCOUNT_NEWSLETTER']	== 1)	{	gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_NEWSLETTER',		1);		} else { gm_set_conf('GM_CHECK_PRIVACY_ACCOUNT_NEWSLETTER',		0);	}
			if($_POST['GM_CHECK_PRIVACY_CHECKOUT_SHIPPING']	== 1)		{	gm_set_conf('GM_CHECK_PRIVACY_CHECKOUT_SHIPPING',		1);		} else { gm_set_conf('GM_CHECK_PRIVACY_CHECKOUT_SHIPPING',		0);	}
			if($_POST['GM_CHECK_PRIVACY_CHECKOUT_PAYMENT']	== 1)		{	gm_set_conf('GM_CHECK_PRIVACY_CHECKOUT_PAYMENT',		1);		} else { gm_set_conf('GM_CHECK_PRIVACY_CHECKOUT_PAYMENT',		0);	}

			if($_POST['GM_WITHDRAWAL_CONTENT_ID'])			  {		gm_set_conf('GM_WITHDRAWAL_CONTENT_ID',			$_POST['GM_WITHDRAWAL_CONTENT_ID']);}
			if($_POST['GM_SHOW_PRIVACY_REGISTRATION']	== 1) {		gm_set_conf('GM_SHOW_PRIVACY_REGISTRATION',		1);				} else { gm_set_conf('GM_SHOW_PRIVACY_REGISTRATION',	0);	}
			if($_POST['GM_CHECK_WITHDRAWAL']			== 1) {		gm_set_conf('GM_CHECK_WITHDRAWAL',				1);				} else { gm_set_conf('GM_CHECK_WITHDRAWAL',				0);	}
			if($_POST['GM_SHOW_WITHDRAWAL']				== 1) {		gm_set_conf('GM_SHOW_WITHDRAWAL',				1);				} else { gm_set_conf('GM_SHOW_WITHDRAWAL',				0);	}
			if($_POST['SHOW_ACCOUNT_WITHDRAWAL_LINK']	== 1) {		gm_set_conf('SHOW_ACCOUNT_WITHDRAWAL_LINK',		1);				} else { gm_set_conf('SHOW_ACCOUNT_WITHDRAWAL_LINK',	0);	}
			if($_POST['ATTACH_CONDITIONS_OF_USE_IN_ORDER_CONFIRMATION']	== 1) {		gm_set_conf('ATTACH_CONDITIONS_OF_USE_IN_ORDER_CONFIRMATION',		1);				} else { gm_set_conf('ATTACH_CONDITIONS_OF_USE_IN_ORDER_CONFIRMATION',	0);	}
			if($_POST['ATTACH_WITHDRAWAL_INFO_IN_ORDER_CONFIRMATION']	== 1) {		gm_set_conf('ATTACH_WITHDRAWAL_INFO_IN_ORDER_CONFIRMATION',		1);				} else { gm_set_conf('ATTACH_WITHDRAWAL_INFO_IN_ORDER_CONFIRMATION',	0);	}
			if($_POST['ATTACH_WITHDRAWAL_FORM_IN_ORDER_CONFIRMATION']	== 1) {		gm_set_conf('ATTACH_WITHDRAWAL_FORM_IN_ORDER_CONFIRMATION',		1);				} else { gm_set_conf('ATTACH_WITHDRAWAL_FORM_IN_ORDER_CONFIRMATION',	0);	}

			if($_POST['CHECK_ABANDONMENT_OF_WITHDRAWL_DOWNLOAD']	== 1) {	gm_set_conf('CHECK_ABANDONMENT_OF_WITHDRAWL_DOWNLOAD',	1);	} else { gm_set_conf('CHECK_ABANDONMENT_OF_WITHDRAWL_DOWNLOAD',	0);	}
			if($_POST['CHECK_ABANDONMENT_OF_WITHDRAWL_SERVICE']	== 1) {		gm_set_conf('CHECK_ABANDONMENT_OF_WITHDRAWL_SERVICE',	1);	} else { gm_set_conf('CHECK_ABANDONMENT_OF_WITHDRAWL_SERVICE',	0);	}

			$coo_download_delay_with_abandomment = MainFactory::create_object('DownloadDelay');
			$coo_download_delay_without_abandomment = MainFactory::create_object('DownloadDelay');

			$coo_download_delay_with_abandomment->convert_days_to_seconds(
				$_POST['DOWNLOAD_DELAY_FOR_ABANDONMENT_OF_WITHDRAWL_RIGHT_DAYS'],
				$_POST['DOWNLOAD_DELAY_FOR_ABANDONMENT_OF_WITHDRAWL_RIGHT_HOURS'],
				$_POST['DOWNLOAD_DELAY_FOR_ABANDONMENT_OF_WITHDRAWL_RIGHT_MINUTES'],
				$_POST['DOWNLOAD_DELAY_FOR_ABANDONMENT_OF_WITHDRAWL_RIGHT_SECONDS']
			);

			$coo_download_delay_without_abandomment->convert_days_to_seconds(
				$_POST['DOWNLOAD_DELAY_WITHOUT_ABANDONMENT_OF_WITHDRAWL_RIGHT_DAYS'],
				$_POST['DOWNLOAD_DELAY_WITHOUT_ABANDONMENT_OF_WITHDRAWL_RIGHT_HOURS'],
				$_POST['DOWNLOAD_DELAY_WITHOUT_ABANDONMENT_OF_WITHDRAWL_RIGHT_MINUTES'],
				$_POST['DOWNLOAD_DELAY_WITHOUT_ABANDONMENT_OF_WITHDRAWL_RIGHT_SECONDS']
			);

			$t_download_delay_abandomment_seconds = $coo_download_delay_with_abandomment->get_total_delay_seconds();
			$t_download_delay_without_abandomment_seconds = $coo_download_delay_without_abandomment->get_total_delay_seconds();

			gm_set_conf('DOWNLOAD_DELAY_FOR_ABANDONMENT_OF_WITHDRAWL_RIGHT', $t_download_delay_abandomment_seconds);
			gm_set_conf('DOWNLOAD_DELAY_WITHOUT_ABANDONMENT_OF_WITHDRAWL_RIGHT', $t_download_delay_without_abandomment_seconds);

			if($_POST['WITHDRAWAL_WEBFORM_ACTIVE']		== 1) {		gm_set_conf('WITHDRAWAL_WEBFORM_ACTIVE',		1);				} else { gm_set_conf('WITHDRAWAL_WEBFORM_ACTIVE',		0);	}
			if($_POST['WITHDRAWAL_PDF_ACTIVE']			== 1) {		gm_set_conf('WITHDRAWAL_PDF_ACTIVE',			1);				} else { gm_set_conf('WITHDRAWAL_PDF_ACTIVE',			0);	}
			if($_POST['GM_SHOW_CONDITIONS']				== 1) {		gm_set_conf('GM_SHOW_CONDITIONS',				1);				} else { gm_set_conf('GM_SHOW_CONDITIONS',				0);	}
			if($_POST['GM_CHECK_CONDITIONS']			== 1) {		gm_set_conf('GM_CHECK_CONDITIONS',				1);				} else { gm_set_conf('GM_CHECK_CONDITIONS',				0);	}

			if($_POST['GM_SHOW_PRIVACY_CONFIRMATION']	 == 1){		gm_set_conf('GM_SHOW_PRIVACY_CONFIRMATION',		1);				} else { gm_set_conf('GM_SHOW_PRIVACY_CONFIRMATION',	0);	}
			if($_POST['GM_SHOW_CONDITIONS_CONFIRMATION'] == 1){		gm_set_conf('GM_SHOW_CONDITIONS_CONFIRMATION',	1);				} else { gm_set_conf('GM_SHOW_CONDITIONS_CONFIRMATION',	0);	}
			if($_POST['GM_SHOW_WITHDRAWAL_CONFIRMATION'] == 1){		gm_set_conf('GM_SHOW_WITHDRAWAL_CONFIRMATION',	1);				} else { gm_set_conf('GM_SHOW_WITHDRAWAL_CONFIRMATION',	0);	}
			if($_POST['GM_LOG_IP']	== 1)					  {		gm_set_conf('GM_LOG_IP',						1);				} else { gm_set_conf('GM_LOG_IP',						0);	}
	//		if($_POST['GM_SHOW_IP'] == 1)					  {		gm_set_conf('GM_SHOW_IP', 1);gm_set_conf('GM_CONFIRM_IP', 0);	}
	//		if($_POST['GM_SHOW_IP'] == 0)					  {		gm_set_conf('GM_SHOW_IP', 0);gm_set_conf('GM_CONFIRM_IP', 1);	}
			if($_POST['GM_CONFIRM_IP'] == 1)				  {		gm_set_conf('GM_CONFIRM_IP',					1);				} else { gm_set_conf('GM_CONFIRM_IP',					0);	}
			if($_POST['GM_LOG_IP_LOGIN'] == 1)				  {		gm_set_conf('GM_LOG_IP_LOGIN',					1);				} else { gm_set_conf('GM_LOG_IP_LOGIN',					0);	}

			if($_POST['DISPLAY_TAX'] == 1)					  {		gm_set_conf('DISPLAY_TAX',					1);					} else { gm_set_conf('DISPLAY_TAX',					0);	}
		}
	}

	elseif(isset($_POST['go_delete']))
	{
		if($_SESSION['coo_page_token']->is_valid($_POST['page_token']))
		{
			/*
			*	-> delete stats for products_viewed
			*/
			if(($_POST['products_viewed'] ?? null) == 1) {

				xtc_db_query("
								UPDATE
									products_description
								SET
									products_viewed = 0
								");
			}

			/*
			*	-> delete stats for products_purchased
			*/
			if(($_POST['products_purchased'] ?? null) == 1) {
				xtc_db_query("
								UPDATE
									products
								SET
									products_ordered = '0'
								");
			}

			/*
			*	-> delete stats for vistors
			*/
			if(($_POST['visitors'] ?? null) == 1) {

				xtc_db_query("
								DELETE
								FROM
									gm_counter_visits
								WHERE
									gm_counter_id != '1'
								");
			}

			/*
			*	-> delete stats for impressions
			*/
			if(($_POST['impressions'] ?? null) == 1) {
				xtc_db_query("
								DELETE
								FROM
									gm_counter_page
								");
				xtc_db_query("
								DELETE
								FROM
									gm_counter_page_history
								");
			}

			/*
			*	-> delete stats for user_info
			*/
			if(($_POST['user_info'] ?? null) == 1) {
				xtc_db_query("
								DELETE
								FROM
									gm_counter_info
								");
			}

			/*
			*	-> delete stats for intern_keywords
			*/
			if(($_POST['intern_keywords'] ?? null) == 1) {
				xtc_db_query("
								DELETE
								FROM
									gm_counter_intern_search
								");
			}

			/*
			*	-> delete stats for extern_keywords
			*/
			if(($_POST['extern_keywords'] ?? null) == 1) {
				xtc_db_query("
								DELETE
								FROM
									gm_counter_extern_search
								");
			}
		}
	}

if(!empty($_POST['go_save']))
{
	$messageStack->add(GM_MISCELLANEOUS_SUCCESS, 'success');
}

if(!empty($_POST['delete_images']))
{
	if($gm_deleted_images > 0)
	{
		$messageStack->add(GM_DELETE_IMAGES_MESSAGE_1 . $gm_deleted_images . GM_DELETE_IMAGES_MESSAGE_2 . $gm_images_count . GM_DELETE_IMAGES_MESSAGE_3, 'success');
	}

	if($gm_images_count-$gm_deleted_images > 0)
	{
		if($gm_images_count-$gm_deleted_images == 1)
		{
			$messageStack->add($gm_images_count-$gm_deleted_images . GM_DELETE_IMAGES_ADVICE_1, 'error');
		}
		else
		{
			$messageStack->add($gm_images_count-$gm_deleted_images . GM_DELETE_IMAGES_ADVICE_2, 'error');
		}
	}
}

if(!empty($_POST['delete_unused_images']))
{
	if($gm_deleted_images >= 0)
	{
		$messageStack->add(GM_DELETE_UNUSED_IMAGES_MESSAGE_1 . $gm_deleted_images . GM_DELETE_UNUSED_IMAGES_MESSAGE_2
		                   . $gm_images_count . GM_DELETE_UNUSED_IMAGES_MESSAGE_3, 'success');
	}
	
	if($gm_images_count-$gm_deleted_images > 0)
	{
		if($gm_images_count-$gm_deleted_images == 1)
		{
			$messageStack->add($gm_images_count-$gm_deleted_images . GM_DELETE_IMAGES_ADVICE_1, 'error');
		}
		else
		{
			$messageStack->add($gm_images_count-$gm_deleted_images . GM_DELETE_IMAGES_ADVICE_2, 'error');
		}
	}
}

if(isset($success) && !empty($success))
{
	$messageStack->add($success, 'success');
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html <?php echo HTML_PARAMS; ?>>
<head>
<meta http-equiv="x-ua-compatible" content="IE=edge">
<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $_SESSION['language_charset']; ?>">
<title><?php echo TITLE; ?></title>
<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/stylesheet.css">
<link rel="stylesheet" type="text/css" href="html/assets/styles/legacy/tooltip_plugin.css">
</head>
<body marginwidth="0" marginheight="0" topmargin="0" bottommargin="0" leftmargin="0" rightmargin="0" bgcolor="#FFFFFF" >
<!-- header //-->
<?php require(DIR_WS_INCLUDES . 'header.php'); ?>
<script type="text/javascript" src="html/assets/javascript/legacy/gm/tooltip_plugin.js"></script>
<!-- header_eof //-->

<!-- body //-->
<table border="0" width="100%" cellspacing="2" cellpadding="2" class="miscellaneous">
  <tr>
    <td class="columnLeft2" width="<?php echo BOX_WIDTH; ?>" valign="top">
			<table border="0" width="<?php echo BOX_WIDTH; ?>" cellspacing="1" cellpadding="1" class="columnLeft">
			<!-- left_navigation //-->
			<?php require(DIR_WS_INCLUDES . 'column_left.php'); ?>
			<!-- left_navigation_eof //-->
    	</table>
		</td>
		<!-- body_text //-->
    <td class="boxCenter" width="100%" valign="top">

	<div class="pageHeading" style="background-image:url(images/gm_icons/gambio.png)"><?php echo HEADING_TITLE; ?></div>
	<br />

	<span class="main">
		<table style="margin-bottom:5px" border="0" cellpadding="0" cellspacing="0" width="100%">
		 <tr class="dataTableHeadingRow">
			<td class="dataTableHeadingContentText" style="width:1%; padding-right:20px; white-space: nowrap">
				<?php
					echo (!isset($_GET['content']) || (isset($_GET['content']) && $_GET['content'] !== 'delete_images' && $_GET['content'] !== 'delete_unused_images')) ? '<a href="gm_miscellaneous.php?content=delete_images">' . GM_DELETE_IMAGES_TITLE . '</a>' : GM_DELETE_IMAGES_TITLE;
				?>
			</td>
			<td class="dataTableHeadingContentText" style="border-right: 0px">
				<?php
					echo (!isset($_GET['content']) || (isset($_GET['content']) && $_GET['content'] !== 'delete_stats')) ? '<a href="gm_miscellaneous.php?content=delete_stats">' . GM_TITLE_STATS . '</a>' : GM_TITLE_STATS;
				?>
			</td>
		 </tr>
		</table>

		<table border="0" cellpadding="0" cellspacing="0" width="100%" class="breakpoint-small multi-table-wrapper">
			<tr class="gx-container">
				<td style="font-size: 12px; text-align: justify">

					<?php if(empty($_GET['content']) || $_GET['content'] === 'miscellaneous'){ ?>

					<form name="gm_miscellaneous" action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content='.(isset($_GET['content']) ? $_GET['content'] : '')); ?>" method="post">
                        <table class="gx-configuration">
	                        <tr style="display: none">
		                        <td class="dataTableContent_gm configuration-label">
			                        &nbsp;
		                        </td>
		                        <td class="dataTableContent_gm">
			                        &nbsp;
		                        </td>
	                        </tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_TRUNCATE_PRODUCTS_NAME; ?>
								</td>
								<td class="dataTableContent_gm">
									<input class="pull-left" type="text" name="truncate_products_name" value="<?php echo gm_get_conf('TRUNCATE_PRODUCTS_NAME'); ?>" />
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_TRUNCATE_PRODUCTS_HISTORY; ?>
								</td>
								<td class="dataTableContent_gm">
									<input class="pull-left" type="text" name="truncate_products_name_history" value="<?php echo gm_get_conf('TRUNCATE_PRODUCTS_HISTORY'); ?>" />
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_ORDER_STATUS_CANCEL_ID; ?>
								</td>
								<td class="dataTableContent_gm">
									<input class="pull-left" type="text" name="GM_ORDER_STATUS_CANCEL_ID" value="<?php echo gm_get_conf('GM_ORDER_STATUS_CANCEL_ID'); ?>" />
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_TAX_FREE; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input class="pull-left" type="checkbox" name="tax_info_tax_free" value="1"<?php echo (gm_get_conf('TAX_INFO_TAX_FREE') == 'true' ? ' checked="checked"' : ''); ?> />
									</div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo SHOW_OLD_SPECIAL_PRICE_TEXT; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input class="pull-left" type="checkbox" name="SHOW_OLD_SPECIAL_PRICE" value="1"<?php echo (gm_get_conf('SHOW_OLD_SPECIAL_PRICE') == '1' ? ' checked="checked"' : ''); ?> />
									</div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo SHOW_OLD_DISCOUNT_PRICE_TEXT; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
                                        <input class="pull-left" type="checkbox" name="SHOW_OLD_DISCOUNT_PRICE" value="1"<?php echo (gm_get_conf('SHOW_OLD_DISCOUNT_PRICE') == '1' ? ' checked="checked"' : ''); ?> />
                                    </div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo SHOW_OLD_GROUP_PRICE_TEXT; ?>
								</td>
								<td class="dataTableContent_gm">
                                    <div class="gx-container" data-gx-widget="checkbox">
									    <input class="pull-left" type="checkbox" name="SHOW_OLD_GROUP_PRICE" value="1"<?php echo (gm_get_conf('SHOW_OLD_GROUP_PRICE') == '1' ? ' checked="checked"' : ''); ?> />
                                    </div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GRADUATED_ASSIGN; ?>
								</td>
								<td class="dataTableContent_gm"
								    data-gx-extension="visibility_switcher"
								    data-visibility_switcher-rows="div.gx-container"
								    data-visibility_switcher-selections="span.tooltip-icon">
                                    <div class="gx-container" data-gx-widget="checkbox">
									    <input class="pull-left" type="checkbox" name="GRADUATED_ASSIGN" value="1"<?php echo (gm_get_conf('GRADUATED_ASSIGN') !== '0' ? ' checked="checked"' : ''); ?> />
	                                    <span class="tooltip-icon" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
											<?php echo GRADUATED_ASSIGN_INFO ?>
										</span>
                                    </div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?= ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING_TEXT; ?>
								</td>
								<td class="dataTableContent_gm"
								    data-gx-extension="visibility_switcher"
								    data-visibility_switcher-rows="div.gx-container"
								    data-visibility_switcher-selections="span.tooltip-icon">
                                    <div class="gx-container" data-gx-widget="checkbox">
									    <input class="pull-left" type="checkbox" name="ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING" value="true" <?php echo (gm_get_conf('ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING') === 'true' ? ' checked="checked"' : ''); ?> />
	                                    <span class="tooltip-icon" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
											<?= ADMIN_FEED_ACCEPTED_SHOP_INFORMATION_DATA_PROCESSING_INFO ?>
										</span>
                                    </div>
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo PRODUCT_REVIEW_NAME; ?>
								</td>
								<td class="dataTableContent_gm">
                                    <div class="gx-container" data-gx-widget="checkbox">
	                                    <select name="PRODUCT_REVIEW_NAME">
		                                    <option value="short_nothing" <?php echo (gm_get_conf('PRODUCT_REVIEW_NAME') === 'short_nothing' ? 'selected>' : '>') . PRODUCT_REVIEW_NAME_OPTION_SHORT_NOTHING; ?></option>
		                                    <option value="short_firstname" <?php echo (gm_get_conf('PRODUCT_REVIEW_NAME') === 'short_firstname' ? 'selected>' : '>') . PRODUCT_REVIEW_NAME_OPTION_SHORT_FIRSTNAME; ?></option>
		                                    <option value="short_lastname" <?php echo (gm_get_conf('PRODUCT_REVIEW_NAME') === 'short_lastname' ? 'selected>' : '>') . PRODUCT_REVIEW_NAME_OPTION_SHORT_LASTNAME; ?></option>
	                                    </select>
                                    </div>
								</td>
							</tr>
                            <tr>
								<td class="dataTableContent_gm configuration-label">
                                    <?php echo MANUAL_ORDER_STANDARD_PAYMENT_NAME; ?>
                                </td>
                                <td class="dataTableContent_gm"
                                    data-gx-extension="visibility_switcher"
                                    data-visibility_switcher-rows="div.gx-container"
                                    data-visibility_switcher-selections="span.tooltip-icon">
                                    <div class="gx-container" data-gx-widget="checkbox">
                                        <select name="MANUAL_ORDER_PAYMENT">
	                                        <?php
                                            require_once 'includes/gm/classes/GMModulesManager.php';
                                            $moduleManager = new GMModuleManager_ORIGIN('payment');

                                            $activePaymentModule = gm_get_conf('MANUAL_ORDER_PAYMENT');

                                            $installedModules = str_replace(';;', ';', MODULE_PAYMENT_INSTALLED);
	                                        $installedModules = str_replace(".php", "", $installedModules);
	                                        $installedModules = explode(";", $installedModules);

	                                        asort($installedModules);

	                                        $hubPaymentModuleKey = array_search('gambio_hub', $installedModules);

	                                        if ($hubPaymentModuleKey !== false)
	                                        {
	                                            // Remove gambio_hub from the list
		                                        unset($installedModules[$hubPaymentModuleKey]);
	                                        }

	                                        if (count($installedModules) === 0)
	                                        {
	                                            // Fallback payment method
		                                        $installedModules[] = 'cod';
	                                        }

	                                        $options = [];

	                                        $activeOption = false;

	                                        foreach($installedModules as $module)
	                                        {
	                                            $paymentModuleData = $moduleManager->get_module_data_by_name($module);
                                                $options[] = ['value'    => $module,
                                                            'selected' => ($module === $activePaymentModule) ? 'selected="selected"' : '',
                                                            'title'    => $paymentModuleData['title']
                                                ];

                                                if($module === $activePaymentModule) {
                                                    $activeOption = true;
                                                }
	                                        }

                                            if(!$activeOption) {
                                                $options[] = [
                                                    'value' => '',
                                                    'selected' => 'selected="selected"',
                                                    'title' => ''
                                                ];
                                            }

                                            foreach($options as $option){
                                                echo "<option value=\"{$option['value']}\" {$option['selected']} >{$option['title']}</option>";
                                            }

	                                        ?>
                                        </select>
                                        <span class="tooltip-icon" data-gx-widget="tooltip_icon" data-tooltip_icon-type="info">
											<p><?php echo MANUAL_ORDER_STANDARD_PAYMENT_INFO ?></p>
										</span>
                                    </div>
								</td>
                            </tr>
						</table>
						<div class="grid bottom-save-bar-content">
							<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
							<input type="submit" class="button btn btn-primary pull-right" name="go_save" value="<?php echo BUTTON_SAVE;?>" />
						</div>
					</form>

					<?php } elseif($_GET['content'] == 'stock'){ ?>
					<form action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content='.$_GET['content']); ?>" method="post">
						<table class="gx-configuration">
							<tr style="display: none">
								<td class="dataTableContent_gm configuration-label">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_CAT_STOCK; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input type="checkbox" name="show_cat_stock" value="1" data-single_checkbox />
									</div>
								</td>
								<td class="dataTableContent_gm">
									<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
									<input type="submit" class="button btn btn-primary pull-right" name="go_cat_stock" value="<?php echo BUTTON_EXECUTE;?>" />
								</td>
							</tr>
						</table>
					</form>

					<form action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content='.$_GET['content']); ?>" method="post">
						<table class="gx-configuration">
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_PRODUCT_STOCK; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input type="checkbox" name="show_product_stock" value="1" data-single_checkbox />
									</div>
								</td>
								<td class="dataTableContent_gm">
									<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
									<input type="submit" class="button btn btn-primary pull-right" name="go_product_stock" value="<?php echo BUTTON_EXECUTE;?>" />
								</td>
							</tr>
						</table>
					</form>

					<?php } elseif($_GET['content'] === 'delete_images' || $_GET['content'] === 'delete_unused_images'){ ?>

					<form action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content='.$_GET['content']); ?>" method="post">
						<table class="gx-configuration">
							<tr style="display: none">
								<td class="dataTableContent_gm configuration-label">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_DELETE_IMAGES; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input type="checkbox" name="delete_images" value="1" data-single_checkbox />
									</div>
								</td>
								<td class="dataTableContent_gm">
									<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
									<input style="margin-left:1px" type="submit" class="button btn btn-primary pull-right" name="go_images" value="<?php echo BUTTON_DELETE;?>" />
								</td>
							</tr>
						</table>
					</form>
						
					<br />
					<form action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content=delete_unused_images'); ?>" method="post">
						<table class="gx-configuration">
							<tr style="display: none">
								<td class="dataTableContent_gm configuration-label">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
								<td class="dataTableContent_gm">
									&nbsp;
								</td>
							</tr>
							<tr>
								<td class="dataTableContent_gm configuration-label">
									<?php echo GM_DELETE_UNUSED_IMAGES; ?>
								</td>
								<td class="dataTableContent_gm">
									<div class="gx-container" data-gx-widget="checkbox">
										<input type="checkbox" name="delete_unused_images" value="1" data-single_checkbox />
									</div>
								</td>
								<td class="dataTableContent_gm">
									<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
									<input style="margin-left:1px" type="submit" class="button btn btn-primary pull-right" name="go_images2" value="<?php echo BUTTON_DELETE;?>" />
								</td>
							</tr>
						</table>
					</form>
					

					<?php } elseif($_GET['content'] == 'delete_stats'){ ?>

				<form action="<?php echo xtc_href_link('gm_miscellaneous.php', 'content='.$_GET['content']); ?>" method="post">
					<table class="gx-configuration" border="0" width="100%" cellspacing="0" cellpadding="2">
						<tr style="display: none">
							<td class="dataTableContent_gm configuration-label">
								&nbsp;
							</td>
							<td class="dataTableContent_gm">
								&nbsp;
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_PRODUCTS_VIEWED; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="products_viewed" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_PRODUCTS_PURCHASED; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="products_purchased" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_VISTORS; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="visitors" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_IMPRESSIONS; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="impressions" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_USER_INFO; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="user_info" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_INTERN_KEWORDS; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="intern_keywords" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
						<tr>
							<td class="dataTableContent_gm configuration-label">
								<?php echo TITLE_STAT_EXTERN_KEWORDS; ?>
							</td>
							<td class="dataTableContent_gm">
								<div class="gx-container" data-gx-widget="checkbox">
									<input type="checkbox" name="extern_keywords" value="1" data-single_checkbox />
								</div>
							</td>
						</tr>
					</table>
					<div class="grid bottom-save-bar-content">
						<?php echo xtc_draw_hidden_field('page_token', $t_page_token); ?>
						<input type="submit" class="button btn btn-primary pull-right" name="go_delete" value="<?php echo BUTTON_DELETE;?>" />
					</div>

					<!--</div><input type="submit" class="button btn btn-primary pull-right" name="go_delete" value="--><?php //echo BUTTON_DELETE;?><!--" />-->
					</form>
					<?php } ?>

				</td>
			</tr>
		</table>

	</span>

    </td>
<!-- body_text_eof //-->
  </tr>
</table>
<!-- body_eof //-->

<!-- footer //-->
<?php require(DIR_WS_INCLUDES . 'footer.php'); ?>
<!-- footer_eof //-->
<br />
</body>
</html>
<?php require(DIR_WS_INCLUDES . 'application_bottom.php'); ?>
