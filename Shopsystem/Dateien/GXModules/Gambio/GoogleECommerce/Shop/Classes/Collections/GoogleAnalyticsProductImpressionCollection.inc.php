<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductImpressionCollection.inc.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductImpressionCollection
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProductImpressionCollection
{
    /**
     * @var GoogleAnalyticsProductImpressionInterface[]
     */
    private $items;
    
    
    /**
     * GoogleAnalyticsProductDataSetCollection constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param GoogleAnalyticsProductImpressionInterface[] $products Products data.
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
     * @param GoogleAnalyticsProductImpressionInterface[] $products Products data.
     *
     * @return static|GoogleAnalyticsProductImpressionCollection New instance.
     */
    public static function collect(array $products)
    {
        return new static($products);
    }
    
    
    /**
     * Returns the collected product list items.
     *
     * @return GoogleAnalyticsProductImpressionInterface[]
     */
    public function toArray()
    {
        return $this->items;
    }
    
    
    /**
     * Adds a GoogleAnalyticsProductImpressionInterface item to the collection.
     *
     * @param GoogleAnalyticsProductImpressionInterface $productImpression
     *
     * @return $this|GoogleAnalyticsProductImpressionCollection Same instance for chained method calls.
     */
    protected function add(GoogleAnalyticsProductImpressionInterface $productImpression)
    {
        $this->items[] = $productImpression;
        
        return $this;
    }
}