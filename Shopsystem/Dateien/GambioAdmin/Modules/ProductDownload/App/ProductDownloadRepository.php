<?php
/*--------------------------------------------------------------------
 ProductDownloadRepository.php 2021-10-12
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App;

use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadDeleter;
use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadInserter;
use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadMapper;
use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadReader;
use Gambio\Admin\Modules\ProductDownload\App\Data\ProductDownloadUpdater;
use Gambio\Admin\Modules\ProductDownload\Model\Collections\ProductOptionIds;
use Gambio\Admin\Modules\ProductDownload\Model\Collections\ProductDownloads;
use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadCreated;
use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadDeleted;
use Gambio\Admin\Modules\ProductDownload\Model\Exceptions\OperationHasNotBeenPermittedException;
use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductDownloadStock;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadOperationPermitter;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadRepository as ProductDownloadRepositoryInterface;
use Gambio\Core\Event\Abstracts\AbstractEventDispatchingRepository;
use Gambio\Core\Filter\Filters;
use Gambio\Core\Filter\Pagination;
use Gambio\Core\Filter\Sorting;
use Psr\EventDispatcher\EventDispatcherInterface;

/**
 * Class ProductDownloadRepository
 * @package Gambio\Admin\Modules\ProductDownload\App
 */
class ProductDownloadRepository extends AbstractEventDispatchingRepository implements ProductDownloadRepositoryInterface
{
    
    /**
     * @var ProductDownloadMapper
     */
    private $mapper;
    
    /**
     * @var ProductDownloadReader
     */
    private $reader;
    
    /**
     * @var ProductDownloadDeleter
     */
    private $deleter;
    
    /**
     * @var ProductDownloadInserter
     */
    private $inserter;
    
    /**
     * @var ProductDownloadUpdater
     */
    private $updater;
    
