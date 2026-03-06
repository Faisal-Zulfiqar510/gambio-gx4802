<?php
/* --------------------------------------------------------------
   InvalidCacheKeyException.php 2021-04-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\Cache\Services\Exceptions;

use Exception;
use Psr\SimpleCache\InvalidArgumentException as InvalidArgumentExceptionInterface;

/**
 * Class InvalidCacheKeyException
 *
 * @package Gambio\Core\Cache\Model\Exceptions
 */
class InvalidCacheKeyException extends Exception implements InvalidArgumentExceptionInterface
{
    /**
     * @param string $string
     *
     * @return InvalidCacheKeyException
     */
    public static function forString(string $string): InvalidCacheKeyException
    {
        return new self('Provided key is invalid. String must contain only these characters: a-z, A-Z, 0-9, _ or . Got: '
                        . $string);
    }
}