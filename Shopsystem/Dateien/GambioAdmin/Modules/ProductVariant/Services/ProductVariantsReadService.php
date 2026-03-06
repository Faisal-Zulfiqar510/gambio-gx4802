<?php
/*------------------------------------------------------------------------------
 ProductVariantsReadService.php 2020-03-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2020 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -----------------------------------------------------------------------------*/

namespace Gambio\Admin\Modules\ProductVariant\Services;

use Gambio\Admin\Modules\ProductVariant\Model\Collections\ProductVariants;
use Gambio\Admin\Modules\ProductVariant\Model\Exceptions\ProductVariantDoesNotExist;
use Gambio\Admin\Modules\ProductVariant\Model\ProductVariant;

/**
 * Interface ProductVariantsReadService
 * @package Gambio\Admin\Modules\ProductVariant\Services
 *
 * @deprecated Since 4.7, the gambio shop-system supports submodules. Those product domains will be refactored into
 *             submodules too. All important changes will be documented in the developer journal as soon as they are
 *             implemented.
 */
interface ProductVariantsReadService
{
    /**
     * @param int $productId
     *
     * @return ProductVariants
     */
    public function getProductVariantsByProductId(int $productId): ProductVariants;
    
    
    /**
     * @param int $variantId
     *
     * @return ProductVariant
     *
     * @throws ProductVariantDoesNotExist
     */
    public function getProductVariantById(int $variantId): ProductVariant;
}