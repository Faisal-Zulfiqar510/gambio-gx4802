<?php
/*--------------------------------------------------------------
   ChangeCustomerGroupAction.php 2022-07-25
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Customer\App\Actions\Json;

use Exception;
use Gambio\Admin\Modules\Customer\Services\CustomerFactory;
use Gambio\Admin\Modules\Customer\Services\CustomerReadService;
use Gambio\Admin\Modules\Customer\Services\CustomerWriteService;
use Gambio\Core\Application\Http\Request;
use Gambio\Core\Application\Http\Response;

/**
 * Class ChangeCustomerGroupAction
 *
 * @package Gambio\Admin\Modules\Customer\App\Actions\Json
 * @codeCoverageIgnore
 */
class ChangeCustomerGroupAction
{
    private CustomerReadService  $readService;
    private CustomerWriteService $writeService;
    private CustomerFactory      $factory;
    
    
    /**
     * @param CustomerReadService  $readService
     * @param CustomerWriteService $writeService
     * @param CustomerFactory      $factory
     */
    public function __construct(
        CustomerReadService  $readService,
        CustomerWriteService $writeService,
        CustomerFactory      $factory
    ) {
        $this->readService  = $readService;
        $this->writeService = $writeService;
        $this->factory      = $factory;
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
            $customers = [];
            
            foreach ($request->getParsedBody() as ['id' => $id, 'groupId' => $groupId]) {
                
                $customers[]   = $customer = $this->readService->getCustomerById((int)$id);
                $customerGroup = $this->factory->createCustomerGroup((int)$groupId);
                
                $customer->changeCustomerGroup($customerGroup);
            }
            
            $this->writeService->storeCustomers(...$customers);
            
            return $response->withStatus(204);
        } catch (Exception $exception) {
            
            return $response->withJson(409)->withJson(['errors' => [$exception->getMessage()]]);
        }
    }
}