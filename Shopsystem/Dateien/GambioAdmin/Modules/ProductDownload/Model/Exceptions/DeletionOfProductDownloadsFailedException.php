<?php
/*--------------------------------------------------------------------
 DeletionOfProductDownloadsFailedException.php 2021-09-01
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
 * Class DeletionOfProductDownloadsFailedException
 * @package Gambio\Admin\Modules\ProductDownload\Model\Exceptions
 */
class DeletionOfProductDownloadsFailedException extends Exception
{
    /**
     * @param Exception $exception
     *
     * @return DeletionOfProductDownloadsFailedException
     */
    public static function becauseOfException(Exception $exception): DeletionOfProductDownloadsFailedException
    {
        return new self('Could not delete product download because of previous exception.', 0, $exception);
    }
}