<?php
/*--------------------------------------------------------------
   VariantId.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\ValueObjects;

use Webmozart\Assert\Assert;

/**
 * Class VariantId
 * @package Gambio\Admin\Modules\ProductVariant\Model\ValueObjects
 */
class ProductVariantId
{
    /**
     * @var int
     */
    protected $variantId;
    
    
    /**
     * ProductVariantId constructor.
     *
     * @param int $variantId
     */
    private function __construct(int $variantId)
    {
        $this->variantId = $variantId;
    }
    
    
    /**
     * @param int $variantId
     *
     * @return ProductVariantId
     */
    public static function create(int $variantId): ProductVariantId
    {
        Assert::greaterThan($variantId, 0, 'The product variant ID must be a positive integer. Got: %s');
        
        return new self($variantId);
    }
    
    
    /**
     * @return int
     */
    public function value(): int
    {
        return $this->variantId;
    }
}
