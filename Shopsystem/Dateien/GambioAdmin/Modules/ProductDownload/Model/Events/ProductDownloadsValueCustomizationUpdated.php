<?php
/*--------------------------------------------------------------------
 ProductDownloadsValueCustomizationUpdated.php 2021-09-01
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\Model\Events;

use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionValueCustomization;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;

/**
 * Class ProductDownloadsValueCustomizationUpdated
 * @package Gambio\Admin\Modules\ProductDownload\Model\Events
 */
class ProductDownloadsValueCustomizationUpdated
{
    /**
     * @var ProductOptionId
     */
    private $productOptionId;
    
    /**
     * @var OptionValueCustomization
     */
    private $optionValueCustomization;
    
    
    /**
     * ProductDownloadsValueCustomizationUpdated constructor.
     *
     * @param ProductOptionId          $productOptionId
     * @param OptionValueCustomization $optionValueCustomization
     */
    private function __construct(
        ProductOptionId $productOptionId,
        OptionValueCustomization $optionValueCustomization
    ) {
        $this->productOptionId          = $productOptionId;
        $this->optionValueCustomization = $optionValueCustomization;
    }
    
    
    /**
     * @param ProductOptionId          $productOptionId
     * @param OptionValueCustomization $optionValueCustomization
     *
     * @return ProductDownloadsValueCustomizationUpdated
     */
    public static function create(
        ProductOptionId $productOptionId,
        OptionValueCustomization $optionValueCustomization
    ): ProductDownloadsValueCustomizationUpdated {
        
        return new self($productOptionId, $optionValueCustomization);
    }
    
    
    /**
     * @return ProductOptionId
     */
    public function productOptionId(): ProductOptionId
    {
        return $this->productOptionId;
    }
    
    
    /**
     * @return OptionValueCustomization
     */
    public function optionValueCustomization(): OptionValueCustomization
    {
        return $this->optionValueCustomization;
    }
}