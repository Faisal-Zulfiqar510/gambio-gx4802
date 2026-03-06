<?php
/*--------------------------------------------------------------
   CustomerMemoReader.php 2022-09-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

namespace Gambio\Admin\Modules\Customer\Submodules\Memos\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Doctrine\DBAL\Query\QueryBuilder;
use Gambio\Admin\Modules\Customer\Submodules\Memos\App\Data\Filter\CustomerMemoFilters;
use Gambio\Admin\Modules\Customer\Submodules\Memos\App\Data\Filter\CustomerMemoSorting;
use Gambio\Admin\Modules\Customer\Submodules\Memos\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\Memos\Model\ValueObjects\CustomerMemoId;
use Gambio\Admin\Modules\Customer\Submodules\Memos\Services\Exceptions\CustomerMemoDoesNotExistException;
use Gambio\Core\Filter\Pagination;
use Gambio\Core\Filter\SqlPagination;

/**
 * Class CustomerMemoReader
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\Memos\App\Data
 */
class CustomerMemoReader
{
    /**
     * @var Connection
     */
    private Connection $connection;
    
    
    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    
    /**
     * Returns all available customer memos.
     *
     * @param CustomerId $customerId
     *
     * @return array
     */
    public function getCustomerMemos(CustomerId $customerId): array
    {
        return $this->createQuery($customerId)->execute()->fetchAll(FetchMode::ASSOCIATIVE);
    }
    
    
    /**
     * Returns a specific customer memo based on the given ID.
     *
     * @param CustomerMemoId $memoId
     *
     * @return array
     *
     * @throws CustomerMemoDoesNotExistException
     */
    public function getCustomerMemoById(CustomerMemoId $memoId): array
    {
        $result = $this->createQuery()
            ->where('memo_id = :memo_id')
            ->setParameter('memo_id', $memoId->value())
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
        
        if (sizeof($result) === 0) {
            
            throw CustomerMemoDoesNotExistException::forCustomerMemoId($memoId);
        }
        
        return array_shift($result);
    }
    
    
    /**
     * @param CustomerId               $customerId
     * @param CustomerMemoFilters      $filters
     * @param CustomerMemoSorting      $sorting
     * @param Pagination|SqlPagination $pagination
     *
     * @return array
     */
    public function getFilteredCustomerMemos(
        CustomerId          $customerId,
        CustomerMemoFilters $filters,
        CustomerMemoSorting $sorting,
        Pagination          $pagination
    ): array {
        
        $filters->applyToQuery($query = $this->createQuery($customerId));
        $sorting->applyToQuery($query);
        $pagination->applyToQuery($query);
        
        return $query->execute()->fetchAll(FetchMode::ASSOCIATIVE);
    }
    
    
    /**
     * @param CustomerId          $customerId
     * @param CustomerMemoFilters $filters
     *
     * @return int
     */
    public function getCustomerMemosTotalCount(CustomerId $customerId, CustomerMemoFilters $filters): int
    {
        $filters->applyToQuery($query = $this->createQuery($customerId));
        
        return $query->execute()->rowCount();
    }
    
    
    /**
     * @param CustomerId|null $customerId
     *
     * @return QueryBuilder
     */
    private function createQuery(?CustomerId $customerId = null): QueryBuilder
    {
        $columns = [
            'memo_id',
            'customers_id',
            'memo_date',
            'last_modified',
            'memo_text',
            'poster_id',
        ];
        
        $query = $this->connection->createQueryBuilder()
            ->select(implode(', ', $columns))
            ->from('customers_memo')
            ->groupBy(implode(', ', $columns));
        
        if ($customerId !== null) {
            
            $query->where('customers_id = :customers_id')->setParameter('customers_id', $customerId->value());
        }
        
        return $query;
    }
}