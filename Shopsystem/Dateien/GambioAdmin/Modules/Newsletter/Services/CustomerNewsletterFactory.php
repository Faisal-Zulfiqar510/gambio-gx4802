<?php
/*--------------------------------------------------------------
   CustomerNewsletterFactory.php 2022-03-30
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/
declare(strict_types=1);

namespace Gambio\Admin\Modules\Newsletter\Services;

use Gambio\Admin\Modules\Newsletter\Model\Collections\CustomerIds;
use Gambio\Admin\Modules\Newsletter\Model\ValueObjects\CustomerId;

/**
 * Class CustomerNewsletterFactory
 *
 * @package Gambio\Admin\Modules\Newsletter\Services
 */
class CustomerNewsletterFactory
{
    /**
     * Creates and returns a collection of customer IDs.
     *
     * @param CustomerId ...$customerIds
     *
     * @return CustomerIds
     */
    public function createCustomerIds(CustomerId ...$customerIds): CustomerIds
    {
        return CustomerIds::create(...$customerIds);
    }
    
    
    /**
     * Creates and returns a customer ID.
     *
     * @param int $customerId
     *
     * @return CustomerId
     */
    public function createCustomerId(int $customerId): CustomerId
    {
        return CustomerId::create($customerId);
    }
}