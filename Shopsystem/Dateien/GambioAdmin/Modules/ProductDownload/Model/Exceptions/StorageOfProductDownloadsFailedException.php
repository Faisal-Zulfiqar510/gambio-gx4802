<?php
/*--------------------------------------------------------------------
 StorageOfProductDownloadsFailedException.php 2021-09-01
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
 * Class StorageOfProductDownloadsFailedException
 * @package Gambio\Admin\Modules\ProductDownload\Model\Exceptions
 */
class StorageOfProductDownloadsFailedException extends Exception
{
    /**
     * @param Exception $exception
     *
     * @return StorageOfProductDownloadsFailedException
     */
    public static function becauseOfException(Exception $exception): StorageOfProductDownloadsFailedException
    {
        return new self('Could not store product download because of previous exception.', 0, $exception);
    }
}