<?php
/*--------------------------------------------------------------
   CustomerDisallowedPaymentMethodsReader.php 2023-04-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\PaymentModule\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Admin\Modules\PaymentModule\Services\Exceptions\CustomerDoesNotExistException;

/**
 * Class CustomerDisallowedPaymentMethodsReader
 *
 * @package Gambio\Admin\Modules\PaymentModule\App\Data
 */
class CustomerDisallowedPaymentMethodsReader
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
     * @param int $customerId
     *
     * @return string
     *
     * @throws CustomerDoesNotExistException
     */
    public function getCustomersDisallowedPaymentMethods(int $customerId): string
    {
        $result = $this->connection->createQueryBuilder()
            ->select('payment_unallowed')
            ->from('customers')
            ->andWhere('customers_id = :customers_id')
            ->setParameter('customers_id', $customerId)
            ->execute()
            ->fetchAll(FetchMode::NUMERIC);
        
        if (count($result) === 0) {
            
            throw CustomerDoesNotExistException::withId($customerId);
        }
        
        return (string)$result[0][0];
    }
}