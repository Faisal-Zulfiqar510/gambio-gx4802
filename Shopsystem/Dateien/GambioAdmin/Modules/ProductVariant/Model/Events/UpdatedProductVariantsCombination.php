<?php
/*--------------------------------------------------------------
   UpdatedProductVariantsCombination.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\Collections\OptionAndOptionValueIds;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class UpdatedProductVariantsCombination
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantsCombination
{
    /**
     * @var ProductVariantId
     */
    protected $variantId;
    
    /**
     * @var OptionAndOptionValueIds
     */
    protected $combinations;
    
    
    /**
     * UpdatedProductVariantsCombination constructor.
     *
     * @param ProductVariantId        $variantId
     * @param OptionAndOptionValueIds $combinations
     */
    private function __construct(ProductVariantId $variantId, OptionAndOptionValueIds $combinations)
    {
        $this->variantId    = $variantId;
        $this->combinations = $combinations;
    }
    
    
    /**
     * @param ProductVariantId        $variantId
     * @param OptionAndOptionValueIds $combinations
     *
     * @return UpdatedProductVariantsCombination
     */
    public static function create(
        ProductVariantId $variantId,
        OptionAndOptionValueIds $combinations
    ): UpdatedProductVariantsCombination {
        return new self($variantId, $combinations);
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
    
    
    /**
     * @return OptionAndOptionValueIds
     */
    public function combinations(): OptionAndOptionValueIds
    {
        return $this->combinations;
    }
}