<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductCollection.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductCollection
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductCollection
{
    /**
     * @var GoogleAnalyticsProductInterface[]
     */
    private $items;
    
    
    /**
     * GoogleAnalyticsProductDataSetCollection constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param GoogleAnalyticsProductInterface[] $products Products data.
     */
    protected function __construct(array $products)
    {
        foreach ($products as $product) {
            $this->add($product);
        }
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductsDataSetCollection.
     *
     * @param GoogleAnalyticsProductInterface[] $products Products data.
     *
     * @return static|GoogleAnalyticsProductCollection New instance.
     */
    public static function collect(array $products)
    {
        return new static($products);
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductsDataSetCollection.
     * This way allows to create the collection by passing a well formatted array as argument.
     *
     * @param array $products Array with information about the product.
     *
     * @return GoogleAnalyticsProductCollection
     */
    public static function collectFromArray(array $products)
    {
        $items = [];
        foreach ($products as $product) {
            $items[] = GoogleAnalyticsProduct::create($product['id'],
                                                      $product['name'],
                                                      $product['brand'],
                                                      $product['category'],
                                                      $product['variant'],
                                                      $product['price'],
                                                      $product['quantity'],
                                                      $product['coupon'],
                                                      $product['listPosition']);
        }
        
        return static::collect($items);
    }
    
    
    /**
     * Returns the collected product list items.
     *
     * @return GoogleAnalyticsProductInterface[]
     */
    public function toArray()
    {
        return $this->items;
    }
    
    
    /**
     * Adds the given product to the collection.
     *
     * @param GoogleAnalyticsProductInterface $product
     *
     * @return $this Same instance for chained method calls.
     */
    protected function add(GoogleAnalyticsProductInterface $product)
    {
        $this->items[] = $product;
        
        return $this;
    }
}