<?php
/* --------------------------------------------------------------
  GoogleAnalyticsThemeCheckoutConfirmation.inc.php 2018-11-15
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2016 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  -------------------------------------------------------------- */

/**
 * Class representing the Google Analytics checkout payment content view overload
 */
class GoogleAnalyticsThemeCheckoutConfirmation extends GoogleAnalyticsThemeCheckoutConfirmation_parent
{
    /**
     * Prepare data
     */
    public function prepare_data()
    {
        parent::prepare_data();
        
        $trackingService   = GoogleAnalyticsServiceFactory::trackingService();
        $configReadService = GoogleAnalyticsConfigurationServiceFactory::readService();
        
        $isEnabled         = $configReadService->enabled();
        $isTrackingEnabled = $configReadService->trackingEnabled(GoogleAnalyticsTracking::checkout());
        
        $this->content_array['google_analytics_enabled']          = $isEnabled;
        $this->content_array['google_analytics_tracking_enabled'] = $isTrackingEnabled;
        
        if (!$isEnabled || !$isTrackingEnabled) {
            return;
        }
        // TODO
    }
}
