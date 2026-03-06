<?php
/*--------------------------------------------------------------
   ProductVariantsPricesRecalculated.php 2022-02-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\Collections\ProductVariantIds;

/**
 * Class ProductVariantsPricesRecalculated
 *
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class ProductVariantsPricesRecalculated
{
    /**
     * @var ProductVariantIds
     */
    protected $variantIds;
    
    
    /**
     * ProductVariantsPricesRecalculated constructor.
     *
     * @param ProductVariantIds $variantIds
     */
    public function __construct(ProductVariantIds $variantIds)
    {
        $this->variantIds = $variantIds;
    }
    
    
    /**
     * @param ProductVariantIds $variantIds
     *
     * @return ProductVariantsPricesRecalculated
     */
    public static function create(ProductVariantIds $variantIds): ProductVariantsPricesRecalculated
    {
        return new self($variantIds);
    }
    
    
    /**
     * @return ProductVariantIds
     */
    public function variantIds(): ProductVariantIds
    {
        return $this->variantIds;
    }
}