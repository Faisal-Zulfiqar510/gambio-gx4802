<?php
/*--------------------------------------------------------------------
 DeletionOfProductOptionsFailedException.php 2021-04-09
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
 * Class DeletionOfProductOptionsFailedException
 * @package Gambio\Admin\Modules\ProductOption\Model\Exceptions
 */
class DeletionOfProductOptionsFailedException extends Exception
{
    /**
     * @param Exception $exception
     *
     * @return DeletionOfProductOptionsFailedException
     */
    public static function becauseOfException(Exception $exception): DeletionOfProductOptionsFailedException
    {
        return new self('Could not delete product option because of previous exception.', 0, $exception);
    }
}