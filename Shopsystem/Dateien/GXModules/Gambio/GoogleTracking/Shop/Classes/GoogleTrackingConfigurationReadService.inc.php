<?php
/* --------------------------------------------------------------
   GoogleTrackingConfigurationReadService.inc.php 2018-09-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleTrackingConfigurationReadService
 */
class GoogleTrackingConfigurationReadService extends GoogleAnalyticsConfigurationReadService
{
    /**
     * Returns true if google ads conversion tracking is enabled.
     *
     * @return bool
     */
    public function isConversionTrackingEnabled()
    {
        return $this->storage->get('conversion-tracking-enabled', GoogleConfigurationStorage::SCOPE_ADWORDS);
    }
    
    
    /**
     * Returns the google ads conversion id.
     *
     * @return string
     */
    public function conversionId()
    {
        return $this->storage->get('conversion-id', GoogleConfigurationStorage::SCOPE_ADWORDS);
    }
    
    
    /**
     * Returns the google ads conversion label.
     *
     * @return string
     */
    public function conversionLabel()
    {
        return $this->storage->get('conversion-label', GoogleConfigurationStorage::SCOPE_ADWORDS);
    }
}