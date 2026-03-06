<?php
/*--------------------------------------------------------------------
 ProductOptionFactory.php 2021-08-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Services;

use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;

/**
 * Class ProductOptionFactory
 * @package Gambio\Admin\Modules\ProductOption\Services
 * @internal No method for creation Aggregate root / collection
 */
class ProductOptionFactory
{
    /**
     * @param int $productOptionId
     *
     * @return ProductOptionId
     */
    public function createProductOptionId(int $productOptionId): ProductOptionId
    {
        return ProductOptionId::create($productOptionId);
    }
    
    
    /**
     * @param int $productId
     *
     * @return ProductId
     */
    public function createProductId(int $productId): ProductId
    {
        return ProductId::create($productId);
    }
    
    
    /**
     * @param int $optionId
     * @param int $optionValueId
     *
     * @return OptionAndOptionValueId
     */
    public function createOptionAndOptionValueId(
        int $optionId, 
        int $optionValueId
    ): OptionAndOptionValueId {
        
        return OptionAndOptionValueId::create($optionId, $optionValueId);
    }
    
    
    /**
     * @param int|null $imageListId
     *
     * @return ImageListId
     */
    public function createImageListId(?int $imageListId): ImageListId
    {
        return $imageListId === null ? ImageListId::createAsNonExistent() : ImageListId::createAsExisting($imageListId);
    }
    
    
    /**
     * @param string $modelNumber
     * @param float  $weight
     * @param float  $price
     *
     * @return OptionValueCustomization
     */
    public function createOptionValueCustomization(
        string $modelNumber,
        float $weight,
        float $price
    ): OptionValueCustomization {
        
        return OptionValueCustomization::create($modelNumber, $weight, $price);
    }
    
    
    /**
     * @param float    $stock
     * @param string $stockType
     *
     * @return ProductOptionStock
     */
    public function createProductOptionStock(
        float $stock = 0,
        string $stockType = ProductOptionStock::STOCK_TYPE_NOT_MANAGED
    ): ProductOptionStock {
        
        return ProductOptionStock::create($stock, $stockType);
    }
}