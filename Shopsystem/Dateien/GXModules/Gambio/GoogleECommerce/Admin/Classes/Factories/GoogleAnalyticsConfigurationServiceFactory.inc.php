<?php
/* --------------------------------------------------------------
   GoogleAnalyticsConfigurationServiceFactory.inc.php 2018-04-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsConfigurationServiceFactory
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsConfigurationServiceFactory implements GoogleAnalyticsConfigurationServiceFactoryInterface
{
    /**
     * @var GoogleAnalyticsConfigurationReadService
     */
    protected static $readService;
    
    /**
     * @var GoogleAnalyticsConfigurationWriteService
     */
    protected static $writeService;
    
    /**
     * @var GoogleConfigurationStorage
     */
    protected static $storage;
    
    /**
     * @var CI_DB_query_builder
     */
    protected static $queryBuilder;
    
    
    /**
     * Creates (and in memory caches) the Google Analytics Configuration Read Service.
     *
     * @return GoogleAnalyticsConfigurationReadServiceInterface
     */
    public static function readService()
    {
        if (null === static::$readService) {
            static::$readService = MainFactory::create(GoogleAnalyticsConfigurationReadService::class,
                                                       static::_storage());
        }
        
        return static::$readService;
    }
    
    
    /**
     * Creates (and in memory caches) the Google Analytics Configuration Write Service.
     *
     * @return GoogleAnalyticsConfigurationWriteServiceInterface
     */
    public static function writeService()
    {
        if (null === static::$writeService) {
            static::$writeService = MainFactory::create(GoogleAnalyticsConfigurationWriteService::class,
                                                        static::_storage());
        }
        
        return static::$writeService;
    }
    
    
    /**
     * Creates (and in memory caches) the Google Configuration Storage component.
     *
     * @return GoogleConfigurationStorage
     */
    protected static function _storage()
    {
        if (null === static::$storage) {
            static::$storage = MainFactory::create(GoogleConfigurationStorage::class,
                                                   self::queryBuilder(),
                                                   GoogleConfigurationStorage::SCOPE_ANALYTICS);
        }
        
        return static::$storage;
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