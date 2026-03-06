<?php
/* --------------------------------------------------------------
   GoogleAnalyticsImpressionType.inc.php 2018-04-25 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsImpressionType
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsImpressionType implements GoogleAnalyticsImpressionTypeInterface
{
    /**
     * @var string
     */
    protected $type;
    
    
    /**
     * GoogleAnalyticsImpressionType constructor.
     * It is recommended to use one of the static factory methods.
     *
     * @param NonEmptyStringType $type Impression type.
     */
    public function __construct(NonEmptyStringType $type)
    {
        $this->type = $type->asString();
    }
    
    
    /**
     * Creates and returns a new bestseller box google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function boxBestseller()
    {
        $type = new NonEmptyStringType('box-bestseller');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new specials box google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function boxSpecials()
    {
        $type = new NonEmptyStringType('box-specials');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new whats new box google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function boxWhatsNew()
    {
        $type = new NonEmptyStringType('box-whats-new');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new bestseller list google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listBestseller()
    {
        $type = new NonEmptyStringType('list-bestseller');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new specials list google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listSpecials()
    {
        $type = new NonEmptyStringType('list-specials');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new whats new list google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listWhatsNew()
    {
        $type = new NonEmptyStringType('list-whats-new');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new available soon google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listAvailableSoon()
    {
        $type = new NonEmptyStringType('list-available-soon');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new top products list google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listTopProducts()
    {
        $type = new NonEmptyStringType('list-top-products');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Creates and returns a new products list google analytics impression type.
     *
     * @return GoogleAnalyticsImpressionType New instance.
     */
    public static function listNewProducts()
    {
        $type = new NonEmptyStringType('list-new-products');
        
        return MainFactory::create(static::class, $type);
    }
    
    
    /**
     * Returns the configuration field for the list name of the impression type.
     *
     * @return string Configuration field name.
     */
    public function listNameField()
    {
        return $this->type . '-name';
    }
}