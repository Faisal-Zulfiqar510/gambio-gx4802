<?php
/* --------------------------------------------------------------
   AfterbuyOrderIdMappingException.php 2022-10-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\ShopApi\Exceptions;

use Exception;

/**
 * Class AfterbuyOrderIdMappingException
 *
 * @package GXModules\Gambio\Afterbuy\ShopApi\Exceptions
 */
class AfterbuyOrderIdMappingException extends Exception
{
    private string $xmlResponse;
    private ?int   $orderId;
    private ?int   $afterbuyOrderId;
    
    
    /**
     * AfterbuyOrderIdMappingException constructor.
     *
     * @param string   $message
     * @param string   $xmlResponse
     * @param int|null $orderId
     * @param int|null $afterbuyOrderId
     */
    public function __construct(string $message, string $xmlResponse, int $orderId = null, int $afterbuyOrderId = null)
    {
        parent::__construct($message);
        $this->xmlResponse     = $xmlResponse;
        $this->orderId         = $orderId;
        $this->afterbuyOrderId = $afterbuyOrderId;
    }
    
    
    /**
     * @return string
     */
    public function xmlResponse(): string
    {
        return $this->xmlResponse;
    }
    
    
    /**
     * @return int|null
     */
    public function orderId(): ?int
    {
        return $this->orderId;
    }
    
    
    /**
     * @return int|null
     */
    public function afterbuyOrderId(): ?int
    {
        return $this->afterbuyOrderId;
    }
}