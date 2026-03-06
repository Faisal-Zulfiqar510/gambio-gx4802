<?php
/* --------------------------------------------------------------
   GoogleTrackingService.inc.php 2018-10-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GoogleConfigurationStorage as Storage;

/**
 * Class GoogleTrackingService
 */
class GoogleTrackingService implements GoogleTrackingServiceInterface
{
    /**
     * @var Storage
     */
    protected $storage;
    
    /**
     * @var GoogleAnalyticsTrackingRepository
     */
    protected $analyticsTrackingRepository;
    
    /**
     * @var GoogleAnalyticsActionSerializer
     */
    protected $actionSerializer;
    
    /**
     * @var GoogleAnalyticsAction
     */
    protected $purchase;
    
    
    /**
     * GoogleTrackingService constructor.
     *
     * @param Storage                           $storage
     * @param GoogleAnalyticsTrackingRepository $analyticsTrackingRepository
     * @param GoogleAnalyticsActionSerializer   $actionSerializer
     */
    public function __construct(
        Storage $storage,
        GoogleAnalyticsTrackingRepository $analyticsTrackingRepository,
        GoogleAnalyticsActionSerializer $actionSerializer
    ) {
        $this->storage                     = $storage;
        $this->analyticsTrackingRepository = $analyticsTrackingRepository;
        $this->actionSerializer            = $actionSerializer;
    }
    
    
    /**
     * Determines whether analytics tracking is enabled.
     *
     * @return bool
     */
    public function analyticsTrackingEnabled()
    {
        return $this->storage->get('enabled', Storage::SCOPE_ANALYTICS);
    }
    
    
    /**
     * Returns analytics purchase tracking data.
     *
     * @param IdType $orderId Orders id.
     *
     * @return array
     */
    public function analyticsPurchaseTrackingData(IdType $orderId)
    {
        return $this->actionSerializer->serialize($this->_fetchPurchase($orderId));
    }
    
    
    /**
     * Determines whether ads conversion tracking is enabled.
     *
     * @return bool
     */
    public function adsConversionTrackingEnabled()
    {
        return $this->storage->get('conversion-tracking-enabled', Storage::SCOPE_ADWORDS);
    }
    
    
    /**
     * Returns ads conversion purchase tracking data.
     *
     * @param IdType $orderId Orders id.
     *
     * @return array
     */
    public function adsConversionTrackingData(IdType $orderId)
    {
        $purchase = $this->_fetchPurchase($orderId);
        
        return [
            'send_to'        => $this->storage->get('conversion-action-id', Storage::SCOPE_ADWORDS),
            'value'          => $purchase->value(),
            'currency'       => $purchase->currency(),
            'transaction_id' => $purchase->transactionId()
        ];
    }
    
    
    /**
     * Fetches and in memory caches purchase information.
     *
     * @param IdType $orderId
     *
     * @return GoogleAnalyticsAction
     */
    protected function _fetchPurchase(IdType $orderId)
    {
        if (null === $this->purchase) {
            $this->purchase = $this->analyticsTrackingRepository->fetchPurchaseByOrderId($orderId);
        }
        
        return $this->purchase;
    }
}