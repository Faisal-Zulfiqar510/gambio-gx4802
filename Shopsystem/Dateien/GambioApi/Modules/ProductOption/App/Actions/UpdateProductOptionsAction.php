<?php
/*--------------------------------------------------------------
   UpdateProductOptionsAction.php 2021-04-29
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Exception;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFactory;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestValidator;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;
use InvalidArgumentException;

/**
 * Class UpdateProductOptionsAction
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class UpdateProductOptionsAction
{
    /**
     * @var ProductOptionApiRequestValidator
     */
    private $validator;
    
    /**
     * @var ProductOptionFactory
     */
    private $factory;
    
    /**
     * @var ProductOptionReadServiceInterface
     */
    private $readService;
    
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private $writeService;
    
    
    /**
     * UpdateProductOptionsAction constructor.
     *
     * @param ProductOptionApiRequestValidator   $validator
     * @param ProductOptionFactory               $factory
     * @param ProductOptionReadServiceInterface  $readService
     * @param ProductOptionWriteServiceInterface $writeService
     */
    public function __construct(
        ProductOptionApiRequestValidator $validator,
        ProductOptionFactory $factory,
        ProductOptionReadServiceInterface $readService,
        ProductOptionWriteServiceInterface $writeService
    ) {
        $this->validator    = $validator;
        $this->factory      = $factory;
        $this->readService  = $readService;
        $this->writeService = $writeService;
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
            
            return $response->withStatus(400)->withJson(['errors' => ['product id can\'t be 0']]);
        }
        
        $errors = $this->validator->validateUpdateBody($request->getParsedBody());
        
        if (empty($errors) === false) {
            
            return $response->withStatus(400)->withJson(['errors' => $errors]);
        }
        
        $options = [];
        
        try {
            
            foreach ($request->getParsedBody() as $documentData) {
                
                $options[] = $option = $this->readService->getProductOptionById((int)$documentData['id']);
                
                if ($option->productId() !== $productId) {
                    
                    throw new InvalidArgumentException(sprintf('Product option with id "%s" belongs to the product with the id "%s"',
                                                               $option->id(),
                                                               $option->productId()));
                }
                
                $customization = $this->factory->createOptionValueCustomization($documentData['modelNumber'],
                                                                                $documentData['weight'],
                                                                                $documentData['price']);
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