<?php
/*--------------------------------------------------------------
   CustomerOrderReader.php 2022-10-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\Orders\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Doctrine\DBAL\Query\QueryBuilder;
use Gambio\Admin\Modules\Customer\Submodules\Orders\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\Orders\Model\ValueObjects\OrderId;
use Gambio\Admin\Modules\Customer\Submodules\Orders\Services\Exceptions\CustomerOrderDoesNotExist;
use Gambio\Core\Application\ValueObjects\UserPreferences;

/**
 * Class CustomerOrderReader
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\Orders\App\Data
 */
class CustomerOrderReader
{
    private Connection $connection;
    private int        $languageId;
    private array      $orderStatusMap = [];
    
    
    /**
     * @param Connection      $connection
     * @param UserPreferences $preferences
     */
    public function __construct(
        Connection $connection,
        UserPreferences $preferences
    ) {
        $this->connection = $connection;
        $this->languageId = $preferences->languageId();
    }
    
    
    /**
     * @return QueryBuilder
     */
    protected function createQuery(): QueryBuilder
    {
        $columns = $groupBy = [
            'o.orders_id',
            'o.customers_id',
            'o.date_purchased',
            'o.orders_status',
            'o.delivery_country_iso_code_2',
            'o.payment_class',
            'ot.value'
        ];
        
        $columns[] = 'GROUP_CONCAT(op.products_id ORDER BY op.products_id ASC) AS product_ids';
        
        return $this->connection->createQueryBuilder()
            ->select(implode(', ', $columns))
            ->from('orders', 'o')
            ->leftJoin('o', 'orders_products', 'op', 'o.orders_id=op.orders_id')
            ->leftJoin('o', 'orders_total', 'ot', 'o.orders_id=ot.orders_id AND ot.class="ot_total"')
            ->groupBy(implode(', ', $groupBy))
            ->orderBy('o.orders_id', 'DESC');
    }
    
    
    /**
     * Returns all available customer orders.
     *
     * @param CustomerId $customerId
     *
     * @return array
     */
    public function getCustomerOrders(CustomerId $customerId): array
    {
        $data = $this->createQuery()
            ->where('o.customers_id=:customers_id')
            ->setParameter('customers_id', $customerId->value())
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
        
        return $this->addOrderStatus($data);
    }
    
    
    /**
     * Returns a specific customer order based on the given ID.
     *
     * @param OrderId $orderId
     *
     * @return array
     *
     * @throws CustomerOrderDoesNotExist
     */
    public function getCustomerOrderById(OrderId $orderId): array
    {
        $result = $this->createQuery()
            ->where('o.orders_id=:order_id')
            ->setParameter('order_id', $orderId->value())
            ->execute();
        
        if ($result->rowCount() === 0) {
            
            throw CustomerOrderDoesNotExist::forOrderId($orderId);
        }
        
        return $this->addOrderStatus($result->fetchAll(FetchMode::ASSOCIATIVE));
    }
    
    
    /**
     * @param array $data
     *
     * @return array
     */
    private function addOrderStatus(array $data): array
    {
        if (empty($this->orderStatusMap)) {
            
            $this->createOrderStatusMap();
        }
    
        foreach ($data as &$row) {
            
            $row['orders_status'] = $this->orderStatusMap[$row['orders_status']];
        }
        
        return $data;
    }
    
    
    /**
     * @return void
     */
    private function createOrderStatusMap(): void
    {
        $this->orderStatusMap = [];
        
        $columns = [
            'os.orders_status_id',
            'os.orders_status_name',
            'os.color'
        ];
        
        $result = $this->connection->createQueryBuilder()
            ->select(implode(', ', $columns))
            ->from('orders_status', 'os')
            ->innerJoin('os', 'languages', 'l', 'os.language_id=l.languages_id AND os.language_id = :language_id')
            ->setParameter('language_id', $this->languageId)
            ->groupBy(implode(', ', $columns))
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
        
        foreach ($result as $row) {
            
            $this->orderStatusMap[$row['orders_status_id']]['label'] = $row['orders_status_name'];
            $this->orderStatusMap[$row['orders_status_id']]['color'] = $row['color'];
        }
    }
}