<?php
/*--------------------------------------------------------------------
 ProductOption.php 2021-08-31
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model;

use Gambio\Admin\Modules\ProductOption\Model\Events\ProductOptionsImageListIdUpdated;
use Gambio\Admin\Modules\ProductOption\Model\Events\ProductOptionsSortOrderUpdated;
use Gambio\Admin\Modules\ProductOption\Model\Events\ProductOptionsStockUpdated;
use Gambio\Admin\Modules\ProductOption\Model\Events\ProductOptionsValueCustomizationUpdated;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;
use Gambio\Core\Event\Abstracts\AbstractEventRaisingEntity;
use InvalidArgumentException;

/**
 * Class ProductOption
 * @package Gambio\Admin\Modules\ProductOption\Model
 */
class ProductOption extends AbstractEventRaisingEntity
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
     * @var ProductOptionStock
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
     * @param ProductOptionStock       $productOptionStock
     * @param int                      $sortOrder
     */
    private function __construct(
        ProductOptionId $productOptionId,
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductOptionStock $productOptionStock,
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
     * @param ProductOptionStock       $productOptionStock
     * @param int                      $sortOrder
     *
     * @return ProductOption
     */
    public static function create(
        ProductOptionId $productOptionId,
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductOptionStock $productOptionStock,
        int $sortOrder = 0
    ): ProductOption {
        
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
        $this->raiseEvent(ProductOptionsImageListIdUpdated::create($this->id, $imageListId));
    }
    
    
    /**
     * @param OptionValueCustomization $optionValueCustomization
     */
    public function changeOptionValueCustomization(OptionValueCustomization $optionValueCustomization): void
    {
        $this->optionValueCustomization = $optionValueCustomization;
        $this->raiseEvent(ProductOptionsValueCustomizationUpdated::create($this->id, $optionValueCustomization));
    }
    
    
    /**
     * @param ProductOptionStock $productOptionStock
     */
    public function changeProductOptionStock(ProductOptionStock $productOptionStock): void
    {
        $this->productOptionStock = $productOptionStock;
        $this->raiseEvent(ProductOptionsStockUpdated::create($this->id, $productOptionStock));
    }
    
    
    /**
     * @param int $sorOrder
     */
    public function changeSortOrder(int $sorOrder): void
    {
        $this->sortOrder = $sorOrder;
        $this->raiseEvent(ProductOptionsSortOrderUpdated::create($this->id, $sorOrder));
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