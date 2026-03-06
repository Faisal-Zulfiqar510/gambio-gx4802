<?php
/*--------------------------------------------------------------------
 ProductOptionInserter.php 2021-07-19
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
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\InsertionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\ProductOptionAlreadyExistsException;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;

/**
 * Class ProductOptionInserter
 * @package Gambio\Admin\Modules\ProductOption\App\Data
 * @todo add column stocktype to this::insertProductOption && `products_attributes` table
 */
class ProductOptionInserter
{
    use ProductOptionFloatConverter;
    
    /**
     * @var Connection
     */
    private $connection;
    
    
    /**
     * ProductOptionInserter constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @param ProductId                $productId
     * @param OptionAndOptionValueId   $optionAndOptionValueId
     * @param ImageListId              $imageListId
     * @param OptionValueCustomization $optionValueCustomization
     * @param ProductOptionStock       $productOptionStock
     * @param int                      $sortOrder
     *
     * @return int
     *
     * @throws InsertionOfProductOptionsFailedException
     * @throws ProductOptionAlreadyExistsException
     */
    public function createProductOption(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        ImageListId $imageListId,
        OptionValueCustomization $optionValueCustomization,
        ProductOptionStock $productOptionStock,
        int $sortOrder = 0
    ): int {
    
    
        try {
            $this->connection->beginTransaction();
    
            if ($this->productOptionExists($productId, $optionAndOptionValueId)) {
        
                throw ProductOptionAlreadyExistsException::forProductIdAndOptionAndOptionValueId($productId, $optionAndOptionValueId);
            }
            
            $productOptionId = $this->insertProductOption($productId,
                                                          $optionAndOptionValueId,
                                                          $optionValueCustomization,
                                                          $productOptionStock,
                                                          $sortOrder);
            
            $this->insertImageListId($productOptionId, $imageListId);
            
            $this->connection->commit();
            
            return $productOptionId;
            
        } catch (ProductOptionAlreadyExistsException $alreadyExistsException) {
            
            throw $alreadyExistsException;
        } catch (Exception $exception) {
            $this->connection->rollBack();
    
            throw InsertionOfProductOptionsFailedException::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param ProductId                $productId
     * @param OptionAndOptionValueId   $optionAndOptionValueId
     * @param OptionValueCustomization $optionValueCustomization
     * @param ProductOptionStock       $productOptionStock
     * @param int                      $sortOrder
     *
     * @return int
     */
    private function insertProductOption(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId,
        OptionValueCustomization $optionValueCustomization,
        ProductOptionStock $productOptionStock,
        int $sortOrder = 0
    ): int {
    
        [
            'prefix' => $pricePrefix,
            'value'  => $priceValue
        ] = $this->convertFloatToPositiveFloatAndPrefix($optionValueCustomization->price());
    
        [
            'prefix' => $weightPrefix,
            'value'  => $weightValue
        ] = $this->convertFloatToPositiveFloatAndPrefix($optionValueCustomization->weight());
    
        $this->connection->createQueryBuilder()
            ->insert('products_attributes')
            ->setValue('products_id', ':products_id')
            ->setValue('options_id', '(SELECT DISTINCT `products_options_id` FROM `products_options` WHERE `options_id` = ' . $optionAndOptionValueId->optionId() . ')')
            ->setValue('options_values_id', '(SELECT DISTINCT `products_options_values_id` FROM `products_options_values` WHERE `option_value_id` = ' . $optionAndOptionValueId->optionValueId() . ')')
            ->setValue('options_values_price', ':options_values_price')
            ->setValue('price_prefix', ':price_prefix')
            ->setValue('attributes_model', ':attributes_model')
            ->setValue('attributes_stock', ':attributes_stock')
            ->setValue('stock_type', ':stock_type')
            ->setValue('options_values_weight', ':options_values_weight')
            ->setValue('weight_prefix', ':weight_prefix')
            ->setValue('sortorder', ':sortorder')
            ->setParameter('products_id', $productId->value())
            ->setParameter('options_values_price', $priceValue)
            ->setParameter('price_prefix', $pricePrefix)
            ->setParameter('attributes_model', $optionValueCustomization->modelNumber())
            ->setParameter('attributes_stock', $productOptionStock->stock())
            ->setParameter('stock_type', $productOptionStock->stockType())
            ->setParameter('options_values_weight', $optionValueCustomization->weight())
            ->setParameter('options_values_weight', $weightValue)
            ->setParameter('weight_prefix', $weightPrefix)
            ->setParameter('sortorder', $sortOrder)
            ->execute();
        
        return (int)$this->connection->lastInsertId();
    }
    
    
    /**
     * @param array $creationArguments
     *
     * @return int[]
     *
     * @throws InsertionOfProductOptionsFailedException
     * @throws ProductOptionAlreadyExistsException
     */
    public function createMultipleProductOptions(array ...$creationArguments): array
    {
        $result = [];
        
        foreach ($creationArguments as $creationArgument) {
            
            $result[] = $this->createProductOption(...$creationArgument);
        }
        
        return $result;
    }
    
    
    /**
     * @param int         $productOptionId
     * @param ImageListId $imageListId
     */
    private function insertImageListId(int $productOptionId, ImageListId $imageListId)
    {
        if ($imageListId->value() !== null) {
            
            $this->connection->createQueryBuilder()
                ->insert('product_image_list_attribute')
                ->setValue('products_attributes_id', ':products_attributes_id')
                ->setValue('product_image_list_id', ':product_image_list_id')
                ->setParameter('products_attributes_id', $productOptionId)
                ->setParameter('product_image_list_id', $imageListId->value())
                ->execute();
        }
    }
    
    
    /**
     * @param ProductId              $productId
     * @param OptionAndOptionValueId $optionAndOptionValueId
     *
     * @return bool
     */
    private function productOptionExists(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId
    ): bool {
    
        return $this->connection->createQueryBuilder()
                   ->select('*')
                   ->from('products_attributes', 'pa')
                   ->leftJoin('pa',
                              'products_options_values',
                              'pov',
                              'pov.products_options_values_id=pa.options_values_id')
                   ->leftJoin('pa',
                              'product_image_list_attribute',
                              'pila',
                              'pa.products_attributes_id=pila.products_attributes_id')
                   ->leftJoin('pa', 'products_options', 'po', 'po.products_options_id=pa.options_id')
                   ->where('pa.products_id=:products_id')
                   ->andWhere('po.options_id=:options_id')
                   ->andWhere('pov.option_value_id=:option_value_id')
                   ->setParameter(':products_id', $productId->value())
                   ->setParameter(':options_id', $optionAndOptionValueId->optionId())
                   ->setParameter(':option_value_id', $optionAndOptionValueId->optionValueId())
                   ->execute()
                   ->rowCount() !== 0;
    }
}