<?php
/*--------------------------------------------------------------
   UpdatedProductVariantsImageListId.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Events;

use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class UpdatedProductVariantsImageListId
 * @package Gambio\Admin\Modules\ProductVariant\Model\Events
 * @codeCoverageIgnore
 */
class UpdatedProductVariantsImageListId
{
    /**
     * @var ImageListId
     */
    private $imageListId;
    
    /**
     * @var ProductVariantId
     */
    private $variantId;
    
    
    /**
     * UpdatedProductVariantsImageListId constructor.
     *
     * @param ProductVariantId $variantId
     * @param ImageListId      $imageListId
     */
    private function __construct(ProductVariantId $variantId, ImageListId $imageListId)
    {
        $this->variantId   = $variantId;
        $this->imageListId = $imageListId;
    }
    
    
    /**
     * @param ProductVariantId $variantId
     * @param ImageListId      $imageListId
     *
     * @return UpdatedProductVariantsImageListId
     */
    public static function create(
        ProductVariantId $variantId,
        ImageListId $imageListId
    ): UpdatedProductVariantsImageListId {
        
        return new self($variantId, $imageListId);
    }
    
    
    /**
     * @return ImageListId
     */
    public function imageListId(): ImageListId
    {
        return $this->imageListId;
    }
    
    
    /**
     * @return ProductVariantId
     */
    public function variantId(): ProductVariantId
    {
        return $this->variantId;
    }
}