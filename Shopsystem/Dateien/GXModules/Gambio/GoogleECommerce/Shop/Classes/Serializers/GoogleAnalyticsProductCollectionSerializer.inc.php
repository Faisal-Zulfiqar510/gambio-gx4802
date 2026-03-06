<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductCollectionSerializer.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductCollectionSerializer
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductCollectionSerializer
{
    /**
     * @var GoogleAnalyticsProductSerializer
     */
    protected $productSerializer;
    
    
    /**
     * GoogleAnalyticsProductCollectionSerializer constructor.
     *
     * @param GoogleAnalyticsProductSerializer $productSerializer
     */
    public function __construct(GoogleAnalyticsProductSerializer $productSerializer)
    {
        $this->productSerializer = $productSerializer;
    }
    
    
    /**
     * Serializes the given product collection into an array.
     *
     * @param GoogleAnalyticsProductCollection $collection Product collection to be serialized.
     *
     * @return array Serialized product collection.
     */
    public function serialize(GoogleAnalyticsProductCollection $collection)
    {
        $data = [];
        
        foreach ($collection->toArray() as $productDataSet) {
            $data[] = $this->productSerializer->serialize($productDataSet);
        }
        
        return $data;
    }
    
    
    /**
     * Encodes the given product collection into a json string.
     *
     * @param GoogleAnalyticsProductCollection $collection Product collection to be encoded.
     * @param int                              $option     Option flag, use a "JSON_" constant flag.
     *
     * @return string Json encoded product collection.
     */
    public function encode(GoogleAnalyticsProductCollection $collection, $option = 0)
    {
        return json_encode($this->serialize($collection), $option);
    }
}