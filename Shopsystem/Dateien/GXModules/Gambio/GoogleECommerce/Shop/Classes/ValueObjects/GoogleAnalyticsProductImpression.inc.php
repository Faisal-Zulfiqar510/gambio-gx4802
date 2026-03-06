<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductImpression.inc.php 2018-04-10
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsProductImpression
 */
class GoogleAnalyticsProductImpression implements GoogleAnalyticsProductImpressionInterface
{
    /**
     * @var string
     */
    protected $id;
    
    /**
     * @var string
     */
    protected $name;
    
    /**
     * @var string
     */
    protected $listName;
    
    /**
     * @var string
     */
    protected $brand;
    
    /**
     * @var string
     */
    protected $category;
    
    /**
     * @var string
     */
    protected $variant;
    
    /**
     * @var int
     */
    protected $listPosition;
    
    /**
     * @var float
     */
    protected $price;
    
    
    /**
     * GoogleAnalyticsProductImpression constructor.
     *
     * @param NonEmptyStringType|null $id           Unique ID/SKU for the item.
     * @param NonEmptyStringType|null $name         Item name.
     * @param NonEmptyStringType|null $listName     The list in which the item was presented to the user.
     * @param NonEmptyStringType|null $brand        Brand of the item.
     * @param NonEmptyStringType|null $category     Item category.
     * @param NonEmptyStringType|null $variant      Item variant.
     * @param IntType|null            $listPosition The position of the item in the list.
     * @param DecimalType|null        $price        Purchase price of the item.
     */
    private function __construct(
        NonEmptyStringType $id = null,
        NonEmptyStringType $name = null,
        NonEmptyStringType $listName = null,
        NonEmptyStringType $brand = null,
        NonEmptyStringType $category = null,
        NonEmptyStringType $variant = null,
        IntType $listPosition = null,
        DecimalType $price = null
    ) {
        $this->id           = $id ? $id->asString() : null;
        $this->name         = $name ? $name->asString() : null;
        $this->listName     = $listName ? $listName->asString() : null;
        $this->brand        = $brand ? $brand->asString() : null;
        $this->category     = $category ? $category->asString() : null;
        $this->variant      = $variant ? $variant->asString() : null;
        $this->listPosition = $listPosition ? $listPosition->asInt() : null;
        $this->price        = $price ? $price->asDecimal() : null;
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsProductImpression.
     *
     * @param string|null $id           Unique ID/SKU for the item.
     * @param string|null $name         Item name.
     * @param string|null $listName     The list in which the item was presented to the user.
     * @param string|null $brand        Brand of the item.
     * @param string|null $category     Item category.
     * @param string|null $variant      Item variant.
     * @param int|null    $listPosition The position of the item in the list.
     * @param float|null  $price        Purchase price of the item.
     *
     * @return static|GoogleAnalyticsProductImpression New instance.
     */
    public static function create(
        $id = null,
        $name = null,
        $listName = null,
        $brand = null,
        $category = null,
        $variant = null,
        $listPosition = null,
        $price = null
    ) {
        if (!$id && !$name) {
            throw new InvalidArgumentException('Either $id or $name is required!');
        }
        
        $id           = $id ? new NonEmptyStringType((string)$id) : null;
        $name         = $name ? new NonEmptyStringType($name) : null;
        $listName     = $listName ? new NonEmptyStringType($listName) : null;
        $brand        = $brand ? new NonEmptyStringType($brand) : null;
        $category     = $category ? new NonEmptyStringType($category) : null;
        $variant      = $variant ? new NonEmptyStringType($variant) : null;
        $listPosition = $listPosition ? new IntType($listPosition) : null;
        $price        = $price ? new DecimalType($price) : null;
        
        return new static($id, $name, $listName, $brand, $category, $variant, $listPosition, $price);
    }
    
    
    /**
     * Returns unique ID/SKU for the item.
     *
     * @return string Unique ID/SKU for the item.
     */
    public function id()
    {
        return $this->id;
    }
    
    
    /**
     * Returns item name.
     *
     * @return string Item name.
     */
    public function name()
    {
        return $this->name;
    }
    
    
    /**
     * Returns purchase price of the item.
     *
     * @return float Purchase price of the item.
     */
    public function price()
    {
        return $this->price;
    }
    
    
    /**
     * Returns brand of the item.
     *
     * @return string Brand of the item.
     */
    public function brand()
    {
        return $this->brand;
    }
    
    
    /**
     * Returns item category.
     *
     * @return string Item category.
     */
    public function category()
    {
        return $this->category;
    }
    
    
    /**
     * Returns item variant.
     *
     * @return string Item variant.
     */
    public function variant()
    {
        return $this->variant;
    }
    
    
    /**
     * Returns the position of the item in the list.
     *
     * @return int The position of the item in the list.
     */
    public function listPosition()
    {
        return $this->listPosition;
    }
    
    
    /**
     * Returns the list in which the item was presented to the user.
     *
     * @return string The list in which the item was presented to the user.
     */
    public function listName()
    {
        return $this->listName;
    }
}