<?php
/* --------------------------------------------------------------
   GoogleAdwordsAdminMenuContentView.inc.php 2017-11-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAdwordsAdminMenuContentView
 */
class GoogleAdwordsAdminMenuContentView extends GoogleAdwordsAdminMenuContentView_parent
{
    /**
     * Adds footer JS extender script for Google Adwords connectivity state.
     */
    public function get_html()
    {
        $html = parent::get_html();
        
        $languageTextManager  = MainFactory::create('LanguageTextManager', 'admin_general', $_SESSION['languages_id']);
        $configurationStorage = new GoogleConfigurationStorage(StaticGXCoreLoader::getDatabaseQueryBuilder(),
                                                               GoogleConfigurationStorage::SCOPE_GENERAL);
        
        $connected   = $configurationStorage->get('connection-status') ? 'data-connected' : '';
        $translation = $connected ? $languageTextManager->get_text('TEXT_GOOGLE_ADWORDS_CONNECTED') : $languageTextManager->get_text('TEXT_GOOGLE_ADWORDS_DISCONNECTED');
        $text        = 'data-text="' . $translation . '"';
        
        $postfix = file_exists(DIR_FS_CATALOG . '.dev-environment') ? '' : '.min';
        $src     = DIR_WS_CATALOG
                   . 'GXModules/Gambio/GoogleOAuth/Build/Admin/Javascript/extenders/footer_google_adwords_state'
                   . $postfix . '.js';
        
        $html .= PHP_EOL . '<script src="' . $src . '" ' . $connected . ' ' . $text . ' data-legacy-mode></script>';
        
        return $html;
    }
}