<?php
/*--------------------------------------------------------------------
 ProductOptionsSortOrderUpdated.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Events;

use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionsSortOrderUpdated
 * @package Gambio\Admin\Modules\ProductOption\Model\Events
 */
class ProductOptionsSortOrderUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var int
     */
    private $sortOrder;
    
    
    /**
     * ProductOptionsSortOrderUpdated constructor.
     *
     * @param ProductOptionId $productOptionId
     * @param int             $sortOrder
     */
    private function __construct(ProductOptionId $productOptionId, int $sortOrder)
    {
        $this->productOptionId = $productOptionId;
        $this->sortOrder       = $sortOrder;
    }
    
    
    /**
     * @param ProductOptionId $productOptionId
     * @param int             $sortOrder
     *
     * @return ProductOptionsSortOrderUpdated
     */
    public static function create(ProductOptionId $productOptionId, int $sortOrder): ProductOptionsSortOrderUpdated
    {
        return new self($productOptionId, $sortOrder);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return int
     */
    public function sortOrder(): int
    {
        return $this->sortOrder;
    }
}