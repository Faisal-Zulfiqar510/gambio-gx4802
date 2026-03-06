<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationWriteServiceInterface.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsWriteServiceInterface
 */
interface GoogleAnalyticsConfigurationWriteServiceInterface
{
    /**
     * Changes the universal analytics tracking code value.
     *
     * @param GoogleAnalyticsUaTrackingCode $trackingCode Tracking code.
     *
     * @return $this Same instance for chained method calls.
     */
    public function changeUaTrackingCode(GoogleAnalyticsUaTrackingCode $trackingCode);
    
    
    /**
     * Enabled the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enable();
    
    
    /**
     * Disabled the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disable();
    
    
    /**
     * Enables google analytics ip anonymization.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableIpAnonymization();
    
    
    /**
     * Disables google analytics ip anonymization.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableIpAnonymization();
    
    
    /**
     * Set configuration that prices are tracked as net for google analytics.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableNetPriceTracking();
    
    
    /**
     * Set configuration that prices are tracked as gross for google analytics.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableGrossPriceTracking();
    
    
    /**
     * Enables the given google analytics tracking.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking Tracking to be enabled.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableTracking(GoogleAnalyticsTrackingInterface $tracking);
    
    
    /**
     * Disables the given google analytics tracking.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking Tracking to be disabled.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableTracking(GoogleAnalyticsTrackingInterface $tracking);
    
    
    /**
     * Changes the list name of an analytics impression type.
     *
     * @param GoogleAnalyticsImpressionTypeInterface $impressionType Impression type to be changed.
     * @param NonEmptyStringType                     $name           New list name.
     *
     * @return $this Same instance for chained method calls.
     */
    public function changeName(GoogleAnalyticsImpressionTypeInterface $impressionType, NonEmptyStringType $name);
    
    
    /**
     * Enables the analytics dev mode.
     * While in dev mode, ad blocker can omit the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableDevMode();
    
    
    /**
     * Disabled the analytics dev mode.
     * While in dev mode, ad blocker can omit the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableDevMode();
}