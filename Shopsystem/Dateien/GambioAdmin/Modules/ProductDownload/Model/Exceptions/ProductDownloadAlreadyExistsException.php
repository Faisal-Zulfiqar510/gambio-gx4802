<?php
/*--------------------------------------------------------------------
 ProductDownloadAlreadyExistsException.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Exceptions;

use Exception;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;

/**
 * Class ProductDownloadAlreadyExistsException
 * @package Gambio\Admin\Modules\ProductDownload\Model\Exceptions
 */
class ProductDownloadAlreadyExistsException extends Exception
{
    /**
     * @param ProductId              $productId
     * @param OptionAndOptionValueId $optionAndOptionValueId
     *
     * @return ProductDownloadAlreadyExistsException
     */
    public static function forProductIdAndOptionAndOptionValueId(
        ProductId $productId,
        OptionAndOptionValueId $optionAndOptionValueId
    ): ProductDownloadAlreadyExistsException {
        
        $message = 'A product option "%s" already exist for the product id "%s"';
        
        return new self(sprintf($message, (string)$optionAndOptionValueId, $productId->value()));
    }
}