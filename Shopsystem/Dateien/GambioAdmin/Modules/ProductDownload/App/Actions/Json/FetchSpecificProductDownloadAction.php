<?php
/*--------------------------------------------------------------
   FetchSpecificProductDownloadAction.php 2021-10-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\Option\Services\Exceptions\OptionDoesNotExistException;
use Gambio\Admin\Modules\Option\Services\OptionFactory;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductDownload\Model\Exceptions\ProductDownloadDoesNotExistException;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class FetchSpecificProductDownloadAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
class FetchSpecificProductDownloadAction extends AbstractProductDownloadAction
{
    /**
     * @var ProductDownloadReadServiceInterface
     */
    private $productOptionReadService;
    /**
     * @var OptionReadServiceInterface
     */
    private $optionReadService;
    /**
     * @var OptionFactory
     */
    private $optionFactory;
    /**
     * @var ProductPriceConversionService
     */
    private $priceModifyService;
    
    
    /**
     * FetchSpecificProductOptionAction constructor.
     *
     * @param ProductDownloadReadServiceInterface $productOptionReadService
     * @param OptionReadServiceInterface          $optionReadService
     * @param OptionFactory                       $optionFactory
     * @param Connection                          $connection
     * @param ProductPriceConversionService       $priceModifyService
     */
    public function __construct(
        ProductDownloadReadServiceInterface $productOptionReadService,
        OptionReadServiceInterface $optionReadService,
        OptionFactory $optionFactory,
        Connection $connection,
        ProductPriceConversionService $priceModifyService
    ) {
        $this->productOptionReadService = $productOptionReadService;
        $this->optionReadService        = $optionReadService;
        $this->optionFactory            = $optionFactory;
        $this->priceModifyService       = $priceModifyService;
        $this->setConnection($connection);
    }
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        try {
    
            $productId       = (int)$request->getAttribute('productId');
            $productOptionId = (int)$request->getAttribute('optionId');
            $productOption   = $this->productOptionReadService->getProductDownloadById($productOptionId);
            $json            = [];
    
            if (in_array($productOption->id(), $this->downloadProductOptionIds(), true) === false) {
            
                throw ProductDownloadDoesNotExistException::forProductOptionId($productOption->id());
            }
    
            if ($productId !== $productOption->productId()) {
        
                $errorMessage = 'Product option id "%s" belongs to product id "%s" and not "%s"';
                $errorMessage = sprintf($errorMessage, $productOptionId, $productOption->productId(), $productId);
        
                return $response->withStatus(404)->withJson(['errors' => [[$errorMessage]]]);
            }
    
            $data = $productOption->toArray();
            $data = $this->addDownloadDataToArray($data);
            unset($data['optionId'], $data['optionValueId'], $data['productId']);
    
            $optionValueId       = $this->optionFactory->createOptionValueId($productOption->optionValueId());
            $data['optionValue'] = $this->optionReadService->getOptionById($productOption->optionId())
                ->values()
                ->getById($optionValueId)
                ->toArray();
    
            $data['price'] = $this->priceModifyService->getGrossPrice($data['price'], $productId);
            
            $json['values'][] = $data;
    
            $option          = $this->optionReadService->getOptionById($productOption->optionId());
            $json['id']      = $option->id();
            $json['details'] = $option->toArray()['details'];
    
            ksort($json);
            usort($json['values'], static function (array $a, array $b) {
                return (int)$a['sortOrder'] <=> (int)$b['sortOrder'];
            });
    
            return $response->withJson(['data' => $json,]);
            
        } catch (ProductDownloadDoesNotExistException | OptionDoesNotExistException $exception) {
    
            return $response->withStatus(404);
        }
    }
}