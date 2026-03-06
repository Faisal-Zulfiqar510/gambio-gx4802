<?php
/* --------------------------------------------------------------
   gm_sitemap_creator.php 2017-05-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------
*/
require_once 'includes/application_top.php';
require_once DIR_FS_INC . 'xtc_category_link.inc.php';
require_once DIR_FS_INC . 'xtc_product_link.inc.php';
require_once DIR_FS_INC . 'xtc_cleanName.inc.php';
require_once DIR_FS_CATALOG . 'gm/inc/gm_xtc_href_link.inc.php';
require_once DIR_FS_ADMIN . 'includes/gm/classes/GMSitemapXML.php';

$_SESSION['coo_page_token']->is_valid($_REQUEST['page_token']);
$sitemap = new GMSitemapXML();
$sitemap->setExportUrlOnlyOnce(true);
$dataCache = DataCache::get_instance(); 


switch($_GET['action']) 
{	
	case 'prepare_categories':
		$categories = $sitemap->prepare();
		if($categories === false)
		{
			echo json_encode(['repeat' => true]);
		}
		else 
		{
			$dataCache->set_data('sitemap_categories', $categories, true);
			echo json_encode(['repeat' => false]);
		}
		break;

	case 'create_sitemap':
		echo $sitemap->generate();	
		break; 

	case 'publish_all':
		xtc_db_query('UPDATE `categories` SET gm_sitemap_entry = 1');
		xtc_db_query('UPDATE `products` SET gm_sitemap_entry = 1');
		
		echo TITLE_SITEMAP_PUBLISH_ALL_SUCCESS;
		break;
}