<?php
/*--------------------------------------------------------------
   CustomerHistoryEntryDtos.php 2022-01-20
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\Submodules\History\Services\DTO\Collections;

use ArrayIterator;
use Gambio\Admin\Modules\Customer\Submodules\History\Services\DTO\CustomerHistoryEntryDto;
use IteratorAggregate;
use Traversable;

/**
 * Class CustomerHistoryEntryDtos
 *
 * @package Gambio\Admin\Modules\Customer\Submodules\History\Services\DTO\Collections
 * @codeCoverageIgnore
 */
class CustomerHistoryEntryDtos implements IteratorAggregate
{
    /** @var CustomerHistoryEntryDto[]  */
    private array $dtos;
    
    
    /**
     * @param CustomerHistoryEntryDto[] $dtos
     */
    private function __construct(array $dtos)
    {
        $this->dtos = $dtos;
    }
    
    
    /**
     * @param CustomerHistoryEntryDto ...$dtos
     *
     * @return CustomerHistoryEntryDtos
     */
    public static function create(CustomerHistoryEntryDto ...$dtos): CustomerHistoryEntryDtos
    {
        return new self($dtos);
    }
    
    /**
     * @return Traversable|CustomerHistoryEntryDto[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->dtos);
    }
    
    
    /**
     * @return array
     */
    public function getArray(): array
    {
        return $this->dtos;
    }
}