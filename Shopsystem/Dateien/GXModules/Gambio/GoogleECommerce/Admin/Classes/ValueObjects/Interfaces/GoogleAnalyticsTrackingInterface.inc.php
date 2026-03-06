<?php
/* --------------------------------------------------------------
   GoogleAnalyticsTrackingInterface.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsTrackingInterface
 */
interface GoogleAnalyticsTrackingInterface
{
    /**
     * Returns the string representation of the tracking type.
     *
     * @return string
     */
    public function trackingType();
}