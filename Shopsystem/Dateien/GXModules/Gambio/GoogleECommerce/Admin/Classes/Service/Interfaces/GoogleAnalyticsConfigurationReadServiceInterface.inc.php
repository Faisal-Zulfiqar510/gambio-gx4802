<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationReadServiceInterface.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsConfigurationReadServiceInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsConfigurationReadServiceInterface
{
    /**
     * Returns the universal analytics tracking code.
     *
     * @return string
     */
    public function uaTrackingCode();
    
    
    /**
     * Is true if google analytics is enabled.
     *
     * @return bool
     */
    public function enabled();
    
    
    /**
     * Is true if ip anonymization is enabled.
     *
     * @return bool
     */
    public function ipAnonymizationEnabled();
    
    
    /**
     * Is true if the given tracking configuration is enabled.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking
     *
     * @return bool
     */
    public function trackingEnabled(GoogleAnalyticsTrackingInterface $tracking);
    
    
    /**
     * Returns the list name of the given impression type.
     *
     * @param GoogleAnalyticsImpressionTypeInterface $impressionType Impression type.
     *
     * @return string List name of given impression type.
     */
    public function listName(GoogleAnalyticsImpressionTypeInterface $impressionType);
    
    
    /**
     * Checks if prices should be tracked as net or gross, true if net.
     *
     * @return bool True if prices should be tracked as net and false if they should be tracked as gross.
     */
    public function trackNetPrices();
    
    
    /**
     * Returns the file name of the given analytics file type.
     *
     * @param GoogleAnalyticsJsFileInterface $fileType Analytics file type.
     *
     * @return string
     */
    public function analyticsFileName(GoogleAnalyticsJsFileInterface $fileType);
    
    
    /**
     * Creates a new file name of the given analytics file type and returns it.
     *
     * @param GoogleAnalyticsJsFileInterface $fileType Analytics file type.
     *
     * @return string
     */
    public function newAnalyticsFileName(GoogleAnalyticsJsFileInterface $fileType);
    
    
    /**
     * Determines if dev mode is enabled.
     *
     * @return bool
     */
    public function isDevModeEnabled();
    
    
    /**
     * Checks if the google_configurations table exists.
     *
     * @return bool
     */
    public function isInstalled();
}