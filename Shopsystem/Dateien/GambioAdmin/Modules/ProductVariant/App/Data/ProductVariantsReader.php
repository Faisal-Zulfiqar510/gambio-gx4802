<?php
/*--------------------------------------------------------------
   ProductVariantsReader.php 2021-07-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Doctrine\DBAL\Query\QueryBuilder;
use Gambio\Admin\Modules\ProductVariant\Model\Collections\OptionAndOptionValueIds;
use Gambio\Admin\Modules\ProductVariant\Model\Exceptions\GenerationOfProductVariantsFailedException;
use Gambio\Admin\Modules\ProductVariant\Model\Exceptions\ProductVariantDoesNotExist;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;
use Gambio\Core\Filter\Filters;
use Gambio\Core\Filter\Pagination;
use Gambio\Core\Filter\Sorting;
use Gambio\Core\Filter\SqlFilters;
use Gambio\Core\Filter\SqlPagination;
use Gambio\Core\Filter\SqlSorting;

/**
 * Class ProductVariantsReader
 * @package Gambio\Admin\Modules\ProductVariant\App\Data
 */
class ProductVariantsReader
{
    /**
     * @var Connection
     */
    private $connection;
    
    
    /**
     * ProductVariantsReader constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * @return QueryBuilder
     */
    protected function createQuery(): QueryBuilder
    {
        
        $selectFields            = [
            '`ppc`.`products_properties_combis_id`',
            '`ppc`.`products_id`',
            '`ppc`.`sort_order`',
            '`ppc`.`combi_model`',
            '`ppc`.`combi_ean`',
            '`ppc`.`combi_quantity`',
            '`ppc`.`stock_type`',
            '`ppc`.`combi_shipping_status_id`',
            '`ppc`.`combi_weight`',
            '`ppc`.`combi_weight_type`',
            '`ppc`.`combi_price_type`',
            '`ppc`.`combi_price`',
            '`ppc`.`products_vpe_id`',
            '`ppc`.`vpe_value`',
            '`ppc`.`gtin`',
            '`ppc`.`asin`',
            '`pilc`.`product_image_list_id`'
        ];
        $commaSeparatedFieldList = implode(',', $selectFields);
        
        $groupConcat = "GROUP_CONCAT(DISTINCT CONCAT(`pv`.`properties_id`, '-' , `ppcp`.`properties_values_id`)
	             ORDER BY `ppcp`.`properties_values_id` ASC
	             SEPARATOR '|') AS `combination`";
        
        $queryBuilder = $this->connection->createQueryBuilder();
        
        $queryBuilder->select($commaSeparatedFieldList . ',' . $groupConcat);
        $queryBuilder->from('products_properties_combis', 'ppc');
        $queryBuilder->leftJoin('ppc',
                                'products_properties_combis_values',
                                'ppcp',
                                'ppc.`products_properties_combis_id`=ppcp.`products_properties_combis_id`');
        $queryBuilder->leftJoin('ppcp',
                                'properties_values',
                                'pv',
                                '`pv`.`properties_values_id` = `ppcp`.`properties_values_id`');
        $queryBuilder->leftJoin('ppc',
                                'product_image_list_combi',
                                'pilc',
                                '`pilc`.`products_properties_combis_id`=`ppc`.`products_properties_combis_id`');
        $queryBuilder->groupBy($commaSeparatedFieldList);
        
