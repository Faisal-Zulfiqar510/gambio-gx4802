<?php
/* --------------------------------------------------------------
  ProductOptionFilterService.php 2021-04-09
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2021 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\ProductOption\App\Data\Filter\ProductOptionFilterFactory;
use Gambio\Admin\Modules\ProductOption\Model\Collections\ProductOptions;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFilterService as ProductOptionFilterServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository as ProductOptionRepositoryInterface;

/**
 * Class ProductOptionFilterService
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionFilterService implements ProductOptionFilterServiceInterface
{
    /**
     * @var ProductOptionFilterFactory
     */
    private $filterFactory;
    
    /**
     * @var ProductOptionRepositoryInterface
     */
    private $repository;
    
    /**
     * @var ProductOptionFactory
     */
    private $domainFactory;
    
    
    /**
     * ProductOptionFilterService constructor.
     *
     * @param ProductOptionFilterFactory       $filterFactory
     * @param ProductOptionRepositoryInterface $repository
     * @param ProductOptionFactory             $domainFactory
     */
    public function __construct(
        ProductOptionFilterFactory $filterFactory,
        ProductOptionRepositoryInterface $repository,
        ProductOptionFactory $domainFactory
    ) {
        $this->filterFactory = $filterFactory;
        $this->repository    = $repository;
        $this->domainFactory = $domainFactory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function filterProductOptions(
        int $productId,
        array $filters,
        ?string $sorting = null,
        int $limit = 25,
        int $offset = 0
    ): ProductOptions {
    
        $productIdObj = $this->domainFactory->createProductId($productId);
        $filtersObj   = $this->filterFactory->createFilters($filters);
        $sortingObj   = $this->filterFactory->createSorting($sorting);
        $pagination   = $this->filterFactory->createPagination($limit, $offset);
    
        return $this->repository->filterProductOptions($productIdObj, $filtersObj, $sortingObj, $pagination);
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductOptionsTotalCount(int $productId, array $filters): int
    {
        $productIdObj = $this->domainFactory->createProductId($productId);
        $filtersObj   = $this->filterFactory->createFilters($filters);
    
        return $this->repository->getProductOptionsTotalCount($productIdObj, $filtersObj);
    }
}