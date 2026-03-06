<?php
/*--------------------------------------------------------------------
 ProductOptionsStockUpdated.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Events;

use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductDownloadStock;

/**
 * Class ProductOptionsStockUpdated
 * @package Gambio\Admin\Modules\ProductDownload\Model\Events
 */
class ProductDownloadsStockUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var ProductDownloadStock
     */
    private $productOptionStock;
    
    
    /**
     * ProductOptionStockUpdated constructor.
     *
     * @param ProductOptionId      $productOptionId
     * @param ProductDownloadStock $productOptionStock
     */
    private function __construct(
        ProductOptionId $productOptionId,
        ProductDownloadStock $productOptionStock
    ) {
        $this->productOptionId = $productOptionId;
        $this->productOptionStock = $productOptionStock;
    }
    
    
    /**
     * @param ProductOptionId      $productOptionId
     * @param ProductDownloadStock $productOptionStock
     *
     * @return ProductDownloadsStockUpdated
     */
    public static function create(
        ProductOptionId $productOptionId,
        ProductDownloadStock $productOptionStock
    ): ProductDownloadsStockUpdated {
        
        return new self($productOptionId, $productOptionStock);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return ProductDownloadStock
     */
    public function productOptionStock(): ProductDownloadStock
    {
        return $this->productOptionStock;
    }
}