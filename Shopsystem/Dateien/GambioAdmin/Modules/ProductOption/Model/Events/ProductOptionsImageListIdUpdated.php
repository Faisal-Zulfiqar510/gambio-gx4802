<?php
/*--------------------------------------------------------------------
 ProductOptionsImageListIdUpdated.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Events;

use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ImageListId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductOptionsImageListIdUpdated
 * @package Gambio\Admin\Modules\ProductOption\Model\Events
 */
class ProductOptionsImageListIdUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var ImageListId
     */
    private $imageListId;
    
    
    /**
     * ProductOptionsImageListIdUpdated constructor.
     *
     * @param ProductOptionId $productOptionId
     * @param ImageListId     $imageListId
     */
    private function __construct(
        ProductOptionId $productOptionId,
        ImageListId $imageListId
    ) {
        $this->productOptionId = $productOptionId;
        $this->imageListId     = $imageListId;
    }
    
    
    /**
     * @param ProductOptionId $productOptionId
     * @param ImageListId     $imageListId
     *
     * @return ProductOptionsImageListIdUpdated
     */
    public static function create(
        ProductOptionId $productOptionId,
        ImageListId $imageListId
    ): ProductOptionsImageListIdUpdated {
        
        return new self($productOptionId, $imageListId);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return ImageListId
     */
    public function imageListId(): ImageListId
    {
        return $this->imageListId;
    }
}