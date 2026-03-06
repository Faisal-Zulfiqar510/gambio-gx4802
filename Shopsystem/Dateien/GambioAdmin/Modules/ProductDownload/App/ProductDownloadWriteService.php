<?php
/*--------------------------------------------------------------------
 ProductDownloadWriteService.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App;

use Gambio\Admin\Modules\ProductDownload\Model\Collections\ProductOptionIds;
use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductDownloadStock;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadFactory;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadRepository as ProductDownloadRepositoryInterface;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadWriteService as ProductDownloadWriteServiceInterface;

/**
 * Class ProductDownloadWriteService
 * @package Gambio\Admin\Modules\ProductDownload\App
 */
class ProductDownloadWriteService implements ProductDownloadWriteServiceInterface
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
     * ProductDownloadWriteService constructor.
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
    public function createProductDownload(
        int $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductDownloadStock $productDownloadStock,
        int $sortOrder = 0
    ): ProductOptionId {
        
        return $this->repository->createProductDownload($this->factory->createProductId($productId),
                                                        $optionAndOptionValueId,
                                                        $imageListId,
                                                        $optionValueCustomization,
                                                        $productDownloadStock,
                                                        $sortOrder);
    }
    
    
    /**
     * @inheritDoc
     */
    public function createMultipleProductDownloads(array ...$creationArguments): ProductOptionIds
    {
        return $this->repository->createMultipleProductDownloads(...$creationArguments);
    }
    
    
    /**
     * @inheritDoc
     */
    public function storeProductDownloads(ProductDownload ...$productDownloads): void
    {
        $this->repository->storeProductDownloads(...$productDownloads);
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteProductDownloads(int ...$ids): void
    {
        $this->repository->deleteProductDownloads(...array_map([$this->factory, 'createProductOptionId'], $ids));
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteAllProductDownloadsByProductId(int $productId): void
    {
        $productId = $this->factory->createProductId($productId);
        
        $this->repository->deleteAllProductDownloadsByProductId($productId);
    }
}