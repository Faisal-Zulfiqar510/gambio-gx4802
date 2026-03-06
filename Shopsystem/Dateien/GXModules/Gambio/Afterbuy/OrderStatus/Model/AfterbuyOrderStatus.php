<?php
/* --------------------------------------------------------------
   AfterbuyOrderStatus.php 2022-11-07
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\OrderStatus\Model;

/**
 * Class AfterbuyOrderStatus
 *
 * @package GXModules\Gambio\Afterbuy\OrderStatus\Model
 */
class AfterbuyOrderStatus
{
    private const TYPE_PAID    = 'paid';
    private const TYPE_UNPAID  = 'unpaid';
    private const TYPE_UNKNOWN = 'unknown';
    
    private string $type;
    
    
    /**
     * AfterbuyOrderStatus constructor.
     *
     * @param string $type
     */
    private function __construct(string $type)
    {
        $this->type = $type;
    }
    
    
    /**
     * @return static
     */
    public static function createPaid(): self
    {
        return new self(self::TYPE_PAID);
    }
    
    
    /**
     * @return static
     */
    public static function createUnpaid(): self
    {
        return new self(self::TYPE_UNPAID);
    }
    
    
    /**
     * @return static
     */
    public static function createUnknown(): self
    {
        return new self(self::TYPE_UNKNOWN);
    }
    
    
    /**
     * @return string
     */
    public function type(): string
    {
        return $this->type;
    }
    
    
    /**
     * @return bool
     */
    public function isPaid(): bool
    {
        return $this->type === self::TYPE_PAID;
    }
    
    
    /**
     * @return bool
     */
    public function isUnpaid(): bool
    {
        return $this->type === self::TYPE_UNPAID;
    }
    
    
    /**
     * @return bool
     */
    public function isUnknown(): bool
    {
        return $this->type === self::TYPE_UNKNOWN;
    }
}