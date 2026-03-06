<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductImpressionCollectionSerializer.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductImpressionCollectionSerializer
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductImpressionCollectionSerializer
{
    /**
     * @var GoogleAnalyticsProductImpressionSerializer
     */
    protected $impressionSerializer;
    
    
    /**
     * GoogleAnalyticsProductImpressionCollectionSerializer constructor.
     *
     * @param GoogleAnalyticsProductImpressionSerializer $impressionSerializer
     */
    public function __construct(GoogleAnalyticsProductImpressionSerializer $impressionSerializer)
    {
        $this->impressionSerializer = $impressionSerializer;
    }
    
    
    /**
     * Serializes the given product impression collection into an array.
     *
     * @param GoogleAnalyticsProductImpressionCollection $collection Product impression collection to be serialized.
     *
     * @return array Serialized product impression collection.
     */
    public function serialize(GoogleAnalyticsProductImpressionCollection $collection)
    {
        $data = [];
        
        foreach ($collection->toArray() as $productImpression) {
            $data[] = $this->impressionSerializer->serialize($productImpression);
        }
        
        return $data;
    }
    
    
    /**
     * Encodes the given product impression collection into a json string.
     *
     * @param GoogleAnalyticsProductImpressionCollection $collection Product impression collection to be encoded.
     * @param int                                        $option     Option flag, use a "JSON_" constant flag.
     *
     * @return string Json encoded product impression collection.
     */
    public function encode(GoogleAnalyticsProductImpressionCollection $collection, $option = 0)
    {
        return json_encode($this->serialize($collection), $option);
    }
}