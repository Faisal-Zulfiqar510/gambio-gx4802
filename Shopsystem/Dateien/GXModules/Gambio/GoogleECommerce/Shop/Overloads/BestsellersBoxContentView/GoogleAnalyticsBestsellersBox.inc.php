<?php

/* --------------------------------------------------------------
   GoogleAnalyticsBestsellersBox.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the bestsellers box content view overload for Google Analytics
 */
class GoogleAnalyticsBestsellersBox extends GoogleAnalyticsBestsellersBox_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $ids = [];
        
        $trackingService   = GoogleAnalyticsServiceFactory::trackingService();
        $configReadService = GoogleAnalyticsConfigurationServiceFactory::readService();
        
        $isEnabled         = $configReadService->enabled();
        $isTrackingEnabled = $configReadService->trackingEnabled(GoogleAnalyticsTracking::boxImpression());
        
        $this->content_array['google_analytics_enabled']          = $isEnabled;
        $this->content_array['google_analytics_tracking_enabled'] = $isTrackingEnabled;
        
        if (!$isEnabled || !$isTrackingEnabled || !$this->get_content_array()['PRODUCTS_DATA']) {
            return;
        }
        
        foreach ($this->get_content_array()['PRODUCTS_DATA'] as $product) {
            if ($product['PRODUCTS_ID'] !== '') {
                $ids[] = new IdType($product['PRODUCTS_ID']);
            }
        }
        
        if (count($ids) === 0) {
            return;
        }
        
        $this->content_array['google_analytics_data'] = $trackingService->encodedImpressionsByProductIds(new IdCollection($ids),
                                                                                                         new IdType($_SESSION['languages_id']),
                                                                                                         new IdType($_SESSION['customers_status']['customers_status_id']),
                                                                                                         new NonEmptyStringType($configReadService->listName(GoogleAnalyticsImpressionType::boxBestseller())));
    }
}