<?php
/*--------------------------------------------------------------
   NextCustomerNumberRepository.php 2022-11-30
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\App;

use Doctrine\DBAL\Connection;

/**
 * Class NextCustomerNumberRepository
 *
 * @package Gambio\Admin\Modules\Customer\App
 */
class NextCustomerNumberRepository
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
     * @return int
     */
    public function next(): int
    {
        $this->clearCache();
        
        return $this->fetchCustomersAutoIncrement();
    }
    
    
    /**
     * @return void
     */
    private function clearCache(): void
    {
        $this->connection->executeQuery('ANALYZE TABLE customers');
    }
    
    /**
     * @return int
     */
    private function fetchCustomersAutoIncrement(): int
    {
        $stmt = $this->connection->prepare('select auto_increment from information_schema.TABLES where TABLE_NAME =:tablename and TABLE_SCHEMA=:database_name;');
        $stmt->bindValue('tablename', 'customers');
        $stmt->bindValue('database_name', $this->connection->getDatabase());
        $stmt->execute();
        
        return (int)($stmt->fetchNumeric()[0]);
    }
}