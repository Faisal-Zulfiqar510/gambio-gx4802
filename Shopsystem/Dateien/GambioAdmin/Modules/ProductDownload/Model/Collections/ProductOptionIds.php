<?php
/*--------------------------------------------------------------------
 ProductOptionIds.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Collections;

use ArrayIterator;
use IteratorAggregate;
use Traversable;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionIds
 * @package Gambio\Admin\Modules\ProductDownload\Model\Collections
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