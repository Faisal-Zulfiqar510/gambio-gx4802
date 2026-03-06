<?php
/*--------------------------------------------------------------------
 ProductDownloadDoesNotExistException.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Exceptions;

use Exception;

/**
 * Class ProductDownloadDoesNotExistException
 * @package Gambio\Admin\Modules\ProductDownload\Model\Exceptions
 */
class ProductDownloadDoesNotExistException extends Exception
{
    /**
     * @param int $productId
     *
     * @return ProductDownloadDoesNotExistException
     */
    final public static function forProductOptionId(int $productId): ProductDownloadDoesNotExistException
    {
        return new self(sprintf('Product option with ID %s does not exist.', $productId));
    }
}