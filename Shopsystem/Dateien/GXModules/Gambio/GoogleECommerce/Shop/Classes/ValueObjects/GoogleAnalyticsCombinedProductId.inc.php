<?php
/* --------------------------------------------------------------
   GoogleAnalyticsCombinedProductId.inc.php 2018-04-24 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsCombinedProductId
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsCombinedProductId implements GoogleAnalyticsCombinedProductIdInterface
{
    /**
     * @var int
     */
    protected $productId;
    
    /**
     * @var GoogleAnalyticsProductAttributeCollection|null
     */
    protected $attributeIds;
    
    /**
     * @var int|null
     */
    protected $propertyCombinationId;
    
    /**
     * @var string
     */
    protected static $propertyOnlyRegex = '/^\d+x(\d+)$/';
    
    /**
     * @var string
     */
    protected static $attributeOnlyRegex = '/^\d+(\{\d+\}\d)+$/';
    
    /**
     * @var string
     */
    protected static $combinedPropertyAttributeRegex = '/^\d+(\{\d+\}(\d))+x\d+$/';
    
    
    /**
     * GoogleAnalyticsCombinedProductId constructor.
     * It is recommended to use the named constructor ::create(string $combinedId).
     *
     * @param NonEmptyStringType $combinedId Product id combination (including attributes and properties).
     */
    public function __construct(NonEmptyStringType $combinedId)
    {
        $id = $combinedId->asString();
        if (preg_match(static::$combinedPropertyAttributeRegex, $id)) {
            $idSegments                  = explode('x', $id);
            $this->propertyCombinationId = (int)array_pop($idSegments);
            
            $this->attributeIds = $this->_createAttributesFromIdString($idSegments[0]);
        }
        if (preg_match(static::$propertyOnlyRegex, $id)) {
            $idSegments                  = explode('x', $id);
            $this->propertyCombinationId = (int)array_pop($idSegments);
        }
        if (preg_match(static::$attributeOnlyRegex, $id)) {
            $this->attributeIds = $this->_createAttributesFromIdString($id);
        }
        $this->productId = (int)explode('{', $id)[0];
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsCombinedProductId.
     *
     * @param string $combinedId Product id combination (including attributes and properties).
     *
     * @return GoogleAnalyticsCombinedProductId New instance.
     */
    public static function create($combinedId)
    {
        return MainFactory::create(static::class, new NonEmptyStringType((string)$combinedId));
    }
    
    
    /**
     * Returns the product id.
     *
     * @return int Product id.
     */
    public function productId()
    {
        return $this->productId;
    }
    
    
    /**
     * Returns the property combination id.
     *
     * @return int|null Property combination id.
     */
    public function propertyId()
    {
        return $this->propertyCombinationId;
    }
    
    
    /**
     * Returns the attribute ids.
     *
     * @return GoogleAnalyticsProductAttributeCollection|null Attribute ids.
     */
    public function attributeIds()
    {
        return $this->attributeIds;
    }
    
    
    /**
     * Checks if only product id is present.
     *
     * @return bool True if only product id is present.
     */
    public function containsOnlyProductId()
    {
        return !$this->containsPropertyId() && !$this->containsAttributeIds();
    }
    
    
    /**
     * Checks if optional property combination id and attribute ids are present.
     *
     * @return bool True if optional property combination id and attribute ids are present.
     */
    public function containsBoth()
    {
        return $this->containsPropertyId() && $this->containsAttributeIds();
    }
    
    
    /**
     * Checks if just property combination id is present.
     *
     * @return bool True if just property combination id is present.
     */
    public function containsPropertyId()
    {
        return null !== $this->propertyCombinationId;
    }
    
    
    /**
     * Checks if only attribute ids are present.
     *
     * @return bool True if only attribute ids are present.
     */
    public function containsAttributeIds()
    {
        return null !== $this->attributeIds;
    }
    
    
    /**
     * Creates attributes from the given id string.
     * The attributes are created by the id substring, start with {.
     *
     * @param string $idString Combined id string.
     *
     * @return GoogleAnalyticsProductAttributeCollection Product attributes.
     */
    protected function _createAttributesFromIdString($idString)
    {
        preg_match_all('/\{(\d+)\}(\d+)/', $idString, $attributeMatches);
        
        $options    = $attributeMatches[1];
        $values     = $attributeMatches[2];
        $attributes = [];
        
        foreach ($options as $key => $option) {
            $attributes[] = [
                'optionId' => $option,
                'valueId'  => $values[$key]
            ];
        }
        
        return GoogleAnalyticsProductAttributeCollection::collectFromArray($attributes);
    }
}
