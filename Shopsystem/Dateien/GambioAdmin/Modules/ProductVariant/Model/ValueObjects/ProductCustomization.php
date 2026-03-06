<?php
/*--------------------------------------------------------------
   ProductCustomization.php 2021-08-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2021 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
 -------------------------------------------------------------*/

declare(strict_types=1);

namespace Gambio\Admin\Modules\ProductVariant\Model\ValueObjects;

use Webmozart\Assert\Assert;

/**
 * Class ProductCustomization
 * @package Gambio\Admin\Modules\ProductVariant\Model\ValueObjects
 */
class ProductCustomization
{
    private const HIGHEST_STORABLE_FLOAT = 99999999999.9999;
    private const MAXIMUM_DECIMAL_PLACES = 4;

    public const WEIGHT_TYPE_ADDITION  = 'addition';
    public const WEIGHT_TYPE_REPLACING = 'replacing';
    
    public const PRICE_TYPE_ADDITION  = 'addition';
    public const PRICE_TYPE_REPLACING = 'replacing';
    
    private const ALLOWED_WEIGHT_TYPES = [self::WEIGHT_TYPE_ADDITION, self::WEIGHT_TYPE_REPLACING];
    private const ALLOWED_PRICE_TYPES  = [self::PRICE_TYPE_ADDITION, self::PRICE_TYPE_REPLACING];
    
    /**
     * @var string
     */
    private $priceType;
    
    /**
     * @var float
     */
    private $price;
    
    /**
     * @var float
     */
    private $vpeScalarValue;
    
    /**
     * @var int|null
     */
    private $vpeUnitId;
    
    /**
     * @var int
     */
    private $deliveryTimeId;
    
    /**
     * @var string
     */
    private $weightType;
    
    /**
     * @var float
     */
    private $weight;
    
    
    /**
     * ProductCustomization constructor.
     *
     * @param string   $priceType
     * @param float    $price
     * @param string   $weightType
     * @param float    $weightSurcharge
     * @param float    $vpeScalarValue
     * @param int|null $vpeUnitId
     * @param int      $deliveryTimeId
     */
    private function __construct(
        string $priceType,
        float $price,
        string $weightType,
        float $weightSurcharge,
        float $vpeScalarValue,
        ?int $vpeUnitId,
        int $deliveryTimeId
    ) {
        $this->priceType      = $priceType;
        $this->price          = $price;
        $this->weightType     = $weightType;
        $this->weight         = $weightSurcharge;
        $this->vpeScalarValue = $vpeScalarValue;
        $this->vpeUnitId      = $vpeUnitId;
        $this->deliveryTimeId = $deliveryTimeId;
    }
    
    
    /**
     * @param string   $priceType
     * @param float    $price
     * @param string   $weightType
     * @param float    $weight
     * @param float    $vpeScalarValue
     * @param int|null $vpeUnitId
     * @param int      $deliveryTimeId
     *
     * @return ProductCustomization
     */
    public static function create(
        string $priceType,
        float $price,
        string $weightType,
        float $weight,
        float $vpeScalarValue,
        int $deliveryTimeId,
        ?int $vpeUnitId = null
    ): ProductCustomization {

        $weight = round($weight, self::MAXIMUM_DECIMAL_PLACES, PHP_ROUND_HALF_UP);
        $price  = round($price, self::MAXIMUM_DECIMAL_PLACES, PHP_ROUND_HALF_UP);

        $message = '\'s value must be less than or equal to %2$s. Got: %s';

        Assert::lessThanEq($weight, self::HIGHEST_STORABLE_FLOAT, 'Weight' . $message);
        Assert::lessThanEq($price, self::HIGHEST_STORABLE_FLOAT, 'Price' . $message);

        if ($vpeUnitId !== null) {
            Assert::greaterThan($vpeUnitId, 0, 'The vpe unit ID must be a positive integer or null. Got: %s');
        }

        Assert::oneOf($priceType,
                      self::ALLOWED_PRICE_TYPES,
                      'Price type must be one of: ' . implode(',', self::ALLOWED_PRICE_TYPES) . '; Got: %s');
        Assert::oneOf($weightType,
                      self::ALLOWED_WEIGHT_TYPES,
                      'Weight type must be one of: ' . implode(',', self::ALLOWED_WEIGHT_TYPES) . '; Got: %s');
        
        return new self($priceType, $price, $weightType, $weight, $vpeScalarValue, $vpeUnitId, $deliveryTimeId);
    }
    
    
    /**
     * @return string
     */
    public function priceType(): string
    {
        return $this->priceType;
    }
    
    
    /**
     * @return float
     */
    public function price(): float
    {
        return $this->price;
    }
    
    
    /**
     * @return float
     */
    public function vpeScalarValue(): float
    {
        return $this->vpeScalarValue;
    }
    
    
    /**
     * @return int|null
     */
    public function vpeUnitId(): ?int
    {
        return $this->vpeUnitId;
    }
    
    
    /**
     * @return int
     */
    public function deliveryTimeId(): int
    {
        return $this->deliveryTimeId;
    }
    
    
    /**
     * @return string
     */
    public function weightType(): string
    {
        return $this->weightType;
    }
    
    
    /**
     * @return float
     */
    public function weight(): float
    {
        return $this->weight;
    }
}