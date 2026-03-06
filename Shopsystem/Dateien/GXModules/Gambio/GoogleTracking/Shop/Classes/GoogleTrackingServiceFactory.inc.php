<?php
/* --------------------------------------------------------------
   GoogleTrackingServiceFactory.inc.php 2018-09-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

use GoogleConfigurationStorage as Storage;

/**
 * Class GoogleTrackingServiceFactory
 */
class GoogleTrackingServiceFactory
{
    /**
     * @var GoogleTrackingConfigurationReadService
     */
    protected static $readService;
    
    /**
     * @var GoogleTrackingService
     */
    protected static $trackingService;
    
    
    /**
     * Creates and in memory caches a google tracking configuration read service.
     *
     * @return GoogleTrackingConfigurationReadService
     */
    public static function readService()
    {
        if (null === static::$readService) {
            $storage             = MainFactory::create(GoogleConfigurationStorage::class,
                                                       StaticGXCoreLoader::getDatabaseQueryBuilder());
            static::$readService = MainFactory::create(GoogleTrackingConfigurationReadService::class, $storage);
        }
        
        return static::$readService;
    }
    
    
    /**
     * Creates and in memory caches a google tracking service.
     *
     * @return GoogleTrackingService
     */
    public static function trackingService()
    {
        if (null === static::$trackingService) {
            $db        = StaticGXCoreLoader::getDatabaseQueryBuilder();
            $storage   = new Storage($db);
            $netPrices = new BoolType($storage->get('price-net', Storage::SCOPE_ANALYTICS));
            
            $analyticsTrackingReader     = MainFactory::create(GoogleAnalyticsTrackingRepositoryReader::class,
                                                               $db,
                                                               $netPrices);
            $analyticsTrackingRepository = MainFactory::create(GoogleAnalyticsTrackingRepository::class,
                                                               $analyticsTrackingReader);
            
            $productSerializer           = MainFactory::create(GoogleAnalyticsProductSerializer::class);
            $productCollectionSerializer = MainFactory::create(GoogleAnalyticsProductCollectionSerializer::class,
                                                               $productSerializer);
            $actionSerializer            = MainFactory::create(GoogleAnalyticsActionSerializer::class,
                                                               $productCollectionSerializer);
            
            static::$trackingService = MainFactory::create(GoogleTrackingService::class,
                                                           $storage,
                                                           $analyticsTrackingRepository,
                                                           $actionSerializer);
        }
        
        return static::$trackingService;
    }
}