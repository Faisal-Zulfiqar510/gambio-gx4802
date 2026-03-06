<?php
/* --------------------------------------------------------------
   AfterbuyCatalogRepository.php 2022-10-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\DBAL\ParameterType;
use GXModules\Gambio\Afterbuy\Admin\Classes\Catalogs\ValueObjects\AfterbuyCatalog;

class AfterbuyCatalogRepository
{
    private Connection $connection;
    
    
    public function __construct(Connection $connection)
    {
        
        $this->connection = $connection;
    }
    
    
    public function wipeCatalogs(): void
    {
        $this->connection->executeQuery('TRUNCATE afterbuy_catalogs');
    }
    
    
    public function addCatalog(AfterbuyCatalog $catalog): void
    {
        $rowData = [
            'catalog_id'     => $catalog->getCatalogID(),
            'parent_id'      => $catalog->getParentID(),
            'name'           => $catalog->getName(),
            'description'    => $catalog->getDescription(),
            'level'          => $catalog->getLevel(),
            'position'       => $catalog->getPosition(),
            'additionaltext' => $catalog->getAdditionalText(),
            'show_catalog'   => $catalog->isShow() ? 1 : 0,
            'picture1'       => $catalog->getPicture1(),
            'picture2'       => $catalog->getPicture2(),
            'titlepicture'   => $catalog->getTitlePicture(),
        ];
        $this->connection->insert('afterbuy_catalogs', $rowData);
        
        $products = $catalog->getCatalogProducts();
        $this->deleteProductsFromCatalog($catalog->getCatalogID());
        foreach ($products as $afterbuyProductId) {
            $this->addProductToCatalog($catalog->getCatalogID(), $afterbuyProductId);
        }
    }
    
    
    /**
     * @param int $catalogId
     *
     * @return void
     * @throws Exception
     */
    protected function deleteProductsFromCatalog(int $catalogId): void
    {
        $table = 'afterbuy_products_to_catalogs';
        $this->connection->delete($table, ['catalog_id' => $catalogId]);
    }
    
    
    /**
     * @param int $catalogId
     * @param int $productId
     *
     * @return void
     * @throws Exception
     */
    protected function addProductToCatalog(int $catalogId, int $productId): void
    {
        $table = 'afterbuy_products_to_catalogs';
        $this->connection->insert($table, ['catalog_id' => $catalogId, 'product_id' => $productId]);
    }
    
    
    /**
     * @param int $afterbuyProductId
     *
     * @return array
     * @throws Exception
     */
    public function getCategoryIdsForAfterbuyProductId(int $afterbuyProductId): array
    {
        $queryBuilder = $this->connection->createQueryBuilder();
        $queryBuilder->from('afterbuy_products_to_catalogs', 'p2c')
            ->join('p2c', 'afterbuy_catalogs_to_categories', 'c2c', 'c2c.catalog_id = p2c.catalog_id')
            ->where('p2c.product_id = ' . $afterbuyProductId)
            ->select('category_id');
        $rows        = $queryBuilder->execute()->fetchAll();
        $categoryIds = [];
        foreach ($rows as $row) {
            $categoryIds[] = (int)$row['category_id'];
        }
        
        return $categoryIds;
    }
    
    
    /**
     * Returns a list (array) of Gambio products_ids mapped to a catalog.
     * 
     * @param int $catalogId
     *
     * @return array
     * @throws Exception
     */
    public function getProductIdsForAfterbuyCatalogId(int $catalogId): array
    {
        $queryBuilder = $this->connection->createQueryBuilder();
        $queryBuilder->from('afterbuy_products_to_catalogs', 'ap2c')
            ->join('ap2c', 'afterbuy_products', 'ap', 'ap.afterbuy_product_id = ap2c.product_id')
            ->join('ap', 'products', 'p', 'p.products_id = ap.products_id')
            ->where('ap2c.catalog_id = ' . $catalogId)
            ->select('ap.products_id');
        $rows       = $queryBuilder->execute()->fetchAll();
        $productIds = [];
        foreach ($rows as $row) {
            $productIds[] = (int)$row['products_id'];
        }
        
        return $productIds;
    }
    
    
    /**
     * @param int $catalogId
     * @param int $categoryId
     *
     * @return void
     * @throws Exception
     */
    public function linkCatalogIdToCategoryId(int $catalogId, int $categoryId): void
    {
        $insertData = [
            'catalog_id'  => $catalogId,
            'category_id' => $categoryId,
        ];
        
        $this->connection->insert('afterbuy_catalogs_to_categories', $insertData);
    }
    
    
    public function unlinkCategory(int $categoryId): void
    {
        $this->connection->delete('afterbuy_catalogs_to_categories', ['category_id' => $categoryId]);
    }
    
    
    /**
     * Returns an array of AfterbuyCatalogs which are children of a parent defined by its CatalogID.
     *
     * @param int $parentCatalogId
     *
     * @return array
     * @throws \Doctrine\DBAL\Exception
     */
    public function getCatalogsByParentId(int $parentCatalogId = 0): array
    {
        $queryBuilder = $this->connection->createQueryBuilder();
        $query        = $queryBuilder->select('*')
            ->where('parent_id = ?')
            ->setParameter(0, $parentCatalogId)
            ->from('afterbuy_catalogs');
        $result       = $query->execute();
        $catalogs     = [];
        foreach ($result->fetchAll() as $catalogRow) {
            $catalogs[] = new AfterbuyCatalog((int)$catalogRow['catalog_id'],
                                              (int)$catalogRow['parent_id'],
                                              (string)$catalogRow['name'],
                                              (string)$catalogRow['description'],
                                              (int)$catalogRow['level'],
                                              (int)$catalogRow['position'],
                                              (string)$catalogRow['additional_text'],
                                              (bool)((int)$catalogRow['show_catalog'] > 0),
                                              (string)$catalogRow['picture1'],
                                              (string)$catalogRow['picture2'],
                                              (string)$catalogRow['titlepicture'],);
        }
        
        return $catalogs;
    }
    
    
    /**
     * @param int $catalogId
     *
     * @return int|null
     * @throws Exception
     */
    public function getCategoryIdByCatalogId(int $catalogId): ?int
    {
        $queryBuilder = $this->connection->createQueryBuilder();
        $query        = $queryBuilder->select('category_id')
            ->where('catalog_id = ' . $queryBuilder->createNamedParameter($catalogId,
                                                                          ParameterType::INTEGER))
            ->from('afterbuy_catalogs_to_categories');
        $result       = $query->execute()->fetchAll();
        if (empty($result)) {
            return null;
        }
        $categoryId = (int)$result[0]['category_id'];
        if ($this->isValidCategory($categoryId)) {
            return $categoryId;
        }
        $this->unlinkCategory($categoryId);
        
        return null;
    }
    
    
    protected function isValidCategory(int $categoryId): bool
    {
        $rowCount = $this->connection->executeQuery('SELECT `categories_id` FROM `categories` WHERE `categories_id` = ?',
                                                    [$categoryId])->rowCount();
        
        return $rowCount > 0;
    }
    
}