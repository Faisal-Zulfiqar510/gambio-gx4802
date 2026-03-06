<?php
/* --------------------------------------------------------------
   GoogleAnalyticsThemeSpecialsBox.inc.php 2022-10-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the specials box content view overload for Google Analytics
 */
class GoogleAnalyticsThemeSpecialsBox extends GoogleAnalyticsThemeSpecialsBox_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $trackingService   = GoogleAnalyticsServiceFactory::trackingService();
        $configReadService = GoogleAnalyticsConfigurationServiceFactory::readService();
        
        $isEnabled         = $configReadService->enabled();
        $isTrackingEnabled = $configReadService->trackingEnabled(GoogleAnalyticsTracking::boxImpression());
        
        $this->content_array['google_analytics_enabled']          = $isEnabled;
        $this->content_array['google_analytics_tracking_enabled'] = $isTrackingEnabled;
        
        if (!$isEnabled || !$isTrackingEnabled || !$this->get_content_array()['box_content']['PRODUCTS_ID']) {
            return;
        }
        
        $data = $trackingService->encodedImpressionByProductId(new IdType($this->get_content_array()['box_content']['PRODUCTS_ID']),
                                                               new IdType($_SESSION['languages_id']),
                                                               new IdType($_SESSION['customers_status']['customers_status_id']),
                                                               new NonEmptyStringType($configReadService->listName(GoogleAnalyticsImpressionType::boxSpecials())));
        
        $this->content_array['google_analytics_data'] = "[{$data}]";
    }
}
