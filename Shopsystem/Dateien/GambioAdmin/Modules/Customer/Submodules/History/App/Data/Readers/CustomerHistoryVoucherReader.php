<?php
/*--------------------------------------------------------------
   CustomerHistoryVoucherReader.php 2022-03-11
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\History\App\Data\Readers;

use DateTimeImmutable;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\FetchMode;
use Gambio\Admin\Modules\Customer\Submodules\History\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryFactory;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryReader;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\DTO\Collections\CustomerHistoryEntryDtos;

/**
 * Class CustomerHistoryVoucherReader
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\History\App\Data\Readers
 */
class CustomerHistoryVoucherReader implements CustomerHistoryReader
{
    private Connection             $connection;
    private CustomerHistoryFactory $factory;
    
    
    /**
     * @param Connection             $connection
     * @param CustomerHistoryFactory $factory
     */
    public function __construct(Connection $connection, CustomerHistoryFactory $factory)
    {
        $this->connection = $connection;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getCustomerHistoryEntries(CustomerId $id): CustomerHistoryEntryDtos
    {
        $columns = [
            'grt.coupon_id',
            'grt.redeem_date',
            'grt.order_id',
            'gd.coupon_name',
            'gd.coupon_description',
            'l.code',
            'l.languages_id',
        ];
        
        $result  = [];
        $entries = $this->connection->createQueryBuilder()
            ->select(implode(',', $columns))
            ->from('coupon_redeem_track', 'grt')
            ->innerJoin('grt', 'coupons_description', 'gd', 'gd.coupon_id=grt.coupon_id')
            ->innerJoin('gd', 'languages', 'l', 'l.languages_id=gd.language_id')
            ->groupBy(implode(',', $columns))
            ->where('customer_id = :customer_id')
            ->setParameter('customer_id', $id->value())
            ->execute()
            ->fetchAll(FetchMode::ASSOCIATIVE);
        
        if (count($entries)) {
            
            $entries = $this->mapDbRowsByCoupon($entries);
    
            foreach ($entries as $entry) {
        
                $date = new DateTimeImmutable($entry['redeem_date']);
                unset($entry['redeem_date']);
        
                $result[] = $this->factory->createCustomerHistoryEntryDto($id->value(),
                                                                          $entry,
                                                                          $this->getType(),
                                                                          $date);
            }
        }
    
        return $this->factory->createCustomerHistoryEntryDtos(...$result);
    }
    
    
    /**
     * Maps db entries by the coupon id. Each language dependent
     * description has it's on row in the query result
     *
     * @param array $entries
     *
     * @return array
     */
    protected function mapDbRowsByCoupon(array $entries): array
    {
        $result = [];
    
        foreach ($entries as $entry) {
    
            [
                'coupon_id'          => $id,
                'coupon_name'        => $name,
                'coupon_description' => $description,
                'redeem_date'        => $date,
                'order_id'           => $orderId,
                'code'               => $code,
                'languages_id'       => $languageId,
            ] = $entry;
            
            if (isset($result[$id]) === false) {
    
                $result[$id] = [
                    'coupon_id'    => (int)$id,
                    'redeem_date'  => $date,
                    'order_id'     => (int)$orderId,
                    'descriptions' => [],
                ];
            }
    
            $result[$id]['descriptions'][$code] = [
                'languages_id'  => (int)$languageId,
                'language_code' => $code,
                'name'          => $name,
                'description'   => $description,
            ];
        }
        
        return array_values($result);
    }
    
    
    /**
     * @inheritDoc
     */
    public function getType(): string
    {
        return 'vouchers';
    }
}