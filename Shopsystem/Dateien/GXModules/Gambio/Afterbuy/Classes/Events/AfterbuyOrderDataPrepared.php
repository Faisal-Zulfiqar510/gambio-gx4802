<?php
/* --------------------------------------------------------------
   AfterbuyOrderDataPrepared.php 2023-03-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);


namespace GXModules\Gambio\Afterbuy\Classes\Events;

class AfterbuyOrderDataPrepared
{
    private array $orderData;
    
    
    private function __construct(array $orderData)
    {
        $this->orderData = $orderData;
    }
    
    public static function create(array $orderData): AfterbuyOrderDataPrepared
    {
        return new static($orderData);
    }
    
    
    /**
     * @return array
     */
    public function getOrderData(): array
    {
        return $this->orderData;
    }
    
    
    /**
     * @param array $orderData
     */
    public function setOrderData(array $orderData): void
    {
        $this->orderData = $orderData;
    }
    
    
}