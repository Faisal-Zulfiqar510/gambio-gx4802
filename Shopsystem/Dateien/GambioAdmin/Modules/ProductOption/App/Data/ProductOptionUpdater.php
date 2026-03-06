<?php
/*--------------------------------------------------------------------
 ProductOptionUpdater.php 2021-09-23
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Data;

use Doctrine\DBAL\Connection;
use Exception;
use Gambio\Admin\Modules\ProductOption\App\Traits\ProductOptionFloatConverter;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\StorageOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;

/**
 * Class ProductOptionUpdater
 * @package Gambio\Admin\Modules\ProductOption\App\Data
 * @todo add column stocktype to this::updateProductOption && `products_attributes` table
 */
class ProductOptionUpdater
{
    use ProductOptionFloatConverter;
    
    /**
     * @var Connection
     */
    private $connection;
    
    
    /**
     * ProductOptionUpdater constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    /**
     * @param ProductOption ...$productOptions
     *
     * @throws StorageOfProductOptionsFailedException
     */
    public function storeProductOptions(ProductOption ...$productOptions): void
    {
        try {
            $this->connection->beginTransaction();
            
            array_map([$this, 'updateProductOption'], $productOptions);
    
            $this->connection->commit();
            
        } catch (Exception $exception) {
            $this->connection->rollBack();
            
            throw StorageOfProductOptionsFailedException::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param ProductOption $productOption
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function updateProductOption(ProductOption $productOption): void
    {
        [
            'prefix' => $pricePrefix,
            'value'  => $priceValue
        ] = $this->convertFloatToPositiveFloatAndPrefix($productOption->price());
    
        [
            'prefix' => $weightPrefix,
            'value'  => $weightValue
        ] = $this->convertFloatToPositiveFloatAndPrefix($productOption->weight());
        
        $this->connection->createQueryBuilder()
            ->update('products_attributes')
            ->set('options_values_price', ':options_values_price')
            ->set('price_prefix', ':price_prefix')
            ->set('attributes_model', ':attributes_model')
            ->set('attributes_stock', ':attributes_stock')
            ->set('stock_type', ':stock_type')
            ->set('options_values_weight', ':options_values_weight')
            ->set('weight_prefix', ':weight_prefix')
            ->set('sortorder', ':sortorder')
            ->where('products_attributes_id = :products_attributes_id')
            ->setParameter('options_values_price', $priceValue)
            ->setParameter('price_prefix', $pricePrefix)
            ->setParameter('attributes_model', $productOption->modelNumber())
            ->setParameter('attributes_stock', $productOption->stock())
            ->setParameter('stock_type', $productOption->stockType())
            ->setParameter('options_values_weight', $weightValue)
            ->setParameter('weight_prefix', $weightPrefix)
            ->setParameter('sortorder', $productOption->sortOrder())
            ->setParameter('products_attributes_id', $productOption->id())
            ->execute();
        
        $this->updateProductOptionImageList($productOption);
    }
    
    
    /**
     * @param ProductOption $productOption
     *
     * @throws \Doctrine\DBAL\Exception
     */
    private function updateProductOptionImageList(ProductOption $productOption): void
    {
        $this->connection->createQueryBuilder()
            ->delete('product_image_list_attribute')
            ->where('products_attributes_id = :products_attributes_id')
            ->setParameter(':products_attributes_id', $productOption->id())
            ->execute();
        
        if ($productOption->imageListId() !== null) {
    
            $this->connection->createQueryBuilder()
                ->insert('product_image_list_attribute')
                ->setValue('products_attributes_id', ':products_attributes_id')
                ->setValue('product_image_list_id', ':product_image_list_id')
                ->setParameter('products_attributes_id', $productOption->id())
                ->setParameter('product_image_list_id', $productOption->imageListId())
                ->execute();
        }
    }
}