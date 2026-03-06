<?php
/*--------------------------------------------------------------
   AdditionalProductFieldsReader.php 2021-08-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\MainComponents\Services\Core\AdditionalProductFields\App\Data;

use Doctrine\DBAL\Connection;
use Gambio\MainComponents\Services\Core\AdditionalProductFields\Model\ValueObjects\ProductId;

/**
 * Class AdditionalProductFieldsReader
 * @package Gambio\MainComponents\Services\Core\AdditionalProductFields\App\Data
 */
class AdditionalProductFieldsReader
{
    /**
     * @var Connection
     */
    protected $connection;
    
    
    /**
     * AdditionalProductFieldsReader constructor.
     *
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }
    
    /**
     * @param ProductId $productId
     *
     * @return array
     */
    public function getAdditionalProductFields(ProductId $productId): array
    {
        $columns = [
            'afv.additional_field_id',
            'l.code',
            'afvd.language_id',
            'afvd.value'
        ];
        
        $data = $this->connection->createQueryBuilder()
            ->select(implode(', ', $columns))
            ->from('additional_field_values', 'afv')
            ->innerJoin('afv', 'additional_field_value_descriptions', 'afvd', 'afv.additional_field_value_id=afvd.additional_field_value_id')
            ->innerJoin('afv', 'languages', 'l', 'l.languages_id=afvd.language_id')
            ->where('afv.item_id = :product_id')#
            ->setParameter(':product_id', $productId->value())
            ->groupBy(implode(', ', $columns))
            ->execute()
            ->fetchAll();
        
        return $this->mapResultData($data);
    }
    
    /**
     * @param array $rows
     *
     * @return array
     */
    protected function mapResultData(array $rows): array
    {
        $result = [];
        
        foreach ($rows as $row) {
    
            $fieldId      = (int)$row['additional_field_id'];
            $languageCode = $row['code'];
        
            $result[$fieldId][$languageCode] = $row['value'];
        }
        
        return $result;
    }
}