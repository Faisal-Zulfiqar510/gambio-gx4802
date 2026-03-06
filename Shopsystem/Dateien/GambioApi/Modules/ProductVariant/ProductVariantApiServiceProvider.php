<?php
/* --------------------------------------------------------------
   ProductVariantApiServiceProvider.php 2022-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductVariant;

use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantFactory;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsFilterService as ProductVariantsFilterServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsGenerationService as ProductVariantsGenerationServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsReadService as ProductVariantsReadServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsWriteService as ProductVariantsWriteServiceInterface;
use Gambio\Api\Modules\ProductVariant\App\Actions\AddOptionValuesAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\CreateProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\DeleteAllProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\DeleteSpecificProductVariantAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\FetchAllProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\FetchSpecificProductVariantAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\GenerateProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\PatchProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\RemoveOptionAction;
use Gambio\Api\Modules\ProductVariant\App\Actions\UpdateProductVariantsAction;
use Gambio\Api\Modules\ProductVariant\App\ProductVariantApiRequestParser;
use Gambio\Api\Modules\ProductVariant\App\ProductVariantApiRequestValidator;
use Gambio\Core\Application\DependencyInjection\AbstractServiceProvider;
use Gambio\Core\Application\ValueObjects\Url;

/**
 * Class OptionsApiServiceProvider
 *
 * @package Gambio\Api\Modules\ParcelService
 * @codeCoverageIgnore
 */
class ProductVariantApiServiceProvider extends AbstractServiceProvider
{
    /**
     * @inheritDoc
     */
    public function provides(): array
    {
        return [
            FetchAllProductVariantsAction::class,
            CreateProductVariantsAction::class,
            UpdateProductVariantsAction::class,
            PatchProductVariantsAction::class,
            DeleteAllProductVariantsAction::class,
            FetchSpecificProductVariantAction::class,
            DeleteSpecificProductVariantAction::class,
            GenerateProductVariantsAction::class,
            AddOptionValuesAction::class,
            RemoveOptionAction::class,
        ];
    }
    
    
    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $this->application->registerShared(ProductVariantApiRequestValidator::class);
        
        $this->application->registerShared(ProductVariantApiRequestParser::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(FetchAllProductVariantsAction::class)
            ->addArgument(ProductVariantApiRequestParser::class)
            ->addArgument(ProductVariantsFilterServiceInterface::class);
        
        $this->application->registerShared(FetchSpecificProductVariantAction::class)
            ->addArgument(ProductVariantsReadServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(DeleteSpecificProductVariantAction::class)
            ->addArgument(ProductVariantsWriteServiceInterface::class)
            ->addArgument(ProductVariantsReadServiceInterface::class);
        
        $this->application->registerShared(CreateProductVariantsAction::class)
            ->addArgument(ProductVariantApiRequestValidator::class)
            ->addArgument(ProductVariantApiRequestParser::class)
            ->addArgument(ProductVariantFactory::class)
            ->addArgument(ProductVariantsWriteServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(DeleteAllProductVariantsAction::class)
            ->addArgument(ProductVariantsWriteServiceInterface::class);
        
        $this->application->registerShared(UpdateProductVariantsAction::class)
            ->addArgument(ProductVariantApiRequestValidator::class)
            ->addArgument(ProductVariantFactory::class)
            ->addArgument(ProductVariantsReadServiceInterface::class)
            ->addArgument(ProductVariantsWriteServiceInterface::class);
        
        $this->application->registerShared(GenerateProductVariantsAction::class)
            ->addArgument(ProductVariantApiRequestValidator::class)
            ->addArgument(ProductVariantApiRequestParser::class)
            ->addArgument(ProductVariantsGenerationServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(AddOptionValuesAction::class)
            ->addArgument(ProductVariantApiRequestValidator::class)
            ->addArgument(ProductVariantApiRequestParser::class)
            ->addArgument(ProductVariantsGenerationServiceInterface::class)
            ->addArgument(Url::class);
        
        $this->application->registerShared(PatchProductVariantsAction::class)
            ->addArgument(ProductVariantsReadServiceInterface::class)
            ->addArgument(ProductVariantsWriteServiceInterface::class)
            ->addArgument(ProductVariantFactory::class);
        
        $this->application->registerShared(RemoveOptionAction::class)
            ->addArgument(ProductVariantApiRequestValidator::class)
            ->addArgument(ProductVariantsGenerationServiceInterface::class);
    }
}