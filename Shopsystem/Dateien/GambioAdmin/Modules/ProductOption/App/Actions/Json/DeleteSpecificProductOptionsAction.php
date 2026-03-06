<?php
/*--------------------------------------------------------------
   DeleteSpecificProductOptionsAction.php 2021-08-04
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\App\Actions\Json;

use Exception;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Core\Application\Http\AbstractAction;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class DeleteSpecificProductOptionsAction
 * @package Gambio\Admin\Modules\ProductOption\App\Actions\Json
 */
class DeleteSpecificProductOptionsAction extends AbstractAction
{
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private $writeService;
    
    /**
     * @var ProductOptionReadServiceInterface
     */
    private $readService;
    
    
    /**
     * DeleteSpecificProductOptionsAction constructor.
     *
     * @param ProductOptionWriteServiceInterface $writeService
     * @param ProductOptionReadServiceInterface  $readService
     */
    public function __construct(
        ProductOptionWriteServiceInterface $writeService,
        ProductOptionReadServiceInterface $readService
    ) {
        $this->writeService = $writeService;
        $this->readService  = $readService;
    }
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        $productOptionIds = explode(',', $request->getAttribute('optionIds'));
        $productOptionIds = array_map('intval', $productOptionIds);
        $productId        = (int)$request->getAttribute('productId');
        
        try {
    
            foreach ($productOptionIds as $productOptionId) {
        
                $productOption = $this->readService->getProductOptionById($productOptionId);
        
                if ($productOption->productId() !== $productId) {
            
                    $errorMessage = 'Product option id "%s" belongs to product id "%s" and not "%s"';
                    $errorMessage = sprintf($errorMessage, $productOptionId, $productOption->productId(), $productId);
            
                    throw new Exception($errorMessage);
                }
            }
    
            $this->writeService->deleteProductOptions(...$productOptionIds);
    
            return $response->withStatus(204);
            
        } catch (Exception $exception) {
    
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}