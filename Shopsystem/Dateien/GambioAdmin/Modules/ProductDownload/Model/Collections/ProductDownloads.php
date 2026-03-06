<?php
/*--------------------------------------------------------------------
 ProductDownloads.php 2021-11-16
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Collections;

use ArrayIterator;
use Exception;
use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use IteratorAggregate;
use Traversable;

/**
 * Class ProductDownloads
 * @package Gambio\Admin\Modules\ProductDownload\Model\Collections
 */
class ProductDownloads implements IteratorAggregate
{
    /**
     * @var ProductDownload[]
     */
    private $productOptions;
    
    
    /**
     * ProductDownloads constructor.
     *
     * @param ProductDownload[] $variants
     */
    private function __construct(array $variants)
    {
        $this->productOptions = $variants;
    }
    
    
    /**
     * @param ProductDownload ...$productOptions
     *
     * @return ProductDownloads
     */
    public static function create(ProductDownload ...$productOptions): ProductDownloads
    {
        return new self($productOptions);
    }
    
    
    /**
     * @return Traversable|ProductDownload[]
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
        return array_map(static function (ProductDownload $productOption): array {
            return $productOption->toArray();
        },
            $this->productOptions);
    }
}