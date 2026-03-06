<?php
/* --------------------------------------------------------------
   main_top_header.php 2020-09-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

include DIR_FS_CATALOG . 'release_info.php';

$userConfigurationService = StaticGXCoreLoader::getService('UserConfiguration');
$recentSearchArea         = isset($recentSearchArea) ? $recentSearchArea : $userConfigurationService->getUserConfiguration(new IdType($_SESSION['customer_id']),
                                                                                                                           'recent_search_area');
$languageTextManager = MainFactory::create('LanguageTextManager', 'admin_labels',
                                           $_SESSION['languages_id']);

$placeholderValue = $languageTextManager->get_text('admin_search_categories');

if($recentSearchArea) {
	$placeholderValue = $languageTextManager->get_text('admin_search_' . $recentSearchArea);
}

?>

<div class="remove-margin cursor-text top-header">
	
	<div class="logo-container">
		<a href="<?= (DIR_WS_CATALOG . 'admin/')?>" class="logo"> <img class="app-logo pull-left"
		                                                                               src="html/assets/images/gx-admin/gambio-admin-white-logo.svg"
		                                                                               alt="Gambio GX4" />
		</a>
	</div>
	
	<div class="search-container">
        <div class="search-wrapper">
            <!-- Admin Search -->
            <input
                type="text"
                name="admin_search"
                placeholder="<?php echo $placeholderValue; ?>"
                data-gx-extension="admin_search"
                data-admin_search-button="#search-in"
                data-admin_search-customer_id="<?php echo (int)$_SESSION['customer_id']; ?>"
                data-admin_search-recent-search-area="<?php echo $recentSearchArea; ?>"
            />

            <!-- Search Dropdown -->
            <ul class="searchable">
                <li class="search-item cursor-pointer" data-search-area="orders">
                    <span class="search-query-item"></span> <span class="search-query-description"></span>
                </li>
                <li class="search-item cursor-pointer" data-search-area="invoices">
                    <span class="search-query-item"></span> <span class="search-query-description"></span>
                </li>
                <li class="search-item cursor-pointer" data-search-area="customers">
                    <span class="search-query-item"></span> <span class="search-query-description"></span>
                </li>
	            <li class="search-item cursor-pointer" data-search-area="categories">
		            <span class="search-query-item"></span> <span class="search-query-description"></span>
	            </li>
	            <li class="search-item cursor-pointer" data-search-area="configurations">
		            <span class="search-query-item"></span> <span class="search-query-description"></span>
	            </li>
                <li class="search-item cursor-pointer" data-search-area="manual">
                    <span class="search-query-item"></span> <span class="search-query-description"></span>
                </li>
                <li class="search-item cursor-pointer" data-search-area="forum">
                    <span class="search-query-item"></span> <span class="search-query-description"></span>
                </li>
            </ul>
        </div>
	</div>
	
	<div class="action-container">
		<?php if(gm_get_conf('GM_SHOP_OFFLINE') === 'checked'
		         || (!empty($_POST['shop_offline'])
		             && $_POST['shop_offline'] === 'checked')
		): ?>
			<div class="offline-notice">
				<i class="fa fa-exclamation-triangle"></i> <a style="color: inherit; text-decoration: inherit;"
				                                              href="<?php echo xtc_href_link('gm_offline.php') ?>"><?php echo TEXT_SHOP_STATUS; ?></a>
			</div>
		<?php endif; ?>
		
		<ul class="header-actions pull-right">
			<li>
				<a href="admin.php?do=DirectHelpProxy/GoToManual"
				   title="<?php echo GM_TOP_MENU_MANUAL; ?>"
				   target="_blank">
					<i class="fa fa-question"></i> </a>
			</li>
			<li>
				<a href="admin.php?do=DirectHelpProxy/GoToForum" title="<?php echo GM_TOP_MENU_FORUM; ?>" target="_blank">
					<i class="fa fa-users"></i> </a>
			</li>
			<li>
				<a class="admin_info_box_button" href="#notifications" title="<?php echo GM_TOP_MENU_INFO_BOX; ?>"> <i
						class="fa fa-bullhorn"></i> <span class="notification-count hidden"></span> </a>
			</li>
			<li>
				<a href="<?php echo xtc_href_link('../index.php') ?>" title="<?php echo GM_TOP_MENU_SHOP; ?>">
					<i class="fa fa-shopping-cart"></i> </a>
			</li>
			<li>
				<a href="<?php echo xtc_href_link('../logoff.php') ?>"
				   title="<?php echo GM_TOP_MENU_LOGOUT . ' (' . htmlspecialchars($_SESSION['customer_first_name'])
				                     . ' ' . htmlspecialchars($_SESSION['customer_last_name']) . ')'; ?>">
					<i class="fa fa-power-off"></i> </a>
			</li>
		</ul>
	</div>

</div>
