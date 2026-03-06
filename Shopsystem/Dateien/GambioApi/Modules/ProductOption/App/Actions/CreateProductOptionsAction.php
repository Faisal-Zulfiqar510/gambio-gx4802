<?php
/*--------------------------------------------------------------
   CreateProductOptionsAction.php 2022-03-24
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Gambio\Admin\Modules\ProductOption\Model\Exceptions\InsertionOfProductOptionsFailedException;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\ProductOptionAlreadyExistsException;
use Gambio\Admin\Modules\ProductOption\Services\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Api\Application\Responses\CreateApiMetaDataTrait;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestParser;
use Gambio\Api\Modules\ProductOption\App\ProductOptionApiRequestValidator;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;
use Gambio\Core\Application\ValueObjects\Url;

/**
 * Class CreateProductOptionsAction
 *
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class CreateProductOptionsAction
{
    use CreateApiMetaDataTrait;
    
    /**
     * @var ProductOptionApiRequestValidator
     */
    private $validator;
    
    /**
     * @var ProductOptionApiRequestParser
     */
    private $parser;
    
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private $service;
    
    /**
     * @var Url
     */
    private $url;
    
    
    /**
     * CreateProductOptionsAction constructor.
     *
     * @param ProductOptionApiRequestValidator   $validator
     * @param ProductOptionApiRequestParser      $parser
     * @param ProductOptionWriteServiceInterface $service
     * @param Url                                $url
     */
    public function __construct(
        ProductOptionApiRequestValidator   $validator,
        ProductOptionApiRequestParser      $parser,
        ProductOptionWriteServiceInterface $service,
        Url                                $url
    ) {
        $this->validator = $validator;
        $this->parser    = $parser;
        $this->service   = $service;
        $this->url       = $url;
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
        
        $errors = $this->validator->validateCreationBody($request->getParsedBody());
        if (empty($errors) === false) {
            return $response->withStatus(400)->withJson(['errors' => $errors]);
        }
        
        $creationArguments = $this->parser->parseProductOptionsData($request, $errors);
        if (empty($errors) === false || empty($creationArguments) === true) {
            return $response->withStatus(422)->withJson(['errors' => $errors]);
        }
        
        try {
            $optionIds = $this->service->createMultipleProductOptions(...$creationArguments);
            $links     = [];
            foreach ($optionIds as $id) {
                $links[] = $this->url->restApiV3() . '/products/' . $productId . '/options/' . $id->value();
            }
            
            return $response->withStatus(200)->withJson([
                                                            'data'  => $optionIds->toArray(),
                                                            '_meta' => $this->createApiMetaData($links),
                                                        ]);
        } catch (InsertionOfProductOptionsFailedException|ProductOptionAlreadyExistsException $exception) {
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}