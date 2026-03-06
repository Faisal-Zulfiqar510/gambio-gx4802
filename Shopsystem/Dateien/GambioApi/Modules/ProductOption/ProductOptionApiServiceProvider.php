<?php
/*--------------------------------------------------------------
   ProductOptionApiServiceProvider.php 2022-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption;

use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFilterService as ProductOptionFilterServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Api\Modules\ProductOption\App\Actions\CreateProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\DeleteAllProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\DeleteSpecificProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\FetchAllProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\FetchSpecificProductOptionAction;
use Gambio\Api\Modules\ProductOption\App\Actions\UpdateProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\Actions\PatchProductOptionsAction;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestParser;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestValidator;
use Gambio\Core\Application\DependencyInjection\AbstractServiceProvider;
use Gambio\Core\Application\ValueObjects\Url;

/**
 * Class ProductOptionApiServiceProvider
 *
 * @package Gambio\Api\Modules\ProductOption
 */
class ProductOptionApiServiceProvider extends AbstractServiceProvider
{
    
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            FetchAllProductOptionsAction::class,
            CreateProductOptionsAction::class,
            UpdateProductOptionsAction::class,
            PatchProductOptionsAction::class,
            DeleteAllProductOptionsAction::class,
            FetchSpecificProductOptionAction::class,
            DeleteSpecificProductOptionsAction::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(ProductOptionApiRequestParser::class)
            ->addArgument(ProductOptionFactory::class);
        $this->application->registerShared(ProductOptionApiRequestValidator::class);
        
        $this->application->registerShared(FetchAllProductOptionsAction::class)
            ->addArgument(ProductOptionApiRequestParser::class)
            ->addArgument(ProductOptionFilterServiceInterface::class);
        
        $this->application->registerShared(CreateProductOptionsAction::class)
            ->addArgument(ProductOptionApiRequestValidator::class)
            ->addArgument(ProductOptionApiRequestParser::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(UpdateProductOptionsAction::class)
            ->addArgument(ProductOptionApiRequestValidator::class)
            ->addArgument(ProductOptionFactory::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(ProductOptionWriteServiceInterface::class);
        
        $this->application->registerShared(PatchProductOptionsAction::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
        ->addArgument(ProductOptionFactory::class);
            
        $this->application->registerShared(DeleteAllProductOptionsAction::class)
            ->addArgument(ProductOptionWriteServiceInterface::class);
        
        $this->application->registerShared(FetchSpecificProductOptionAction::class)
            ->addArgument(ProductOptionReadServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(DeleteSpecificProductOptionsAction::class)
            ->addArgument(ProductOptionWriteServiceInterface::class)
            ->addArgument(ProductOptionReadServiceInterface::class);
    }
}