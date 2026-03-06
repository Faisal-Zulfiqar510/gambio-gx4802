<?php
/*--------------------------------------------------------------
   ProductVariantServiceProvider.php 2022-02-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

namespace Gambio\Admin\Modules\ProductVariant;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\ImageList\Services\ImageListRepository;
use Gambio\Admin\Modules\Option\Model\Events\OptionDetailsUpdated;
use Gambio\Admin\Modules\Option\Model\Events\OptionValueUpdated;
use Gambio\Admin\Modules\Option\Services\OptionRepository;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadRepository;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository;
use Gambio\Admin\Modules\ProductVariant\App\Data\Filter\ProductVariantFilterFactory;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsDeleter;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsInserter;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsMapper;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsReader;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsUpdater;
use Gambio\Admin\Modules\ProductVariant\App\EventListeners\RebuildProductsPropertiesIndexOnUpdatedOptionDetail;
use Gambio\Admin\Modules\ProductVariant\App\EventListeners\RebuildProductsPropertiesIndexOnUpdatedOptionValue;
use Gambio\Admin\Modules\ProductVariant\App\EventListeners\RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantCombinationGenerator;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantProductDownloadOperationPermitter;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantProductOptionOperationPermitter;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsFilterService;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsGenerationService;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsImageListOperationPermitter;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsOptionOperationPermitter;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsReadService;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsRepository;
use Gambio\Admin\Modules\ProductVariant\App\ProductVariantsWriteService;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantFactory;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsFilterService as ProductVariantsFilterServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsGenerationService as ProductVariantsGenerationServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsReadService as ProductVariantsReadServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsRepository as ProductVariantsRepositoryInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsWriteService as ProductVariantsWriteServiceInterface;
use Gambio\Core\Application\DependencyInjection\AbstractBootableServiceProvider;
use Gambio\Core\Configuration\Services\ConfigurationFinder;
use Gambio\Core\Configuration\Services\ConfigurationService;
use Psr\EventDispatcher\EventDispatcherInterface;

/**
 * Class ProductVariantServiceProvider
 *
 * @package Gambio\Admin\Modules\Variants
 * @codeCoverageIgnore
 */
class ProductVariantServiceProvider extends AbstractBootableServiceProvider
{
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            ProductVariantsFilterServiceInterface::class,
            ProductVariantsReadServiceInterface::class,
            ProductVariantsWriteServiceInterface::class,
            ProductVariantsRepositoryInterface::class,
            ProductVariantsGenerationServiceInterface::class,
            ProductVariantsOptionOperationPermitter::class,
            ProductVariantProductDownloadOperationPermitter::class,
            ProductVariantProductOptionOperationPermitter::class,
            ProductVariantsImageListOperationPermitter::class,
            ProductVariantFactory::class,
            RebuildProductsPropertiesIndexOnUpdatedOptionDetail::class,
            RebuildProductsPropertiesIndexOnUpdatedOptionValue::class,
            Services\RecalculateProductVariantPriceService::class,
            RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(ProductVariantFilterFactory::class);
        $this->application->registerShared(ProductVariantFactory::class);
        $this->application->registerShared(ProductVariantsReader::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductVariantsDeleter::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductVariantsInserter::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductVariantsUpdater::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductVariantsMapper::class)->addArgument(ProductVariantFactory::class);
        $this->application->registerShared(ProductVariantCombinationGenerator::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(ProductVariantsRepositoryInterface::class, ProductVariantsRepository::class)
            ->addArgument(ProductVariantsReader::class)
            ->addArgument(ProductVariantsDeleter::class)
            ->addArgument(ProductVariantsInserter::class)
            ->addArgument(ProductVariantsUpdater::class)
            ->addArgument(ProductVariantsMapper::class)
            ->addArgument(EventDispatcherInterface::class);
        
        $this->application->registerShared(ProductVariantsFilterServiceInterface::class,
                                           ProductVariantsFilterService::class)
            ->addArgument(ProductVariantFilterFactory::class)
            ->addArgument(ProductVariantsRepositoryInterface::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(ProductVariantsReadServiceInterface::class,
                                           ProductVariantsReadService::class)
            ->addArgument(ProductVariantsRepositoryInterface::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(ProductVariantsWriteServiceInterface::class,
                                           ProductVariantsWriteService::class)
            ->addArgument(ProductVariantsRepositoryInterface::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(ProductVariantsGenerationServiceInterface::class,
                                           ProductVariantsGenerationService::class)
            ->addArgument(ProductVariantsRepositoryInterface::class)
            ->addArgument(ProductVariantFactory::class)
            ->addArgument(ProductVariantCombinationGenerator::class)
            ->addArgument(ConfigurationService::class);
        
        $this->application->registerShared(ProductVariantsOptionOperationPermitter::class)
            ->addArgument(ProductVariantsReader::class);
        
        $this->application->registerShared(ProductVariantsImageListOperationPermitter::class)
            ->addArgument(ProductVariantsReader::class);
        
        $this->application->registerShared(RebuildProductsPropertiesIndexOnUpdatedOptionDetail::class)
            ->addArgument(ProductVariantsReader::class)
            ->addArgument(ProductVariantsUpdater::class);
        
        $this->application->registerShared(RebuildProductsPropertiesIndexOnUpdatedOptionValue::class)
            ->addArgument(ProductVariantsReader::class)
            ->addArgument(ProductVariantsUpdater::class);
        
        $this->application->registerShared(ProductVariantProductDownloadOperationPermitter::class)
            ->addArgument(ProductVariantsReader::class);
        
        $this->application->registerShared(ProductVariantProductOptionOperationPermitter::class)
            ->addArgument(ProductVariantsReader::class);
        
        $this->application->registerShared(RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener::class)
            ->addArgument(Services\RecalculateProductVariantPriceService::class);
        
        $this->application->registerShared(Services\RecalculateProductVariantPriceService::class,
                                           App\RecalculateProductVariantPriceService::class)
            ->addArgument(Connection::class)
            ->addArgument(ConfigurationFinder::class)
            ->addArgument(ProductPriceConversionService::class);
    }
    
    
    /**
     * @inheritDoc
     */
    public function boot(): void
    {
        $this->application->inflect(OptionRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductVariantsOptionOperationPermitter::class]);
        
        $this->application->inflect(ImageListRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductVariantsImageListOperationPermitter::class]);
        
        $this->application->attachEventListener(OptionDetailsUpdated::class,
                                                RebuildProductsPropertiesIndexOnUpdatedOptionDetail::class);
        
        $this->application->attachEventListener(OptionValueUpdated::class,
                                                RebuildProductsPropertiesIndexOnUpdatedOptionValue::class);
        
        $this->application->inflect(ProductDownloadRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductVariantProductDownloadOperationPermitter::class]);
        
        $this->application->inflect(ProductOptionRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductVariantProductOptionOperationPermitter::class]);
        
        $this->application->attachEventListener(OptionValueUpdated::class,
                                                RecalculateProductVariantsPricesOnOptionValueUpdatedEventListener::class);
    }
}