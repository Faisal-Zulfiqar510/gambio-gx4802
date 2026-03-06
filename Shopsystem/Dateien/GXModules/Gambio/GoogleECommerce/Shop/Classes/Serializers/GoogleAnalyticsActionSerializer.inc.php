<?php
/* --------------------------------------------------------------
   GoogleAnalyticsActionSerializer.inc.php 2018-04-20 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsActionSerializer
 */
class GoogleAnalyticsActionSerializer
{
    /**
     * @var GoogleAnalyticsProductCollectionSerializer
     */
    private $productCollectionSerializer;
    
    
    /**
     * GoogleAnalyticsActionSerializer constructor.
     *
     * @param GoogleAnalyticsProductCollectionSerializer $productCollectionSerializer
     */
    public function __construct(GoogleAnalyticsProductCollectionSerializer $productCollectionSerializer)
    {
        $this->productCollectionSerializer = $productCollectionSerializer;
    }
    
    
    /**
     * Serializes a google analytics event action.
     *
     * @param GoogleAnalyticsActionInterface $action GA event action.
     *
     * @return array Serialized action data.
     */
    public function serialize(GoogleAnalyticsActionInterface $action)
    {
        return [
            'transaction_id' => $action->transactionId(),
            'affiliation'    => $action->affiliation(),
            'value'          => $action->value(),
            'currency'       => $action->currency(),
            'tax'            => $action->tax(),
            'shipping'       => $action->shippingCost(),
            'items'          => $this->productCollectionSerializer->serialize($action->items())
        ];
    }
    
    
    /**
     * Encodes a google analytics event action.
     *
     * @param GoogleAnalyticsActionInterface $action GA event action.
     *
     * @return string Encoded action data.
     */
    public function encode(GoogleAnalyticsActionInterface $action)
    {
        return json_encode($this->serialize($action));
    }
}