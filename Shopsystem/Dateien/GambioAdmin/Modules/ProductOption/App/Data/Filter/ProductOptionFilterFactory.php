<?php
/* --------------------------------------------------------------
  ProductOptionFilterFactory.php 2021-04-09
  Gambio GmbH
  http://www.gambio.de
  Copyright (c) 2021 Gambio GmbH
  Released under the GNU General Public License (Version 2)
  [http://www.gnu.org/licenses/gpl-2.0.html]
  --------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Data\Filter;

use Gambio\Core\Filter\SqlPagination;

/**
 * Class ProductOptionFilterFactory
 * @package Gambio\Admin\Modules\ProductOption\App\Data\Filter
 */
class ProductOptionFilterFactory
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
     * @return ProductOptionFilters
     */
    public function createFilters(array $filters): ProductOptionFilters
    {
        return ProductOptionFilters::createFromMap($filters);
    }
    
    
    /**
     * @param string|null $sorting
     *
     * @return ProductOptionSorting
     */
    public function createSorting(?string $sorting): ProductOptionSorting
    {
        return ProductOptionSorting::create($sorting);
    }
}