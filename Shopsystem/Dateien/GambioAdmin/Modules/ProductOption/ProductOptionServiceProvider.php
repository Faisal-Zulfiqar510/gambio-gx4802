<?php
/*--------------------------------------------------------------
   ProductOptionServiceProvider.php 2022-10-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Layout\Menu\AdminMenuService;
use Gambio\Admin\Modules\ImageList\Services\ImageListRepository;
use Gambio\Admin\Modules\Option\Services\OptionFactory;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\Option\Services\OptionRepository;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\CreateProductOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\DeleteSpecificProductOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\FetchAllAvailableOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\FetchAllProductOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\FetchSpecificAvailableOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\FetchSpecificProductOptionAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Json\UpdateProductOptionsAction;
use Gambio\Admin\Modules\ProductOption\App\Actions\Vue\IndexAction;
use Gambio\Admin\Modules\ProductOption\App\Data\Filter\ProductOptionFilterFactory;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionDeleter;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionInserter;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionMapper;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionReader;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionUpdater;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionFilterService;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionProductVariantOperationPermitter;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionReadService;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRepository;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionsImageListOperationPermitter;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionsOptionOperationPermitter;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionWriteService;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFilterService as ProductOptionFilterServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository as ProductOptionRepositoryInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsReadService as ProductVariantsReadServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsRepository;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRequestParser;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRequestValidator;
use Gambio\Core\Application\DependencyInjection\AbstractBootableServiceProvider;
use Gambio\Core\Application\ValueObjects\UserPreferences;
use Gambio\Core\Configuration\Services\ConfigurationFinder;
use Gambio\Core\Language\Services\LanguageService;
use Psr\EventDispatcher\EventDispatcherInterface;

/**
 * Class ProductOptionServiceProvider
 *
 * @package Gambio\Admin\Modules\ProductOption
 */
class ProductOptionServiceProvider extends AbstractBootableServiceProvider
{
    
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            ProductOptionFactory::class,
            ProductOptionRepositoryInterface::class,
            ProductOptionFilterServiceInterface::class,
            ProductOptionWriteServiceInterface::class,
            ProductOptionReadServiceInterface::class,
            ProductOptionsOptionOperationPermitter::class,
            ProductOptionsImageListOperationPermitter::class,
            ProductOptionProductVariantOperationPermitter::class,
            IndexAction::class,
            DeleteSpecificProductOptionsAction::class,
            FetchSpecificProductOptionAction::class,
            UpdateProductOptionsAction::class,
            CreateProductOptionsAction::class,
            FetchAllProductOptionsAction::class,
            FetchAllAvailableOptionsAction::class,
            FetchSpecificAvailableOptionsAction::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(ProductOptionFactory::class);
        $this->application->registerShared(ProductOptionFilterFactory::class);
        $this->application->registerShared(ProductOptionMapper::class)->addArgument(ProductOptionFactory::class);
        $this->application->registerShared(ProductOptionReader::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductOptionDeleter::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductOptionInserter::class)->addArgument(Connection::class);
        $this->application->registerShared(ProductOptionUpdater::class)->addArgument(Connection::class);
        
        $this->application->registerShared(ProductOptionRepositoryInterface::class, ProductOptionRepository::class)
            ->addArgument(ProductOptionMapper::class)
            ->addArgument(ProductOptionReader::class)
            ->addArgument(ProductOptionDeleter::class)
            ->addArgument(ProductOptionInserter::class)
            ->addArgument(ProductOptionUpdater::class)
            ->addArgument(EventDispatcherInterface::class);
        
        $this->application->registerShared(ProductOptionFilterServiceInterface::class,
                                           ProductOptionFilterService::class)
            ->addArgument(ProductOptionFilterFactory::class)
            ->addArgument(ProductOptionRepositoryInterface::class)
            ->addArgument(ProductOptionFactory::class);
        
        $this->application->registerShared(ProductOptionWriteServiceInterface::class, ProductOptionWriteService::class)
            ->addArgument(ProductOptionRepositoryInterface::class)
            ->addArgument(ProductOptionFactory::class);
        
        $this->application->registerShared(ProductOptionReadServiceInterface::class, ProductOptionReadService::class)
            ->addArgument(ProductOptionRepositoryInterface::class)
            ->addArgument(ProductOptionFactory::class);
        
        $this->application->registerShared(ProductOptionsOptionOperationPermitter::class)
            ->addArgument(ProductOptionReader::class);
        
        $this->application->registerShared(ProductOptionsImageListOperationPermitter::class)
            ->addArgument(ProductOptionReader::class);
        
        $this->application->registerShared(IndexAction::class)
            ->addArgument(Connection::class)
            ->addArgument(UserPreferences::class)
            ->addArgument(AdminMenuService::class)
            ->addArgument(LanguageService::class)
            ->addArgument(ConfigurationFinder::class);
        
        $this->application->registerShared(DeleteSpecificProductOptionsAction::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
            ->addArgument(ProductOptionReadServiceInterface::class);
        
        $this->application->registerShared(FetchSpecificProductOptionAction::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(OptionReadServiceInterface::class)
            ->addArgument(OptionFactory::class)
            ->addArgument(Connection::class)
            ->addArgument(ProductPriceConversionService::class);
        
        $this->application->registerShared(UpdateProductOptionsAction::class)
            ->addArgument(ProductOptionFactory::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
            ->addArgument(ProductPriceConversionService::class)
            ->addArgument(ProductOptionRequestParser::class);
        
        $this->application->registerShared(ProductOptionRequestParser::class)->addArgument(ProductOptionFactory::class);
        $this->application->registerShared(ProductOptionRequestValidator::class);
        
        $this->application->registerShared(CreateProductOptionsAction::class)
            ->addArgument(ProductOptionRequestValidator::class)
            ->addArgument(ProductOptionRequestParser::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(OptionReadServiceInterface::class)
            ->addArgument(ProductPriceConversionService::class);
        
        $this->application->registerShared(FetchAllProductOptionsAction::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(OptionReadServiceInterface::class)
            ->addArgument(OptionFactory::class)
            ->addArgument(Connection::class)
            ->addArgument(ProductPriceConversionService::class);
        
        $this->application->registerShared(FetchAllAvailableOptionsAction::class)
            ->addArgument(OptionReadServiceInterface::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(ProductVariantsReadServiceInterface::class);
        
        $this->application->registerShared(FetchSpecificAvailableOptionsAction::class)
            ->addArgument(OptionReadServiceInterface::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(ProductVariantsReadServiceInterface::class);
        
        $this->application->registerShared(ProductOptionProductVariantOperationPermitter::class)
            ->addArgument(ProductOptionRepositoryInterface::class)
            ->addArgument(ProductOptionFactory::class);
    }
    
    
    /**
     * @inheritDoc
     */
    public function boot(): void
    {
        $this->application->inflect(OptionRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductOptionsOptionOperationPermitter::class]);
        
        $this->application->inflect(ImageListRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductOptionsImageListOperationPermitter::class]);
        
        $this->application->inflect(ProductVariantsRepository::class)
            ->invokeMethod('registerOperationPermitter', [ProductOptionProductVariantOperationPermitter::class]);
    }
}
