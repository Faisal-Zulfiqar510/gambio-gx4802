<?php
/* --------------------------------------------------------------
   AfterbuyCatalogsCronjobTask.inc.php 2022-10-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

use Doctrine\DBAL\Connection;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\AfterbuyXMLService;
use GXModules\Gambio\Afterbuy\Admin\Classes\AfterbuyXML\Exceptions\XMLException;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\AfterbuyCatalogRepository;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\CatalogImportRunner;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\Exceptions\CatalogImportException;
use GXModules\Gambio\Afterbuy\Admin\Classes\LoggerAdapter;
use GXModules\Gambio\Afterbuy\Admin\Classes\Products\AfterbuyProductImporter;
use GXModules\Gambio\Afterbuy\Admin\Classes\Products\ProductImportRunner;
use GXModules\Gambio\Afterbuy\Admin\Classes\ProductsQuantityUpdateService;

class AfterbuyCatalogsCronjobTask extends AbstractCronjobTask
{
    /**
     * @param float $cronjobStartAsMicrotime
     *
     * @return Closure
     */
    public function getCallback($cronjobStartAsMicrotime)
    {
        return function () {
            $this->logInfo('AfterbuyCatalogsCronjobTask::getCallback() called');
            
            $this->logger->lastRun();
            
            if (!$this->moduleIsInstalledAndActive()) {
                return true;
            }
            
            $this->updateCatalogs();
            
            $this->logger->log(['CronjobTask finished' => date('c')]);
            $this->logger->lastSuccess();
            
            return true;
        };
    }
    
    
    protected function updateCatalogs(): void
    {
        $this->logInfo("Updating catalogs via cron");
        
        /** @var AfterbuyXMLService $xmlService */
        $abService = $this->dependencies->getDependencies()['XMLService'];
        
        /** @var GambioAfterbuyConfigurationStorage $configurationStorage */
        $configurationStorage = $this->dependencies->getDependencies()['ConfigurationStorage'];
        
        /** @var AfterbuyCatalogRepository $catalogRepository */
        $catalogRepository = $this->dependencies->getDependencies()['CatalogRepository'];
        
        $importRunner = new CatalogImportRunner($configurationStorage, $abService, $catalogRepository);
        $importRunner->setLogger(AfterbuyLogger::createLogger());
        $importRunner->run();
    }
    
    
    protected function logInfo(string $message): void
    {
        $this->logger->log(['message' => $message, 'level' => 'info']);
    }
    
    
    protected function logError(string $message): void
    {
        $this->logger->logError(['message' => $message, 'level' => 'error']);
    }
    
    
    protected function moduleIsInstalledAndActive(): bool
    {
        $configurationFinder = $this->dependencies->getDependencies()['ConfigurationFinder'];
        $installedConfig     = (bool)$configurationFinder->get('gm_configuration/MODULE_CENTER_GAMBIOAFTERBUY_INSTALLED');
        $activeConfig        = (bool)$configurationFinder->get('modules/gambio/afterbuy/active');
        
        return $installedConfig && $activeConfig;
    }
}