<?php
/*--------------------------------------------------------------------------------------------------
    FetchAvailableProductDownloadsPerIdAction.php 2021-11-17
    Gambio GmbH
    http://www.gambio.de
    Copyright (c) 2021 Gambio GmbH
    Released under the GNU General Public License (Version 2)
    [http://www.gnu.org/licenses/gpl-2.0.html]
    --------------------------------------------------------------------------------------------------
 */

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Exception;
use Gambio\Admin\Modules\Option\Services\Exceptions\OptionDoesNotExistException;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Admin\Modules\ProductVariant\Services\ProductVariantsReadService as ProductVariantsReadServiceInterface;
use Gambio\Core\Application\Http\AbstractAction;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class FetchAvailableProductDownloadsPerIdAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
class FetchSpecificAvailableOptionsAction extends AbstractAction
{
    /**
     * @var OptionReadServiceInterface
     */
    private $optionReadService;
    
    /**
     * @var ProductDownloadReadServiceInterface
     */
    private $productDownloadReadService;
    
    /**
     * @var ProductVariantsReadServiceInterface
     */
    private $productVariantsReadService;
    
    
    /**
     * @param OptionReadServiceInterface          $optionReadService
     * @param ProductDownloadReadServiceInterface $productDownloadReadService
     * @param ProductVariantsReadServiceInterface $productVariantsReadService
     */
    public function __construct(
        OptionReadServiceInterface $optionReadService,
        ProductDownloadReadServiceInterface $productDownloadReadService,
        ProductVariantsReadServiceInterface $productVariantsReadService
    ) {
        $this->optionReadService          = $optionReadService;
        $this->productDownloadReadService = $productDownloadReadService;
        $this->productVariantsReadService = $productVariantsReadService;
    }
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        $productId = (int)$request->getAttribute('productId');
        $optionId  = (int)$request->getAttribute('optionId');
        
        try {
            $option         = $this->optionReadService->getOptionById($optionId);
            $productOptions = $this->productDownloadReadService->getProductDownloadsByProductId($productId);
            $variants       = $this->productVariantsReadService->getProductVariantsByProductId($productId);
            $valuesCreated  = array_column($productOptions->toArray(), 'optionValueId');
            $json           = [];
    
            foreach ($variants as $variant) {
        
                foreach ($variant->combination() as $optionAndOptionValueId) {
    
                    $valuesCreated[] = $optionAndOptionValueId->optionValueId();
                    
                    if ($optionAndOptionValueId->optionId() === $optionId) {
    
                        return $response->withJson(['data' => []]);
                    }
                }
            }
    
            $valuesCreated = array_unique($valuesCreated);
            
            foreach ($option->values() as $value) {
            
                if (in_array($value->id(), $valuesCreated, true)) {
            
                    continue;
                }
    
                $json[$value->id()] = [
                    'id'        => $value->id(),
                    'sortOrder' => $value->sortOrder(),
                    'details'   => $value->toArray()['details'],
                ];
            }
    
            if (count($json)) {
        
                usort($json, static function(array $a, array $b): int {
                    return $a['sortOrder'] <=> $b['sortOrder'];
                });
            }
    
            return $response->withJson(['data' => array_values($json)]);
        
        } catch (OptionDoesNotExistException $exception) {
            
            return $response->withStatus(404);
        } catch (Exception $exception) {
            return $response->withStatus(409)->withJson(['message' => $exception->getMessage()]);
        }
    }
}