<?php
/*--------------------------------------------------------------------
 ProductOptionIds.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Collections;

use ArrayIterator;
use IteratorAggregate;
use Traversable;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionIds
 * @package Gambio\Admin\Modules\ProductOption\Model\Collections
 */
class ProductOptionIds implements IteratorAggregate
{
    
    /**
     * @var ProductOptionId[]
     */
    private $ids;
    
    
    /**
     * ProductOptionIds constructor.
     *
     * @param ProductOptionId[] $ids
     */
    private function __construct(array $ids)
    {
        $this->ids = $ids;
    }
    
    
    /**
     * @param ProductOptionId ...$ids
     *
     * @return ProductOptionIds
     */
    public static function create(ProductOptionId ...$ids): ProductOptionIds
    {
        return new self($ids);
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(static function (ProductOptionId $id): int {
            return $id->value();
        },
            $this->ids);
    }
    
    
    /**
     * @return Traversable|ProductOptionId[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->ids);
    }
}