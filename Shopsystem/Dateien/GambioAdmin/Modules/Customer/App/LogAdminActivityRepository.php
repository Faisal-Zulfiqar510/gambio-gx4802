<?php
/*--------------------------------------------------------------
   LogAdminActivityRepository.php 2022-07-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\App;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Driver\Exception as DBALDriverException;
use Doctrine\DBAL\FetchMode;

/**
 * Class LogAdminActivityRepository
 *
 * @package Gambio\Admin\Modules\Customer\App
 */
class LogAdminActivityRepository
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
     * @return bool
     */
    public function getLogAdminActivitiesStatus(int $customerId): bool
    {
        $result = $this->connection->createQueryBuilder()
            ->select('configuration_value')
            ->from('user_configuration')
            ->where('customer_id=:customer_id')
            ->andWhere('configuration_key=:configuration_key')
            ->setParameters(["customer_id" => $customerId, 'configuration_key' => 'admin_activity_status'])
            ->execute();
        
        return !($result->rowCount() === 0) && $result->fetch(FetchMode::NUMERIC)[0] === '1';
    }
    
    
    /**
     * @param int  $customerId
     * @param bool $status
     *
     * @return void
     * @throws DBALDriverException
     */
    public function setLogAdminActivitiesStatus(int $customerId, bool $status): void
    {
        $query = <<<MYSQL
                REPLACE INTO `user_configuration` (`customer_id`, `configuration_key`, `configuration_value`)
                VALUES (:customer_id, 'admin_activity_status', :status)
            MYSQL;
    
        $stmt  = $this->connection->prepare($query);
        $stmt->bindValue(':customer_id', $customerId);
        $stmt->bindValue(':status', (int)$status);
        $stmt->execute();
    }
}