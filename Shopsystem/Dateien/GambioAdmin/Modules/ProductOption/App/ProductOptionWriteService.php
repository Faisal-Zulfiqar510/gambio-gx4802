<?php
/*--------------------------------------------------------------------
 ProductOptionWriteService.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\ProductOption\Model\Collections\ProductOptionIds;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\DeletionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\InsertionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\ProductOptionAlreadyExistsException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\StorageOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository as ProductOptionRepositoryInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;

/**
 * Class ProductOptionWriteService
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionWriteService implements ProductOptionWriteServiceInterface
{
    
    /**
     * @var ProductOptionRepositoryInterface
     */
    private $repository;
    
    /**
     * @var ProductOptionFactory
     */
    private $factory;
    
    
    /**
     * ProductOptionWriteService constructor.
     *
     * @param ProductOptionRepositoryInterface $repository
     * @param ProductOptionFactory             $factory
     */
    public function __construct(
        ProductOptionRepositoryInterface $repository,
        ProductOptionFactory $factory
    ) {
        $this->repository = $repository;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function createProductOption(
        int $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductOptionStock $productOptionStock,
        int $sortOrder = 0
    ): ProductOptionId {
        
        return $this->repository->createProductOption($this->factory->createProductId($productId),
                                                      $optionAndOptionValueId,
                                                      $imageListId,
                                                      $optionValueCustomization,
                                                      $productOptionStock,
                                                      $sortOrder);
    }
    
    
    /**
     * @inheritDoc
     */
    public function createMultipleProductOptions(array ...$creationArguments): ProductOptionIds
    {
        return $this->repository->createMultipleProductOptions(...$creationArguments);
    }
    
    
    /**
     * @inheritDoc
     */
    public function storeProductOptions(ProductOption ...$productOptions): void
    {
        $this->repository->storeProductOptions(...$productOptions);
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteProductOptions(int ...$ids): void
    {
        $this->repository->deleteProductOptions(...array_map([$this->factory, 'createProductOptionId'], $ids));
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteAllProductOptionsByProductId(int $productId): void
    {
        $productId = $this->factory->createProductId($productId);
        
        $this->repository->deleteAllProductOptionsByProductId($productId);
    }
}