<?php
/*--------------------------------------------------------------
   CustomerHistoryCustomerReader.php 2022-03-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\History\App\Data\Readers;

use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Admin\Modules\Customer\Submodules\History\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryFactory;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryReader;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\DTO\Collections\CustomerHistoryEntryDtos;

/**
 * Class CustomerHistoryCustomerReader
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\History\App\Data\Readers
 */
class CustomerHistoryCustomerReader implements CustomerHistoryReader
{
    
    private Connection             $connection;
    private CustomerHistoryFactory $factory;
    
    
    /**
     * @param Connection             $connection
     * @param CustomerHistoryFactory $factory
     */
    public function __construct(Connection $connection, CustomerHistoryFactory $factory)
    {
        $this->connection = $connection;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getCustomerHistoryEntries(CustomerId $id): CustomerHistoryEntryDtos
    {
        $result  = [];
        $entries = $this->connection->createQueryBuilder()
            ->select('customers_date_added')
            ->from('customers')
            ->groupBy('customers_date_added')
            ->where('customers_id = :customers_id')
            ->setParameter('customers_id', $id->value())
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
    
        if (count($entries)) {
    
            foreach ($entries as $entry) {
    
                $result[] = $this->factory->createCustomerHistoryEntryDto($id->value(),
                                                                          ['action' => 'account created',],
                                                                          $this->getType(),
                                                                          new DateTimeImmutable($entry['customers_date_added']));
            }
        }
    
        return $this->factory->createCustomerHistoryEntryDtos(...$result);
    }
    
    
    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'customer';
    }
}