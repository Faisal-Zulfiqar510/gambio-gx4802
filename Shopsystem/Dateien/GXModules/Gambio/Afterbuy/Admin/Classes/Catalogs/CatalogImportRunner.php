<?php
/* --------------------------------------------------------------
   CatalogImportRunner.php 2022-10-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs;

use CategoryReadServiceInterface;
use CategoryWriteServiceInterface;
use GambioAfterbuyConfigurationStorage;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\AfterbuyXMLService;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\Exceptions\XMLException;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\Exceptions\CatalogImportException;
use ProductWriteServiceInterface;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;
use StaticGXCoreLoader;

class CatalogImportRunner implements LoggerAwareInterface
{
    private LoggerInterface                    $logger;
    private AfterbuyXMLService                 $XMLService;
    private AfterbuyCatalogRepository          $catalogRepository;
    private GambioAfterbuyConfigurationStorage $configurationStorage;
    
    
    public function __construct(
        GambioAfterbuyConfigurationStorage $configurationStorage,
        AfterbuyXMLService                 $XMLService,
        AfterbuyCatalogRepository          $catalogRepository
    ) {
        $this->logger            = new NullLogger();
        $this->XMLService        = $XMLService;
        $this->catalogRepository = $catalogRepository;
        $this->configurationStorage = $configurationStorage;
    }
    
    
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
    
    
    public function run(): void
    {
        $this->logger->info("Starting catalog import run");

        $this->XMLService->setLogger($this->logger);

        // 1st step: fetch catalogs and store them in the local repository
        try {
            $this->logger->info("Retrieving catalogs from Afterbuy");
            $catalogs = $this->XMLService->getShopCatalogs(true);
        } catch (XMLException $e) {
            $message = "Could not fetch catalogs: {$e->getMessage()}";
            $this->logger->warning($message);
            throw new CatalogImportException($message);
        }
        $this->logger->debug("Got " . count($catalogs) . " catalogs, storing");
        $this->catalogRepository->wipeCatalogs();
        foreach ($catalogs as $catalog) {
            $this->catalogRepository->addCatalog($catalog);
        }
        
        // 2nd step: create categories from catalogs repository
        $parentCategoryId = (int)$this->configurationStorage->get('import_catalogs_parent_category');
        /** @var CategoryReadServiceInterface $readService */
        $readService = StaticGXCoreLoader::getService('CategoryRead');
        /** @var CategoryWriteServiceInterface $writeService */
        $writeService = StaticGXCoreLoader::getService('CategoryWrite');
        /** @var ProductWriteServiceInterface $productWriteService */
        $productWriteService = StaticGXCoreLoader::getService('ProductWrite');
        $sync                = new CatalogCategorySync($this->catalogRepository,
                                                       $readService,
                                                       $writeService,
                                                       $productWriteService);
        $sync->setLogger($this->logger);
        $this->logger->info("Creating/updating Afterbuy catalogs in parent category {$parentCategoryId}");
        $sync->syncCategoriesToCatalogs($parentCategoryId);
    }
}
