<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationWriteService.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsConfigurationWriteService
 */
class GoogleAnalyticsConfigurationWriteService implements GoogleAnalyticsConfigurationWriteServiceInterface
{
    /**
     * @var GoogleConfigurationStorage
     */
    protected $storage;
    
    
    /**
     * GoogleAnalyticsConfigurationWriteService constructor.
     *
     * @param GoogleConfigurationStorage $storage Configuration storage component.
     */
    public function __construct(GoogleConfigurationStorage $storage)
    {
        $this->storage = $storage;
    }
    
    
    /**
     * Changes the universal analytics tracking code value.
     * If no argument is passed, the current tracking code will be removed.
     *
     * @param GoogleAnalyticsUaTrackingCode $trackingCode Tracking code.
     *
     * @return $this Same instance for chained method calls.
     */
    public function changeUaTrackingCode(GoogleAnalyticsUaTrackingCode $trackingCode = null)
    {
        $this->storage->set('ua-tracking-code', $trackingCode ? $trackingCode->code() : '');
        
        return $this;
    }
    
    
    /**
     * Enabled the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enable()
    {
        $this->storage->set('enabled', true);
        
        return $this;
    }
    
    
    /**
     * Disabled the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disable()
    {
        $this->storage->set('enabled', false);
        
        return $this;
    }
    
    
    /**
     * Enables google analytics ip anonymization.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableIpAnonymization()
    {
        $this->storage->set('anonymize-ip', true);
        
        return $this;
    }
    
    
    /**
     * Disables google analytics ip anonymization.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableIpAnonymization()
    {
        $this->storage->set('anonymize-ip', false);
        
        return $this;
    }
    
    
    /**
     * Set configuration that prices are tracked as net for google analytics.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableNetPriceTracking()
    {
        $this->storage->set('price-net', true);
        
        return $this;
    }
    
    
    /**
     * Set configuration that prices are tracked as gross for google analytics.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableGrossPriceTracking()
    {
        $this->storage->set('price-net', false);
        
        return $this;
    }
    
    
    /**
     * Enables the given google analytics tracking.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking Tracking to be enabled.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableTracking(GoogleAnalyticsTrackingInterface $tracking)
    {
        $this->storage->set($tracking->trackingType(), true);
        
        return $this;
    }
    
    
    /**
     * Disables the given google analytics tracking.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking Tracking to be disabled.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableTracking(GoogleAnalyticsTrackingInterface $tracking)
    {
        $this->storage->set($tracking->trackingType(), false);
        
        return $this;
    }
    
    
    /**
     * Changes the list name of an analytics impression type.
     *
     * @param GoogleAnalyticsImpressionTypeInterface $impressionType Impression type to be changed.
     * @param NonEmptyStringType                     $name           New list name.
     *
     * @return $this Same instance for chained method calls.
     */
    public function changeName(GoogleAnalyticsImpressionTypeInterface $impressionType, NonEmptyStringType $name)
    {
        $this->storage->set($impressionType->listNameField(), $name->asString());
        
        return $this;
    }
    
    
    /**
     * Enables the analytics dev mode.
     * While in dev mode, ad blocker can omit the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function enableDevMode()
    {
        $this->storage->set('dev-mode', true);
        
        return $this;
    }
    
    
    /**
     * Disabled the analytics dev mode.
     * While in dev mode, ad blocker can omit the google analytics tracking.
     *
     * @return $this Same instance for chained method calls.
     */
    public function disableDevMode()
    {
        $this->storage->set('dev-mode', false);
        
        return $this;
    }
}