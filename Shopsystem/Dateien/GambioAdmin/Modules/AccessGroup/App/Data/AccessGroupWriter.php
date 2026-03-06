<?php
/* --------------------------------------------------------------
   AccessGroupWriter.php 2021-09-06
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\AccessGroup\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\ConnectionException;
use Doctrine\DBAL\DBALException;
use Gambio\Admin\Modules\AccessGroup\Model\AccessGroup;
use Gambio\Admin\Modules\AccessGroup\Model\Collections\AccessGroupIds;
use Gambio\Admin\Modules\AccessGroup\Model\Exceptions\ParentAccessGroupIdDoesNotExistException;
use Gambio\Admin\Modules\AccessGroup\Model\ValueObjects\AccessGroupDescriptions;
use Gambio\Admin\Modules\AccessGroup\Model\ValueObjects\AccessGroupId;
use Gambio\Admin\Modules\AccessGroup\Model\ValueObjects\AccessGroupNames;
use Gambio\Admin\Modules\AccessGroup\Services\Exceptions\DeletionOfAccessGroupsFailedException;
use Gambio\Admin\Modules\AccessGroup\Services\Exceptions\StorageOfAccessGroupsFailedException;
use Gambio\Admin\Modules\Language\Model\Language;
use Gambio\Core\Language\Services\LanguageService;

/**
 * Class AccessGroupWriter
 *
 * @package Gambio\Admin\Modules\AccessGroup\App\Data
 */
class AccessGroupWriter
{
    /**
     * @var Connection
     */
    private $db;
    
