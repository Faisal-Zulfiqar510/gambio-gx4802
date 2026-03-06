<?php
/* --------------------------------------------------------------
   GoogleAnalyticsAdminController.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use \GoogleAnalyticsConfigurationOverviewQuery as GAConfigurations;
use \GoogleAnalyticsConfigurationServiceFactory as ServiceFactory;
use \GoogleAnalyticsChangeSettingsCommand as ChangeSettings;
use \GoogleAnalyticsTracking as TrackingOption;
use \GoogleAnalyticsImpressionType as ImpressionType;

/**
 * Class GoogleAnalyticsAdminController
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsAdminController extends AdminHttpViewController
{
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    /**
     * @var NonEmptyStringType
     */
    protected $title;
    
    /**
     * @var GoogleConfigurationStorage
     */
    protected $configStorage;
    
    
    /**
     * Initialization of google analytics admin controller.
     */
    protected function init()
    {
        $this->languageTextManager = MainFactory::create(LanguageTextManager::class);
        $this->title               = $this->languageTextManager->get_text('page_title', 'google_analytics');
        $this->configStorage       = new GoogleConfigurationStorage(StaticGXCoreLoader::getDatabaseQueryBuilder(),
                                                                    GoogleConfigurationStorage::SCOPE_GENERAL);
    }
    
    
    /**
     * Action method to display google analytics chart.
     *
     * @return AdminLayoutHttpControllerResponse|RedirectHttpControllerResponse
     */
    public function actionDefault()
    {
        if (!$this->configStorage->get('connection-status')) {
            return MainFactory::create('RedirectHttpControllerResponse',
                                       './admin.php?do=GoogleAnalyticsAdmin/configuration');
        }
        
        $template = $this->_template('google_analytics');
        
        return $this->_response($this->title, $template, null, null, $this->_contentNavigation());
    }
    
    
    /**
     * Action method to display the google analytics configuration page.
     *
     * @return AdminLayoutHttpControllerResponse
     */
    public function actionConfiguration()
    {
        $template = $this->_template('configurations');
        $data     = $this->_configurationData();
        $data     = array_merge($data,
                                [
                                    'oauthError' => (int)$this->_getQueryParameter('error')
                                ]);
        
        return $this->_response($this->title, $template, $data, null, $this->_contentNavigation('configurations'));
    }
    
    
    /**
     * Action method to update google analytics configurations.
     *
     * @return RedirectHttpControllerResponse
     */
    public function actionUpdateSettings()
    {
        $command = MainFactory::create(ChangeSettings::class, $this->_getPostDataCollection());
        $service = ServiceFactory::writeService();
        
        if (!$command->validate($this->languageTextManager)) {
            if (!$command->enableGoogleAnalytics()) {
                $service->disable();
            }
            
            return MainFactory::create(RedirectHttpControllerResponse::class,
                                       './admin.php?do=GoogleAnalyticsAdmin/configuration');
        }
        
        $this->_updateSettings($command, $service);
        
        return MainFactory::create(RedirectHttpControllerResponse::class,
                                   './admin.php?do=GoogleAnalyticsAdmin/configuration');
    }
    
    
    /**
     * Updates the google analytics configurations.
     *
     * @param GoogleAnalyticsChangeSettingsCommand     $command Command that provide new configuration values.
     *
     * @param GoogleAnalyticsConfigurationWriteService $service
     *
     * @return $this Same instance for chained method calls.
     */
    protected function _updateSettings(ChangeSettings $command, GoogleAnalyticsConfigurationWriteService $service)
    {
        $enableTrackingOptioningOption = static function (TrackingOption $type, $enable) use ($service) {
            $enable ? $service->enableTracking($type) : $service->disableTracking($type);
        };
        
        $command->uaTrackingCode() && $command->enableGoogleAnalytics() ? $service->enable() : $service->disable();
        $service->changeUaTrackingCode($command->uaTrackingCode());
        $command->enableIpAnonymization() ? $service->enableIpAnonymization() : $service->disableIpAnonymization();
        $command->enableNetPriceTracking() ? $service->enableNetPriceTracking() : $service->enableGrossPriceTracking();
        $command->enableDevMode() ? $service->enableDevMode() : $service->disableDevMode();
        
        $enableTrackingOptioningOption(TrackingOption::boxImpression(), $command->enableBoxImpression());
        $enableTrackingOptioningOption(TrackingOption::listImpression(), $command->enableListImpression());
        $enableTrackingOptioningOption(TrackingOption::productClicks(), $command->enableProductClick());
        $enableTrackingOptioningOption(TrackingOption::productDetails(), $command->enableProductDetails());
        $enableTrackingOptioningOption(TrackingOption::shoppingCart(), $command->enableShoppingCart());
        $enableTrackingOptioningOption(TrackingOption::checkout(), $command->enableCheckout());
        
        $service->changeName(ImpressionType::boxBestseller(), $command->bestsellerBoxName());
        $service->changeName(ImpressionType::boxSpecials(), $command->specialsBoxName());
        $service->changeName(ImpressionType::boxWhatsNew(), $command->whatsNewBoxName());
        
        $service->changeName(ImpressionType::listBestseller(), $command->bestsellerListName());
        $service->changeName(ImpressionType::listSpecials(), $command->specialsListName());
        $service->changeName(ImpressionType::listNewProducts(), $command->newProductsListName());
        $service->changeName(ImpressionType::listWhatsNew(), $command->whatsNewListName());
        $service->changeName(ImpressionType::listAvailableSoon(), $command->availableSoonListName());
        $service->changeName(ImpressionType::listTopProducts(), $command->topProductsListName());
        
        return $this;
    }
    
    
    /**
     * Returns the template data for the google analytics configuration page.
     *
     * @return array Template data of configuration page.
     * @see GAConfigurations
     */
    protected function _configurationData()
    {
        $query = MainFactory::create(GAConfigurations::class,
                                     ServiceFactory::readService(),
                                     $this->languageTextManager);
        
        $data = [
            'error'          => $query->previousError(),
            'configurations' => [
                $query->mainConfiguration(),
                $query->trackingOptions(),
                $query->boxNames(),
                $query->listNames(),
                $query->advancedSettings()
            ]
        ];
        
        return $data;
    }
    
    
    /**
     * Utility method to create the content navigation instance.
     *
     * @param string $active Whether 'charts' or 'configuraitions' to preselect the nav item.
     *
     * @return ContentNavigationCollection
     */
    protected function _contentNavigation($active = 'charts')
    {
        $contentNavigation = new ContentNavigationCollection([]);
        
        $contentNavigation->add(new StringType($this->languageTextManager->get_text('gx_ga_chart_content_label',
                                                                                    'google_analytics')),
                                new StringType('./admin.php?do=GoogleAnalyticsAdmin'),
                                new BoolType($active === 'charts'));
        
        $contentNavigation->add(new StringType($this->languageTextManager->get_text('gx_ga_configuration_content_label',
                                                                                    'google_analytics')),
                                new StringType('./admin.php?do=GoogleAnalyticsAdmin/configuration'),
                                new BoolType($active === 'configurations'));
        
        return $contentNavigation;
    }
    
    
    /**
     * Utility method to provide an easy creation for the template path.
     *
     * @param string $file Template file in GoogleECommerce/Admin/Html directory.
     *
     * @return NonEmptyStringType Absolute path, as non empty string type, of template file.
     */
    protected function _template($file)
    {
        return new NonEmptyStringType(__DIR__ . '/../../Html/' . $file . '.html');
    }
    
    
    /**
     * Utility method to provide an easy creation for admin layout responses.
     *
     * @param string                                    $title             Page title.
     * @param NonEmptyStringType                        $template          Template file.
     * @param array|null                                $data              Template data.
     * @param array|null                                $assets            (Optional) js and css asset files.
     * @param ContentNavigationCollectionInterface|null $contentNavigation Content navigation.
     *
     * @return AdminLayoutHttpControllerResponse|bool
     */
    protected function _response(
        $title,
        NonEmptyStringType $template,
        array $data = null,
        array $assets = null,
        ContentNavigationCollectionInterface $contentNavigation = null
    ) {
        return MainFactory::create(AdminLayoutHttpControllerResponse::class,
                                   new NonEmptyStringType($title),
                                   new ExistingFile($template),
                                   $data ? new KeyValueCollection($data) : null,
                                   $assets ? new AssetCollection($assets) : null,
                                   $contentNavigation);
    }
}