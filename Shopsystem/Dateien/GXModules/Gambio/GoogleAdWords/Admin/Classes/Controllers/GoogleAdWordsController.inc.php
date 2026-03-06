<?php
/* --------------------------------------------------------------
   GoogleAdWordsController.inc.php 2017-11-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2017 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GoogleConfigurationStorage as Storage;
use GoogleAdsConversionTrackingConfigurationQuery as ConversionQuery;
use GuzzleHttp\Client;

/**
 * Class GoogleAdWordsController
 *
 * This controller displays the Google AdWords page.
 *
 * @category System
 * @package  AdminHttpViewControllers
 */
class GoogleAdWordsController extends AdminHttpViewController
{
    /**
     * @var NonEmptyStringType
     */
    protected $title;
    
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
     * @var GoogleConfigurationStorage
     */
    protected $configurationStorage;
    
    /**
     * @var AssetCollection
     */
    protected $assets;
    
    
    /**
     * Initialize the controller.
     */
    public function init()
    {
        $this->languageTextManager  = MainFactory::create('LanguageTextManager',
                                                          'google_adwords',
                                                          $_SESSION['languages_id']);
        $this->title                = new NonEmptyStringType($this->languageTextManager->get_text('page_title'));
        $this->jsBaseUrl            = '../GXModules/Gambio/GoogleAdWords/Build/Admin/Javascript';
        $this->stylesBaseUrl        = '../GXModules/Gambio/GoogleAdWords/Build/Admin/Styles';
        $this->templatesBaseUrl     = DIR_FS_CATALOG . 'GXModules/Gambio/GoogleAdWords/Admin/Html';
        $this->db                   = StaticGXCoreLoader::getDatabaseQueryBuilder();
        $this->configurationStorage = new Storage($this->db, Storage::SCOPE_GENERAL);
        
        $assetsArray = [
            MainFactory::create('Asset', $this->stylesBaseUrl . '/campaigns_overview.css'),
            MainFactory::create('Asset', 'google_adwords.lang.inc.php'),
        ];
        
        $this->assets = MainFactory::create('AssetCollection', $assetsArray);
    }
    
    
    /**
     * Displays the Google AdWords overview page.
     *
     * @return AdminLayoutHttpControllerResponse|bool
     */
    public function actionDefault()
    {
        $template = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl . '/campaigns_overview.html'));
        
        $accountConnectionData = $this->_accountConnectionData();
        
        $pageData = [
            'campaignsDateRanges' => $this->_campaignsDataRangeSelectionArray(),
            'pageToken'           => $_SESSION['coo_page_token']->generate_token(),
            'authSuccess'         => (string)$this->_getQueryParameter('success') === '1' ? : false,
            'show_account_form'   => $this->configurationStorage->get('connection-status') ? 'false' : 'true',
        ];
        
        $data = MainFactory::create('KeyValueCollection', array_merge($pageData, $accountConnectionData));
        
        $nav = [
            $this->languageTextManager->get_text('label_campaigns')           => '',
            $this->languageTextManager->get_text('label_conversion_tracking') => './admin.php?do=GoogleAdWords/conversionTracking'
        ];
        
        $navCollection = new ContentNavigationCollection($nav);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse',
                                   $this->title,
                                   $template,
                                   $data,
                                   $this->assets,
                                   $navCollection);
    }
    
    
    public function actionConversionTracking()
    {
        if (!$this->configurationStorage->get('connection-status')) {
            return MainFactory::create(RedirectHttpControllerResponse::class, './admin.php?do=GoogleAdWords');
        }
        $template = new ExistingFile(new NonEmptyStringType($this->templatesBaseUrl
                                                            . '/conversion_tracking_config.html'));
        
        $nav           = [
            $this->languageTextManager->get_text('label_campaigns')           => './admin.php?do=GoogleAdWords',
            $this->languageTextManager->get_text('label_conversion_tracking') => ''
        ];
        $navCollection = new ContentNavigationCollection($nav);
        
        $client    = new Client();
        $apiClient = MainFactory::create(GoogleServicesApiClient::class, $client, $this->configurationStorage);
        $query     = MainFactory::create(ConversionQuery::class,
                                         $this->configurationStorage,
                                         $this->languageTextManager,
                                         $apiClient);
        
        $error = $query->error();
        
        if ($error) {
            $data = [
                'error' => $error
            ];
            $data = new KeyValueCollection($data);
            
            return MainFactory::create('AdminLayoutHttpControllerResponse',
                                       $this->title,
                                       $template,
                                       $data,
                                       $this->assets,
                                       $navCollection);
        }
        
        $data = [
            'enabled'            => $query->enabled(),
            'conversionName'     => $query->conversionName(),
            'conversionId'       => $query->conversionId(),
            'conversionActionId' => $query->conversionActionId(),
            'conversionTrackers' => $query->conversionTrackers(),
            'error'              => null
        ];
        
        $data = new KeyValueCollection($data);
        
        return MainFactory::create('AdminLayoutHttpControllerResponse',
                                   $this->title,
                                   $template,
                                   $data,
                                   $this->assets,
                                   $navCollection);
    }
    
    
    public function actionUpdateConfiguration()
    {
        $command = new UpdateAdsConversionTrackingConfiguration($this->postDataArray);
        
        if (!$this->configurationStorage->get('connection-status')) {
            $_SESSION['ads_error'] = $this->languageTextManager->get_text('gx_google_connection_required',
                                                                          'google_general');
            
            return new RedirectHttpControllerResponse('./admin.php?do=GoogleAdWords/conversionTracking');
        }
        
        $this->configurationStorage->set('conversion-tracking-enabled', $command->enabled(), Storage::SCOPE_ADWORDS);
        $this->configurationStorage->set('conversion-name', $command->conversionName(), Storage::SCOPE_ADWORDS);
        $this->configurationStorage->set('conversion-id', $command->conversionId(), Storage::SCOPE_ADWORDS);
        $this->configurationStorage->set('conversion-action-id',
                                         $command->conversionActionId(),
                                         Storage::SCOPE_ADWORDS);
        
        return MainFactory::create(RedirectHttpControllerResponse::class,
                                   './admin.php?do=GoogleAdWords/conversionTracking');
    }
    
    
    private function _campaignsDataRangeSelectionArray()
    {
        return [
            'TODAY'               => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('TODAY')
            ],
            'YESTERDAY'           => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('YESTERDAY')
            ],
            'THIS_WEEK_SUN_TODAY' => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('THIS_WEEK_SUN_TODAY')
            ],
            'THIS_WEEK_MON_TODAY' => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('THIS_WEEK_MON_TODAY')
            ],
            'LAST_7_DAYS'         => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_7_DAYS')
            ],
            'LAST_WEEK_SUN_SAT'   => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_WEEK_SUN_SAT')
            ],
            'LAST_WEEK'           => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_WEEK')
            ],
            'LAST_BUSINESS_WEEK'  => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_BUSINESS_WEEK')
            ],
            'LAST_14_DAYS'        => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_14_DAYS')
            ],
            'THIS_MONTH'          => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('THIS_MONTH')
            ],
            'LAST_30_DAYS'        => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_30_DAYS')
            ],
            'LAST_MONTH'          => [
                'selected' => false,
                'value'    => $this->languageTextManager->get_text('LAST_MONTH')
            ],
            ''                    => [
                'selected' => true,
                'value'    => $this->languageTextManager->get_text('TOTAL_TIME')
            ]
        ];
    }
    
    
    private function _accountConnectionData()
    {
        return [
            'error' => (int)$this->_getQueryParameter('error')
        ];
    }
}