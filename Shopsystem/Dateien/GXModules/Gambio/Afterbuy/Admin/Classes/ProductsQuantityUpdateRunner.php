<?php
/* --------------------------------------------------------------
   ProductsQuantityUpdateRunner.php 2022-12-08
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes;

use GambioAfterbuyConfigurationStorage;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\AfterbuyXMLService;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\Exceptions\XMLException;
use Psr\Log\LoggerAwareInterface;
use Psr\Log\LoggerInterface;
use Psr\Log\NullLogger;

class ProductsQuantityUpdateRunner implements LoggerAwareInterface
{
    private LoggerInterface                    $logger;
    private GambioAfterbuyConfigurationStorage $configurationStorage;
    private ProductsQuantityUpdateService      $productsQuantityUpdateService;
    
    
    public function __construct(
        GambioAfterbuyConfigurationStorage $configurationStorage,
        AfterbuyXMLService                 $XMLService,
        ProductsQuantityUpdateService      $productsQuantityUpdateService
    ) {
        $this->logger                        = new NullLogger();
        $this->configurationStorage          = $configurationStorage;
        $this->xmlService                    = $XMLService;
        $this->productsQuantityUpdateService = $productsQuantityUpdateService;
    }
    
    
    public function run(): void
    {
        $configurationStorage = $this->configurationStorage;
        $lastSyncDateTime     = new \DateTimeImmutable($configurationStorage->get('last_qty_sync'));
        $newLastSyncDateTime  = new \DateTimeImmutable();
        /* $oneHourAgo           = new \DateTimeImmutable('1 hour ago'); */
        $salesSince = $lastSyncDateTime;
        /*
        if ($lastSyncDateTime->getTimestamp() > $oneHourAgo->getTimestamp()) {
            $salesSince = $oneHourAgo;
        }
        */
        $this->logger->info("Syncing quantity updates since {$salesSince->format('c')}");
        /** @var AfterbuyXMLService $xmlService */
        $xmlService = $this->xmlService;
        $xmlService->setLogger($this->logger);
        try {
            $page = 0;
            do {
                $page++;
                $updatedProducts = $xmlService->getShopProductsModifiedSinceRange($salesSince, 10, 0, true, $page);
                if ((int)$updatedProducts->getTotalNumberOfEntries() === 0) {
                    $this->logger->info("No updated products found at Afterbuy.");
                } else {
                    $this->logger->info("Processing " . count($updatedProducts->getProducts())
                                        . " products received from Afterbuy");
                    $this->productsQuantityUpdateService->setLogger($this->logger);
                    $productSyncType = $configurationStorage->get('product_sync_type');
                    $this->productsQuantityUpdateService->updateProductQuantities($productSyncType,
                        ...$updatedProducts->getProducts());
                }
            } while ($updatedProducts->getTotalNumberOfPages() > $page);
            
            $configurationStorage->set('last_qty_sync', $newLastSyncDateTime->format('c'));
        } catch (XMLException $e) {
            $this->logger->error("ERROR: {$e->getMessage()}");
        }
    }
    
    
    public function setLogger(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }
}
