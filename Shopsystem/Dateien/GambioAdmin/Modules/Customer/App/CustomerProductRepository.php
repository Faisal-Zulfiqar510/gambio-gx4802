<?php
/*--------------------------------------------------------------
   CustomerProductRepository.php 2022-07-05
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\App;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Admin\Modules\Customer\App\Data\DTO\Collections\ProductDTOs;
use Gambio\Admin\Modules\Customer\App\Data\DTO\ProductDTO;

/**
 * Class CustomerProductRepository
 *
 * @package    Gambio\Admin\Modules\Customer\App
 * @deprecated this will be removed once were is a products
 *             read service in the GambioAdmin namespace
 */
class CustomerProductRepository
{
    private Connection $connection;
    
    
    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @param int $languageId
     * @param int ...$productIds
     *
     * @return ProductDTOs
     * @deprecated this will be removed once were is a products
     *             read service in the GambioAdmin namespace
     */
    public function getProductsNameAndImage(int $languageId, int ...$productIds): ProductDTOs
    {
        $result = [];
        
        if (count($productIds)) {
    
            $columns    = implode(', ', [
                'p.products_id',
                'pd.products_name',
                'p.products_image',
            ]);
            $productIds = implode(', ', $productIds);
    
            $data = $this->connection->createQueryBuilder()
                ->select($columns)
                ->from('products', 'p')
                ->innerJoin('p', 'products_description', 'pd', 'pd.products_id=p.products_id')
                ->groupBy($columns)
                ->where(sprintf('p.products_id IN (%s)', $productIds))
                ->andWhere('pd.language_id=:language_id')
                ->setParameter('language_id', $languageId)
                ->execute()
                ->fetchAll(FetchMode::ASSOCIATIVE);
    
            foreach ($data as ['products_id' => $id, 'products_name' => $name, 'products_image' => $image]) {
        
                $result[] = new ProductDTO((int)$id, $name, $image);
            }
        }
        
        return new ProductDTOs(...$result);
    }
}