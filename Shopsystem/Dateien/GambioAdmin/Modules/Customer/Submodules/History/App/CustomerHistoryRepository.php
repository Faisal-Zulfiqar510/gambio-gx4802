<?php
/*--------------------------------------------------------------
   CustomerHistoryRepository.php 2022-01-21
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\History\App;

use Gambio\Admin\Modules\Customer\Submodules\History\App\Data\CustomerHistoryMapper;
use Gambio\Admin\Modules\Customer\Submodules\History\Model\Collections\CustomerHistory;
use Gambio\Admin\Modules\Customer\Submodules\History\Model\ValueObjects\CustomerId;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryReader;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\CustomerHistoryRepository as CustomerHistoryRepositoryInterface;

/**
 * Class CustomerHistoryRepository
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\History\App
 */
class CustomerHistoryRepository implements CustomerHistoryRepositoryInterface
{
    /** @var CustomerHistoryReader[] */
    private array                 $readers;
    private CustomerHistoryMapper $mapper;
    
    
    /**
     * @param CustomerHistoryMapper $mapper
     * @param CustomerHistoryReader ...$readers
     */
    public function __construct(
        CustomerHistoryMapper $mapper,
        CustomerHistoryReader ...$readers
    ) {
        $this->mapper  = $mapper;
    
        foreach ($readers as $reader) {
            
            $this->readers[$reader->getType()] = $reader;
        }
    }
    
    
    /**
     * @inheritDoc
     */
    public function getCustomerHistory(CustomerId $customerId): CustomerHistory
    {
        $result = $this->mapper->createCustomerHistory();
    
        foreach ($this->readers as $reader) {
            
            $dtos = $reader->getCustomerHistoryEntries($customerId);
    
            $result = $result->merge($this->mapper->mapCustomerHistory($dtos));
        }
        
        return $result;
    }
    
    
    /**
     * @inheritDoc
     */
    public function getCustomerHistoryForType(CustomerId $customerId, string $type): CustomerHistory
    {
        $result = $this->mapper->createCustomerHistory();
    
        foreach ($this->readers as $reader) {
        
            if ($reader->getType() !== $type) {
                
                continue;
            }
            
            $dtos = $reader->getCustomerHistoryEntries($customerId);
    
            $result = $result->merge($this->mapper->mapCustomerHistory($dtos));
        }
    
        return $result;
    }
    
    
    /**
     * @inheritDoc
     */
    public function registerCustomerHistoryReader(CustomerHistoryReader $reader): void
    {
        $this->readers[$reader->getType()] = $reader;
    }
}