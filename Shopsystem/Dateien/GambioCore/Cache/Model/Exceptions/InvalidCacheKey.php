<?php
/* --------------------------------------------------------------
   InvalidCacheKey.php 2021-04-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\Cache\Model\Exceptions;

use Gambio\Core\Cache\Services\Exceptions\InvalidCacheKeyException;

/**
 * Class InvalidCacheKey
 *
 * @package    Gambio\Core\Cache\Model\Exceptions
 * @deprecated Use `Gambio\Core\Cache\Services\Exceptions\InvalidCacheKeyException` instead
 */
class InvalidCacheKey extends InvalidCacheKeyException
{
    /**
     * @param string $string
     *
     * @return InvalidCacheKey
     */
    public static function forString(string $string): InvalidCacheKeyException
    {
        return new self('Provided key is invalid. String must contain only these characters: a-z, A-Z, 0-9, _ or . Got: '
                        . $string);
    }
}