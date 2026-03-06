<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProduct.php 2018-04-17
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProduct
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsProduct implements GoogleAnalyticsProductInterface
{
    /**
     * @var string|null
     */
    protected $id;
    
    /**
     * @var string|null
     */
    protected $name;
    
    /**
     * @var string|null
     */
    protected $brand;
    
    /**
     * @var string|null
     */
    protected $category;
    
    /**
     * @var string|null
     */
    protected $variant;
    
    /**
     * @var float|null
     */
    protected $price;
    
    /**
     * @var int|null
     */
    protected $quantity;
    
    /**
     * @var string|null
     */
    protected $coupon;
    
    /**
     * @var int|null
     */
    protected $listPosition;
    
    
    /**
     * GoogleAnalyticsProductDataSet constructor.
     *
     * @param NonEmptyStringType|null $id           Unique ID/SKU for the item.
     * @param NonEmptyStringType|null $name         Item name.
     * @param NonEmptyStringType|null $brand        Brand of the item.
     * @param NonEmptyStringType|null $category     Item category.
     * @param NonEmptyStringType|null $variant      Item variant.
     * @param DecimalType|null        $price        Purchase price of the item.
     * @param DecimalType|null        $quantity     Item quantity.
     * @param NonEmptyStringType|null $coupon       Coupon code for a purchasable item.
     * @param IntType|null            $listPosition The position of the item in the list.
     */
    private function __construct(
        NonEmptyStringType $id = null,
        NonEmptyStringType $name = null,
        NonEmptyStringType $brand = null,
        NonEmptyStringType $category = null,
        NonEmptyStringType $variant = null,
        DecimalType $price = null,
        DecimalType $quantity = null,
        NonEmptyStringType $coupon = null,
        IntType $listPosition = null
    ) {
        $this->id           = $id ? $id->asString() : null;
        $this->name         = $name ? $name->asString() : null;
        $this->brand        = $brand ? $brand->asString() : null;
        $this->category     = $category ? $category->asString() : null;
        $this->variant      = $variant ? $variant->asString() : null;
        $this->price        = $price ? $price->asDecimal() : null;
        $this->quantity     = $quantity ? $quantity->asDecimal() : null;
        $this->coupon       = $coupon ? $coupon->asString() : null;
        $this->listPosition = $listPosition ? $listPosition->asInt() : null;
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductDataSet.
     *
     * @param string|null $id           Unique ID/SKU for the item.
     * @param string|null $name         Item name.
     * @param string|null $brand        Brand of the item.
     * @param string|null $category     Item category.
     * @param string|null $variant      Item variant.
     * @param float|null  $price        Purchase price of the item.
     * @param float|null  $quantity     Item quantity.
     * @param string|null $coupon       Coupon code for a purchasable item.
     * @param int|null    $listPosition The position of the item in the list.
     *
     * @return GoogleAnalyticsProduct New instance.
     */
    public static function create(
        $id = null,
        $name = null,
        $brand = null,
        $category = null,
        $variant = null,
        $price = null,
        $quantity = null,
        $coupon = null,
        $listPosition = null
    ) {
        if (!$id && !$name || ($id === '' && $name === '')) {
            throw new InvalidArgumentException('Either $id or $name is required!');
        }
        $id   = $id !== '' && null !== $id ? (string)$id : null;
        $name = $name !== '' && null !== $name ? (string)$name : null;
        
        $id           = $id ? new NonEmptyStringType($id) : null;
        $name         = $name ? new NonEmptyStringType($name) : null;
        $brand        = $brand ? new NonEmptyStringType($brand) : null;
        $category     = $category ? new NonEmptyStringType($category) : null;
        $variant      = $variant ? new NonEmptyStringType($variant) : null;
        $price        = $price ? new DecimalType($price) : null;
        $quantity     = $quantity ? new DecimalType($quantity) : null;
        $coupon       = $coupon ? new NonEmptyStringType($coupon) : null;
        $listPosition = $listPosition ? new IntType($listPosition) : null;
        
        return new static($id, $name, $brand, $category, $variant, $price, $quantity, $coupon, $listPosition);
    }
    
    
    /**
     * Returns the unique ID/SKU for the item.
     *
     * @return null|string Unique ID/SKU for the item.
     */
    public function id()
    {
        return $this->id;
    }
    
    
    /**
     * Returns the item name.
     *
     * @return null|string Item name.
     */
    public function name()
    {
        return $this->name;
    }
    
    
    /**
     * Returns the purchase price of the item.
     *
     * @return float|null Purchase price of the item.
     */
    public function price()
    {
        return $this->price;
    }
    
    
    /**
     * Returns the brand of the item.
     *
     * @return null|string Brand of the item.
     */
    public function brand()
    {
        return $this->brand;
    }
    
    
    /**
     * Returns the item category.
     *
     * @return null|string Item category.
     */
    public function category()
    {
        return $this->category;
    }
    
    
    /**
     * Returns the item variant.
     *
     * @return null|string Item variant.
     */
    public function variant()
    {
        return $this->variant;
    }
    
    
    /**
     * Returns the the position of the item in the list.
     *
     * @return int|null The position of the item in the list.
     */
    public function listPosition()
    {
        return $this->listPosition;
    }
    
    
    /**
     * Returns the item quantity.
     *
     * @return int|null Item quantity.
     */
    public function quantity()
    {
        return $this->quantity;
    }
    
    
    /**
     * Returns the coupon code for a purchasable item.
     *
     * @return null|string Coupon code for a purchasable item.
     */
    public function coupon()
    {
        return $this->coupon;
    }
}