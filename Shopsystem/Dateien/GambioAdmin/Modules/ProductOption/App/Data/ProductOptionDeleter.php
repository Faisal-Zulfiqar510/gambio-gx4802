<?php
/*--------------------------------------------------------------------
 ProductOptionDeleter.php 2021-04-09
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
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\DeletionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionDeleter
 * @package Gambio\Admin\Modules\ProductOption\App\Data
 */
class ProductOptionDeleter
{
    /**
     * @var Connection
     */
    private $connection;
    
    
    /**
     * ProductOptionDeleter constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @param ProductOptionId ...$ids
     *
     * @throws DeletionOfProductOptionsFailedException
     */
    public function deleteProductOptions(ProductOptionId ...$ids): void
    {
        try {
            
            $this->connection->beginTransaction();
            
            $ids = array_map(static function(ProductOptionId $productOptionId) : int {
                return $productOptionId->value();
            }, $ids);
            
            $this->connection->createQueryBuilder()
                ->delete('products_attributes')
                ->where('products_attributes_id IN (' . implode(',', $ids) . ')')
                ->execute();
            
            $this->connection->createQueryBuilder()
                ->delete('product_image_list_attribute')
                ->where('products_attributes_id IN (' . implode(',', $ids) . ')')
                ->execute();
    
            $this->connection->commit();
            
        } catch (Exception $exception) {
            
            $this->connection->rollBack();
            
            throw DeletionOfProductOptionsFailedException::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param ProductId $productId
     *
     * @throws DeletionOfProductOptionsFailedException
     */
    public function deleteAllProductOptionsByProductId(ProductId $productId): void
    {
        try {
        
            $this->connection->beginTransaction();
            
            $attributeIdsSubQuery = '
                SELECT `products_attributes_id`
                FROM products_attributes WHERE `products_id` = ' . $productId->value();
        
            $this->connection->createQueryBuilder()
                ->delete('product_image_list_attribute')
                ->where('products_attributes_id IN (' . $attributeIdsSubQuery . ')')
                ->execute();
    
            $this->connection->createQueryBuilder()
                ->delete('products_attributes')
                ->where('products_id = :products_id')
                ->setParameter(':products_id', $productId->value())
                ->execute();
    
            $this->connection->commit();
        
        } catch (Exception $exception) {
        
            $this->connection->rollBack();
        
            throw DeletionOfProductOptionsFailedException::becauseOfException($exception);
        }
    }
}