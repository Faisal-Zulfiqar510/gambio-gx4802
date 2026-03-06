<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductAttributeCollection.inc.php 2018-04-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductAttributeCollection
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductAttributeCollection
{
    /**
     * @var GoogleAnalyticsProductAttribute[]
     */
    private $items = [];
    
    /**
     * @var array
     */
    private $optionIds = [];
    
    
    /**
     * @var array
     */
    private $valueIds = [];
    
    
    /**
     * GoogleAnalyticsProductAttributeCollection constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param GoogleAnalyticsProductAttribute[] $products Product attributes data.
     */
    protected function __construct(array $products)
    {
        foreach ($products as $product) {
            $this->add($product);
        }
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductAttributeCollection.
     *
     * @param GoogleAnalyticsProductAttribute[] $products Product attributes data.
     *
     * @return GoogleAnalyticsProductAttributeCollection New instance.
     */
    public static function collect(array $products)
    {
        return new static($products);
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductAttributeCollection.
     * This way allows to create the collection by passing a well formatted array as argument.
     *
     * @param array $attributes Array with information about the product attributes.
     *
     * @return GoogleAnalyticsProductAttributeCollection
     */
    public static function collectFromArray(array $attributes)
    {
        $items = [];
        foreach ($attributes as $attribute) {
            $items[] = GoogleAnalyticsProductAttribute::create($attribute['optionId'], $attribute['valueId']);
        }
        
        return static::collect($items);
    }
    
    
    /**
     * Returns the option ids of all attributes in the collection.
     *
     * @return array
     */
    public function optionIds()
    {
        return $this->optionIds;
    }
    
    
    /**
     * Returns the value ids of all attributes in the collection.
     *
     * @return array
     */
    public function valueIds()
    {
        return $this->valueIds;
    }
    
    
    /**
     * Checks if collection is empty.
     *
     * @return bool
     */
    public function isEmpty()
    {
        return count($this->items) === 0;
    }
    
    
    /**
     * Returns the collected product attribute list items.
     *
     * @return GoogleAnalyticsProductAttribute[]
     */
    public function toArray()
    {
        return $this->items;
    }
    
    
    /**
     * Adds the given product attribute to the collection.
     *
     * @param GoogleAnalyticsProductAttribute $attribute
     *
     * @return $this Same instance for chained method calls.
     */
    protected function add(GoogleAnalyticsProductAttribute $attribute)
    {
        $this->items[]     = $attribute;
        $this->optionIds[] = $attribute->optionId();
        $this->valueIds[]  = $attribute->valueId();
        
        return $this;
    }
}