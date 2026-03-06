<?php
/* --------------------------------------------------------------
 GoogleOAuthController.inc.php 2017-12-20
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2017 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

class GoogleOAuthController extends AdminHttpViewController
{
    /**
     * @var string
     */
    protected $jsBaseUrl;
    
    /**
     * @var string
     */
    protected $stylesBaseUrl;
    
    /**
     * @var string
     */
    protected $templatesBaseUrl;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    /**
     * @var CI_DB_query_builder
     */
    protected $db;
    
    
    /**
     * Initialize the controller.
     */
    public function init()
    {
        $this->jsBaseUrl           = '../GXModules/Gambio/GoogleAdWords/Build/Admin/Javascript';
        $this->stylesBaseUrl       = '../GXModules/Gambio/GoogleAdWords/Build/Admin/Styles';
        $this->templatesBaseUrl    = DIR_FS_CATALOG . 'GXModules/Gambio/GoogleOAuth/Admin/Html';
        $this->languageTextManager = MainFactory::create('LanguageTextManager',
                                                         'google_adwords',
                                                         $_SESSION['languages_id']);
        $this->db                  = StaticGXCoreLoader::getDatabaseQueryBuilder();
    }
    
    
    public function actionDefault()
    {
        $title    = new NonEmptyStringType($this->languageTextManager->get_text('page_title'));
        $template = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl . '/connect_account.html'));
        
        $configurationStorage = new GoogleConfigurationStorage($this->db, GoogleConfigurationStorage::SCOPE_GENERAL);
        
        $data = MainFactory::create('KeyValueCollection',
                                    [
                                        'iFrameUrl' => $configurationStorage->get('app-url') . '#connect',
                                        'origin'    => HTTP_SERVER . DIR_WS_CATALOG,
                                        'error'     => (int)$this->_getQueryParameter('error'),
                                        'language'  => $_SESSION['language_code'],
                                        'version'   => $this->_getVersion(),
                                        'connected' => $configurationStorage->get('connection-status')
                                    ]);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse', $title, $template, $data);
    }
    
    
    public function actionReset()
    {
        $this->db->truncate('google_adwords_client_customers');
        $configurationStorage = new GoogleConfigurationStorage($this->db, GoogleConfigurationStorage::SCOPE_GENERAL);
        $configurationStorage->set('connection-status', false);
        $configurationStorage->set('refresh-token', '');
        
        return new RedirectHttpControllerResponse('./admin.php?do=GoogleOAuth');
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