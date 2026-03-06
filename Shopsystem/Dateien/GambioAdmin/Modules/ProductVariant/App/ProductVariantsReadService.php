<?php
/*------------------------------------------------------------------------------
 ProductVariantsReadService.php 2020-03-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -----------------------------------------------------------------------------*/

namespace Gambio\Admin\Modules\ProductVariant\App;

use Gambio\Admin\Modules\ProductVariant\Model\Collections\ProductVariants;
use Gambio\Admin\Modules\ProductVariant\Model\ProductVariant;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantFactory;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsReadService as ProductVariantsReadServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsRepository as ProductVariantsRepositoryInterface;

class ProductVariantsReadService implements ProductVariantsReadServiceInterface
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
     * ProductVariantsReadService constructor.
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
    public function getProductVariantsByProductId(int $productId): ProductVariants
    {
        return $this->repository->getProductVariantsByProductId($this->factory->createProductId($productId));
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductVariantById(int $variantId): ProductVariant
    {
        return $this->repository->getProductVariantById($this->factory->createProductVariantId($variantId));
    }
}