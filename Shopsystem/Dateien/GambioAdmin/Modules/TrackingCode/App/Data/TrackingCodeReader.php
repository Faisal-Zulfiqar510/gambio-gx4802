<?php
/* --------------------------------------------------------------
   TrackingCodeReader.php 2021-04-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\TrackingCode\App\Data;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\TrackingCode\Model\ValueObjects\OrderId;
use Gambio\Admin\Modules\TrackingCode\Model\ValueObjects\TrackingCodeId;
use Gambio\Admin\Modules\TrackingCode\Services\Exceptions\TrackingCodeNotFoundException;
use Gambio\Core\Filter\Filters;
use Gambio\Core\Filter\Pagination;
use Gambio\Core\Filter\Sorting;
use Gambio\Core\Filter\SqlFilters;
use Gambio\Core\Filter\SqlPagination;
use Gambio\Core\Filter\SqlSorting;

/**
 * Class TrackingCodeReader
 *
 * @package Gambio\Admin\Modules\TrackingCode\App\Data
 */
class TrackingCodeReader
{
    /**
     * @var Connection
     */
    private $db;
    
    
    /**
     * TrackingCodeReader constructor.
     *
     * @param Connection $db
     */
    public function __construct(Connection $db)
    {
        $this->db = $db;
    }
    
    
    /**
     * @param TrackingCodeId $id
     *
     * @return array
     *
     * @throws TrackingCodeNotFoundException
     */
    public function getTrackingCodeDataById(TrackingCodeId $id): array
    {
        $trackingCodeData = $this->db->createQueryBuilder()
            ->select('orders_parcel_tracking_codes.*, languages.code as `language_code`')
            ->from('orders_parcel_tracking_codes')
            ->join('orders_parcel_tracking_codes',
                   'languages',
                   'languages',
                   'orders_parcel_tracking_codes.language_id = languages.languages_id')
            ->where('orders_parcel_tracking_code_id = :trackingCodeId')
            ->setParameter('trackingCodeId', $id->value())
            ->execute()
            ->fetch();
        
        if ($trackingCodeData === false) {
            throw TrackingCodeNotFoundException::forId($id->value());
        }
        
        return $trackingCodeData;
    }
    
    
    /**
     * @param Filters|SqlFilters       $filters
     * @param Sorting|SqlSorting       $sorting
     * @param Pagination|SqlPagination $pagination
     *
     * @return array
     */
    public function getFilteredTrackingCodesData(Filters $filters, Sorting $sorting, Pagination $pagination): array
    {
        $query = $this->db->createQueryBuilder()
            ->select('orders_parcel_tracking_codes.*, languages.code as `language_code`')
            ->from('orders_parcel_tracking_codes')
            ->join('orders_parcel_tracking_codes',
                   'languages',
                   'languages',
                   'orders_parcel_tracking_codes.language_id = languages.languages_id');
        $filters->applyToQuery($query);
        $sorting->applyToQuery($query);
        $pagination->applyToQuery($query);
        
        return $query->execute()->fetchAll();
    }
    
    
    /**
     * @param Filters|SqlFilters $filters
     *
     * @return int
     */
    public function getTrackingCodesTotalCount(Filters $filters): int
    {
        $query = $this->db->createQueryBuilder()
            ->select('orders_parcel_tracking_codes.orders_parcel_tracking_code_id')
            ->from('orders_parcel_tracking_codes')
            ->join('orders_parcel_tracking_codes',
                   'languages',
                   'languages',
                   'orders_parcel_tracking_codes.language_id = languages.languages_id')
            ->groupBy('orders_parcel_tracking_codes.orders_parcel_tracking_code_id');
        $filters->applyToQuery($query);
        
        return $query->execute()->rowCount();
    }
    
    
    /**
     * @return array
     */
    public function getAllTrackingCodesData(): array
    {
        return $this->db->createQueryBuilder()
            ->select('orders_parcel_tracking_codes.*, languages.code as `language_code`')
            ->from('orders_parcel_tracking_codes')
            ->join('orders_parcel_tracking_codes',
                   'languages',
                   'languages',
                   'orders_parcel_tracking_codes.language_id = languages.languages_id')
            ->execute()
            ->fetchAll();
    }
    
    
    /**
     * @param OrderId $id
     *
     * @return array
     */
    public function getTrackingCodesDataByOrderId(OrderId $id): array
    {
        return $this->db->createQueryBuilder()
            ->select('orders_parcel_tracking_codes.*, languages.code as `language_code`')
            ->from('orders_parcel_tracking_codes')
            ->join('orders_parcel_tracking_codes',
                   'languages',
                   'languages',
                   'orders_parcel_tracking_codes.language_id = languages.languages_id')
            ->where('order_id = :orderId')
            ->setParameter('orderId', $id->value())
            ->orderBy('orders_parcel_tracking_codes.orders_parcel_tracking_code_id')
            ->execute()
            ->fetchAll();
    }
}