<?php
/*--------------------------------------------------------------------
 ProductOptions.php 2021-11-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Collections;

use ArrayIterator;
use Exception;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;
use IteratorAggregate;
use Traversable;

/**
 * Class ProductOptions
 * @package Gambio\Admin\Modules\ProductOption\Model\Collections
 */
class ProductOptions implements IteratorAggregate
{
    /**
     * @var ProductOption[]
     */
    private $productOptions;
    
    
    /**
     * ProductOptions constructor.
     *
     * @param ProductOption[] $variants
     */
    private function __construct(array $variants)
    {
        $this->productOptions = $variants;
    }
    
    
    /**
     * @param ProductOption ...$productOptions
     *
     * @return ProductOptions
     */
    public static function create(ProductOption ...$productOptions): ProductOptions
    {
        return new self($productOptions);
    }
    
    
    /**
     * @return Traversable|ProductOption[]
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator($this->productOptions);
    }
    
    
    /**
     * @return array
     */
    public function toArray(): array
    {
        return array_map(static function (ProductOption $productOption): array {
            return $productOption->toArray();
        },
            $this->productOptions);
    }
}