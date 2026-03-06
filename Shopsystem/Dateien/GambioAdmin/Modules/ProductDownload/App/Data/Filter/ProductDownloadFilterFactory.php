<?php
/* --------------------------------------------------------------
  ProductDownloadFilterFactory.php 2021-09-01
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2021 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Data\Filter;

use Gambio\Core\Filter\SqlPagination;

/**
 * Class ProductDownloadFilterFactory
 * @package Gambio\Admin\Modules\ProductDownload\App\Data\Filter
 */
class ProductDownloadFilterFactory
{
    /**
     * @param int $limit
     * @param int $offset
     *
     * @return SqlPagination
     */
    public function createPagination(int $limit, int $offset): SqlPagination
    {
        return SqlPagination::createWithLimitAndOffset($limit, $offset);
    }
    
    
    /**
     * @param array $filters
     *
     * @return ProductDownloadFilters
     */
    public function createFilters(array $filters): ProductDownloadFilters
    {
        return ProductDownloadFilters::createFromMap($filters);
    }
    
    
    /**
     * @param string|null $sorting
     *
     * @return ProductDownloadSorting
     */
    public function createSorting(?string $sorting): ProductDownloadSorting
    {
        return ProductDownloadSorting::create($sorting);
    }
}