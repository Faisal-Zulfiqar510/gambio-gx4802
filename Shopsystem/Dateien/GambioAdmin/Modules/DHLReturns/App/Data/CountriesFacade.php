<?php
/* --------------------------------------------------------------
   CountriesFacade.php 2021-08-03
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);


namespace Gambio\Admin\Modules\DHLReturns\App\Data;

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DBALException;
use Doctrine\DBAL\FetchMode;

class CountriesFacade
{
    /**
     * @var Connection
     */
    private $dbConnection;
    
    
    public function __construct(Connection $dbConnection)
    {
        $this->dbConnection = $dbConnection;
    }
    
    public function getAllCountries()
    {
        $countries = [];
        try {
            $stmt = $this->dbConnection->query('SELECT * FROM `countries`');
            while ($countryRow = $stmt->fetch(FetchMode::ASSOCIATIVE)) {
                $countries[] = [
                    'id' => $countryRow['countries_id'],
                    'iso2' => $countryRow['countries_iso_code_2'],
                    'iso3' => $countryRow['countries_iso_code_3'],
                    'status' => $countryRow['status'],
                ];
            }
        } catch (DBALException $e) {
        }
        return $countries;
    }
}