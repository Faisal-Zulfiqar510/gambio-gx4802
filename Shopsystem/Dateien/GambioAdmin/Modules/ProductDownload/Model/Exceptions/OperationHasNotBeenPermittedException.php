<?php
/*--------------------------------------------------------------
   OperationHasNotBeenPermittedException.php 2021-10-12
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Exceptions;

use Exception;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadOperationPermitter;

/**
 * Class OperationHasNotBeenPermittedException
 * @package Gambio\Admin\Modules\ProductDownload\Model\Exceptions
 */
class OperationHasNotBeenPermittedException extends Exception
{
    /**
     * @param ProductDownloadOperationPermitter $permitter
     *
     * @return OperationHasNotBeenPermittedException
     */
    public static function forCreationByPermitter(
        ProductDownloadOperationPermitter $permitter
    ): OperationHasNotBeenPermittedException {
        
        return new self('Creation operation has not been permitted by "' . get_class($permitter) . '".');
    }
    
    
    /**
     * @param ProductDownloadOperationPermitter $permitter
     *
     * @return OperationHasNotBeenPermittedException
     */
    public static function forStorageByPermitter(
        ProductDownloadOperationPermitter $permitter
    ): OperationHasNotBeenPermittedException {
        
        return new self('Storage operation has not been permitted by "' . get_class($permitter) . '".');
    }
    
    
    /**
     * @param ProductDownloadOperationPermitter $permitter
     *
     * @return OperationHasNotBeenPermittedException
     */
    public static function forDeletionByPermitter(
        ProductDownloadOperationPermitter $permitter
    ): OperationHasNotBeenPermittedException {
        
        return new self('Deletion operation has not been permitted by "' . get_class($permitter) . '".');
    }
}