    /**
     * @var LanguageService
     */
    private $languageService;
    
    
    /**
     * AccessGroupWriter constructor.
     *
     * @param Connection      $db
     * @param LanguageService $languageService
     */
    public function __construct(Connection $db, LanguageService $languageService)
    {
        $this->db              = $db;
        $this->languageService = $languageService;
    }
    
    
    /**
     * @param AccessGroupNames        $names
     * @param AccessGroupDescriptions $descriptions
     * @param int                     $sortOrder
     * @param bool                    $isProtected
     * @param int|null                $parentGroupId
     *
     * @return int
     */
    public function createAccessGroup(
        AccessGroupNames        $names,
        AccessGroupDescriptions $descriptions,
        int                     $sortOrder,
        bool                    $isProtected = false,
        ?int                    $parentGroupId = null
    ): int {
        $this->db->createQueryBuilder()
            ->insert('admin_access_groups')
            ->setValue('parent_id', ':parentId')
            ->setValue('sort_order', ':sortOrder')
            ->setValue('protected', ':isProtected')
            ->setParameter('parentId', $parentGroupId ?? 0)
            ->setParameter('sortOrder', $sortOrder)
            ->setParameter('isProtected', $isProtected ? 1 : 0)
            ->execute();
        
        $groupId = (int)$this->db->lastInsertId();
        /** @var Language $language */
        foreach ($this->languageService->getAvailableLanguages() as $language) {
            $this->db->createQueryBuilder()
                ->insert('admin_access_group_descriptions')
                ->setValue('admin_access_group_id', ':groupId')
                ->setValue('language_id', ':languageId')
                ->setValue('name', ':name')
                ->setValue('description', ':description')
                ->setParameter('groupId', $groupId)
                ->setParameter('languageId', $language->id())
                ->setParameter('name', $names->getName($language->code()))
                ->setParameter('description', $descriptions->getDescription($language->code()))
                ->execute();
        }
        
        return $groupId;
    }
    
    
    /**
     * @param AccessGroup ...$groups
     *
     * @return int[]
     *
     * @throws StorageOfAccessGroupsFailedException
     */
    public function storeAccessGroups(AccessGroup ...$groups): array
    {
        $ids = [];
        $this->db->beginTransaction();
        
        try {
            foreach ($groups as $group) {
                $this->updateAccessGroup($group);
                $ids[] = $group->id();
            }
            
            $this->db->commit();
        } catch (DBALException $exception) {
            $this->db->rollBack();
            
            throw StorageOfAccessGroupsFailedException::becauseOfException($exception);
        }
        
        return $ids;
    }
    
    
    /**
     * @param AccessGroup $group
     */
    private function updateAccessGroup(AccessGroup $group): void
    {
        try {
            $parentGroupId = $group->parentGroupId();
        } catch (ParentAccessGroupIdDoesNotExistException $e) {
            $parentGroupId = 0;
        }
        
        $this->db->createQueryBuilder()
            ->update('admin_access_groups')
            ->set('parent_id', ':parentId')
            ->set('sort_order', ':sortOrder')
            ->set('protected', ':isProtected')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('parentId', $parentGroupId)
            ->setParameter('sortOrder', $group->sortOrder())
            ->setParameter('isProtected', $group->isProtected() ? 1 : 0)
            ->setParameter('groupId', $group->id())
            ->execute();
        
        $this->addItems($group->id(), $group);
        $this->addDetails($group->id(), $group);
    }
    
    
    /**
     * @param int         $groupId
     * @param AccessGroup $group
     */
    private function addItems(int $groupId, AccessGroup $group): void
    {
        $this->db->createQueryBuilder()
            ->delete('admin_access_group_items')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('groupId', $groupId)
            ->execute();
        
        foreach ($group->groupItems() as $groupItem) {
            $this->db->createQueryBuilder()
                ->insert('admin_access_group_items')
                ->setValue('admin_access_group_id', ':groupId')
                ->setValue('identifier', ':descriptor')
                ->setValue('type', ':type')
                ->setParameter('groupId', $groupId)
                ->setParameter('descriptor', $groupItem->descriptor())
                ->setParameter('type', $groupItem->type())
                ->execute();
        }
    }
    
    
    /**
     * @param int         $groupId
     * @param AccessGroup $group
     */
    private function addDetails(int $groupId, AccessGroup $group): void
    {
        $this->db->createQueryBuilder()
            ->delete('admin_access_group_descriptions')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('groupId', $groupId)
            ->execute();
        
        /** @var Language $language */
        foreach ($this->languageService->getAvailableLanguages() as $language) {
            $this->db->createQueryBuilder()
                ->insert('admin_access_group_descriptions')
                ->setValue('admin_access_group_id', ':groupId')
                ->setValue('language_id', ':languageId')
                ->setValue('name', ':name')
                ->setValue('description', ':description')
                ->setParameter('groupId', $groupId)
                ->setParameter('languageId', $language->id())
                ->setParameter('name', $group->name($language->code()))
                ->setParameter('description', $group->description($language->code()))
                ->execute();
        }
    }
    
    
    /**
     * @param AccessGroupIds $groupIds
     *
     * @throws ConnectionException
     *
     * @throws DeletionOfAccessGroupsFailedException
     */
    public function deleteAccessGroups(AccessGroupIds $groupIds): void
    {
        $this->db->beginTransaction();
        try {
            foreach ($groupIds as $groupId) {
                $this->deleteGroup($groupId);
            }
            
            $this->db->commit();
        } catch (DBALException $exception) {
            $this->db->rollBack();
            
            throw DeletionOfAccessGroupsFailedException::becauseOfException($exception);
        }
    }
    
    
    /**
     * @param AccessGroupId $id
     */
    private function deleteGroup(AccessGroupId $id): void
    {
        $this->db->createQueryBuilder()
            ->delete('admin_access_groups')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('groupId', $id->value())
            ->execute();
        
        $this->db->createQueryBuilder()
            ->delete('admin_access_group_items')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('groupId', $id->value())
            ->execute();
        
        $this->db->createQueryBuilder()
            ->delete('admin_access_group_descriptions')
            ->where('admin_access_group_id = :groupId')
            ->setParameter('groupId', $id->value())
            ->execute();
    }
}