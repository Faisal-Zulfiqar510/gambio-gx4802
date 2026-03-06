<?php
/*--------------------------------------------------------------
   ProductVariantCreated.php 2020-03-01
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
 * Class ProductVariantCreated
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class ProductVariantCreated
{
    /**
     * @var ProductVariantId
     */
    protected $id;
    
    
    /**
     * ProductVariantCreated constructor.
     *
     * @param ProductVariantId $id
     */
    public function __construct(ProductVariantId $id)
    {
        $this->id = $id;
    }
    
    
    /**
     * @param ProductVariantId $id
     *
     * @return ProductVariantCreated
     */
    public static function create(ProductVariantId $id): ProductVariantCreated
    {
        return new self($id);
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->id;
    }
}