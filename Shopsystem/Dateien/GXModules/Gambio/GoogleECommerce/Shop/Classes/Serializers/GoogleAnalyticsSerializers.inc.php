<?php
/* --------------------------------------------------------------
   GoogleAnalyticsSerializers.inc.php 2018-04-11
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsSerializers
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsSerializers
{
    /**
     * @var GoogleAnalyticsProductImpressionSerializer
     */
    protected $impressionSerializer;
    
    /**
     * @var GoogleAnalyticsProductImpressionCollectionSerializer
     */
    protected $impressionCollectionSerializer;
    
    /**
     * @var GoogleAnalyticsProductSerializer
     */
    protected $productDataSerializer;
    
    /**
     * @var GoogleAnalyticsProductCollectionSerializer
     */
    protected $productCollectionSerializer;
    
    /**
     * @var GoogleAnalyticsActionSerializer
     */
    protected $actionSerializer;
    
    
    /**
     * Creates and returns the google analytics product impression serializer.
     *
     * @return GoogleAnalyticsProductImpressionSerializer Google analytics product impression serializer.
     */
    public function impressionSerializer()
    {
        if (null === $this->impressionSerializer) {
            $this->impressionSerializer = MainFactory::create(GoogleAnalyticsProductImpressionSerializer::class);
        }
        
        return $this->impressionSerializer;
    }
    
    
    /**
     * Creates and returns the google analytics product impression collection serializer.
     *
     * @return GoogleAnalyticsProductImpressionCollectionSerializer Product impression collection serializer.
     */
    public function impressionCollectionSerializer()
    {
        if (null === $this->impressionCollectionSerializer) {
            $this->impressionCollectionSerializer = MainFactory::create(GoogleAnalyticsProductImpressionCollectionSerializer::class,
                                                                        $this->impressionSerializer());
        }
        
        return $this->impressionCollectionSerializer;
    }
    
    
    /**
     * Creates and returns the google analytics product serializer.
     *
     * @return GoogleAnalyticsProductSerializer Google analytics product serializer.
     */
    public function productSerializer()
    {
        if (null === $this->productDataSerializer) {
            $this->productDataSerializer = MainFactory::create(GoogleAnalyticsProductSerializer::class);
        }
        
        return $this->productDataSerializer;
    }
    
    
    /**
     * Creates and returns the google analytics product collection serializer.
     *
     * @return GoogleAnalyticsProductCollectionSerializer Google analytics product collection serializer.
     */
    public function productCollectionSerializer()
    {
        if (null === $this->productCollectionSerializer) {
            $this->productCollectionSerializer = MainFactory::create(GoogleAnalyticsProductCollectionSerializer::class,
                                                                     $this->productSerializer());
        }
        
        return $this->productCollectionSerializer;
    }
    
    
    /**
     * Creates and returns the google analytics action serializer.
     *
     * @return GoogleAnalyticsActionSerializer Google analytics product collection serializer.
     */
    public function actionSerializer()
    {
        if (null === $this->actionSerializer) {
            $this->actionSerializer = MainFactory::create(GoogleAnalyticsActionSerializer::class,
                                                          $this->productCollectionSerializer());
        }
        
        return $this->actionSerializer;
    }
}