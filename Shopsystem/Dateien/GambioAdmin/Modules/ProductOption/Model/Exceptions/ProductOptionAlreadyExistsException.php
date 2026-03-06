<?php
/*--------------------------------------------------------------------
 ProductOptionCombinationAlreadyExistsException.php 2021-04-27
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\Exceptions;

use Exception;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductOption\Model\ValueObjects\ProductId;

/**
 * Class ProductOptionCombinationAlreadyExistsException
 * @package Gambio\Admin\Modules\ProductOption\Model\Exceptions
 */
class ProductOptionAlreadyExistsException extends Exception
{
    /**
     * @param ProductId              $productId
     * @param OptionAndOptionValueId $optionAndOptionValueId
     *
     * @return ProductOptionAlreadyExistsException
     */
    public static function forProductIdAndOptionAndOptionValueId(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId
    ): ProductOptionAlreadyExistsException {
        
        $message = 'A product option "%s" already exist for the product id "%s"';
        
        return new self(sprintf($message, (string)$optionAndOptionValueId, $productId->value()));
    }
}