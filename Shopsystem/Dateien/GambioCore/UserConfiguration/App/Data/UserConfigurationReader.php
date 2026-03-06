<?php
/* --------------------------------------------------------------
   UserConfigurationReader.php 2021-05-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2020 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\UserConfiguration\App\Data;

use Doctrine\DBAL\Connection;
use Gambio\Core\UserConfiguration\App\Exceptions\UserConfigurationNotFound;
use Gambio\Core\UserConfiguration\Model\ValueObjects\UserConfigurationKey;
use Gambio\Core\UserConfiguration\Model\ValueObjects\UserId;

/**
 * Class UserConfigurationReader
 *
 * @package Gambio\Core\UserConfiguration\App\Data
 */
class UserConfigurationReader
{
    /**
     * @var Connection
     */
    private $db;
    
    
    /**
     * UserConfigurationReader constructor.
     *
     * @param Connection $db
     */
    public function __construct(Connection $db)
    {
        $this->db = $db;
    }
    
    
    /**
     * @param UserId               $userId
     * @param UserConfigurationKey $key
     *
     * @return mixed
     *
     * @throws UserConfigurationNotFound
     */
    public function getConfigurationValue(UserId $userId, UserConfigurationKey $key): string
    {
        $data = $this->db->createQueryBuilder()
            ->select('configuration_value')
            ->from('user_configuration')
            ->where('customer_id = :userId AND configuration_key = :key')
            ->setParameter('userId', $userId->value())
            ->setParameter('key', $key->value())
            ->execute()
            ->fetch();
        
        if ($data === false) {
            throw UserConfigurationNotFound::for($userId->value(), $key->value());
        }
        
        return $data['configuration_value'];
    }
}