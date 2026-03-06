<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductSerializer.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductSerializer
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductSerializer
{
    /**
     * Serializes the given product value object into an array.
     *
     * @param GoogleAnalyticsProductInterface $product Product to be serialized.
     *
     * @return array Serialized product.
     */
    public function serialize(GoogleAnalyticsProductInterface $product)
    {
        $data = [];
        
        $this->_tryToSet($product, 'id', $data)
            ->_tryToSet($product, 'name', $data)
            ->_tryToSet($product, 'brand', $data)
            ->_tryToSet($product, 'category', $data)
            ->_tryToSet($product, 'variant', $data)
            ->_tryToSet($product, 'price', $data)
            ->_tryToSet($product, 'quantity', $data)
            ->_tryToSet($product, 'coupon', $data)
            ->_tryToSet($product, 'listPosition', $data);
        
        return $data;
    }
    
    
    /**
     * Encodes the given product value object into a json string.
     *
     * @param GoogleAnalyticsProductInterface $product Product to be encoded.
     * @param int                             $option  Option flag, use a "JSON_" constant flag.
     *
     * @return string Json encoded product.
     */
    public function encode(GoogleAnalyticsProductInterface $product, $option = 0)
    {
        return json_encode($this->serialize($product), $option) ? : json_encode([]);
    }
    
    
    /**
     * Tries to set a new property, if the value is not null.
     *
     * @param GoogleAnalyticsProductInterface $product  Product value object to be serialized.
     * @param string                          $property Name of properties accessor method.
     * @param array                           $data     Final serialized data array.
     *
     * @return $this|GoogleAnalyticsProductSerializer Same instance for chained method calls.
     */
    protected function _tryToSet(GoogleAnalyticsProductInterface $product, $property, &$data)
    {
        $value = $product->{$property}();
        if ($value) {
            $data[$property] = str_replace("'","`",$value);
        }
        
        return $this;
    }
}
