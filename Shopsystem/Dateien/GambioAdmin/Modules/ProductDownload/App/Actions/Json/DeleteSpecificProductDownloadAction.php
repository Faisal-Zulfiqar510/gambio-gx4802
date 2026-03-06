<?php
/*--------------------------------------------------------------
   DeleteSpecificProductDownloadAction.php 2021-09-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Exception;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadWriteService as ProductDownloadWriteServiceInterface;
use Gambio\Core\Application\Http\AbstractAction;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class DeleteSpecificProductDownloadAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
class DeleteSpecificProductDownloadAction extends AbstractAction
{
    /**
     * @var ProductDownloadWriteServiceInterface
     */
    private $writeService;
    
    /**
     * @var ProductDownloadReadServiceInterface
     */
    private $readService;
    
    
    /**
     * DeleteSpecificProductOptionsAction constructor.
     *
     * @param ProductDownloadWriteServiceInterface $writeService
     * @param ProductDownloadReadServiceInterface  $readService
     */
    public function __construct(
        ProductDownloadWriteServiceInterface $writeService,
        ProductDownloadReadServiceInterface $readService
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
        
                $productOption = $this->readService->getProductDownloadById($productOptionId);
        
                if ($productOption->productId() !== $productId) {
            
                    $errorMessage = 'Product download id "%s" belongs to product id "%s" and not "%s"';
                    $errorMessage = sprintf($errorMessage, $productOptionId, $productOption->productId(), $productId);
            
                    throw new Exception($errorMessage);
                }
            }
    
            $this->writeService->deleteProductDownloads(...$productOptionIds);
    
            return $response->withStatus(204);
            
        } catch (Exception $exception) {
    
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}