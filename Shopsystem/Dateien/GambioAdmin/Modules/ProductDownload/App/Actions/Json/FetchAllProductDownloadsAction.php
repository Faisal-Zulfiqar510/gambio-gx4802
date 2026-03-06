<?php
/*--------------------------------------------------------------
   FetchAllProductDownloadsAction.php 2021-10-27
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductDownload\App\Actions\Json;

use Doctrine\DBAL\Connection;
use Gambio\Admin\Modules\Option\Services\OptionFactory;
use Gambio\Admin\Modules\Option\Services\OptionReadService as OptionReadServiceInterface;
use Gambio\Admin\Modules\Price\Services\ProductPriceConversionService;
use Gambio\Admin\Modules\ProductDownload\Services\ProductDownloadReadService as ProductDownloadReadServiceInterface;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class FetchAllProductDownloadsAction
 * @package Gambio\Admin\Modules\ProductDownload\App\Actions\Json
 */
class FetchAllProductDownloadsAction extends AbstractProductDownloadAction
{
    /**
     * @var ProductDownloadReadServiceInterface
     */
    private $productDownloadReadService;
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
        $this->productDownloadReadService = $productOptionReadService;
        $this->optionReadService          = $optionReadService;
        $this->optionFactory              = $optionFactory;
        $this->priceModifyService         = $priceModifyService;
        $this->setConnection($connection);
    }
    
    
    /**
     * @inheritDoc
     */
    public function handle(Request $request, Response $response): Response
    {
        $json           = [];
        $productId      = (int)$request->getAttribute('productId');
        $productOptions = $this->productDownloadReadService->getProductDownloadsByProductId($productId);
        
        foreach ($productOptions as $productOption) {
            
            if (in_array($productOption->id(), $this->downloadProductOptionIds(), true) === false) {
            
                continue;
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
            
            $json[$productOption->optionId()]['values'][] = $data;
        }
        
        foreach (array_keys($json) as $optionId) {
            
            $option                         = $this->optionReadService->getOptionById($optionId);
            $json[$option->id()]['id']      = $option->id();
            $json[$option->id()]['details'] = $option->toArray()['details'];
            
            ksort($json[$option->id()]);
            usort($json[$option->id()]['values'], static function (array $a, array $b) {
                return (int)$a['sortOrder'] <=> (int)$b['sortOrder'];
            });
        }
        
        return $response->withJson(['data' => array_values($json)]);
    }
}