<?php
/* --------------------------------------------------------------
   AfterbuyStockupdateCronjobDependencies.inc.php 2023-01-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

use Doctrine\DBAL\Connection;
use Gambio\Core\Configuration\Services\ConfigurationFinder;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\AfterbuyXMLService;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\AfterbuyCatalogRepository;
use GXModules\Gambio\Afterbuy\Admin\Classes\Products\AfterbuyProductImporter;
use GXModules\Gambio\Afterbuy\Admin\Classes\Products\ProductsMappingRepository;
use GXModules\Gambio\Afterbuy\Admin\Classes\ProductsQuantityUpdateRunner;
use GXModules\Gambio\Afterbuy\Admin\Classes\ProductsQuantityUpdateService;

class AfterbuyStockupdateCronjobDependencies extends AbstractCronjobDependencies
{
    
    /**
     * @return array
     */
    public function getDependencies()
    {
        /** @var GambioAfterbuyConfigurationStorage $gambioAfterbuyConfigurationStorage */
        $gambioAfterbuyConfigurationStorage = MainFactory::create('GambioAfterbuyConfigurationStorage');
        $configurationFinder                = \LegacyDependencyContainer::getInstance()
            ->get(ConfigurationFinder::class);
        $partnerToken                       = $gambioAfterbuyConfigurationStorage->get('partner_token');
        $accountToken                       = $gambioAfterbuyConfigurationStorage->get('account_token');
        $moduleConfiguration                = new GambioAfterbuyConfigurationStorage();
        $productsQuantitiesUpdateService    = new ProductsQuantityUpdateService(StaticGXCoreLoader::getDatabaseQueryBuilder());
        
        $xmlService                     = new AfterbuyXMLService($partnerToken, $accountToken);
        $productsQuantitiesUpdateRunner = new ProductsQuantityUpdateRunner($moduleConfiguration,
                                                                           $xmlService,
                                                                           $productsQuantitiesUpdateService);
        
        return [
            'ConfigurationFinder'            => $configurationFinder,
            'ProductsQuantitiesUpdateRunner' => $productsQuantitiesUpdateRunner,
        ];
    }
}
