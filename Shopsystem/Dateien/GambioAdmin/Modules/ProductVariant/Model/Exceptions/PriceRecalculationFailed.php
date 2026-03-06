<?php
/*--------------------------------------------------------------
   PriceRecalculationFailed.php 2022-02-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Exceptions;

use Exception;

/**
 * Class PriceRecalculationFailed
 *
 * @package Gambio\Admin\Modules\ProductVariant\Model\Exceptions
 */
class PriceRecalculationFailed extends Exception
{
    /**
     * @param Exception $exception
     *
     * @return PriceRecalculationFailed
     */
    public static function becauseOfException(Exception $exception): PriceRecalculationFailed
    {
        return new self('Could not recalculate product variant prices because of previous exception.', 0, $exception);
    }
}