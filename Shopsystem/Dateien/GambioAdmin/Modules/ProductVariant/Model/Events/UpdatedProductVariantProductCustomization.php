<?php
/*--------------------------------------------------------------
   UpdatedProductVariantProductCustomization.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductCustomization;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class UpdatedProductVariantProductCustomization
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantProductCustomization
{
    /**
     * @var ProductCustomization
     */
    private $productCustomization;
    
    /**
     * @var ProductVariantId
     */
    private $variantId;
    
    
    /**
     * UpdatedProductVariantProductCustomization constructor.
     *
     * @param ProductVariantId     $variantId
     * @param ProductCustomization $productCustomization
     */
    private function __construct(ProductVariantId $variantId, ProductCustomization $productCustomization)
    {
        $this->variantId            = $variantId;
        $this->productCustomization = $productCustomization;
    }
    
    
    /**
     * @param ProductVariantId     $variantId
     * @param ProductCustomization $productCustomization
     *
     * @return UpdatedProductVariantProductCustomization
     */
    public static function create(
        ProductVariantId $variantId,
        ProductCustomization $productCustomization
    ): UpdatedProductVariantProductCustomization {
        return new self($variantId, $productCustomization);
    }
    
    
    /**
     * @return ProductCustomization
     */
    public function productCustomization(): ProductCustomization
    {
        return $this->productCustomization;
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
}