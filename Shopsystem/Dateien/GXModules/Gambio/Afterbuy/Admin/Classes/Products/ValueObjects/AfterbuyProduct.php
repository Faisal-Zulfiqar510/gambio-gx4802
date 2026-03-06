<?php
/* --------------------------------------------------------------
   AfterbuyProduct.php 2023-03-13
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2023 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/
declare(strict_types=1);

namespace GXModules\Gambio\Afterbuy\Admin\Classes\Products\ValueObjects;

/**
 * Representation of an Afterbuy product.
 *
 * Please note: Naming and capitalization of properties in this class follows the tag names in Afterbuy’s XML API.
 * Do not refactor!
 */
class AfterbuyProduct
{
    private string              $originalXml;
    private ?int                $ProductID;
    private ?float              $Anr;
    private string              $EAN;
    private string              $Name;
    private ?string             $SeoName;
    private ?\DateTimeImmutable $ModDate;
    private ?string             $VariationName;
    private int                 $BaseProductFlag             = 0;
    private array               $BaseProducts                = [];
    private ?string             $ShortDescription;
    private ?string             $Description;
    private ?string             $Keywords;
    private ?int                $AvailableShop;
    private ?int                $Quantity;
    private ?bool               $Stock;
    private ?bool               $Discontinued;
    private ?bool               $MergeStock;
    private ?string             $UnitOfQuantity;
    private ?float              $BasepriceFactor;
    private ?int                $MinimumOrderQuantity;
    private ?float              $SellingPrice;
    private ?float              $DealerPrice;
    private ?int                $Level;
    private ?int                $Position;
    private array               $ScaledDiscounts             = [];
    private ?float              $TaxRate;
    private ?float              $Weight;
    private ?string             $ShippingGroup;
    private ?string             $ShopShippingGroup;
    private array               $Features                    = [];
    private ?string             $FreeValue1;
    private ?string             $FreeValue2;
    private ?string             $FreeValue3;
    private ?string             $FreeValue4;
    private ?string             $FreeValue5;
    private ?string             $FreeValue6;
    private ?string             $FreeValue7;
    private ?string             $FreeValue8;
    private ?string             $FreeValue9;
    private ?string             $FreeValue10;
    private ?string             $DeliveryTime;
    private ?string             $ImageSmallURL;
    private ?string             $ImageLargeURL;
    private ?string             $ManufacturerStandardProductIDType; // ASIN, EAN, GTIN, ISBN, UPC
    private ?string             $ManufacturerStandardProductIDValue;
    private ?string             $ProductBrand;
    private ?string             $CustomsTariffNumber;
    private ?string             $GoogleProductCategory;
    private ?string             $CountryOfOrigin;
    private ?string             $ManufacturerPartNumber;
    private ?int                $Condition; // 0 => kein Zustand, 1 => neu, 2 => gebraucht, 3 => generalüberholt
    private ?int                $AgeGroup; // 1 => Erwachsene, 2 => Kinder, 3 => Kleinkinder, 4 => Säuglinge, 5 => Neugeborene
    private ?int                $Gender; // 1 => Unisex, 2 => Herren, 3 => Damen
    private array               $MultiLanguage               = [];
    private array               $ProductPictures             = [];
    private array               $Catalogs                    = [];
    private array               $Attributes                  = [];
    private array               $Discounts                   = [];
    private array               $variantProducts             = [];
    private array               $AdditionalDescriptionFields = [];
    private int                 $ProductShopOption           = 0;
    private array               $productSetProducts          = [];
    
