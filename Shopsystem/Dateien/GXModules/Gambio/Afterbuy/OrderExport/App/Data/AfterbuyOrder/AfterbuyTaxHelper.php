<?php
/* --------------------------------------------------------------
   AfterbuyTaxHelper.php 2023-02-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\OrderExport\App\Data\AfterbuyOrder;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Exception;
use Doctrine\DBAL\FetchMode;

class AfterbuyTaxHelper
{
    private Connection          $connection;
    
    
    public function __construct(
        Connection          $connection
    ) {
        $this->connection          = $connection;
    }
    
    
    /**
     * Determines whether VAT must be added for a given customers_status_id.
     *
     * @param int $customerStatusId
     *
     * @return bool
     * @throws Exception
     */
    public function mustAddTax(int $customerStatusId): bool
    {
        static $customersStatus = [];
        if (empty($customersStatus)) {
            $qb = $this->connection->createQueryBuilder();
            $customersStatusColumns = [
                'customers_status_id',
                'customers_status_show_price_tax',
                'customers_status_add_tax_ot'
            ];
            $customersStatusData = $qb->select($customersStatusColumns)
                ->from('customers_status')
                ->groupBy($customersStatusColumns)
                ->execute()
                ->fetchAll();
            foreach ($customersStatusData as $customersStatusDatum) {
                $customersStatus[$customersStatusDatum['customers_status_id']] = $customersStatusDatum;
            }
        }
        
        return isset($customersStatus[$customerStatusId])
               && (int)$customersStatus[$customerStatusId]['customers_status_show_price_tax'] === 0
               && (int)$customersStatus[$customerStatusId]['customers_status_add_tax_ot'] === 1;
    }
    
    
    /**
     * Returns the tax rate based on a tax class ID, country and (optionally) state/zone.
     * 
     * @param int    $taxClassId
     * @param string $countryName
     * @param string $zoneName
     *
     * @return float
     * @throws Exception
     */
    public function getTaxRate(int $taxClassId, string $countryName, string $zoneName = ''): float
    {
        $countryId = $this->findCountryIdByName($countryName);
        $zoneId    = $this->findZoneIdByCountryIdAndName($countryId, $zoneName);

        $taxRateQuery = "SELECT SUM(`tax_rate`) AS `tax_rate`
					FROM
						`tax_rates` `tr`
					LEFT JOIN `zones_to_geo_zones` `za` ON (`tr`.`tax_zone_id` = `za`.`geo_zone_id`)
					LEFT JOIN `geo_zones` `tz` ON (`tz`.`geo_zone_id` = `tr`.`tax_zone_id`)
					WHERE
						(`za`.`zone_country_id` IS NULL OR
							`za`.`zone_country_id` = '0' OR
							`za`.`zone_country_id` = {$countryId}) AND
						(`za`.`zone_id` IS NULL OR
							`za`.`zone_id` = '0' OR
							`za`.`zone_id` = {$zoneId}) AND
						`tr`.`tax_class_id` = {$taxClassId}
					GROUP BY `tr`.`tax_priority`";
        $statement = $this->connection->executeQuery($taxRateQuery);
        $result = $statement->fetch(FetchMode::ASSOCIATIVE);
        if (is_array($result)) {
            return (float)$result['tax_rate'];
        }
        
        return 0;
    }
    
    
    /**
     * Finds country ID by name.
     * 
     * @param string $countryName
     *
     * @return int
     * @throws Exception
     */
    private function findCountryIdByName(string $countryName): int
    {
        $qb = $this->connection->createQueryBuilder();
        $statement = $qb->select('countries_id')
            ->from('countries')
            ->where($qb->expr()->eq('countries_name', $this->connection->quote($countryName)))
            ->execute();
        $result = $statement->fetch();
        if (is_array($result)) {
            return (int)$result['countries_id'];
        }
        
        return 0;
    }
    
    
    /**
     * Finds zone ID by name.
     * 
     * @param int    $countryId
     * @param string $zoneName
     *
     * @return int
     * @throws Exception
     */
    private function findZoneIdByCountryIdAndName(int $countryId, string $zoneName): int
    {
        $qb = $this->connection->createQueryBuilder();
        $statement = $qb->select('zone_id')
            ->from('zones')
            ->where($qb->expr()->eq('zone_country_id', $countryId))
            ->andWhere($qb->expr()->eq('zone_name', $this->connection->quote($zoneName)))
            ->execute();
        $result = $statement->fetch();
        if (is_array($result)) {
            return (int)$result['zone_id'];
        }

        return 0;
    }
    
}
