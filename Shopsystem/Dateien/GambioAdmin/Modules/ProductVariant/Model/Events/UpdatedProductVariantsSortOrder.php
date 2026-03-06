<?php
/*--------------------------------------------------------------
   UpdatedProductVariantsSortOrder.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class UpdatedProductVariantsSortOrder
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantsSortOrder
{
    /**
     * @var ProductVariantId
     */
    protected $variantId;
    
    /**
     * @var int
     */
    protected $sortOrder;
    
    
    /**
     * UpdatedProductVariantsSortOrder constructor.
     *
     * @param ProductVariantId $variantId
     * @param int              $sortOrder
     */
    private function __construct(ProductVariantId $variantId, int $sortOrder)
    {
        $this->sortOrder = $sortOrder;
        $this->variantId = $variantId;
    }
    
    
    /**
     * @param ProductVariantId $variantId
     * @param int              $sortOrder
     *
     * @return UpdatedProductVariantsSortOrder
     */
    public static function create(ProductVariantId $variantId, int $sortOrder): UpdatedProductVariantsSortOrder
    {
        return new self($variantId, $sortOrder);
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
    
    
    /**
     * @return int
     */
    public function sortOrder(): int
    {
        return $this->sortOrder;
    }
}