<?php
/* --------------------------------------------------------------
   UpdateAdsConversionTrackingConfiguration.inc.php 2018-09-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class UpdateAdsConversionTrackingConfiguration
 */
class UpdateAdsConversionTrackingConfiguration
{
    /**
     * @var array
     */
    protected $postData;
    
    
    /**
     * UpdateAdsConversionTrackingConfiguration constructor.
     *
     * @param array $postData
     */
    public function __construct(array $postData)
    {
        $this->postData = $postData;
    }
    
    
    /**
     * Is google ads conversion tracking enabled.
     *
     * @return bool
     */
    public function enabled()
    {
        return array_key_exists('conversion-tracking-enabled', $this->postData);
    }
    
    
    /**
     * Returns the google ads conversion tracking id.
     *
     * @return string
     */
    public function conversionId()
    {
        return $this->postData['conversion-id'];
    }
    
    
    /**
     * Returns the google ads conversion tracking action id.
     *
     * @return string
     */
    public function conversionActionId()
    {
        return $this->postData['conversion-action-id'];
    }
    
    
    /**
     * Returns the google ads conversion name.
     *
     * @return string
     */
    public function conversionName()
    {
        return $this->postData['conversion-name'];
    }
}