<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationOverviewQuery.inc.php 2018-04-25 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use \GoogleAnalyticsConfigurationReadServiceInterface as Service;
use \GoogleAnalyticsTracking as Track;
use \GoogleAnalyticsImpressionType as ImpressionType;

/**
 * Class GoogleAnalyticsConfigurationOverviewQuery
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsConfigurationOverviewQuery
{
    /**
     * @var GoogleAnalyticsConfigurationReadServiceInterface
     */
    protected $service;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    
    /**
     * GoogleAnalyticsConfigurationOverviewQuery constructor.
     *
     * @param GoogleAnalyticsConfigurationReadServiceInterface $service             Fetch analytics configurations.
     * @param LanguageTextManager                              $languageTextManager Text provider.
     */
    public function __construct(Service $service, LanguageTextManager $languageTextManager)
    {
        $this->service             = $service;
        $this->languageTextManager = $languageTextManager;
    }
    
    
    /**
     * Returns the main configuration group of google analytics.
     *
     * @return array Main configuration group of google analytics.
     */
    public function mainConfiguration()
    {
        $prefix    = ENABLE_SSL_CATALOG === 'false' ? HTTP_CATALOG_SERVER : HTTPS_CATALOG_SERVER;
        $optOutUrl = $prefix . DIR_WS_CATALOG . 'shop.php?do=GaOptOut';
        
        return [
            'legend' => $this->languageTextManager->get_text('gx_ga_main_configuration_label', 'google_analytics'),
            'group'  => [
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_enabled_label', 'google_analytics'),
                    'name'  => 'enabled',
                    'value' => $this->service->enabled(),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_ua_tracking_code_label', 'google_analytics'),
                    'name'  => 'ua_tracking_code',
                    'value' => $this->service->uaTrackingCode(),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_anonymize_ip_label', 'google_analytics'),
                    'name'  => 'anonymize_ip',
                    'value' => $this->service->ipAnonymizationEnabled(),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_price_net_label', 'google_analytics'),
                    'name'  => 'price_net',
                    'value' => $this->service->trackNetPrices(),
                    'type'  => 'checkbox'
                ],
                [
                    'label'     => $this->languageTextManager->get_text('gx_ga_opt_out_label', 'google_analytics'),
                    'name'      => 'opt-out',
                    'value'     => $optOutUrl,
                    'type'      => 'text',
                    'readyOnly' => true
                ]
            ]
        ];
    }
    
    
    /**
     * Returns the tracking options configuration group of google analytics.
     *
     * @return array Tracking options configuration group of google analytics.
     */
    public function trackingOptions()
    {
        return [
            'legend' => $this->languageTextManager->get_text('gx_ga_tracking_options_label', 'google_analytics'),
            'group'  => [
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_box_impression_label', 'google_analytics'),
                    'name'  => 'box_impression',
                    'value' => $this->service->trackingEnabled(Track::boxImpression()),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_impression_label', 'google_analytics'),
                    'name'  => 'list_impression',
                    'value' => $this->service->trackingEnabled(Track::listImpression()),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_product_click_label', 'google_analytics'),
                    'name'  => 'product_click',
                    'value' => $this->service->trackingEnabled(Track::productClicks()),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_product_details_label', 'google_analytics'),
                    'name'  => 'product_details',
                    'value' => $this->service->trackingEnabled(Track::productDetails()),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_shopping_cart_label', 'google_analytics'),
                    'name'  => 'shopping_cart',
                    'value' => $this->service->trackingEnabled(Track::shoppingCart()),
                    'type'  => 'checkbox'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_checkout_label', 'google_analytics'),
                    'name'  => 'checkout',
                    'value' => $this->service->trackingEnabled(Track::checkout()),
                    'type'  => 'checkbox'
                ]
            ]
        ];
    }
    
    
    /**
     * Returns the box names configuration group of google analytics.
     *
     * @return array Box names configuration group of google analytics.
     */
    public function boxNames()
    {
        return [
            'legend' => $this->languageTextManager->get_text('gx_ga_box_names_label', 'google_analytics'),
            'group'  => [
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_box_bestseller_label', 'google_analytics'),
                    'name'  => 'bestseller_box_configuration',
                    'value' => $this->service->listName(ImpressionType::boxBestseller()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_box_specials_label', 'google_analytics'),
                    'name'  => 'specials_box_configuration',
                    'value' => $this->service->listName(ImpressionType::boxSpecials()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_box_whats_new_label', 'google_analytics'),
                    'name'  => 'whats_new_box_configuration',
                    'value' => $this->service->listName(ImpressionType::boxWhatsNew()),
                    'type'  => 'text'
                ]
            ]
        ];
    }
    
    
    /**
     * Returns the list names configuration group of google analytics.
     *
     * @return array List names configuration group of google analytics.
     */
    public function listNames()
    {
        return [
            'legend' => $this->languageTextManager->get_text('gx_ga_list_names_label', 'google_analytics'),
            'group'  => [
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_bestseller_label', 'google_analytics'),
                    'name'  => 'bestseller_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listBestseller()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_specials_label', 'google_analytics'),
                    'name'  => 'specials_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listSpecials()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_new_products_label',
                                                                    'google_analytics'),
                    'name'  => 'new_products_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listNewProducts()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_whats_new_label', 'google_analytics'),
                    'name'  => 'whats_new_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listWhatsNew()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_available_soon_label',
                                                                    'google_analytics'),
                    'name'  => 'available_soon_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listAvailableSoon()),
                    'type'  => 'text'
                ],
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_list_top_products_label',
                                                                    'google_analytics'),
                    'name'  => 'top_products_list_configuration',
                    'value' => $this->service->listName(ImpressionType::listTopProducts()),
                    'type'  => 'text'
                ]
            ]
        ];
    }
    
    
    /**
     * Returns the advanced settings for google analytics.
     *
     * @return array
     */
    public function advancedSettings()
    {
        return [
            'legend' => $this->languageTextManager->get_text('gx_ga_advanced_settings_label', 'google_analytics'),
            'group'  => [
                [
                    'label' => $this->languageTextManager->get_text('gx_ga_enable_dev_mode_label', 'google_analytics'),
                    'name'  => 'dev_mode_advanced_configuration',
                    'value' => $this->service->isDevModeEnabled(),
                    'type'  => 'checkbox'
                ]
            ]
        ];
    }
    
    
    /**
     * Returns an error message for the previous error, if one occurred.
     * If not, null is returned.
     *
     * @return string|null
     */
    public function previousError()
    {
        if (array_key_exists('ga_config_error', $_SESSION)) {
            $error = $_SESSION['ga_config_error'];
            unset($_SESSION['ga_config_error']);
            
            return $error;
        }
        
        return null;
    }
}