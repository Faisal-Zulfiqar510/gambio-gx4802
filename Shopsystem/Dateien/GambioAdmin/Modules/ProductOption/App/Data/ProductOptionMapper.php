<?php
/*--------------------------------------------------------------------
 ProductOptionMapper.php 2021-08-17
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Data;

use Gambio\Admin\Modules\ProductOption\App\Traits\ProductOptionFloatConverter;
use Gambio\Admin\Modules\ProductOption\Model\Collections\ProductOptionIds;
use Gambio\Admin\Modules\ProductOption\Model\Collections\ProductOptions;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;

/**
 * Class ProductOptionMapper
 * @package Gambio\Admin\Modules\ProductOption\App\Data
 */
class ProductOptionMapper
{
    use ProductOptionFloatConverter;
    
    /**
     * @var ProductOptionFactory
     */
    private $factory;
    
    
    /**
     * ProductOptionMapper constructor.
     *
     * @param ProductOptionFactory $factory
     */
    public function __construct(ProductOptionFactory $factory)
    {
        $this->factory = $factory;
    }
    
    
    /**
     * @param array $productOptions
     *
     * @return ProductOptions
     */
    public function mapProductOptions(array $productOptions): ProductOptions
    {
        $options = array_map([$this, 'mapProductOption'], $productOptions);
        
        return ProductOptions::create(...$options);
    }
    
    
    /**
     * @param array $data
     *
     * @return ProductOption
     */
    public function mapProductOption(array $data): ProductOption
    {
        $productOptionId        = $this->mapProductOptionId((int)$data['products_attributes_id']);
        $productId              = $this->mapProductId((int)$data['products_id']);
        $optionAndOptionValueId = $this->mapOptionAndOptionValueId((int)$data['options_id'],
                                                                   (int)$data['option_value_id']);
        $imageListId            = $this->mapImageListId($data['product_image_list_id']
                                                        === null ? null : (int)$data['product_image_list_id']);
        $additionalWeight       = $this->convertPositiveFloatAndPrefixToFloat($data['weight_prefix'],
                                                                              (float)$data['options_values_weight']);
        $additionalPrice        = $this->convertPositiveFloatAndPrefixToFloat($data['price_prefix'],
                                                                              (float)$data['options_values_price']);
        $customization          = $this->mapOptionValueCustomization($data['attributes_model'],
                                                                     $additionalWeight,
                                                                     $additionalPrice);
        $stockType              = empty($data['stock_type']) ? ProductOptionStock::STOCK_TYPE_NOT_MANAGED : $data['stock_type'];
        $stock                  = $this->mapProductOptionStock((float)$data['attributes_stock'], $stockType);
        
        return ProductOption::create($productOptionId,
                                     $productId,
                                     $optionAndOptionValueId,
                                     $imageListId,
                                     $customization,
                                     $stock,
                                     (int)$data['sortorder']);
    }
    
    
    /**
     * @param int $productOptionId
     *
     * @return ProductOptionId
     */
    public function mapProductOptionId(int $productOptionId): ProductOptionId
    {
        return $this->factory->createProductOptionId($productOptionId);
    }
    
    
    /**
     * @param array $productOptionIds
     *
     * @return ProductOptionIds
     */
    public function mapProductOptionIds(array $productOptionIds): ProductOptionIds
    {
        return ProductOptionIds::create(...array_map([$this, 'mapProductOptionId'], $productOptionIds));
    }
    
    
    /**
     * @param int $productId
     *
     * @return ProductId
     */
    public function mapProductId(int $productId): ProductId
    {
        return $this->factory->createProductId($productId);
    }
    
    
    /**
     * @param int $optionId
     * @param int $optionValueId
     *
     * @return OptionAndOptionValueId
     */
    public function mapOptionAndOptionValueId(int $optionId, int $optionValueId): OptionAndOptionValueId
    {
        return $this->factory->createOptionAndOptionValueId($optionId, $optionValueId);
    }
    
    
    /**
     * @param int|null $imageListId
     *
     * @return ImageListId
     */
    public function mapImageListId(?int $imageListId): ImageListId
    {
        return $this->factory->createImageListId($imageListId);
    }
    
    
    /**
     * @param string $modelNumber
     * @param float  $weight
     * @param float  $price
     *
     * @return OptionValueCustomization
     */
    public function mapOptionValueCustomization(
        string $modelNumber,
        float $weight,
        float $price
    ): OptionValueCustomization {
        
        return $this->factory->createOptionValueCustomization($modelNumber, $weight, $price);
    }
    
    
    /**
     * @param float    $stock
     * @param string $stockType
     *
     * @return ProductOptionStock
     */
    public function mapProductOptionStock(float $stock, string $stockType): ProductOptionStock
    {
        return $this->factory->createProductOptionStock($stock, $stockType);
    }
}