    /**
     * @var ProductDownloadOperationPermitter[]
     */
    private $permitters = [];
    
    
    /**
     * ProductDownloadRepository constructor.
     *
     * @param ProductDownloadMapper    $mapper
     * @param ProductDownloadReader    $reader
     * @param ProductDownloadDeleter   $deleter
     * @param ProductDownloadInserter  $inserter
     * @param ProductDownloadUpdater   $updater
     * @param EventDispatcherInterface $dispatcher
     */
    public function __construct(
        ProductDownloadMapper $mapper,
        ProductDownloadReader $reader,
        ProductDownloadDeleter $deleter,
        ProductDownloadInserter $inserter,
        ProductDownloadUpdater $updater,
        EventDispatcherInterface $dispatcher
    ) {
        $this->mapper   = $mapper;
        $this->reader   = $reader;
        $this->deleter  = $deleter;
        $this->inserter = $inserter;
        $this->updater  = $updater;
        
        $this->setEventDispatcher($dispatcher);
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductDownloadsByProductId(ProductId $productId): ProductDownloads
    {
        return $this->mapper->mapProductDownloads($this->reader->getProductOptionsByProductId($productId->value()));
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductDownloadById(ProductOptionId $productOptionId): ProductDownload
    {
        return $this->mapper->mapProductDownload($this->reader->getProductOptionById($productOptionId->value()));
    }
    
    
    /**
     * @inheritDoc
     */
    public function filterProductDownloads(
        ProductId $productId,
        Filters $filters,
        Sorting $sorting,
        Pagination $pagination
    ): ProductDownloads {
        
        return $this->mapper->mapProductDownloads($this->reader->filterProductDownloads($productId,
                                                                                    $filters,
                                                                                    $sorting,
                                                                                    $pagination));
    }
    
    
    /**
     * @inheritDoc
     */
    public function getProductDownloadsTotalCount(ProductId $productId, Filters $filters): int
    {
        return $this->reader->getProductDownloadsTotalCount($productId, $filters);
    }
    
    
    /**
     * @inheritDoc
     */
    public function createProductDownload(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductDownloadStock $productDownloadStock,
        int $sortOrder = 0
    ): ProductOptionId {
    
        $creationArguments = [
            $productId,
            $optionAndOptionValueId,
            $imageListId,
            $optionValueCustomization,
            $productDownloadStock,
            $sortOrder,
        ];
        
        foreach ($this->permitters as $permitter) {
        
            if ($permitter->permitsCreations(...$creationArguments) === false) {
            
                throw OperationHasNotBeenPermittedException::forCreationByPermitter($permitter);
            }
        }
        
        $productOptionId = $this->inserter->createProductDownload($productId,
                                                                  $optionAndOptionValueId,
                                                                  $imageListId,
                                                                  $optionValueCustomization,
                                                                  $productDownloadStock,
                                                                  $sortOrder);
    
        $productOptionId = $this->mapper->mapProductOptionId($productOptionId);
        
        $this->dispatchEvent(ProductDownloadCreated::create($productOptionId));
        
        return $productOptionId;
    }
    
    
    /**
     * @inheritDoc
     */
    public function createMultipleProductDownloads(array ...$creationArguments): ProductOptionIds
    {
        foreach ($this->permitters as $permitter) {
        
            if ($permitter->permitsCreations(...$creationArguments) === false) {
            
                throw OperationHasNotBeenPermittedException::forCreationByPermitter($permitter);
            }
        }
        
        $productOptionIds = $this->inserter->createMultipleProductDownloads(...$creationArguments);
        $productOptionIds = $this->mapper->mapProductOptionIds($productOptionIds);
    
        foreach ($productOptionIds as $productOptionId) {
            
            $this->dispatchEvent(ProductDownloadCreated::create($productOptionId));
        }
        
        return $productOptionIds;
    }
    
    
    /**
     * @inheritDoc
     */
    public function storeProductDownloads(ProductDownload ...$productDownloads): void
    {
        foreach ($this->permitters as $permitter) {
        
            if ($permitter->permitsStorages(...$productDownloads) === false) {
            
                throw OperationHasNotBeenPermittedException::forStorageByPermitter($permitter);
            }
        }
        
        $this->updater->storeProductDownloads(...$productDownloads);
    
        foreach ($productDownloads as $productDownload) {
            
            $this->dispatchEntityEvents($productDownload);
        }
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteProductDownloads(ProductOptionId ...$ids): void
    {
        foreach ($this->permitters as $permitter) {
        
            if ($permitter->permitsDeletions(...$ids) === false) {
            
                throw OperationHasNotBeenPermittedException::forDeletionByPermitter($permitter);
            }
        }
        
        $this->deleter->deleteProductOptions(...$ids);
    
        foreach ($ids as $id) {
            
            $this->dispatchEvent(ProductDownloadDeleted::create($id));
        }
    }
    
    
    /**
     * @inheritDoc
     */
    public function deleteAllProductDownloadsByProductId(ProductId $productId): void
    {
        $productOptionIds = $this->reader->getProductOptionIdsByProductId($productId->value());
        
        if (count($productOptionIds)) {
            
            $productOptionIds = $this->mapper->mapProductOptionIds($productOptionIds);
    
            foreach ($this->permitters as $permitter) {
        
                foreach ($productOptionIds as $productOptionId) {
            
                    if ($permitter->permitsDeletions($productOptionId) === false) {
                
                        throw OperationHasNotBeenPermittedException::forDeletionByPermitter($permitter);
                    }
                }
            }
            
            $this->deleter->deleteAllProductDownloadsByProductId($productId);
        
            foreach ($productOptionIds as $productOptionId) {
                
                $this->dispatchEvent(ProductDownloadDeleted::create($productOptionId));
            }
        }
    }
    
    /**
     * @inheritDoc
     */
    public function registerOperationPermitter(ProductDownloadOperationPermitter $permitter): void
    {
        $this->permitters[get_class($permitter)] = $permitter;
    }
}