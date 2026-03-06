<?php
/* --------------------------------------------------------------
   GoogleAdwordsAdminLayoutHttpControllerResponse.inc.php 2017-11-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAdwordsAdminLayoutHttpControllerResponse
 *
 * Includes the footer JS extender that indicates the Google Adwords connection status.
 */
class GoogleAdwordsAdminLayoutHttpControllerResponse extends GoogleAdwordsAdminLayoutHttpControllerResponse_parent
{
    /**
     * Adds the footer JS extender script into the page.
     *
     * Important: We overload the "_setInitialMessages" method in order to add the required JS file, cause
     * this method is executed after the "dynamic_script_assets" content data are set (the timing suits for this task).
     */
    protected function _setInitialMessages()
    {
        parent::_setInitialMessages();
        
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
        
        $contentData = $this->contentView->get_content_array();
        
        $scripts = $contentData['dynamic_script_assets'] . PHP_EOL . '<script src="' . $src . '" ' . $connected . ' '
                   . $text . '></script>';
        $this->contentView->set_content_data('dynamic_script_assets', $scripts);
    }
}