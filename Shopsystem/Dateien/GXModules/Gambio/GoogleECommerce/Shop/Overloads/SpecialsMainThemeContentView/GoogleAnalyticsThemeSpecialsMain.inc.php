<?php
/* --------------------------------------------------------------
   GoogleAnalyticsThemeSpecialsMain.php 2018-11-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GoogleAnalyticsThemeSpecialsMain extends GoogleAnalyticsThemeSpecialsMain_parent
{
    public function prepare_data()
    {
        parent::prepare_data();
        
        $trackingService   = GoogleAnalyticsServiceFactory::trackingService();
        $configReadService = GoogleAnalyticsConfigurationServiceFactory::readService();
        
        $isEnabled         = $configReadService->enabled();
        $isTrackingEnabled = $configReadService->trackingEnabled(GoogleAnalyticsTracking::listImpression());
        
        $this->content_array['google_analytics_enabled']          = $isEnabled;
        $this->content_array['google_analytics_tracking_enabled'] = $isTrackingEnabled;
        
        if (!$isEnabled || !$isTrackingEnabled || !is_array($this->content_array['module_content'])) {
            return;
        }
        
        $productsData = $this->content_array['module_content'];
        $ids          = [];
        foreach ($productsData as $productData) {
            if ($productData['PRODUCTS_ID'] !== '') {
                $ids[] = new IdType($productData['PRODUCTS_ID']);
            }
        }
        
        if (count($ids) === 0) {
            return;
        }
        
        $this->content_array['google_analytics_data'] = $trackingService->encodedImpressionsByProductIds(new IdCollection($ids),
                                                                                                         new IdType($_SESSION['languages_id']),
                                                                                                         new IdType($_SESSION['customers_status']['customers_status_id']),
                                                                                                         new NonEmptyStringType($configReadService->listName(GoogleAnalyticsImpressionType::listSpecials())));
    }
}
