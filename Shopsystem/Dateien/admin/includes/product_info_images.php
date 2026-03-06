<?php
/*--------------------------------------------------------------
   product_info_images.php 2020-09-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------

   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: product_info_images.php 899 2005-04-29 02:40:57Z hhgag $)

   Released under the GNU General Public License
   --------------------------------------------------------------*/

// creating required sub directories
$parentDirectory = str_replace(basename($products_image_name), '', DIR_FS_CATALOG_INFO_IMAGES . $products_image_name);
if (!is_dir($parentDirectory) && !mkdir($parentDirectory, 0777, true) && !is_dir($parentDirectory)) {
    throw new \RuntimeException(sprintf('Directory "%s" was not created', $parentDirectory));
}

// BOF GM_IMAGE_LOG
$md5_before = '';
$filetime_before = '';
if(file_exists(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name)) {
	if(!empty($skip_existing_images))
	{
		return;
	}
	$md5_before			= md5_file(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name);
	$filetime_before	= filemtime(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name);
}
// EOF GM_IMAGE_LOG

$a = new image_manipulation(DIR_FS_CATALOG_ORIGINAL_IMAGES . $products_image_name,PRODUCT_IMAGE_INFO_WIDTH,PRODUCT_IMAGE_INFO_HEIGHT,DIR_FS_CATALOG_INFO_IMAGES . $products_image_name,IMAGE_QUALITY,'');
$a->create();

// BOF GM_IMAGE_LOG
$md5_after = '';
$filetime_after = '';
if(!empty($md5_before)) {
	$md5_after		= md5_file(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name);
	$filetime_after = filemtime(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name);
}

if(property_exists($a, 'image_error') && $a->image_error) {
	$image_error = true;
} elseif($filetime_before != $filetime_after && $md5_before == $md5_after) {
	$image_error = true;
}
// EOF GM_IMAGE_LOG

// BOF GM_MOD:		
@chmod(DIR_FS_CATALOG_INFO_IMAGES.$products_image_name, 0777);
