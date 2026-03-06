<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationReadService.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsConfigurationReadService
 */
class GoogleAnalyticsConfigurationReadService implements GoogleAnalyticsConfigurationReadServiceInterface
{
    /**
     * @var GoogleConfigurationStorage
     */
    protected $storage;
    
    
    /**
     * GoogleAnalyticsConfigurationReadService constructor.
     *
     * @param GoogleConfigurationStorage $storage
     */
    public function __construct(GoogleConfigurationStorage $storage)
    {
        $this->storage = $storage;
    }
    
    
    /**
     * Returns the universal analytics tracking code.
     *
     * @return string
     */
    public function uaTrackingCode()
    {
        return $this->storage->get('ua-tracking-code', GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Is true if google analytics is enabled.
     *
     * @return bool
     */
    public function enabled()
    {
        return $this->storage->get('enabled', GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Is true if ip anonymization is enabled.
     *
     * @return bool
     */
    public function ipAnonymizationEnabled()
    {
        return $this->storage->get('anonymize-ip', GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Is true if the given tracking configuration is enabled.
     *
     * @param GoogleAnalyticsTrackingInterface $tracking
     *
     * @return bool
     */
    public function trackingEnabled(GoogleAnalyticsTrackingInterface $tracking)
    {
        return $this->storage->get($tracking->trackingType(), GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Returns the list name of the given impression type.
     *
     * @param GoogleAnalyticsImpressionTypeInterface $impressionType Impression type.
     *
     * @return string List name of given impression type.
     */
    public function listName(GoogleAnalyticsImpressionTypeInterface $impressionType)
    {
        return $this->storage->get($impressionType->listNameField(), GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Checks if prices should be tracked as net or gross, true if net.
     *
     * @return bool True if prices should be tracked as net and false if they should be tracked as gross.
     */
    public function trackNetPrices()
    {
        if ($this->storage->get('price-net', GoogleConfigurationStorage::SCOPE_ANALYTICS) === null) {
            return false;
        }
        
        return $this->storage->get('price-net', GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Returns the file name of the given analytics file type.
     *
     * @param GoogleAnalyticsJsFileInterface $fileType Analytics file type.
     *
     * @return string
     */
    public function analyticsFileName(GoogleAnalyticsJsFileInterface $fileType)
    {
        $fileName = $this->storage->get($fileType->type() . '-js-file-name',
                                        GoogleConfigurationStorage::SCOPE_ANALYTICS);
        
        if ($fileName === '') {
            $fileName = $this->newAnalyticsFileName($fileType);
        }
        
        return $fileName;
    }
    
    
    /**
     * Creates a new file name of the given analytics file type and returns it.
     *
     * @param GoogleAnalyticsJsFileInterface $fileType Analytics file type.
     *
     * @return string
     */
    public function newAnalyticsFileName(GoogleAnalyticsJsFileInterface $fileType)
    {
        $fileName = uniqid();
        $fileName = str_replace('/', '|', $fileName);
        $fileName = str_replace('.', '|', $fileName) . '.js';
        
        $this->storage->set($fileType->type() . '-js-file-name',
                            $fileName,
                            GoogleConfigurationStorage::SCOPE_ANALYTICS);
        
        return $fileName;
    }
    
    
    /**
     * Determines if dev mode is enabled.
     *
     * @return bool
     */
    public function isDevModeEnabled()
    {
        return $this->storage->get('dev-mode', GoogleConfigurationStorage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Checks if the google_configurations table exists.
     *
     * @return bool
     */
    public function isInstalled()
    {
        return $this->storage->isInstalled();
    }
}