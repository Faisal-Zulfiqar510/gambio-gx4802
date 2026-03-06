<?php
/*--------------------------------------------------------------------
 ProductDownloadFactory.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Services;

use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductDownloadStock;

/**
 * Class ProductDownloadFactory
 * @package Gambio\Admin\Modules\ProductDownload\Services
 * @internal No method for creation Aggregate root / collection
 * @codeCoverageIgnore
 */
class ProductDownloadFactory
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
     * @return ProductDownloadStock
     */
    public function createProductDownloadStock(
        float $stock = 0,
        string $stockType = ProductDownloadStock::STOCK_TYPE_NOT_MANAGED
    ): ProductDownloadStock {
        
        return ProductDownloadStock::create($stock, $stockType);
    }
}