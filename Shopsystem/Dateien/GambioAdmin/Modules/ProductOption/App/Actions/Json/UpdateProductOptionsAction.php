<?php
/*--------------------------------------------------------------
   UpdateProductOptionsAction.php 2022-10-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Actions\Json;

use Exception;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductOption\App\ProductOptionRequestParser;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Core\Application\Http\AbstractAction;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class UpdateProductOptionsAction
 *
 * @package Gambio\Admin\Modules\ProductOption\App\Actions\Json
 */
class UpdateProductOptionsAction extends AbstractAction
{
    /**
     * @var ProductOptionFactory
     */
    private ProductOptionFactory $factory;
    
    /**
     * @var ProductOptionReadServiceInterface
     */
    private ProductOptionReadServiceInterface $readService;
    
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private ProductOptionWriteServiceInterface $writeService;
    
    /**
     * @var ProductPriceConversionService
     */
    private ProductPriceConversionService $priceModifyService;
    
    /**
     * @var ProductOptionRequestParser
     */
    private ProductOptionRequestParser $requestParser;
    
    
    /**
     * UpdateProductOptionsAction constructor.
     *
     * @param ProductOptionFactory               $factory
     * @param ProductOptionReadServiceInterface  $readService
     * @param ProductOptionWriteServiceInterface $writeService
     * @param ProductPriceConversionService      $priceModifyService
     * @param ProductOptionRequestParser         $requestParser
     */
    public function __construct(
        ProductOptionFactory               $factory,
        ProductOptionReadServiceInterface  $readService,
        ProductOptionWriteServiceInterface $writeService,
        ProductPriceConversionService      $priceModifyService,
        ProductOptionRequestParser         $requestParser
    ) {
        $this->factory            = $factory;
        $this->readService        = $readService;
        $this->writeService       = $writeService;
        $this->priceModifyService = $priceModifyService;
        $this->requestParser      = $requestParser;
    }
    
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        if (($productId = (int)$request->getAttribute('productId')) === 0) {
            return $response->withStatus(400)->withJson(['errors' => ['product id can\'t be 0']]);
        }
        
        $parsedBody = $request->getParsedBody();
        $options    = [];
        
        try {
            foreach ($parsedBody as $documentData) {
                $options[] = $option = $this->readService->getProductOptionById((int)$documentData['id']);
                
                if ($option->productId() !== $productId) {
                    throw new \InvalidArgumentException(sprintf('Product option with id "%s" belongs to the product with the id "%s"',
                                                                $option->id(),
                                                                $option->productId()));
                }
                
                $documentData['price'] = $this->priceModifyService->getNetPrice($documentData['price'], $productId);
                
                $customization = $this->requestParser->parseOptionValueCustomizationData($documentData);
                $stock         = $this->factory->createProductOptionStock($documentData['stock'],
                                                                          $documentData['stockType']);
                
                $option->changeImageListId($this->factory->createImageListId($documentData['imageListId']));
                $option->changeSortOrder($documentData['sortOrder']);
                $option->changeProductOptionStock($stock);
                $option->changeOptionValueCustomization($customization);
            }
            
            $this->writeService->storeProductOptions(...$options);
            
            return $response->withStatus(204);
        } catch (Exception $exception) {
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}