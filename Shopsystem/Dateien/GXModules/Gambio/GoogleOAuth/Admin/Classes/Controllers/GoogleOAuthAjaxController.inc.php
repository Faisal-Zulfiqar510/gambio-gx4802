<?php
/* --------------------------------------------------------------
   GoogleOAuthAjaxController.inc.php 2018-05-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleOAuthAjaxController
 */
class GoogleOAuthAjaxController extends AdminHttpViewController
{
    /**
     * Provides data for the account connection modal.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionConnectionModal()
    {
        $configurationStorage = new GoogleConfigurationStorage(StaticGXCoreLoader::getDatabaseQueryBuilder(),
                                                               GoogleConfigurationStorage::SCOPE_GENERAL);
        
        $languageTextManager = MainFactory::create(LanguageTextManager::class);
        
        $data = [
            'modalTitle' => $languageTextManager->get_text('connect_account_page_title', 'google_adwords'),
            'connected'  => $configurationStorage->get('connection-status'),
            'iFrameUrl'  => $configurationStorage->get('app-url') . '#connect',
            'origin'     => HTTP_SERVER . DIR_WS_CATALOG,
            'language'   => $_SESSION['language_code'],
            'version'    => $this->_getVersion()
        ];
        
        return new JsonHttpControllerResponse($data);
    }
    
    
    /**
     * Returns the google oauth access token.
     *
     * @return JsonHttpControllerResponse
     */
    public function actionGetAccessToken()
    {
        $configurationStorage = new GoogleConfigurationStorage(StaticGXCoreLoader::getDatabaseQueryBuilder(),
                                                               GoogleConfigurationStorage::SCOPE_GENERAL);
        
        return MainFactory::create(JsonHttpControllerResponse::class,
                                   [
                                       'accessToken' => GoogleOAuthService::create($configurationStorage)
                                           ->getAccessToken(),
                                       'appUrl'      => $configurationStorage->get('app-url'),
                                       'lang'        => $_SESSION['language_code']
                                   ]);
    }
    
    
    private function _getVersion()
    {
        $path    = DIR_FS_CATALOG . 'version_info' . DIRECTORY_SEPARATOR . 'google_services-';
        $matches = glob($path . '*.php');
        
        if (count($matches) === 0) {
            // use 1.0.5 to determine for the api that the legacy flow should be used.
            return '1.0.5';
        }
        sort($matches);
        $latestVersionPath = array_pop($matches);
        
        return str_replace('.php', '', str_replace($path, '', $latestVersionPath));
    }
}