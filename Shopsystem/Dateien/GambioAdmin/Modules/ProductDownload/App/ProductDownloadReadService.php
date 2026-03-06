<?php
/*--------------------------------------------------------------------
 ProductDownloadReadService.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App;

use Gambio\Admin\Modules\ProductDownload\Model\Collections\ProductDownloads;
use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadFactory;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadRepository as ProductDownloadRepositoryInterface;

/**
 * Class ProductDownloadReadService
 * @package Gambio\Admin\Modules\ProductDownload\App
 */
class ProductDownloadReadService implements ProductDownloadReadServiceInterface
{
    /**
     * @var ProductDownloadRepositoryInterface
     */
    private $repository;
    
    /**
     * @var ProductDownloadFactory
     */
    private $factory;
    
    
    /**
     * ProductDownloadReadService constructor.
     *
     * @param ProductDownloadRepositoryInterface $repository
     * @param ProductDownloadFactory             $factory
     */
    public function __construct(
        ProductDownloadRepositoryInterface $repository,
        ProductDownloadFactory $factory
    ) {
        $this->repository = $repository;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductDownloadsByProductId(int $productId): ProductDownloads
    {
        return $this->repository->getProductDownloadsByProductId($this->factory->createProductId($productId));
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductDownloadById(int $productOptionId): ProductDownload
    {
        return $this->repository->getProductDownloadById($this->factory->createProductOptionId($productOptionId));
    }
}