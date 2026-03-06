<?php
/* --------------------------------------------------------------
   GoogleTrackingThemeHeader.inc.php 2018-11-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GoogleTrackingThemeHeader extends GoogleTrackingThemeHeader_parent
{
    /**
     * @var GoogleTrackingConfigurationReadService
     */
    protected $configurationService;
    
    /**
     * @var bool
     */
    protected $analyticsTrackingEnabled;
    
    /**
     * @var bool
     */
    protected $adsConversionTrackingEnabled;
    
    
    /**
     * Prepare data
     */
    public function prepare_data()
    {
        $this->initGoogleTrackingHeader();
        
        parent::prepare_data();
    }
    
    
    protected function initGoogleTrackingHeader()
    {
        $this->configurationService = GoogleTrackingServiceFactory::readService();
        
        $this->analyticsTrackingEnabled     = $this->configurationService->enabled();
        $this->adsConversionTrackingEnabled = $this->configurationService->isConversionTrackingEnabled();
        
        if ($this->adsConversionTrackingEnabled || $this->analyticsTrackingEnabled) {
            $uaTrackingCode = $this->configurationService->uaTrackingCode();
            $conversionId   = $this->configurationService->conversionId();
            
            $this->content_array['tracking_enabled']                = true;
            $this->content_array['analytics_tracking_enabled']      = $this->analyticsTrackingEnabled;
            $this->content_array['ads_conversion_tracking_enabled'] = $this->adsConversionTrackingEnabled;
            
            $this->content_array['gtag_id'] = $this->analyticsTrackingEnabled ? $uaTrackingCode : $this->configurationService->conversionId();
            
            $this->content_array['google_analytics_tracking_code']        = $uaTrackingCode;
            $this->content_array['google_ads_conversion_id']              = $conversionId;
            $this->content_array['google_analytics_anonymize_ip_enabled'] = $this->configurationService->ipAnonymizationEnabled();
            
            $isDevModeEnabled = $this->configurationService->isDevModeEnabled();
            
            if (!$isDevModeEnabled && $this->analyticsTrackingEnabled) {
                $jsPublicPath  = DIR_WS_CATALOG . 'public/';
                $gtagFile      = $jsPublicPath
                                 . $this->configurationService->analyticsFileName(GoogleAnalyticsJsFile::gtag(GoogleAnalyticsUaTrackingCode::create($uaTrackingCode)));
                $analyticsFile = $jsPublicPath
                                 . $this->configurationService->analyticsFileName(GoogleAnalyticsJsFile::analytics());
                $ecPluginFile  = $jsPublicPath
                                 . $this->configurationService->analyticsFileName(GoogleAnalyticsJsFile::ecPlugin());
                
                $this->content_array['google_analytics_gtag_js_file']      = $gtagFile;
                $this->content_array['google_analytics_analytics_js_file'] = $analyticsFile;
                $this->content_array['google_analytics_ec_plugin_js_file'] = $ecPluginFile;
                $this->content_array['google_analytics_dev_mode_enabled']  = false;
            } else {
                $this->content_array['google_analytics_dev_mode_enabled'] = true;
            }
        } else {
            $this->content_array['tracking_enabled'] = false;
        }
    }
}
