<?php
/*--------------------------------------------------------------------
 ProductDownloadsSortOrderUpdated.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Events;

use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductDownloadsSortOrderUpdated
 * @package Gambio\Admin\Modules\ProductDownload\Model\Events
 */
class ProductDownloadsSortOrderUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var int
     */
    private $sortOrder;
    
    
    /**
     * ProductDownloadsSortOrderUpdated constructor.
     *
     * @param ProductOptionId $productOptionId
     * @param int             $sortOrder
     */
    private function __construct(ProductOptionId $productOptionId, int $sortOrder)
    {
        $this->productOptionId = $productOptionId;
        $this->sortOrder       = $sortOrder;
    }
    
    
    /**
     * @param ProductOptionId $productOptionId
     * @param int             $sortOrder
     *
     * @return ProductDownloadsSortOrderUpdated
     */
    public static function create(ProductOptionId $productOptionId, int $sortOrder): ProductDownloadsSortOrderUpdated
    {
        return new self($productOptionId, $sortOrder);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return int
     */
    public function sortOrder(): int
    {
        return $this->sortOrder;
    }
}