<?php
/*--------------------------------------------------------------------
 ProductOptionDeleter.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Data;

use Doctrine\DBAL\Connection;
use Exception;
use Gambio\Admin\Modules\ProductDownload\Model\Exceptions\DeletionOfProductDownloadsFailedException;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionDeleter
 * @package Gambio\Admin\Modules\ProductDownload\App\Data
 */
class ProductDownloadDeleter
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
     * @throws DeletionOfProductDownloadsFailedException
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
            
            throw DeletionOfProductDownloadsFailedException::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param ProductId $productId
     *
     * @throws DeletionOfProductDownloadsFailedException
     */
    public function deleteAllProductDownloadsByProductId(ProductId $productId): void
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
        
            throw DeletionOfProductDownloadsFailedException::becauseOfException($exception);
        }
    }
}