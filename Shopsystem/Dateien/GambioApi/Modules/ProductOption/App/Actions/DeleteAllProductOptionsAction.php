<?php
/*--------------------------------------------------------------
   DeleteAllProductOptionsAction.php 2021-04-28
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Api\Modules\ProductOption\App\Actions;

use Gambio\Admin\Modules\ProductOption\App\ProductOptionWriteService as ProductOptionWriteServiceInterface;
use Gambio\Admin\Modules\ProductOption\Model\Exceptions\DeletionOfProductOptionsFailedException;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class DeleteAllProductOptionsAction
 * @package Gambio\Api\Modules\ProductOption\App\Actions
 */
class DeleteAllProductOptionsAction
{
    /**
     * @var ProductOptionWriteServiceInterface
     */
    private $service;
    
    
    /**
     * DeleteAllProductOptionsAction constructor.
     *
     * @param ProductOptionWriteServiceInterface $service
     */
    public function __construct(
        ProductOptionWriteServiceInterface $service
    ) {
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
        try {
            
            if (($productId = (int)$request->getAttribute('productId')) !== 0) {
                
                $this->service->deleteAllProductOptionsByProductId($productId);
            }
            
            return $response->withStatus(204);
        } catch (DeletionOfProductOptionsFailedException $exception) {
            
            return $response->withStatus(422)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}