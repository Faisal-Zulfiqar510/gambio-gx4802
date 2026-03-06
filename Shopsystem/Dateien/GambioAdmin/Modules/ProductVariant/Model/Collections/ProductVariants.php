<?php
/* --------------------------------------------------------------
 ProductVariants.php 2021-02-24
 Gambio GmbH
 http://www.gambio.de

 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 --------------------------------------------------------------
 */

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Collections;

use ArrayIterator;
use Gambio\Admin\Modules\ProductVariant\Model\ProductVariant;
use IteratorAggregate;
use Traversable;

/**
 * Class ProductVariants
 *
 * @package Gambio\Admin\Modules\ProductVariant\Model\Collections
 */
class ProductVariants implements IteratorAggregate
{
    /**
     * @var ProductVariant[]
     */
    private $variants;
    
    
    /**
     * ProductVariants constructor.
     *
     * @param ProductVariant[] $variants
     */
    private function __construct(array $variants)
    {
        $this->variants = $variants;
    }
    
    
    /**
     * @param ProductVariant ...$variants
     *
     * @return ProductVariants
     */
    public static function create(ProductVariant ...$variants): ProductVariants
    {
        return new self($variants);
    }
    
    
    /**
     * @return Traversable|ProductVariant[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->variants);
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(static function (ProductVariant $variant): array {
            return $variant->toArray();
        },
            $this->variants);
    }
}
