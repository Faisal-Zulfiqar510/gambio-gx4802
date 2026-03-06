<?php
/*--------------------------------------------------------------
   UpdatedProductVariantsStock.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantStock;

/**
 * Class UpdatedProductVariantsStock
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantsStock
{
    /**
     * @var ProductVariantId
     */
    private $variantId;
    
    /**
     * @var ProductVariantStock
     */
    private $stock;
    
    
    /**
     * UpdatedProductVariantsStock constructor.
     *
     * @param ProductVariantId    $variantId
     * @param ProductVariantStock $stock
     */
    private function __construct(ProductVariantId $variantId, ProductVariantStock $stock)
    {
        $this->variantId = $variantId;
        $this->stock     = $stock;
    }
    
    
    /**
     * @param ProductVariantId    $variantId
     * @param ProductVariantStock $stock
     *
     * @return UpdatedProductVariantsStock
     */
    public static function create(ProductVariantId $variantId, ProductVariantStock $stock): UpdatedProductVariantsStock
    {
        return new self($variantId, $stock);
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
    
    
    /**
     * @return float
     */
    public function stock(): float
    {
        return $this->stock->stock();
    }
    
    
    /**
     * @return string
     */
    public function stockType(): string
    {
        return $this->stock->stockType();
    }
}