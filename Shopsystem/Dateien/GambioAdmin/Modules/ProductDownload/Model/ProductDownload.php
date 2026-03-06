<?php
/*--------------------------------------------------------------------
 ProductDownload.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model;

use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadImageListIdUpdated;
use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadsSortOrderUpdated;
use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadsStockUpdated;
use Gambio\Admin\Modules\ProductDownload\Model\Events\ProductDownloadsValueCustomizationUpdated;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductDownloadStock;
use Gambio\Core\Event\Abstracts\AbstractEventRaisingEntity;
use InvalidArgumentException;

/**
 * Class ProductDownload
 * @package Gambio\Admin\Modules\ProductDownload\Model
 */
class ProductDownload extends AbstractEventRaisingEntity
{
    /**
     * @var ProductOptionId
     */
    private $id;
    
    /**
     * @var ProductId
     */
    private $productId;
    
    /**
     * @var OptionAndOptionValueId
     */
    private $optionAndOptionValueId;
    
    /**
     * @var ImageListId
     */
    private $imageListId;
    
    /**
     * @var OptionValueCustomization
     */
    private $optionValueCustomization;
    
    /**
     * @var ProductDownloadStock
     */
    private $productOptionStock;
    
    /**
     * @var int
     */
    private $sortOrder;
    
    
    /**
     * ProductOption constructor.
     *
     * @param ProductOptionId          $productOptionId
     * @param ProductId                $productId
     * @param OptionAndOptionValueId   $optionAndOptionValueId
     * @param ImageListId              $imageListId
     * @param OptionValueCustomization $optionValueCustomization
     * @param ProductDownloadStock     $productOptionStock
     * @param int                      $sortOrder
     */
    private function __construct(
        ProductOptionId $productOptionId,
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductDownloadStock $productOptionStock,
        int $sortOrder = 0
    ) {
        $this->id                       = $productOptionId;
        $this->productId                = $productId;
        $this->optionAndOptionValueId   = $optionAndOptionValueId;
        $this->imageListId              = $imageListId;
        $this->optionValueCustomization = $optionValueCustomization;
        $this->productOptionStock       = $productOptionStock;
        $this->sortOrder                = $sortOrder;
    }
    
    
    /**
     * @param ProductOptionId          $productOptionId
     * @param ProductId                $productId
     * @param OptionAndOptionValueId   $optionAndOptionValueId
     * @param ImageListId              $imageListId
     * @param OptionValueCustomization $optionValueCustomization
     * @param ProductDownloadStock     $productOptionStock
     * @param int                      $sortOrder
     *
     * @return ProductDownload
     */
    public static function create(
        ProductOptionId $productOptionId,
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductDownloadStock $productOptionStock,
        int $sortOrder = 0
    ): ProductDownload {
        
        return new self($productOptionId,
                        $productId,
                        $optionAndOptionValueId,
                        $imageListId,
                        $optionValueCustomization,
                        $productOptionStock,
                        $sortOrder);
    }
    
    
    /**
     * @param ImageListId $imageListId
     */
    public function changeImageListId(ImageListId $imageListId): void
    {
        $this->imageListId = $imageListId;
        $this->raiseEvent(ProductDownloadImageListIdUpdated::create($this->id, $imageListId));
    }
    
    
    /**
     * @param OptionValueCustomization $optionValueCustomization
     */
    public function changeOptionValueCustomization(OptionValueCustomization $optionValueCustomization): void
    {
        $this->optionValueCustomization = $optionValueCustomization;
        $this->raiseEvent(ProductDownloadsValueCustomizationUpdated::create($this->id, $optionValueCustomization));
    }
    
    
    /**
     * @param ProductDownloadStock $productOptionStock
     */
    public function changeProductOptionStock(ProductDownloadStock $productOptionStock): void
    {
        $this->productOptionStock = $productOptionStock;
        $this->raiseEvent(ProductDownloadsStockUpdated::create($this->id, $productOptionStock));
    }
    
    
    /**
     * @param int $sorOrder
     */
    public function changeSortOrder(int $sorOrder): void
    {
        $this->sortOrder = $sorOrder;
        $this->raiseEvent(ProductDownloadsSortOrderUpdated::create($this->id, $sorOrder));
    }
    
    
    /**
     * @return int
     */
    public function id(): int
    {
        return $this->id->value();
    }
    
    
    /**
     * @return int
     */
    public function productId(): int
    {
        return $this->productId->value();
    }
    
    
    /**
     * @return int|null
     */
    public function imageListId(): ?int
    {
        return $this->imageListId->value();
    }
    
    
    /**
     * @return int
     */
    public function optionId(): int
    {
        return $this->optionAndOptionValueId->optionId();
    }
    
    
    /**
     * @return int
     */
    public function optionValueId(): int
    {
        return $this->optionAndOptionValueId->optionValueId();
    }
    
    
    /**
     * @return int
     */
    public function sortOrder(): int
    {
        return $this->sortOrder;
    }
    
    
    /**
     * @return string
     */
    public function modelNumber(): string
    {
        return $this->optionValueCustomization->modelNumber();
    }
    
    
    /**
     * @return float
     */
    public function weight(): float
    {
        return $this->optionValueCustomization->weight();
    }
    
    
    /**
     * @return float
     */
    public function price(): float
    {
        return $this->optionValueCustomization->price();
    }
    
    
    /**
     * @return string
     */
    public function stockType(): string
    {
        return $this->productOptionStock->stockType();
    }
    
    
    /**
     * @return float
     */
    public function stock(): float
    {
        return $this->productOptionStock->stock();
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return [
            'id'            => $this->id(),
            'productId'     => $this->productId(),
            'imageListId'   => $this->imageListId(),
            'optionId'      => $this->optionId(),
            'optionValueId' => $this->optionValueId(),
            'sortOrder'     => $this->sortOrder(),
            'modelNumber'   => $this->modelNumber(),
            'weight'        => $this->weight(),
            'price'         => $this->price(),
            'stockType'     => $this->stockType(),
            'stock'         => $this->stock(),
        ];
    }
}