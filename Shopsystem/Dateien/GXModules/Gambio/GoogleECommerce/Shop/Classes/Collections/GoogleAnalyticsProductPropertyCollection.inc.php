<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductPropertyCollection.inc.php 2018-04-23 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductPropertyCollection
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductPropertyCollection
{
    /**
     * @var GoogleAnalyticsProductProperty[]
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
     * GoogleAnalyticsProductPropertyCollection constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param GoogleAnalyticsProductProperty[] $products Product properties data.
     */
    protected function __construct(array $products)
    {
        foreach ($products as $product) {
            $this->add($product);
        }
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductPropertyCollection.
     *
     * @param GoogleAnalyticsProductProperty[] $products Product properties data.
     *
     * @return GoogleAnalyticsProductPropertyCollection New instance.
     */
    public static function collect(array $products)
    {
        return new static($products);
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductsDataSetCollection.
     * This way allows to create the collection by passing a well formatted array as argument.
     *
     * @param array $properties Array with information about the product properties.
     *
     * @return GoogleAnalyticsProductPropertyCollection
     */
    public static function collectFromArray(array $properties)
    {
        $items = [];
        foreach ($properties as $property) {
            $items[] = GoogleAnalyticsProductProperty::create($property['optionId'], $property['valueId']);
        }
        
        return static::collect($items);
    }
    
    
    /**
     * Returns the option ids of all properties in the collection.
     *
     * @return array
     */
    public function optionIds()
    {
        return $this->optionIds;
    }
    
    
    /**
     * Returns the value ids of all properties in the collection.
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
     * Returns the collected product property list items.
     *
     * @return GoogleAnalyticsProductProperty[]
     */
    public function toArray()
    {
        return $this->items;
    }
    
    
    /**
     * Adds the given product property to the collection.
     *
     * @param GoogleAnalyticsProductProperty $property
     *
     * @return $this Same instance for chained method calls.
     */
    protected function add(GoogleAnalyticsProductProperty $property)
    {
        $this->items[]     = $property;
        $this->optionIds[] = $property->optionId();
        $this->valueIds[]  = $property->valueId();
        
        return $this;
    }
}