    public const BASE_PRODUCT_FLAG_SIMPLE             = 0;
    public const BASE_PRODUCT_FLAG_VARIATIONS_PARENT  = 1;
    public const BASE_PRODUCT_FLAG_PRODUCT_SET_PARENT = 2;
    public const BASE_PRODUCT_FLAG_PART_OF_SET        = 3;
    
    
    public function __construct(string $externalProductId, string $Name)
    {
        $this->EAN  = $externalProductId;
        $this->Name = $Name;
    }
    
    
    public function toArray(): array
    {
        $output        = [
            'EAN'  => $this->EAN,
            'Name' => $this->Name,
        ];
        $supportedTags = [
            'ProductID',
            'Anr',
            'EAN',
            'Name',
            'ModDate',
            'VariationName',
            'BaseProductFlag',
            'BaseProducts',
            'ShortDescription',
            'Description',
            'Keywords',
            'Quantity',
            'AvailableShop',
            'Stock',
            'Discontinued',
            'MergeStock',
            'UnitOfQuantity',
            'BasePriceFactor',
            'MinimumOrderQuantity',
            'SellingPrice',
            'DealerPrice',
            'Level',
            'Position',
            'ScaledDiscounts',
            'TaxRate',
            'Weight',
            'ShippingGroup',
            'ShopShippingGroup',
            'Features',
            'FreeValue1',
            'FreeValue2',
            'FreeValue3',
            'FreeValue4',
            'FreeValue5',
            'FreeValue6',
            'FreeValue7',
            'FreeValue8',
            'FreeValue9',
            'FreeValue10',
            'DeliveryTime',
            'ImageSmallURL',
            'ImageLargeURL',
            'ManufacturerStandardProductIDType',
            'ManufacturerStandardProductIDValue',
            'ProductBrand',
            'CustomsTariffNumber',
            'GoogleProductCategory',
            'CountryOfOrigin',
            'Condition',
            'AgeGroup',
            'ManufacturerPartNumber',
            'Condition',
            'MultiLanguage',
            'ProductPictures',
            'Catalogs',
            'Attributes',
            'Discounts',
            'AdditionalDescriptionFields',
            'ProductShopOption',
        ];
        foreach ($supportedTags as $tag) {
            if (property_exists($this, $tag) && !\is_null($this->$tag)) {
                if (is_float($this->$tag)) {
                    $output[$tag] = number_format($this->$tag, 2, ',', '');
                } elseif ($this->$tag instanceof \DateTimeInterface) {
                    $output[$tag] = $this->$tag->format('Y.m.d H:i:s');
                } elseif (is_bool($this->$tag)) {
                    $output[$tag] = $this->$tag ? '1' : '0';
                } elseif ($tag === 'BaseProducts') {
                    if (!empty($this->BaseProducts)) {
                        $output[$tag] = [
                            'BaseProduct' => [],
                        ];
                        foreach ($this->BaseProducts as $baseProduct) {
                            $output[$tag]['BaseProduct'][] = $baseProduct->toArray();
                        }
                    }
                } elseif ($tag === 'MultiLanguage') {
                    if (!empty($this->MultiLanguage)) {
                        $output[$tag] = [];
                        foreach ($this->MultiLanguage as $languageCode => $multiLanguage) {
                            $output[$tag][strtoupper($languageCode)] = $multiLanguage->toArray();
                        }
                    }
                } elseif ($tag === 'ProductPictures') {
                    if (!empty($this->ProductPictures)) {
                        $output[$tag] = [
                            'ProductPicture' => [],
                        ];
                        foreach ($this->ProductPictures as $productPicture) {
                            $output[$tag]['ProductPicture'][] = $productPicture->toArray();
                        }
                    }
                } elseif ($tag === 'Catalogs') {
                    if (!empty($this->Catalogs)) {
                        $output[$tag] = [
                            'CatalogID' => $this->Catalogs,
                        ];
                    }
                } elseif ($tag === 'ScaledDiscounts') {
                    $output[$tag] = [];
                    /** @var ScaledDiscount $scaledDiscount */
                    foreach ($this->ScaledDiscounts as $scaledDiscount) {
                        $output[$tag][] = $scaledDiscount->toArray();
                    }
                } elseif ($tag === 'Discounts') {
                    $output[$tag] = [];
                    /** @var Discount $discount */
                    foreach ($this->Discounts as $discount) {
                        $output[$tag][] = $discount->toArray();
                    }
                } elseif ($tag === 'Attributes') {
                    $output[$tag] = [];
                    /** @var Attribut $attribute */
                    foreach ($this->Attributes as $attribut) {
                        $output[$tag][] = $attribut->toArray();
                    }
                } elseif ($tag === 'Features') {
                    $output[$tag] = [];
                    /** @var Attribut $attribute */
                    foreach ($this->Features as $feature) {
                        $output[$tag][] = $feature->toArray();
                    }
                } elseif ($tag === 'AdditionalDescriptionFields') {
                    $output[$tag] = [];
                    foreach ($this->AdditionalDescriptionFields as $additionalDescriptionField) {
                        $output[$tag][] = $additionalDescriptionField->toArray();
                    }
                } else {
                    $output[$tag] = $this->$tag;
                }
            }
        }
        
        return $output;
    }
    
    
    public function addVariantProduct(AfterbuyProduct $variantProduct): void
    {
        $this->variantProducts[$variantProduct->getProductID()] = $variantProduct;
    }
    
    
    public function getVariantProduct(int $productId): ?AfterbuyProduct
    {
        return $this->variantProducts[$productId] ?? null;
    }
    
    
    /**
     * @return int|null
     */
    public function getProductID(): ?int
    {
        return $this->ProductID;
    }
    
    
    /**
     * @param int|null $ProductID
     */
    public function setProductID(?int $ProductID): void
    {
        $this->ProductID = $ProductID;
    }
    
    
    /**
     * @return float|null
     */
    public function getAnr(): ?float
    {
        return $this->Anr;
    }
    
    
    /**
     * @param float|null $Anr
     */
    public function setAnr(?float $Anr): void
    {
        $this->Anr = $Anr;
    }
    
    
    /**
     * @return string
     */
    public function getEAN(): string
    {
        return $this->EAN;
    }
    
    
    /**
     * @param string $EAN
     */
    public function setEAN(string $EAN): void
    {
        $this->EAN = $EAN;
    }
    
    
    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->Name;
    }
    
    
    /**
     * @param string $Name
     */
    public function setName(string $Name): void
    {
        $this->Name = $Name;
    }
    
    
    /**
     * @return string|null
     */
    public function getManufacturerPartNumber(): ?string
    {
        return $this->ManufacturerPartNumber;
    }
    
    
    /**
     * @param string|null $ManufacturerPartNumber
     */
    public function setManufacturerPartNumber(?string $ManufacturerPartNumber): void
    {
        $this->ManufacturerPartNumber = $ManufacturerPartNumber;
    }
    
    
    /**
     * @return string|null
     */
    public function getShortDescription(): ?string
    {
        return $this->ShortDescription;
    }
    
    
    /**
     * @param string|null $ShortDescription
     */
    public function setShortDescription(?string $ShortDescription): void
    {
        $this->ShortDescription = $ShortDescription;
    }
    
    
    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->Description;
    }
    
    
    /**
     * @param string|null $Description
     */
    public function setDescription(?string $Description): void
    {
        $this->Description = $Description;
    }
    
    
    /**
     * @return int|null
     */
    public function getQuantity(): ?int
    {
        return $this->Quantity;
    }
    
    
    /**
     * @param int|null $Quantity
     */
    public function setQuantity(?int $Quantity): void
    {
        $this->Quantity = $Quantity;
    }
    
    
    /**
     * @return float|null
     */
    public function getSellingPrice(): ?float
    {
        return $this->SellingPrice;
    }
    
    
    /**
     * @param float|null $SellingPrice
     */
    public function setSellingPrice(?float $SellingPrice): void
    {
        $this->SellingPrice = $SellingPrice;
    }
    
    
    /**
     * @return float|null
     */
    public function getTaxRate(): ?float
    {
        return $this->TaxRate;
    }
    
    
    /**
     * @param float|null $TaxRate
     */
    public function setTaxRate(?float $TaxRate): void
    {
        $this->TaxRate = $TaxRate;
    }
    
    
    /**
     * @return string
     */
    public function getOriginalXml(): string
    {
        return $this->originalXml;
    }
    
    
    /**
     * @param string $originalXml
     */
    public function setOriginalXml(string $originalXml): void
    {
        $this->originalXml = $originalXml;
    }
    
    
    /**
     * @return string|null
     */
    public function getSeoName(): ?string
    {
        return $this->SeoName;
    }
    
    
    /**
     * @param string|null $SeoName
     */
    public function setSeoName(?string $SeoName): void
    {
        $this->SeoName = $SeoName;
    }
    
    
    /**
     * @return \DateTimeImmutable|null
     */
    public function getModDate(): ?\DateTimeImmutable
    {
        return $this->ModDate;
    }
    
    
    /**
     * @param \DateTimeImmutable|null $ModDate
     */
    public function setModDate(?\DateTimeImmutable $ModDate): void
    {
        $this->ModDate = $ModDate;
    }
    
    
    /**
     * @return string|null
     */
    public function getVariationName(): ?string
    {
        return $this->VariationName;
    }
    
    
    /**
     * @param string|null $VariationName
     */
    public function setVariationName(?string $VariationName): void
    {
        $this->VariationName = $VariationName;
    }
    
    
    /**
     * @return int
     */
    public function getBaseProductFlag(): int
    {
        return $this->BaseProductFlag;
    }
    
    
    /**
     * @param int $BaseProductFlag
     */
    public function setBaseProductFlag(int $BaseProductFlag): void
    {
        $this->BaseProductFlag = $BaseProductFlag;
    }
    
    
    /**
     * @return array
     */
    public function getBaseProducts(): array
    {
        return $this->BaseProducts;
    }
    
    
    /**
     * @param array $BaseProducts
     */
    public function setBaseProducts(array $BaseProducts): void
    {
        $this->BaseProducts = $BaseProducts;
    }
    
    
    /**
     * @param BaseProduct $baseProduct
     *
     * @return void
     */
    public function addBaseProduct(BaseProduct $baseProduct): void
    {
        $this->BaseProducts[] = $baseProduct;
    }
    
    
    /**
     * @return string|null
     */
    public function getKeywords(): ?string
    {
        return $this->Keywords;
    }
    
    
    /**
     * @param string|null $Keywords
     */
    public function setKeywords(?string $Keywords): void
    {
        $this->Keywords = $Keywords;
    }
    
    
    /**
     * @return int|null
     */
    public function getAvailableShop(): ?int
    {
        return $this->AvailableShop;
    }
    
    
    /**
     * @param int|null $AvailableShop
     */
    public function setAvailableShop(?int $AvailableShop): void
    {
        $this->AvailableShop = $AvailableShop;
    }
    
    
    /**
     * @return bool|null
     */
    public function getStock(): ?bool
    {
        return $this->Stock;
    }
    
    
    /**
     * @param bool|null $Stock
     */
    public function setStock(?bool $Stock): void
    {
        $this->Stock = $Stock;
    }
    
    
    /**
     * @return bool|null
     */
    public function getDiscontinued(): ?bool
    {
        return $this->Discontinued;
    }
    
    
    /**
     * @param bool|null $Discontinued
     */
    public function setDiscontinued(?bool $Discontinued): void
    {
        $this->Discontinued = $Discontinued;
    }
    
    
    /**
     * @return bool|null
     */
    public function getMergeStock(): ?bool
    {
        return $this->MergeStock;
    }
    
    
    /**
     * @param bool|null $MergeStock
     */
    public function setMergeStock(?bool $MergeStock): void
    {
        $this->MergeStock = $MergeStock;
    }
    
    
    /**
     * @return string|null
     */
    public function getUnitOfQuantity(): ?string
    {
        return $this->UnitOfQuantity;
    }
    
    
    /**
     * @param string|null $UnitOfQuantity
     */
    public function setUnitOfQuantity(?string $UnitOfQuantity): void
    {
        $this->UnitOfQuantity = $UnitOfQuantity;
    }
    
    
    /**
     * @return float|null
     */
    public function getBasepriceFactor(): ?float
    {
        return $this->BasepriceFactor;
    }
    
    
    /**
     * @param float|null $BasepriceFactor
     */
    public function setBasepriceFactor(?float $BasepriceFactor): void
    {
        $this->BasepriceFactor = $BasepriceFactor;
    }
    
    
    /**
     * @return int|null
     */
    public function getMinimumOrderQuantity(): ?int
    {
        return $this->MinimumOrderQuantity;
    }
    
    
    /**
     * @param int|null $MinimumOrderQuantity
     */
    public function setMinimumOrderQuantity(?int $MinimumOrderQuantity): void
    {
        $this->MinimumOrderQuantity = $MinimumOrderQuantity;
    }
    
    
    /**
     * @return float|null
     */
    public function getDealerPrice(): ?float
    {
        return $this->DealerPrice;
    }
    
    
    /**
     * @param float|null $DealerPrice
     */
    public function setDealerPrice(?float $DealerPrice): void
    {
        $this->DealerPrice = $DealerPrice;
    }
    
    
    /**
     * @return int|null
     */
    public function getLevel(): ?int
    {
        return $this->Level;
    }
    
    
    /**
     * @param int|null $Level
     */
    public function setLevel(?int $Level): void
    {
        $this->Level = $Level;
    }
    
    
    /**
     * @return int|null
     */
    public function getPosition(): ?int
    {
        return $this->Position;
    }
    
    
    /**
     * @param int|null $Position
     */
    public function setPosition(?int $Position): void
    {
        $this->Position = $Position;
    }
    
    
    /**
     * @return array
     */
    public function getScaledDiscounts(): array
    {
        return $this->ScaledDiscounts;
    }
    
    
    /**
     * @param array $ScaledDiscounts
     */
    public function setScaledDiscounts(array $ScaledDiscounts): void
    {
        $this->ScaledDiscounts = $ScaledDiscounts;
    }
    
    
    public function addScaledDiscount(ScaledDiscount $scaledDiscount): void
    {
        $this->ScaledDiscounts[] = $scaledDiscount;
    }
    
    
    /**
     * @return float|null
     */
    public function getWeight(): ?float
    {
        return $this->Weight;
    }
    
    
    /**
     * @param float|null $Weight
     */
    public function setWeight(?float $Weight): void
    {
        $this->Weight = $Weight;
    }
    
    
    /**
     * @return string|null
     */
    public function getShippingGroup(): ?string
    {
        return $this->ShippingGroup;
    }
    
    
    /**
     * @param string|null $ShippingGroup
     */
    public function setShippingGroup(?string $ShippingGroup): void
    {
        $this->ShippingGroup = $ShippingGroup;
    }
    
    
    /**
     * @return string|null
     */
    public function getShopShippingGroup(): ?string
    {
        return $this->ShopShippingGroup;
    }
    
    
    /**
     * @param string|null $ShopShippingGroup
     */
    public function setShopShippingGroup(?string $ShopShippingGroup): void
    {
        $this->ShopShippingGroup = $ShopShippingGroup;
    }
    
    
    /**
     * @return array
     */
    public function getFeatures(): array
    {
        return $this->Features;
    }
    
    
    /**
     * @param array $Features
     */
    public function setFeatures(array $Features): void
    {
        $this->Features = $Features;
    }
    
    
    public function addFeature(Feature $feature): void
    {
        $this->Features[] = $feature;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue1(): ?string
    {
        return $this->FreeValue1;
    }
    
    
    /**
     * @param string|null $FreeValue1
     */
    public function setFreeValue1(?string $FreeValue1): void
    {
        $this->FreeValue1 = $FreeValue1;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue2(): ?string
    {
        return $this->FreeValue2;
    }
    
    
    /**
     * @param string|null $FreeValue2
     */
    public function setFreeValue2(?string $FreeValue2): void
    {
        $this->FreeValue2 = $FreeValue2;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue3(): ?string
    {
        return $this->FreeValue3;
    }
    
    
    /**
     * @param string|null $FreeValue3
     */
    public function setFreeValue3(?string $FreeValue3): void
    {
        $this->FreeValue3 = $FreeValue3;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue4(): ?string
    {
        return $this->FreeValue4;
    }
    
    
    /**
     * @param string|null $FreeValue4
     */
    public function setFreeValue4(?string $FreeValue4): void
    {
        $this->FreeValue4 = $FreeValue4;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue5(): ?string
    {
        return $this->FreeValue5;
    }
    
    
    /**
     * @param string|null $FreeValue5
     */
    public function setFreeValue5(?string $FreeValue5): void
    {
        $this->FreeValue5 = $FreeValue5;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue6(): ?string
    {
        return $this->FreeValue6;
    }
    
    
    /**
     * @param string|null $FreeValue6
     */
    public function setFreeValue6(?string $FreeValue6): void
    {
        $this->FreeValue6 = $FreeValue6;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue7(): ?string
    {
        return $this->FreeValue7;
    }
    
    
    /**
     * @param string|null $FreeValue7
     */
    public function setFreeValue7(?string $FreeValue7): void
    {
        $this->FreeValue7 = $FreeValue7;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue8(): ?string
    {
        return $this->FreeValue8;
    }
    
    
    /**
     * @param string|null $FreeValue8
     */
    public function setFreeValue8(?string $FreeValue8): void
    {
        $this->FreeValue8 = $FreeValue8;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue9(): ?string
    {
        return $this->FreeValue9;
    }
    
    
    /**
     * @param string|null $FreeValue9
     */
    public function setFreeValue9(?string $FreeValue9): void
    {
        $this->FreeValue9 = $FreeValue9;
    }
    
    
    /**
     * @return string|null
     */
    public function getFreeValue10(): ?string
    {
        return $this->FreeValue10;
    }
    
    
    /**
     * @param string|null $FreeValue10
     */
    public function setFreeValue10(?string $FreeValue10): void
    {
        $this->FreeValue10 = $FreeValue10;
    }
    
    
    /**
     * @return string|null
     */
    public function getDeliveryTime(): ?string
    {
        return $this->DeliveryTime;
    }
    
    
    /**
     * @param string|null $DeliveryTime
     */
    public function setDeliveryTime(?string $DeliveryTime): void
    {
        $this->DeliveryTime = $DeliveryTime;
    }
    
    
    /**
     * @return string|null
     */
    public function getImageSmallURL(): ?string
    {
        return $this->ImageSmallURL;
    }
    
    
    /**
     * @param string|null $ImageSmallURL
     */
    public function setImageSmallURL(?string $ImageSmallURL): void
    {
        $this->ImageSmallURL = $ImageSmallURL;
    }
    
    
    /**
     * @return string|null
     */
    public function getImageLargeURL(): ?string
    {
        return $this->ImageLargeURL;
    }
    
    
    /**
     * @param string|null $ImageLargeURL
     */
    public function setImageLargeURL(?string $ImageLargeURL): void
    {
        $this->ImageLargeURL = $ImageLargeURL;
    }
    
    
    /**
     * @return string|null
     */
    public function getManufacturerStandardProductIDType(): ?string
    {
        return $this->ManufacturerStandardProductIDType;
    }
    
    
    /**
     * @param string|null $ManufacturerStandardProductIDType
     */
    public function setManufacturerStandardProductIDType(?string $ManufacturerStandardProductIDType): void
    {
        $this->ManufacturerStandardProductIDType = $ManufacturerStandardProductIDType;
    }
    
    
    /**
     * @return string|null
     */
    public function getManufacturerStandardProductIDValue(): ?string
    {
        return $this->ManufacturerStandardProductIDValue;
    }
    
    
    /**
     * @param string|null $ManufacturerStandardProductIDValue
     */
    public function setManufacturerStandardProductIDValue(?string $ManufacturerStandardProductIDValue): void
    {
        $this->ManufacturerStandardProductIDValue = $ManufacturerStandardProductIDValue;
    }
    
    
    /**
     * @return string|null
     */
    public function getProductBrand(): ?string
    {
        return $this->ProductBrand;
    }
    
    
    /**
     * @param string|null $ProductBrand
     */
    public function setProductBrand(?string $ProductBrand): void
    {
        $this->ProductBrand = $ProductBrand;
    }
    
    
    /**
     * @return string|null
     */
    public function getCustomsTariffNumber(): ?string
    {
        return $this->CustomsTariffNumber;
    }
    
    
    /**
     * @param string|null $CustomsTariffNumber
     */
    public function setCustomsTariffNumber(?string $CustomsTariffNumber): void
    {
        $this->CustomsTariffNumber = $CustomsTariffNumber;
    }
    
    
    /**
     * @return string|null
     */
    public function getGoogleProductCategory(): ?string
    {
        return $this->GoogleProductCategory;
    }
    
    
    /**
     * @param string|null $GoogleProductCategory
     */
    public function setGoogleProductCategory(?string $GoogleProductCategory): void
    {
        $this->GoogleProductCategory = $GoogleProductCategory;
    }
    
    
    /**
     * @return string|null
     */
    public function getCountryOfOrigin(): ?string
    {
        return $this->CountryOfOrigin;
    }
    
    
    /**
     * @param string|null $CountryOfOrigin
     */
    public function setCountryOfOrigin(?string $CountryOfOrigin): void
    {
        $this->CountryOfOrigin = $CountryOfOrigin;
    }
    
    
    /**
     * @return int|null
     */
    public function getCondition(): ?int
    {
        return $this->Condition;
    }
    
    
    /**
     * @param int|null $Condition
     */
    public function setCondition(?int $Condition): void
    {
        $this->Condition = $Condition;
    }
    
    
    /**
     * @return int|null
     */
    public function getAgeGroup(): ?int
    {
        return $this->AgeGroup;
    }
    
    
    /**
     * @param int|null $AgeGroup
     */
    public function setAgeGroup(?int $AgeGroup): void
    {
        $this->AgeGroup = $AgeGroup;
    }
    
    
    /**
     * @return int|null
     */
    public function getGender(): ?int
    {
        return $this->Gender;
    }
    
    
    /**
     * @param int|null $Gender
     */
    public function setGender(?int $Gender): void
    {
        $this->Gender = $Gender;
    }
    
    
    /**
     * @param string $languageCode
     *
     * @return MultiLanguage|null
     */
    public function getMultiLanguage(string $languageCode): ?MultiLanguage
    {
        return $this->MultiLanguage[$languageCode] ?? null;
    }
    
    
    /**
     * @param array $MultiLanguage
     */
    public function setMultiLanguage(MultiLanguage ...$multiLanguages): void
    {
        $this->MultiLanguage = $multiLanguages;
    }
    
    
    /**
     * @return array
     */
    public function getProductPictures(): array
    {
        return $this->ProductPictures;
    }
    
    
    /**
     * @param array $ProductPictures
     */
    public function setProductPictures(array $ProductPictures): void
    {
        $this->ProductPictures = $ProductPictures;
    }
    
    
    /**
     * @return array
     */
    public function getCatalogs(): array
    {
        return $this->Catalogs;
    }
    
    
    /**
     * @param array $Catalogs
     */
    public function setCatalogs(array $Catalogs): void
    {
        $this->Catalogs = $Catalogs;
    }
    
    
    /**
     * @return array
     */
    public function getAttributes(): array
    {
        return $this->Attributes;
    }
    
    
    /**
     * @param array $Attributes
     */
    public function setAttributes(array $Attributes): void
    {
        $this->Attributes = $Attributes;
    }
    
    
    /**
     * @param Attribut $attribut
     *
     * @return void
     */
    public function addAttribut(Attribut $attribut): void
    {
        $this->Attributes[] = $attribut;
    }
    
    
    /**
     * @return array
     */
    public function getDiscounts(): array
    {
        return $this->Discounts;
    }
    
    
    /**
     * @param array $Discounts
     */
    public function setDiscounts(array $Discounts): void
    {
        $this->Discounts = $Discounts;
    }
    
    
    /**
     * @param Discount $discount
     *
     * @return void
     */
    public function addDiscount(Discount $discount): void
    {
        $this->Discounts[] = $discount;
    }
    
    
    /**
     * @param string        $languageCode
     * @param MultiLanguage $multiLanguage
     *
     * @return void
     */
    public function addMultiLanguage(string $languageCode, MultiLanguage $multiLanguage): void
    {
        $languageCode                       = strtolower(substr($languageCode, 0, 2));
        $this->MultiLanguage[$languageCode] = $multiLanguage;
    }
    
    
    /**
     * @param ProductPicture $productPicture
     *
     * @return void
     */
    public function addProductPicture(ProductPicture $productPicture): void
    {
        $this->ProductPictures[] = $productPicture;
    }
    
    
    /**
     * @param int $catalogID
     *
     * @return void
     */
    public function addCatalogID(int $catalogID): void
    {
        $this->Catalogs[] = $catalogID;
    }
    
    
    /**
     * @param AdditionalDescriptionField $additionalDescriptionField
     *
     * @return void
     */
    public function addAdditionalDescriptionField(AdditionalDescriptionField $additionalDescriptionField): void
    {
        $this->AdditionalDescriptionFields[] = $additionalDescriptionField;
    }
    
    
    /**
     * @return array
     */
    public function getAdditionalDescriptionFields(): array
    {
        return $this->AdditionalDescriptionFields;
    }
    
    
    /**
     * @param array $AdditionalDescriptionFields
     */
    public function setAdditionalDescriptionFields(array $AdditionalDescriptionFields): void
    {
        $this->AdditionalDescriptionFields = $AdditionalDescriptionFields;
    }
    
    
    /**
     * @return int
     */
    public function getProductShopOption(): int
    {
        return $this->ProductShopOption;
    }
    
    
    /**
     * @param int $ProductShopOption
     */
    public function setProductShopOption(int $ProductShopOption): void
    {
        $this->ProductShopOption = $ProductShopOption;
    }
    
    
    /**
     * @param AfterbuyProduct $setProduct
     *
     * @return void
     */
    public function addProductSetProduct(AfterbuyProduct $setProduct): void
    {
        $this->productSetProducts[$setProduct->getProductID()] = $setProduct;
    }
    
    
    /**
     * @param int $productID
     *
     * @return AfterbuyProduct|null
     */
    public function getProductSetProduct(int $productID): ?AfterbuyProduct
    {
        return $this->productSetProducts[$productID] ?? null;
    }
    
    /**
     * @return array
     */
    public function getProductSetProducts(): array
    {
        return $this->productSetProducts;
    }
    
    
}