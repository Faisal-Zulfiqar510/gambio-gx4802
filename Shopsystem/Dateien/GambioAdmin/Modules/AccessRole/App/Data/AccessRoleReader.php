<?php
/* --------------------------------------------------------------
   AccessRoleReader.php 2021-09-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\AccessRole\App\Data;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\AccessRole\Model\ValueObjects\AccessRoleId;
use Gambio\Admin\Modules\AccessRole\Model\ValueObjects\AdminId;
use Gambio\Admin\Modules\AccessRole\Services\Exceptions\AccessRoleDoesNotExistException;

/**
 * Class AccessRoleReader
 *
 * @package Gambio\Admin\Modules\AccessRole\App\Data
 */
class AccessRoleReader
{
    /**
     * @var Connection
     */
    private $db;
    
    
    /**
     * AccessRoleReader constructor.
     *
     * @param Connection $db
     */
    public function __construct(Connection $db)
    {
        $this->db = $db;
    }
    
    
    /**
     * @param AccessRoleId $id
     *
     * @return array<string, string|array|bool|int>
     *
     * @throws AccessRoleDoesNotExistException
     */
    public function getAccessRoleDataById(AccessRoleId $id): array
    {
        $roleData = $this->db->createQueryBuilder()
            ->select('admin_access_role_id, sort_order, protected')
            ->from('admin_access_roles')
            ->where('admin_access_role_id = :id')
            ->setParameter('id', $id->value())
            ->execute()
            ->fetch();
        
        if ($roleData === false) {
            throw AccessRoleDoesNotExistException::forId($id->value());
        }
        
        $roleDetails     = $this->getDetails($id->value());
        $rolePermissions = $this->getPermissions($id->value());
        
        return [
            'id'           => (int)$roleData['admin_access_role_id'],
            'names'        => $roleDetails['names'],
            'descriptions' => $roleDetails['descriptions'],
            'permissions'  => $rolePermissions,
            'sortOrder'    => (int)$roleData['sort_order'],
            'isProtected'  => $roleData['protected'] === '1',
        ];
    }
    
    
    /**
     * @return array<array<string, string|array|bool|int>>
     */
    public function getAccessRolesData(): array
    {
        $roles     = [];
        $rolesData = $this->db->createQueryBuilder()
            ->select('admin_access_role_id, sort_order, protected')
            ->from('admin_access_roles')
            ->execute()
            ->fetchAll();
        
        foreach ($rolesData as $roleData) {
            $roleDetails     = $this->getDetails((int)$roleData['admin_access_role_id']);
            $rolePermissions = $this->getPermissions((int)$roleData['admin_access_role_id']);
            
            $roles[] = [
                'id'           => (int)$roleData['admin_access_role_id'],
                'names'        => $roleDetails['names'],
                'descriptions' => $roleDetails['descriptions'],
                'permissions'  => $rolePermissions,
                'sortOrder'    => (int)$roleData['sort_order'],
                'isProtected'  => $roleData['protected'] === '1',
            ];
        }
        
        return $roles;
    }
    
    
    /**
     * @param AdminId $admin
     *
     * @return array<array<string, string|array|bool|int>>
     */
    public function getAccessRolesDataByAdmin(AdminId $admin): array
    {
        $roles     = [];
        $rolesData = $this->db->createQueryBuilder()
            ->select('aar.admin_access_role_id, aar.sort_order, aar.protected')
            ->from('admin_access_roles', 'aar')
            ->join('aar', 'admin_access_users', 'aau', 'aar.admin_access_role_id = aau.admin_access_role_id')
            ->where('aau.customer_id = :adminId')
            ->setParameter('adminId', $admin->value())
            ->execute()
            ->fetchAll();
        
        foreach ($rolesData as $roleData) {
            $roleDetails     = $this->getDetails((int)$roleData['admin_access_role_id']);
            $rolePermissions = $this->getPermissions((int)$roleData['admin_access_role_id']);
            
            $roles[] = [
                'id'           => (int)$roleData['admin_access_role_id'],
                'names'        => $roleDetails['names'],
                'descriptions' => $roleDetails['descriptions'],
                'permissions'  => $rolePermissions,
                'sortOrder'    => (int)$roleData['sort_order'],
                'isProtected'  => $roleData['protected'] === '1',
            ];
        }
        
        return $roles;
    }
    
    
    /**
     * @param int $id
     *
     * @return array<string, array<string, string>>
     */
    private function getDetails(int $id): array
    {
        $roleDetails = $this->db->createQueryBuilder()
            ->select('languages.code AS language_code, aard.name, aard.description')
            ->from('admin_access_role_descriptions', 'aard')
            ->join('aard', 'languages', 'languages', 'aard.language_id = languages.languages_id')
            ->where('aard.admin_access_role_id = :roleId')
            ->setParameter('roleId', $id)
            ->execute()
            ->fetchAll();
        
        $names        = [];
        $descriptions = [];
        foreach ($roleDetails as $roleDetail) {
            $names[$roleDetail['language_code']]        = $roleDetail['name'];
            $descriptions[$roleDetail['language_code']] = $roleDetail['description'];
        }
        
        return [
            'names'        => $names,
            'descriptions' => $descriptions,
        ];
    }
    
    
    /**
     * @param int $id
     *
     * @return array
     */
    private function getPermissions(int $id): array
    {
        $permissions = $this->db->createQueryBuilder()
            ->select('admin_access_group_id, reading_granted, writing_granted, deleting_granted')
            ->from('admin_access_permissions')
            ->where('admin_access_role_id = :roleId')
            ->setParameter('roleId', $id)
            ->execute()
            ->fetchAll();
        
        return array_map(static function (array $permission): array {
            return [
                'groupId'         => (int)$permission['admin_access_group_id'],
                'readingGranted'  => $permission['reading_granted'] === '1',
                'writingGranted'  => $permission['writing_granted'] === '1',
                'deletingGranted' => $permission['deleting_granted'] === '1',
            ];
        },
            $permissions);
    }
}