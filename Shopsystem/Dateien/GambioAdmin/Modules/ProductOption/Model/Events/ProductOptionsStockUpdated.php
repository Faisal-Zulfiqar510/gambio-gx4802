<?php
/*--------------------------------------------------------------------
 ProductOptionsStockUpdated.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Events;

use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionStock;

/**
 * Class ProductOptionsStockUpdated
 * @package Gambio\Admin\Modules\ProductOption\Model\Events
 */
class ProductOptionsStockUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var ProductOptionStock
     */
    private $productOptionStock;
    
    
    /**
     * ProductOptionStockUpdated constructor.
     *
     * @param ProductOptionId    $productOptionId
     * @param ProductOptionStock $productOptionStock
     */
    private function __construct(
        ProductOptionId $productOptionId,
        ProductOptionStock $productOptionStock
    ) {
        $this->productOptionId = $productOptionId;
        $this->productOptionStock = $productOptionStock;
    }
    
    
    /**
     * @param ProductOptionId    $productOptionId
     * @param ProductOptionStock $productOptionStock
     *
     * @return ProductOptionsStockUpdated
     */
    public static function create(
        ProductOptionId $productOptionId,
        ProductOptionStock $productOptionStock
    ): ProductOptionsStockUpdated {
        
        return new self($productOptionId, $productOptionStock);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return ProductOptionStock
     */
    public function productOptionStock(): ProductOptionStock
    {
        return $this->productOptionStock;
    }
}