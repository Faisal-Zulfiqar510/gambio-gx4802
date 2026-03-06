<?php
/* --------------------------------------------------------------
   GoogleAdsConversionTrackingConfigurationQuery.inc.php 2018-09-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GoogleConfigurationStorage as Storage;
use GuzzleHttp\Exception\ServerException;

/**
 * Class GoogleAdsConversionTrackingConfigurationQuery
 */
class GoogleAdsConversionTrackingConfigurationQuery
{
    /**
     * @var GoogleConfigurationStorage
     */
    protected $storage;
    
    /**
     * @var LanguageTextManager
     */
    protected $languageTextManager;
    
    /**
     * @var GoogleServicesApiClient
     */
    protected $apiClient;
    
    /**
     * @var array
     */
    protected $conversionTrackers;
    
    /**
     * @var string
     */
    protected $conversionName;
    
    /**
     * @var string
     */
    protected $conversionId;
    
    /**
     * @var string
     */
    protected $conversionActionId;
    
    /**
     * @var string
     */
    protected $error;
    
    
    /**
     * GoogleAdsConversionTrackingConfigurationQuery constructor.
     *
     * @param GoogleConfigurationStorage $storage
     * @param LanguageTextManager        $languageTextManager
     * @param GoogleServicesApiClient    $apiClient
     */
    public function __construct(
        Storage $storage,
        LanguageTextManager $languageTextManager,
        GoogleServicesApiClient $apiClient
    ) {
        $this->storage             = $storage;
        $this->languageTextManager = $languageTextManager;
        $this->apiClient           = $apiClient;
        
        $this->conversionTrackers();
        $currentConversionName = $this->storage->get('conversion-name', Storage::SCOPE_ADWORDS);
        
        foreach ($this->conversionTrackers as $tracker) {
            if ($currentConversionName === $tracker['name']) {
                $this->conversionName     = $tracker['name'];
                $this->conversionId       = $tracker['conversionId'];
                $this->conversionActionId = $tracker['conversionActionId'];
            }
        }
        
        if (!$this->conversionId) {
            $this->conversionName     = $this->conversionTrackers[0]['name'];
            $this->conversionId       = $this->conversionTrackers[0]['conversionId'];
            $this->conversionActionId = $this->conversionTrackers[0]['conversionActionId'];
        }
    }
    
    
    public function error()
    {
        return $this->error;
    }
    
    
    /**
     * Checks if google ads conversion tracking is enabled.
     *
     * @return bool
     */
    public function enabled()
    {
        return $this->storage->get('conversion-tracking-enabled', Storage::SCOPE_ADWORDS);
    }
    
    
    /**
     * Returns the google ads conversions name.
     *
     * @return string
     */
    public function conversionName()
    {
        return $this->conversionName;
    }
    
    
    /**
     * Returns the google ads conversions id.
     *
     * @return string
     */
    public function conversionId()
    {
        return $this->conversionId;
    }
    
    
    /**
     * Returns the google ads conversions action id.
     *
     * @return string
     */
    public function conversionActionId()
    {
        return $this->conversionActionId;
    }
    
    
    /**
     * Fetches and returns the google ads conversion trackers from the api.
     *
     * @return array
     */
    public function conversionTrackers()
    {
        if (null === $this->conversionTrackers) {
            try {
                $response = $this->apiClient->clientCall('ads-conversion-trackers');
                
                $this->conversionTrackers = json_decode($response->getBody()->getContents(), true);
                
                $this->conversionTrackers = $this->conversionTrackers ? : [];
                
                if (count($this->conversionTrackers) === 0) {
                    $this->error = $this->languageTextManager->get_text('gx_ads_conversion_trackers_not_found_error',
                                                                        'google_adwords');
                }
            } catch (ServerException $e) {
                $this->conversionTrackers = [];
                $this->error              = $this->languageTextManager->get_text('gx_ads_unexpected_error',
                                                                                 'google_adwords');
            }
        }
        
        return $this->conversionTrackers;
    }
}