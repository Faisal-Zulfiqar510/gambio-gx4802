<?php
/*--------------------------------------------------------------
   FetchSpecificProductOptionAction.php 2022-03-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Gambio\Admin\Modules\ProductOption\Model\Exceptions\ProductOptionDoesNotExistException;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionReadService as ProductOptionReadServiceInterface;
use Gambio\Api\Application\Responses\CreateApiMetaDataTrait;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;
use Gambio\Core\Application\ValueObjects\Url;

/**
 * Class FetchSpecificProductOptionAction
 *
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class FetchSpecificProductOptionAction
{
    use CreateApiMetaDataTrait;
    
    /**
     * @var ProductOptionReadServiceInterface
     */
    private $service;
    
    /**
     * @var Url
     */
    private $url;
    
    
    /**
     * FetchSpecificProductOptionAction constructor.
     *
     * @param ProductOptionReadServiceInterface $service
     * @param Url                               $url
     */
    public function __construct(ProductOptionReadServiceInterface $service, Url $url)
    {
        $this->service = $service;
        $this->url     = $url;
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
        try {
            $productId       = (int)$request->getAttribute('productId');
            $productOptionId = (int)$request->getAttribute('optionId');
            $productOption   = $this->service->getProductOptionById($productOptionId);
            
            if ($productId !== $productOption->productId()) {
                $errorMessage = 'Product option id "%s" belongs to product id "%s" and not "%s"';
                $errorMessage = sprintf($errorMessage, $productOptionId, $productOption->productId(), $productId);
                
                return $response->withStatus(404)->withJson(['errors' => [[$errorMessage]]]);
            }
            
            $data     = $productOption->toArray();
            $links    = [
                'option'    => $this->url->restApiV3() . '/options/' . $data['optionId'],
                'imageList' => $this->url->restApiV3() . '/image-lists/' . $data['imageListId'],
            ];
            $metaData = $this->createApiMetaData($links);
            
            return $response->withJson([
                                           'data'  => $data,
                                           '_meta' => $metaData,
                                       ]);
        } catch (ProductOptionDoesNotExistException $exception) {
            return $response->withStatus(404);
        }
    }
}