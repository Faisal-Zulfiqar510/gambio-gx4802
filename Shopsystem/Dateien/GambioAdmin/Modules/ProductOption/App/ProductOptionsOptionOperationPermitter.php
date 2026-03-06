<?php
/* --------------------------------------------------------------
   ProductOptionsOptionOperationPermitter.php 2021-06-010
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\Option\Model\Entities\OptionValue;
use Gambio\Admin\Modules\Option\Model\Option;
use Gambio\Admin\Modules\Option\Model\ValueObjects\OptionId;
use Gambio\Admin\Modules\Option\Services\OptionOperationPermitter;
use Gambio\Admin\Modules\ProductOption\App\Data\ProductOptionReader;

/**
 * Class ProductOptionsOptionOperationPermitter
 *
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionsOptionOperationPermitter implements OptionOperationPermitter
{
    /**
     * @var ProductOptionReader
     */
    private $reader;
    
    
    /**
     * ProductOptionsOptionOperationPermitter constructor.
     *
     * @param ProductOptionReader $reader
     */
    public function __construct(ProductOptionReader $reader)
    {
        $this->reader = $reader;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsCreations(array ...$creationArgs): bool
    {
        return true;
    }
    
    
    /**
     * Checks for each option if other option value IDs are used for product options.
     * If so, some option values have been removed from the option, that can not be deleted.
     *
     * @inheritDoc
     */
    public function permitsStorages(Option ...$options): bool
    {
        foreach ($options as $option) {
            
            $usedValueIds = array_map(static function (OptionValue $optionValue): int {
                return $optionValue->id();
            },
                $option->values()->asArray());
            
            if ($this->reader->areDifferentOptionValuesInUse($option->id(), ...$usedValueIds)) {
                return false;
            }
        }
        
        return true;
    }
    
    
    /**
     * Checks if the given option IDs are used for product options.
     *
     * @inheritDoc
     */
    public function permitsDeletions(OptionId ...$ids): bool
    {
        $idValues = array_map(static function (OptionId $id): int {
            return $id->value();
        },
            $ids);
        
        return $this->reader->isOneOrMoreOptionsInUse(...$idValues) === false;
    }
}