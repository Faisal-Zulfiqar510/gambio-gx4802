<?php
/*--------------------------------------------------------------------
 ProductOptionDoesNotExistException.php 2021-04-09
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Exceptions;

use Exception;

/**
 * Class ProductOptionDoesNotExistException
 * @package Gambio\Admin\Modules\ProductOption\Model\Exceptions
 */
class ProductOptionDoesNotExistException extends Exception
{
    /**
     * @param int $productId
     *
     * @return ProductOptionDoesNotExistException
     */
    final public static function forProductOptionId(int $productId): ProductOptionDoesNotExistException
    {
        return new self(sprintf('Product option with ID %s does not exist.', $productId));
    }
}