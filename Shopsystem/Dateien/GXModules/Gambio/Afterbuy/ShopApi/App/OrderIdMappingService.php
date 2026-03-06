<?php
/* --------------------------------------------------------------
   OrderIdMappingService.php 2022-11-02
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\ShopApi\App;

use GXModules\Gambio\Afterbuy\ShopApi\Service\AfterbuyOrderIdMappingService;
use GXModules\Gambio\Afterbuy\ShopApi\Service\Data\AfterbuyOrderIdMappingRepository;

/**
 * Class OrderIdMappingService
 *
 * @package GXModules\Gambio\Afterbuy\ShopApi\App
 */
class OrderIdMappingService implements AfterbuyOrderIdMappingService
{
    private AfterbuyOrderIdMappingRepository $repository;
    
    
    /**
     * OrderIdMappingService constructor.
     *
     * @param \GXModules\Gambio\Afterbuy\ShopApi\Service\Data\AfterbuyOrderIdMappingRepository $repository
     */
    public function __construct(AfterbuyOrderIdMappingRepository $repository)
    {
        $this->repository = $repository;
    }
    
    
    /**
     * @inheritDoc
     */
    public function mapAfterbuyOrderIdToShopOrderId(string $xmlResponse): void
    {
        $orderIdMapping = $this->repository->getAfterbuyOrderIdMapping($xmlResponse);
        $this->repository->saveAfterbuyOrderIdMapping($orderIdMapping, $xmlResponse);
    }
}