<?php
/*--------------------------------------------------------------
   PatchProductOptionsAction.php 2022-05-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Exception;
use Gambio\Admin\Modules\ProductOption\Model\ProductOption;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestValidator;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;
use InvalidArgumentException;

/**
 * Class PatchProductOptionsAction
 *
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class PatchProductOptionsAction
{
    /**
     * @var ProductOptionReadServiceInterface
     */
    private $readService;
    
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private $writeService;
    
    /**
     * @var ProductOptionFactory
     */
    private $optionFactory;
    
    
    /**
     * @param ProductOptionReadServiceInterface  $readService
     * @param ProductOptionWriteServiceInterface $writeService
     * @param ProductOptionFactory               $optionFactory
     */
    public function __construct(
        ProductOptionReadServiceInterface  $readService,
        ProductOptionWriteServiceInterface $writeService,
        ProductOptionFactory               $optionFactory
    ) {
        $this->readService   = $readService;
        $this->writeService  = $writeService;
        $this->optionFactory = $optionFactory;
    }
    
    
    /**
     * @param Request  $request
     * @param Response $response
     * @param array    $args
     *
     * @return Response
     */
    public function __invoke(Request $request, Response $response, array $args): Response
    {
        if (($productId = (int)$request->getAttribute('productId')) === 0) {
            return $response->withStatus(400)->withJson(['errors' => ['Product ID can\'t be 0']]);
        }
        
        $productOptions = [];
        
        try {
            foreach ($request->getParsedBody() as $documentData) {
                $productOptions[] = $productOption = $this->readService->getProductOptionById((int)($documentData['id'] ?? 0));
                
                if ($productOption->productId() !== $productId) {
                    throw new InvalidArgumentException(sprintf('Product option with ID "%s" belongs to the product with the ID "%s"',
                                                               $productOption->id(),
                                                               $productOption->productId()));
                }
                
                $this->patchProductOption($documentData, $productOption);
            }
            
            $this->writeService->storeProductOptions(...$productOptions);
            
            return $response->withStatus(204);
        } catch (Exception $exception) {
            return $response->withStatus(422)->withJson(['errors' => [[$exception->getMessage()]]]);
        }
    }
    
    
    /**
     * @param array         $documentData
     * @param ProductOption $option
     *
     * @return void
     */
    private function patchProductOption(array $documentData, ProductOption $option): void
    {
        if (array_key_exists('imageListId', $documentData)) {
            $this->changeImageListId($documentData, $option);
        }
        
        if (array_key_exists('modelNumber', $documentData) || array_key_exists('weight', $documentData)
            || array_key_exists('price', $documentData)) {
            $this->changeOptionValueCustomization($documentData, $option);
        }
        
        if (array_key_exists('stockType', $documentData) || array_key_exists('stock', $documentData)) {
            $this->changeProductOptionStock($documentData, $option);
        }
        
        if (array_key_exists('sortOrder', $documentData)) {
            $this->changeSortOrder($documentData, $option);
        }
    }
    
    
    /**
     * @param array         $documentData
     * @param ProductOption $option
     *
     * @return void
     */
    private function changeImageListId(array $documentData, ProductOption $option): void
    {
        if ($documentData['imageListId'] !== null) {
            $documentData['imageListId'] = (int)$documentData['imageListId'];
        } else {
            $documentData['imageListId'] = null;
        }
        
        $newImageListId = $this->optionFactory->createImageListId($documentData['imageListId']);
        
        $option->changeImageListId($newImageListId);
    }
    
    
    /**
     * @param array         $documentData
     * @param ProductOption $option
     *
     * @return void
     */
    private function changeOptionValueCustomization(array $documentData, ProductOption $option): void
    {
        $documentData['modelNumber'] = $documentData['modelNumber'] ?? $option->modelNumber();
        $documentData['weight']      = $documentData['weight'] ?? $option->weight();
        $documentData['price']       = $documentData['price'] ?? $option->price();
        
        $newOptionValueCustomization = $this->optionFactory->createOptionValueCustomization($documentData['modelNumber'],
                                                                                            (float)$documentData['weight'],
                                                                                            (float)$documentData['price']);
        
        $option->changeOptionValueCustomization($newOptionValueCustomization);
    }
    
    
    /**
     * @param array         $documentData
     * @param ProductOption $option
     *
     * @return void
     */
    private function changeProductOptionStock(array $documentData, ProductOption $option): void
    {
        $documentData['stock']     = $documentData['stock'] ?? $option->stock();
        $documentData['stockType'] = $documentData['stockType'] ?? $option->stockType();
        
        $newProductVariantStock = $this->optionFactory->createProductOptionStock((float)$documentData['stock'],
                                                                                 $documentData['stockType']);
        
        $option->changeProductOptionStock($newProductVariantStock);
    }
    
    
    /**
     * @param array         $documentData
     * @param ProductOption $option
     *
     * @return void
     */
    private function changeSortOrder(array $documentData, ProductOption $option): void
    {
        $option->changeSortOrder((int)$documentData['sortOrder']);
    }
}