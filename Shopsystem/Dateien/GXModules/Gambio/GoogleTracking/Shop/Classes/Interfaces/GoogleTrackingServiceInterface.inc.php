<?php
/* --------------------------------------------------------------
   GoogleTrackingServiceInterface.inc.php 2018-10-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleTrackingServiceInterface
 */
interface GoogleTrackingServiceInterface
{
    /**
     * Determines whether analytics tracking is enabled.
     *
     * @return bool
     */
    public function analyticsTrackingEnabled();
    
    
    /**
     * Returns analytics purchase tracking data.
     *
     * @param IdType $orderId Orders id.
     *
     * @return array
     */
    public function analyticsPurchaseTrackingData(IdType $orderId);
    
    
    /**
     * Determines whether ads conversion tracking is enabled.
     *
     * @return bool
     */
    public function adsConversionTrackingEnabled();
    
    
    /**
     * Returns ads conversion purchase tracking data.
     *
     * @param IdType $orderId Orders id.
     *
     * @return array
     */
    public function adsConversionTrackingData(IdType $orderId);
}