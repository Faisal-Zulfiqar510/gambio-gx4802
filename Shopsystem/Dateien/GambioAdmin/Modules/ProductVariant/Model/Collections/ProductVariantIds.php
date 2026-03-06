<?php
/*--------------------------------------------------------------
   ProductVariantIds.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Collections;

use ArrayIterator;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;
use IteratorAggregate;
use Traversable;

/**
 * Class ProductVariantIds
 *
 * @package Gambio\Admin\Modules\ProductVariant\Model\Collections
 */
class ProductVariantIds implements IteratorAggregate
{
    /**
     * @var ProductVariantId[]
     */
    private $ids;
    
    
    /**
     * ProductVariantIds constructor.
     *
     * @param ProductVariantId[] $ids
     */
    private function __construct(array $ids)
    {
        $this->ids = $ids;
    }
    
    
    /**
     * @param ProductVariantId ...$ids
     *
     * @return ProductVariantIds
     */
    public static function create(ProductVariantId ...$ids): ProductVariantIds
    {
        return new self($ids);
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(static function (ProductVariantId $id): int {
            return $id->value();
        },
            $this->ids);
    }
    
    
    /**
     * @return Traversable|ProductVariantId[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->ids);
    }
}