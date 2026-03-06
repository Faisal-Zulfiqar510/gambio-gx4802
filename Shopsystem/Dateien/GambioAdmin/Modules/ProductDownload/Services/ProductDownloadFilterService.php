<?php
/*--------------------------------------------------------------------
 ProductDownloadFilterService.php 2022-09-13
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2022 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Services;

use Gambio\Admin\Modules\ProductDownload\Model\Collections\ProductDownloads;

/**
 * Interface ProductDownloadFilterService
 *
 * @package    Gambio\Admin\Modules\ProductDownload\Services
 *
 * @deprecated Since 4.7, the gambio shop-system supports submodules. Those product domains will be refactored into
 *             submodules too. All important changes will be documented in the developer journal as soon as they are
 *             implemented.
 */
interface ProductDownloadFilterService
{
    /**
     * @param int         $productId
     * @param array       $filters
     * @param string|null $sorting
     * @param int         $limit
     * @param int         $offset
     *
     * @return ProductDownloads
     */
    public function filterProductDownloads(
        int     $productId,
        array   $filters,
        ?string $sorting = null,
        int     $limit = 25,
        int     $offset = 0
    ): ProductDownloads;
    
    
    /**
     * @param int   $productId
     * @param array $filters
     *
     * @return int
     */
    public function getProductDownloadsTotalCount(int $productId, array $filters): int;
}