<?php
/*--------------------------------------------------------------------
 OptionValueCustomization.php 2021-10-04
 Gambio GmbH
 http://www.gambio.de
 Copyright (c) 2021 Gambio GmbH
 Released under the GNU General Public License (Version 2)
 [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductOption\Model\ValueObjects;

use Webmozart\Assert\Assert;

/**
 * Class OptionValueCustomization
 * @package Gambio\Admin\Modules\ProductOption\Model\ValueObjects
 */
class OptionValueCustomization
{
    private const HIGHEST_STORABLE_FLOAT = 99999999999.9999;
    private const MAXIMUM_DECIMAL_PLACES = 4;
    
    /**
     * @var string
     */
    private $modelNumber;
    
    /**
     * @var float
     */
    private $weight;
    
    /**
     * @var float
     */
    private $price;
    
    
    /**
     * OptionValueCustomization constructor.
     *
     * @param string $modelNumber
     * @param float  $weight
     * @param float  $price
     */
    private function __construct(
        string $modelNumber,
        float $weight,
        float $price
    ) {
        $this->modelNumber = $modelNumber;
        $this->weight      = $weight;
        $this->price       = $price;
    }
    
    
    /**
     * @param string $modelNumber
     * @param float  $weight
     * @param float  $price
     *
     * @return OptionValueCustomization
     */
    public static function create(
        string $modelNumber,
        float $weight,
        float $price
    ): OptionValueCustomization {
    
        $weight = round($weight, self::MAXIMUM_DECIMAL_PLACES, PHP_ROUND_HALF_UP);
        $price  = round($price, self::MAXIMUM_DECIMAL_PLACES, PHP_ROUND_HALF_UP);
    
        $message = '\'s value must be less than or equal to %2$s. Got: %s';
    
        Assert::lessThanEq($weight, self::HIGHEST_STORABLE_FLOAT, 'Weight' . $message);
        Assert::lessThanEq($price, self::HIGHEST_STORABLE_FLOAT, 'Price' . $message);
        
        return new self($modelNumber, $weight, $price);
    }
    
    /**
     * @return string
     */
    public function modelNumber(): string
    {
        return $this->modelNumber;
    }
    
    
    /**
     * @return float
     */
    public function weight(): float
    {
        return $this->weight;
    }
    
    
    /**
     * @return float
     */
    public function price(): float
    {
        return $this->price;
    }
    
    
    /**
     * @param float $price
     *
     * @return OptionValueCustomization
     */
    public function withPrice(float $price): OptionValueCustomization
    {
        return new self($this->modelNumber(), $this->weight(), $price);
    }
    
    
    /**
     * @param string $modelNumber
     *
     * @return $this
     */
    public function withModelNumber(string $modelNumber): OptionValueCustomization
    {
        return new self($modelNumber, $this->weight(), $this->price());
    }
    
    
    /**
     * @param float $weight
     *
     * @return $this
     */
    public function withWeight(float $weight): OptionValueCustomization
    {
        return new self($this->modelNumber(), $weight, $this->price());
    }
}