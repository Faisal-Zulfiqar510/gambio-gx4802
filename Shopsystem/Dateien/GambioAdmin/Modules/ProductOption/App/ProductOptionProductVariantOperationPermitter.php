<?php
/*--------------------------------------------------------------
   ProductOptionProductVariantOperationPermitter.php 2021-11-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App;

use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionRepository as ProductOptionRepositoryInterface;
use Gambio\Admin\Modules\ProductVariant\Model\Collections\OptionAndOptionValueIds;
use Gambio\Admin\Modules\ProductVariant\Model\ProductVariant;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductId;
use Gambio\Admin\Modules\ProductVariant\Model\ValueObjects\ProductVariantId;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantOperationPermitter as ProductVariantOperationPermitterInterface;

/**
 * Class ProductVariantOperationPermitter
 * @package Gambio\Admin\Modules\ProductOption\App
 */
class ProductOptionProductVariantOperationPermitter implements ProductVariantOperationPermitterInterface
{
    /**
     * @var ProductOptionRepositoryInterface
     */
    private $repository;
    
    /**
     * @var ProductOptionFactory
     */
    private $factory;
    
    /**
     * @var array
     */
    private $optionsUsedAsProductOption;
    
    
    /**
     * @param ProductOptionRepositoryInterface $repository
     * @param ProductOptionFactory             $factory
     */
    public function __construct(
        ProductOptionRepositoryInterface $repository,
        ProductOptionFactory $factory
    ) {
        $this->repository = $repository;
        $this->factory    = $factory;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsCreations(array ...$creationArgs): bool
    {
        foreach ($creationArgs as $args) {
            
            /** @var ProductId $productId */
            $productId = $args[0];
            /** @var OptionAndOptionValueIds $combination */
            $combination = $args[1];
            
            $optionIds = array_column($combination->toArray(), 'optionId');
            $optionIds = array_unique($optionIds);
            
            if ($this->optionIdUsedAsProductOption($productId->value(), ...$optionIds)) {
                
                return false;
            }
        }
        
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsStorages(ProductVariant ...$variants): bool
    {
        return true;
    }
    
    
    /**
     * @inheritDoc
     */
    public function permitsDeletions(ProductVariantId ...$ids): bool
    {
        return true;
    }
    
    
    /**
     * @param int $productId
     * @param int ...$optionIds
     *
     * @return bool
     */
    protected function optionIdUsedAsProductOption(
        int $productId,
        int ...$optionIds
    ): bool {
        
        if ($this->optionsUsedAsProductOption === null) {
    
            $productOptions = $this->repository->getProductOptionsByProductId($this->factory->createProductId($productId));
    
            $this->optionsUsedAsProductOption = array_column($productOptions->toArray(), 'optionId');
            $this->optionsUsedAsProductOption = array_unique($this->optionsUsedAsProductOption);
        }
        
        foreach ($optionIds as $optionId) {
        
            if (in_array($optionId, $this->optionsUsedAsProductOption, true)) {
                
                return true;
            }
        }
        
        return false;
    }
}