<?php
/*--------------------------------------------------------------
   ProductVariantProductDownloadOperationPermitter.php 2021-10-12
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\App;

use Gambio\Admin\Modules\ProductDownload\Model\ProductDownload;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\OptionAndOptionValueId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductDownload\Model\ValueObjects\ProductOptionId;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadOperationPermitter;
use Gambio\Admin\Modules\ProductVariant\App\Data\ProductVariantsReader;

/**
 * Class ProductVariantProductDownloadOperationPermitter
 * @package Gambio\Admin\Modules\ProductVariant\App
 */
class ProductVariantProductDownloadOperationPermitter implements ProductDownloadOperationPermitter
{
    /**
     * @var ProductVariantsReader
     */
    private $reader;
    
    /**
     * @param ProductVariantsReader $readService
     */
    public function __construct(
        ProductVariantsReader $readService
    ) {
        $this->reader = $readService;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsCreations(array ...$creationArgs): bool
    {
        foreach ($creationArgs as $args) {
    
            /** @var ProductId $productId */
            $productId = $args[0];
            /** @var OptionAndOptionValueId $optionAndOptionValueId */
            $optionAndOptionValueId = $args[1];
            
            if (in_array($optionAndOptionValueId->optionId(), $this->optionsUsedAsVariants($productId), true)) {
                
                return false;
            }
        }
        
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsStorages(ProductDownload ...$productOption): bool
    {
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsDeletions(ProductOptionId ...$ids): bool
    {
        return true;
    }
    
    
    /**
     * @param ProductId $productId
     *
     * @return array
     */
    private function optionsUsedAsVariants(ProductId $productId): array
    {
        $result   = [];
        $variants = $this->reader->getProductVariantsByProductId(\Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductId::create($productId->value()));
        
        foreach ($variants as $variant) {
            
            foreach (explode('|', $variant['combination']) as $optionOptionValue) {
                
                $result[] = (int)(explode('-', $optionOptionValue)[0]);
            }
        }
        
        return array_unique($result);
    }
}