        return $queryBuilder;
    }
    
    
    /**
     * @param ProductId $productId
     *
     * @return array
     * @throws Exception
     */
    public function getProductVariantsByProductId(ProductId $productId): array
    {
        $queryBuilder = $this->createQuery()
            ->where('ppc.products_id = :products_id')
            ->setParameter(':products_id', $productId->value());
        
        return $queryBuilder->execute()->fetchAll();
    }
    
    
    /**
     * @param ProductId               $productId
     * @param OptionAndOptionValueIds $combination
     *
     * @return int|null
     */
    public function getProductVariantIdByProductIdAndCombination(
        ProductId $productId,
        OptionAndOptionValueIds $combination
    ): ?int {
        $groupConcat = "GROUP_CONCAT(DISTINCT CONCAT(`pv`.`properties_id`, '-' , `ppcp`.`properties_values_id`)
	             ORDER BY `ppcp`.`properties_values_id` ASC
	             SEPARATOR '|') AS `combination`";
        
        $data = $this->connection->createQueryBuilder()
            ->select('`ppcp`.`products_properties_combis_id` ,' . $groupConcat)
            ->from('products_properties_combis', 'ppc')
            ->leftJoin('ppc',
                       'products_properties_combis_values',
                       'ppcp',
                       'ppc.`products_properties_combis_id`=ppcp.`products_properties_combis_id`')
            ->leftJoin('ppcp',
                       'properties_values',
                       'pv',
                       '`pv`.`properties_values_id` = `ppcp`.`properties_values_id`')
            ->groupBy('`ppcp`.`products_properties_combis_id`')
            ->where('`ppc`.`products_id` = :product_id')
            ->having('`combination` = :combination')
            ->setParameter('product_id', $productId->value())
            ->setParameter('combination', $combination->toString())
            ->execute()
            ->fetchAll();
        
        return empty($data) ? null : (int)$data[0]['products_properties_combis_id'];
    }
    
    
    /**
     * @param ProductVariantId $id
     *
     * @return array
     * @throws ProductVariantDoesNotExist
     * @throws Exception
     */
    public function getProductVariantById(ProductVariantId $id): array
    {
        $result = $this->createQuery()
            ->where('ppc.products_properties_combis_id = :variant_id')
            ->setParameter(':variant_id', $id->value())
            ->execute()
            ->fetchAll();
        
        if (count($result) === 0) {
            throw ProductVariantDoesNotExist::forProductVariantId($id);
        }
        
        return $result[0];
    }
    
    
    /**
     * @param ProductId                $productId
     * @param Filters|SqlFilters       $filters
     * @param Sorting|SqlSorting       $sorting
     * @param Pagination|SqlPagination $pagination
     *
     * @return array
     * @throws Exception
     */
    public function filterProductVariants(
        ProductId $productId,
        Filters $filters,
        Sorting $sorting,
        Pagination $pagination
    ): array {
        $queryBuilder = $this->createQuery()
            ->where('ppc.products_id = :products_id')
            ->setParameter(':products_id', $productId->value());
        
        $filters->applyToQuery($queryBuilder);
        $sorting->applyToQuery($queryBuilder);
        $pagination->applyToQuery($queryBuilder);
        
        return $queryBuilder->execute()->fetchAll();
    }
    
    
    /**
     * @param ProductId          $productId
     * @param Filters|SqlFilters $filters
     *
     * @return int
     * @throws Exception
     */
    public function getProductVariantsTotalCount(ProductId $productId, Filters $filters): int
    {
        $queryBuilder = $this->createQuery()
            ->where('ppc.products_id = :products_id')
            ->setParameter(':products_id', $productId->value());
        
        $filters->applyToQuery($queryBuilder);
        
        return $queryBuilder->execute()->rowCount();
    }
    
    
    /**
     * @param int ...$optionIds
     *
     * @return bool
     */
    public function isOneOrMoreOptionsInUse(int ...$optionIds): bool
    {
        if (count($optionIds) === 0) {
            return false;
        }
        
        return $this->connection->createQueryBuilder()
                   ->select('ppcp.*')
                   ->from('products_properties_combis_values', 'ppcp')
                   ->leftJoin('ppcp',
                              'properties_values',
                              'pv',
                              '`pv`.`properties_values_id` = `ppcp`.`properties_values_id`')
                   ->where('pv.properties_id  IN (' . implode(', ', $optionIds) . ')')
                   ->execute()
                   ->rowCount() > 0;
    }
    
    
    
    /**
     * @param int $optionId
     * @param int ...$optionValueIds
     *
     * @return bool
     */
    public function areDifferentOptionValuesInUse(int $optionId, int ...$optionValueIds): bool
    {
        $query = $this->connection->createQueryBuilder()
            ->select('ppcp.*')
            ->from('products_properties_combis_values', 'ppcp')
            ->leftJoin('ppcp',
                       'properties_values',
                       'pv',
                       '`pv`.`properties_values_id` = `ppcp`.`properties_values_id`')
            ->where('pv.properties_id = :optionId')
            ->setParameter('optionId', $optionId);
    
        if (count($optionValueIds) > 0) {
            $query->andWhere('pv.properties_values_id  NOT IN (' . implode(', ', $optionValueIds) . ')');
        }
    
        return $query->execute()->rowCount() > 0;
    }
    
    
    /**
     * @param int $optionValueId
     *
     * @return int option id
     *
     * @throws GenerationOfProductVariantsFailedException
     */
    public function getAssignedOptionOfOptionValue(int $optionValueId): int
    {
        $result = $this->connection->createQueryBuilder()
            ->select('pv.properties_id')
            ->from('properties_values', 'pv')
            ->innerJoin('pv', 'properties', 'p', 'p.properties_id=pv.properties_id')
            ->where('pv.properties_values_id = :optionValueId')
            ->setParameter('optionValueId', $optionValueId)
            ->execute();
        
        if ($result->rowCount() === 0) {
            
            throw GenerationOfProductVariantsFailedException::optionValueDoesNotExist($optionValueId);
        }
        
        return (int)$result->fetchAll()[0]['properties_id'];
    }
    
    /**
     * @param int ...$imageListIds
     *
     * @return bool
     */
    public function imageListsAreAssignedToAProductVariant(int ...$imageListIds): bool
    {
        return $this->connection->createQueryBuilder()
                   ->select('products_properties_combis_id')
                   ->from('product_image_list_combi')
                   ->where('product_image_list_id IN (' . implode(', ', $imageListIds) . ')')
                   ->execute()
                   ->rowCount() > 0;
    }
    
    
    /**
     * @param int ...$optionIds
     *
     * @return int[]
     */
    public function variantsContainingOptions(int ...$optionIds): array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('products_properties_combis_id')
            ->from('products_properties_combis_values')
            ->where('options_id IN (' . implode(', ', $optionIds) . ')')
            ->execute()
            ->fetchAll(FetchMode::NUMERIC);
        
        return array_map(static function(array $row): int {
            return (int)array_shift($row);
        }, $result);
    }
    
    
    /**
     * @param int ...$optionValueIds
     *
     * @return array
     */
    public function variantsContainingOptionValues(int ...$optionValueIds): array
    {
        $result = $this->connection->createQueryBuilder()
            ->select('products_properties_combis_id')
            ->from('products_properties_combis_values')
            ->where('properties_values_id IN (' . implode(', ', $optionValueIds) . ')')
            ->execute()
            ->fetchAll(FetchMode::NUMERIC);
    
        return array_map(static function(array $row): int {
            return (int)array_shift($row);
        }, $result);
    }
}