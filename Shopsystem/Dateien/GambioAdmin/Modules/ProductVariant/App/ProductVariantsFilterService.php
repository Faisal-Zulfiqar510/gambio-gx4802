<?php
/*--------------------------------------------------------------
   ProductVariantsFilterService.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App;

use Gambio\Admin\Modules\ProductVariant\App\Data\Filter\ProductVariantFilterFactory;
use Gambio\Admin\Modules\ProductVariant\Model\Collections\ProductVariants;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantFactory;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsFilterService as ProductVariantsFilterServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsRepository;

/**
 * Class ProductVariantsFilterService
 * @package Gambio\Admin\Modules\ProductVariant\App\Data
 */
class ProductVariantsFilterService implements ProductVariantsFilterServiceInterface
{
    /**
     * @var ProductVariantFilterFactory
     */
    protected $filterFactory;
    
    /**
     * @var ProductVariantsRepository
     */
    protected $repository;
    
    /**
     * @var ProductVariantFactory
     */
    private $domainFactory;
    
    
    /**
     * ProductVariantsFilterService constructor.
     *
     * @param ProductVariantFilterFactory $filterFactory
     * @param ProductVariantsRepository   $repository
     * @param ProductVariantFactory       $domainFactory
     */
    public function __construct(
        ProductVariantFilterFactory $filterFactory,
        ProductVariantsRepository $repository,
        ProductVariantFactory $domainFactory
    ) {
        $this->filterFactory = $filterFactory;
        $this->repository    = $repository;
        $this->domainFactory = $domainFactory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function filterProductVariants(
        int $productId,
        array $filters,
        ?string $sorting = null,
        int $limit = 25,
        int $offset = 0
    ): ProductVariants {
        $productIdObj = $this->domainFactory->createProductId($productId);
        $filtersObj   = $this->filterFactory->createFilters($filters);
        $sortingObj   = $this->filterFactory->createSorting($sorting);
        $pagination   = $this->filterFactory->createPagination($limit, $offset);
        
        return $this->repository->filterProductVariants($productIdObj, $filtersObj, $sortingObj, $pagination);
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductVariantsTotalCount(int $productId, array $filters): int
    {
        $productIdObj = $this->domainFactory->createProductId($productId);
        $filtersObj   = $this->filterFactory->createFilters($filters);
        
        return $this->repository->getProductVariantsTotalCount($productIdObj, $filtersObj);
    }
}