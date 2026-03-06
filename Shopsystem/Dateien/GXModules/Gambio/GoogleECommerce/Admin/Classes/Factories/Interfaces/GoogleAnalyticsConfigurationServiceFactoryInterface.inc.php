<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationServiceFactoryInterface.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsConfigurationServiceFactoryInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsConfigurationServiceFactoryInterface
{
    /**
     * Creates (and in memory caches) the Google Analytics Configuration Read Service.
     *
     * @return GoogleAnalyticsConfigurationReadServiceInterface
     */
    public static function readService();
    
    
    /**
     * Creates (and in memory caches) the Google Analytics Configuration Write Service.
     *
     * @return GoogleAnalyticsConfigurationWriteServiceInterface
     */
    public static function writeService();
}