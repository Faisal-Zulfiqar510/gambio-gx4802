<?php
/*--------------------------------------------------------------
   ProductDownloadOperationPermitter.php 2021-10-12
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Services;

use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Interface ProductDownloadOperationPermitter
 * @package Gambio\Admin\Modules\ProductDownload\Services
 *
 * @deprecated Since 4.7, the gambio shop-system supports submodules. Those product domains will be refactored into
 *             submodules too. All important changes will be documented in the developer journal as soon as they are
 *             implemented.
 */
interface ProductDownloadOperationPermitter
{
    /**
     * Checks the permission of the create operation.
     *
     * @param array ...$creationArgs
     *
     * @return bool
     */
    public function permitsCreations(array ...$creationArgs): bool;
    
    /**
     * Checks the permission of the store operation.
     *
     * @param ProductDownload ...$productOption
     *
     * @return bool
     */
    public function permitsStorages(ProductDownload ...$productOption): bool;
    
    
    /**
     * Checks the permission of the delete operation.
     *
     * @param ProductOptionId ...$ids
     *
     * @return bool
     */
    public function permitsDeletions(ProductOptionId ...$ids): bool;
}