<?php
/*--------------------------------------------------------------
   ProductVariantCombinationAlreadyExists.php 2020-03-01
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\Exceptions;

use Exception;

/**
 * Class ProductVariantCombinationAlreadyExists
 * @package Gambio\Admin\Modules\ProductVariant\Model\Exceptions
 */
class ProductVariantCombinationAlreadyExists extends Exception
{
    /**
     * @param int    $productId
     * @param string $optionAndOptionValueId
     *
     * @return ProductVariantCombinationAlreadyExists
     */
    public static function forProductIdAndCombinationString(
        int $productId,
        string $optionAndOptionValueId
    ): ProductVariantCombinationAlreadyExists {
        return new self('Variant "' . $optionAndOptionValueId . '" for product ID ' . $productId . ' already exists.');
    }
}