<?php
/*--------------------------------------------------------------
   NewsletterReader.php 2022-03-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Newsletter\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Doctrine\DBAL\Query\QueryBuilder;
use Gambio\Admin\Modules\Newsletter\Model\ValueObjects\CustomerId;

/**
 * Class NewsletterReader
 *
 * @package Gambio\Admin\Modules\Newsletter\App\Data
 */
class NewsletterReader
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
     * @return array
     */
    public function getSubscribedCustomers(): array
    {
        return $this->createQuery()->execute()->fetchAll(FetchMode::ASSOCIATIVE);
    }
    
    
    /**
     * @param CustomerId $customerId
     *
     * @return bool
     */
    public function isCustomerSubscribed(CustomerId $customerId): bool
    {
        $result = $this->createQuery()
            ->andWhere('customers_id = :customers_id')
            ->setParameter('customers_id', $customerId->value())
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
        
        return count($result) !== 0;
    }
    
    
    /**
     * @return QueryBuilder
     */
    private function createQuery(): QueryBuilder
    {
        return $this->connection->createQueryBuilder()
            ->select('customers_id')
            ->from('newsletter_recipients')
            ->where('mail_status = :mail_status')
            ->setParameter('mail_status', '1')
            ->orderBy('customers_id')
            ->groupBy('customers_id');
    }
}