<?php
/*--------------------------------------------------------------
   ProductVariantDeleted.php 2020-03-01
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
 * Class ProductVariantDeleted
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class ProductVariantDeleted
{
    /**
     * @var ProductVariantId
     */
    protected $variantId;
    
    
    /**
     * ProductVariantDeleted constructor.
     *
     * @param ProductVariantId $variantId
     */
    public function __construct(ProductVariantId $variantId)
    {
        $this->variantId = $variantId;
    }
    
    
    /**
     * @param ProductVariantId $variantId
     *
     * @return ProductVariantDeleted
     */
    public static function create(ProductVariantId $variantId): ProductVariantDeleted
    {
        return new self($variantId);
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
}