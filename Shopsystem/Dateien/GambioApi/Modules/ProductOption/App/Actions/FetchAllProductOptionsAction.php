<?php
/*--------------------------------------------------------------
   FetchAllProductOptionsAction.php 2021-11-16
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Gambio\Admin\Modules\ProductOption\Services\ProductOptionFilterService as ProductOptionFilterServiceInterface;
use Gambio\Api\Application\Responses\CreateApiMetaDataTrait;
use Gambio\Api\Application\Responses\ResponseDataTrimmerTrait;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestParser;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class FetchAllProductOptionsAction
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class FetchAllProductOptionsAction
{
    use CreateApiMetaDataTrait;
    use ResponseDataTrimmerTrait;
    
    /**
     * @var ProductOptionApiRequestParser
     */
    private $parser;
    
    /**
     * @var ProductOptionFilterServiceInterface
     */
    private $service;
    
    
    /**
     * FetchAllProductOptionsAction constructor.
     *
     * @param ProductOptionApiRequestParser       $parser
     * @param ProductOptionFilterServiceInterface $service
     */
    public function __construct(
        ProductOptionApiRequestParser $parser,
        ProductOptionFilterServiceInterface $service
    ) {
        $this->parser  = $parser;
        $this->service = $service;
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
        $fields     = $this->parser->getFields($request);
        $filters    = $this->parser->getFilters($request);
        $productId  = (int)$request->getAttribute('productId');
        $sorting    = $this->parser->getSorting($request);
        $page       = $this->parser->getPage($request);
        $limit      = $this->parser->getPerPage($request);
        $offset     = $limit * ($page - 1);
        $options    = $this->service->filterProductOptions($productId, $filters, $sorting, $limit, $offset);
        $totalCount = $this->service->getProductOptionsTotalCount($productId, $filters);
        
        $metaData = $this->createApiCollectionMetaData($page,
                                                       $limit,
                                                       $totalCount,
                                                       $this->parser->getResourceUrlFromRequest($request),
                                                       $request->getQueryParams());
        
        $responseData = $options->toArray();
        
        if (count($fields) > 0) {
            
            $responseData = $this->trimCollectionData($responseData, $fields);
        }
    
        return $response->withJson([
                                       'data'  => $responseData,
                                       '_meta' => $metaData,
                                   ]);
    }
}