<?php
/* --------------------------------------------------------------
   column_left.php 2020-09-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.		
   --------------------------------------------------------------

   based on:
   (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
   (c) 2002-2003 osCommerce(column_left.php,v 1.15 2002/01/11); www.oscommerce.com
   (c) 2003	 nextcommerce (column_left.php,v 1.25 2003/08/19); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: column_left.php 1231 2005-09-21 13:05:36Z mz $)

   Released under the GNU General Public License
   --------------------------------------------------------------*/

// Get customer's admin menu.
$coo_view = MainFactory::create_object('AdminMenuContentView');
$coo_view->setCustomerId($_SESSION['customer_id']);
$t_html = $coo_view->get_html();

// Set manually the width because it is required by the collapse_left_menu.js module.
$userConfiguration = StaticGXCoreLoader::getService('UserConfiguration');
$userId = new IdType((int)$_SESSION['customer_id']);
$menuState = $userConfiguration->getUserConfiguration($userId, 'menuVisibility');

echo '<div class="main-left-menu" data-gx-compatibility="main_left_menu" data-init-state="' . $menuState . '" style="width:200px">';
echo $t_html;
echo '</div>';
