<?php
/*--------------------------------------------------------------------
 ProductOptionReadService.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\ProductOption\Model\Collections\ProductOptions;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository as ProductOptionRepositoryInterface;

/**
 * Class ProductOptionReadService
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionReadService implements ProductOptionReadServiceInterface
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
     * ProductOptionReadService constructor.
     *
     * @param ProductOptionRepositoryInterface $repository
     * @param ProductOptionFactory             $factory
     */
    public function __construct(
        ProductOptionRepositoryInterface $repository,
        ProductOptionFactory $factory
    ) {
        $this->repository = $repository;
        $this->factory = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductOptionsByProductId(int $productId): ProductOptions
    {
        return $this->repository->getProductOptionsByProductId($this->factory->createProductId($productId));
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductOptionById(int $productOptionId): ProductOption
    {
        return $this->repository->getProductOptionById($this->factory->createProductOptionId($productOptionId));
    }
}