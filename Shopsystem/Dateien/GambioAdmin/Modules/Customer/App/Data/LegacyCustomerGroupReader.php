<?php
/* --------------------------------------------------------------
   LegacyCustomerGroupReader.php 2022-05-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\App\Data;

use Doctrine\DBAL\Connection;
use Gambio\Core\Application\ValueObjects\UserPreferences;
use function array_map;

/**
 * Class LegacyCustomerGroupReader
 *
 * @package Gambio\Admin\Modules\Customer\App\Data
 */
class LegacyCustomerGroupReader
{
    private Connection      $db;
    private UserPreferences $userPreferences;
    
    
    /**
     * @param Connection      $connection
     * @param UserPreferences $userPreferences
     */
    public function __construct(Connection $connection, UserPreferences $userPreferences)
    {
        $this->db              = $connection;
        $this->userPreferences = $userPreferences;
    }
    
    
    /**
     * @return array
     */
    public function getCustomerGroups(): array
    {
        $data = $this->db->createQueryBuilder()
            ->select('`customers_status_id` as `id`, `customers_status_name` as `label`')
            ->from('customers_status')
            ->where('`language_id` = :languageId')
            ->setParameter('languageId', $this->userPreferences->languageId())
            ->orderBy('`customers_status_id`')
            ->execute()
            ->fetchAll();
        
        return array_map(function (array $customerGroupData): array {
            $customerGroupData['id'] = (int)$customerGroupData['id'];
            
            return $customerGroupData;
        }, $data);
    }
}