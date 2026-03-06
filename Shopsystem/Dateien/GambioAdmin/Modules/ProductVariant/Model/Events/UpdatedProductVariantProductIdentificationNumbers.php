<?php
/*--------------------------------------------------------------
   UpdatedProductVariantProductIdentificationNumbers.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductIdentificationNumbers;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class UpdatedProductVariantProductIdentificationNumbers
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantProductIdentificationNumbers
{
    /**
     * @var ProductIdentificationNumbers
     */
    private $productIdentificationNumbers;
    
    /**
     * @var ProductVariantId
     */
    private $variantId;
    
    
    /**
     * UpdatedProductVariantProductIdentificationNumbers constructor.
     *
     * @param ProductVariantId             $variantId
     * @param ProductIdentificationNumbers $productIdentificationNumbers
     */
    private function __construct(
        ProductVariantId $variantId,
        ProductIdentificationNumbers $productIdentificationNumbers
    ) {
        $this->productIdentificationNumbers = $productIdentificationNumbers;
        $this->variantId                    = $variantId;
    }
    
    
    /**
     * @param ProductVariantId             $variantId
     * @param ProductIdentificationNumbers $productIdentificationNumbers
     *
     * @return UpdatedProductVariantProductIdentificationNumbers
     */
    public static function create(
        ProductVariantId $variantId,
        ProductIdentificationNumbers $productIdentificationNumbers
    ): UpdatedProductVariantProductIdentificationNumbers {
        return new self($variantId, $productIdentificationNumbers);
    }
    
    
    /**
     * @return ProductIdentificationNumbers
     */
    public function productIdentificationNumbers(): ProductIdentificationNumbers
    {
        return $this->productIdentificationNumbers;
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
}