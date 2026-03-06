<?php
/* --------------------------------------------------------------
 FavouritesHashListDbRepository.php 2020-03-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

declare(strict_types=1);

namespace Gambio\Admin\Layout\Menu\Repositories\PostCache\Implementation;

use Doctrine\DBAL\Connection;
use Gambio\Core\Application\ValueObjects\UserPreferences;
use Gambio\Admin\Layout\Menu\Models\Cached\FavouritesHashList;
use Gambio\Admin\Layout\Menu\Repositories\PostCache\FavouritesHashListRepository;

/**
 * Class FavouritesHashListDbRepository
 * @package Gambio\Admin\Layout\Menu\Repository
 */
class FavouritesHashListDbRepository implements FavouritesHashListRepository
{
    /**
     * @var Connection
     */
    private $connection;
    
    /**
     * @var UserPreferences
     */
    private $userPreferences;
    
    
    /**
     * FavouritesHashListDbRepository constructor.
     *
     * @param Connection      $connection
     * @param UserPreferences $userPreferences
     */
    public function __construct(Connection $connection, UserPreferences $userPreferences)
    {
        $this->connection      = $connection;
        $this->userPreferences = $userPreferences;
    }
    
    
    /**
     * @inheritDoc
     */
    public function favouritesList(): FavouritesHashList
    {
        $qb = $this->connection->createQueryBuilder();
        
        $result     = $qb->select('link_key')
            ->from('gm_admin_favorites')
            ->where("customers_id = {$qb->createNamedParameter($this->userPreferences->userId())}")
            ->orderBy('sort_order')
            ->execute()
            ->fetchAll();
        $favourites = [];
        foreach ($result as $favourite) {
            $favourites[] = $favourite['link_key'];
        }
        
        return FavouritesHashList::fromArray($favourites);
    }
}