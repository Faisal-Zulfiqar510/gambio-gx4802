<?php
/*--------------------------------------------------------------
   ProductVariantDoesNotExist.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Exceptions;

use Exception;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;

/**
 * Class ProductVariantDoesNotExist
 * @package Gambio\Admin\Modules\ProductVariant\Model\Exceptions
 */
class ProductVariantDoesNotExist extends Exception
{
    /**
     * @param ProductVariantId $id
     *
     * @return ProductVariantDoesNotExist
     */
    public static function forProductVariantId(ProductVariantId $id): ProductVariantDoesNotExist
    {
        return new self('Variant with ID ' . $id->value() . ' does not exist.');
    }
}