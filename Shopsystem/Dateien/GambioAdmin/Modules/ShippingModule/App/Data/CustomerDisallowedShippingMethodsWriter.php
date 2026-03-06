<?php
/*--------------------------------------------------------------
   CustomerDisallowedShippingMethodsWriter.php 2022-03-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\ShippingModule\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Admin\Modules\ShippingModule\Model\ValueObjects\ShippingMethodId;
use Gambio\Admin\Modules\ShippingModule\Services\Exceptions\CustomerDoesNotExistException;

/**
 * Class CustomerDisallowedShippingMethodsWriter
 *
 * @package Gambio\Admin\Modules\ShippingModule\App\Data
 */
class CustomerDisallowedShippingMethodsWriter
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
     * @param int              $customerId
     * @param ShippingMethodId ...$methodsIds
     *
     * @return void
     *
     * @throws CustomerDoesNotExistException
     */
    public function setDisallowedShippingMethods(int $customerId, ShippingMethodId ...$methodsIds): void
    {
        $result = $this->connection->createQueryBuilder()
            ->select('shipping_unallowed')
            ->from('customers')
            ->andWhere('customers_id = :customers_id')
            ->setParameter('customers_id', $customerId)
            ->execute()
            ->fetchAll(FetchMode::NUMERIC);
        
        if (count($result) === 0) {
            
            throw CustomerDoesNotExistException::withId($customerId);
        }
        
        $disallowedShippingMethods = array_map(fn(ShippingMethodId $id): string => $id->value(), $methodsIds);
        $disallowedShippingMethods = implode(',', $disallowedShippingMethods);
        
        $this->connection->createQueryBuilder()
            ->update('customers')
            ->set('shipping_unallowed', ':shipping_unallowed')
            ->setParameter('shipping_unallowed', $disallowedShippingMethods)
            ->andWhere('customers_id = :customers_id')
            ->setParameter('customers_id', $customerId)
            ->execute();
    }
}