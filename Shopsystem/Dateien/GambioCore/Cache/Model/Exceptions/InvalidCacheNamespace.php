<?php
/* --------------------------------------------------------------
   InvalidCacheNamespace.php 2021-04-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2019 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace Gambio\Core\Cache\Model\Exceptions;

use Gambio\Core\Cache\Services\Exceptions\InvalidCacheNamespaceException;

/**
 * Class InvalidCacheNamespace
 *
 * @package    Gambio\Core\Cache\Model\Exceptions
 * @deprecated Use `Gambio\Core\Cache\Services\Exceptions\InvalidCacheNamespaceException` instead
 */
class InvalidCacheNamespace extends InvalidCacheNamespaceException
{
    /**
     * @param string $string
     *
     * @return InvalidCacheNamespace
     */
    public static function forString(string $string): InvalidCacheNamespaceException
    {
        return new self('Provided namespace is invalid. String must contain only these characters: a-z, A-Z, 0-9, _ or . Got: '
                        . $string);
    }
}