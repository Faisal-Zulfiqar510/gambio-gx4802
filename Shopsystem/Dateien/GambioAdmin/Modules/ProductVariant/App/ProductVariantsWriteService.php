<?php
/*------------------------------------------------------------------------------
 ProductVariantsWriteService.php 2010-08-24
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -----------------------------------------------------------------------------*/

namespace Gambio\Admin\Modules\ProductVariant\App;

use Gambio\Admin\Modules\ProductVariant\Model\Collections\OptionAndOptionValueIds;
use Gambio\Admin\Modules\ProductVariant\Model\Collections\ProductVariantIds;
use Gambio\Admin\Modules\ProductVariant\Model\ProductVariant;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductCustomization;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductIdentificationNumbers;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantStock;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantFactory;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsRepository as ProductVariantsRepositoryInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsWriteService as ProductVariantsWriterServiceInterface;
use Webmozart\Assert\Assert;

/**
 * Class ProductVariantsWriteService
 * @package Gambio\Admin\Modules\ProductVariant\App
 */
class ProductVariantsWriteService implements ProductVariantsWriterServiceInterface
{
    /**
     * @var ProductVariantsRepositoryInterface
     */
    private $repository;
    
    /**
     * @var ProductVariantFactory
     */
    private $factory;
    
    
    /**
     * ProductVariantsWriteService constructor.
     *
     * @param ProductVariantsRepositoryInterface $repository
     * @param ProductVariantFactory              $factory
     */
    public function __construct(
        ProductVariantsRepositoryInterface $repository,
        ProductVariantFactory $factory
    ) {
        $this->repository = $repository;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function createProductVariant(
        int $productId,
        OptionAndOptionValueIds $combination,
        ?int $imageListId,
        ProductCustomization $productCustomization,
        ProductIdentificationNumbers $productIdentificationNumbers,
        ProductVariantStock $stock,
        int $sortOrder = 0
    ): ProductVariantId {
        return $this->repository->createProductVariant($this->factory->createProductId($productId),
                                                       $combination,
                                                       $this->factory->createImageListId($imageListId),
                                                       $productCustomization,
                                                       $productIdentificationNumbers,
                                                       $stock,
                                                       $sortOrder);
    }
    
    
    /**
     * @inheritDoc
     */
    public function createMultipleProductVariants(array ...$creationArguments): ProductVariantIds
    {
        Assert::allIsList($creationArguments, 'Provided arguments need to be a list.');
        Assert::allMinCount($creationArguments, 6, 'At least two arguments needed per creation.');
        
        foreach ($creationArguments as $index => $creationArgument) {
            
            Assert::integer($creationArgument[0], 'Product ID must be an integer. Index: ' . $index);
            
            if ($creationArgument[2] !== null) {
    
                Assert::integer($creationArgument[2], 'Image list ID must be an integer. Index: ' . $index);
            }
            
            $creationArguments[$index][0] = $this->factory->createProductId($creationArgument[0]);
            $creationArguments[$index][2] = $this->factory->createImageListId($creationArgument[2]);
        }
        
        return $this->repository->createMultipleProductVariants(...$creationArguments);
    }
    
    
    /**
     * @inheritDoc
     */
    public function storeProductVariants(ProductVariant ...$productVariants): void
    {
        $this->repository->storeProductVariants(...$productVariants);
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteProductVariants(int ...$ids): void
    {
        $ids = array_map(function (int $id): ProductVariantId {
            return $this->factory->createProductVariantId($id);
        },
            $ids);
        
        $this->repository->deleteProductVariants(...$ids);
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteAllProductVariantsByProductId(int $productId): void
    {
        $this->repository->deleteAllProductVariantsByProductId($this->factory->createProductId($productId));
    }
}