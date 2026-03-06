<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductImpressionSerializer.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductImpressionSerializer
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductImpressionSerializer
{
    /**
     * Serializes the given product impression value object into an array.
     *
     * @param GoogleAnalyticsProductImpressionInterface $productImpression Product impression to be serialized.
     *
     * @return array Serialized product impression.
     */
    public function serialize(GoogleAnalyticsProductImpressionInterface $productImpression)
    {
        $data = [];
        
        $this->_tryToSet($productImpression, 'id', $data)
            ->_tryToSet($productImpression, 'name', $data)
            ->_tryToSet($productImpression,
                        'listName',
                        $data,
                        'list_name')
            ->_tryToSet($productImpression, 'brand', $data)
            ->_tryToSet($productImpression, 'category', $data)
            ->_tryToSet($productImpression, 'variant', $data)
            ->_tryToSet($productImpression, 'listPosition', $data, 'list_position')
            ->_tryToSet($productImpression, 'price', $data);
        
        return $data;
    }
    
    
    /**
     * Encodes the given product impression value object into a json string.
     *
     * @param GoogleAnalyticsProductImpressionInterface $productImpression Product impression to be encoded.
     * @param int                                       $option            Option flag, use a "JSON_" constant flag.
     *
     * @return string Json encoded product impression.
     */
    public function encode(GoogleAnalyticsProductImpressionInterface $productImpression, $option = 0)
    {
        return json_encode($this->serialize($productImpression), $option);
    }
    
    
    /**
     * Tries to set a new property, if the value is not null.
     *
     * @param GoogleAnalyticsProductImpressionInterface $productImpression  Product value object to be serialized.
     * @param string                                    $property           Name of properties accessor method.
     * @param array                                     $data               Final serialized data array.
     * @param string|null                               $as                 (Optional) Json property name, $property if
     *                                                                      null.
     *
     * @return $this Same instance for chained method calls.
     */
    protected function _tryToSet(
        GoogleAnalyticsProductImpressionInterface $productImpression,
        $property,
        &$data,
        $as = null
    ) {
        $value = $productImpression->{$property}();
        if ($value) {
            $data[$as ? : $property] = str_replace("'","`",$value);
        }
        
        return $this;
    }
}
