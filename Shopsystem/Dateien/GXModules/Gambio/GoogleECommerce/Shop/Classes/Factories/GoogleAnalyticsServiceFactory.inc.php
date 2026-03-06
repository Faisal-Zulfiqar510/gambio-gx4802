<?php
/* --------------------------------------------------------------
   GoogleAnalyticsServiceFactory.inc.php 2018-04-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsServiceFactory
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsServiceFactory
{
    /**
     * @var GoogleAnalyticsTrackingService
     */
    protected static $trackingService;
    
    /**
     * @var GoogleAnalyticsTrackingRepository
     */
    protected static $repository;
    
    /**
     * @var GoogleAnalyticsTrackingRepositoryReader
     */
    protected static $reader;
    
    /**
     * @var GoogleAnalyticsSerializers
     */
    protected static $serializers;
    
    /**
     * @var CI_DB_query_builder
     */
    protected static $queryBuilder;
    
    
    
    /**
     * Creates and returns the google analytics tracking service.
     *
     * @return GoogleAnalyticsTrackingService
     */
    public static function trackingService()
    {
        if (null === static::$trackingService) {
            static::$trackingService = MainFactory::create(GoogleAnalyticsTrackingService::class,
                                                           static::_repository(),
                                                           static::_serializers());
        }
        
        return static::$trackingService;
    }
    
    
    /**
     * Creates and returns the google analytics repository.
     *
     * @return GoogleAnalyticsTrackingRepository
     */
    protected static function _repository()
    {
        if (null === static::$repository) {
            static::$repository = new GoogleAnalyticsTrackingRepository(static::_reader());
        }
        
        return static::$repository;
    }
    
    
    /**
     * Creates and returns the google analytics reader.
     *
     * @return GoogleAnalyticsTrackingRepositoryReader
     */
    protected static function _reader()
    {
        if (null === static::$reader) {
            $netPrices      = new BoolType(GoogleAnalyticsConfigurationServiceFactory::readService()->trackNetPrices());
            static::$reader = MainFactory::create(GoogleAnalyticsTrackingRepositoryReader::class,
                                                  self::queryBuilder(),
                                                  $netPrices);
        }
        
        return static::$reader;
    }
    
    
    /**
     * Creates and returns the google analytics serializers.
     *
     * @return GoogleAnalyticsSerializers
     */
    protected static function _serializers()
    {
        if (null === static::$serializers) {
            static::$serializers = MainFactory::create(GoogleAnalyticsSerializers::class);
        }
        
        return static::$serializers;
    }
    
    /**
     * @return CI_DB_query_builder
     */
    private static function queryBuilder(): CI_DB_query_builder
    {
        return self::$queryBuilder ?? StaticGXCoreLoader::getDatabaseQueryBuilder();
    }
    
    
    /**
     * @param CI_DB_query_builder $queryBuilder
     */
    public static function setQueryBuilder(CI_DB_query_builder $queryBuilder): void
    {
        self::$queryBuilder = $queryBuilder;
    }
}