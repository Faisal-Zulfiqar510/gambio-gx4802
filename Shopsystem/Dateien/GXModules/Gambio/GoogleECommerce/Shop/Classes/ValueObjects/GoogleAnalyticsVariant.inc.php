<?php
/* --------------------------------------------------------------
   GoogleAnalyticsVariant.inc.php 2018-04-23 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class GoogleAnalyticsVariant
 *
 * @package GoogleAnalytics
 */
class GoogleAnalyticsVariant implements GoogleAnalyticsVariantInterface
{
    /**
     * @var GoogleAnalyticsProductPropertyCollection
     */
    protected $properties;
    
    /**
     * @var GoogleAnalyticsProductAttributeCollection
     */
    protected $attributes;
    
    
    /**
     * GoogleAnalyticsVariant constructor.
     * Protected to enforce usage of named constructor.
     *
     * @param GoogleAnalyticsProductPropertyCollection  $properties Product properties, if exists.
     * @param GoogleAnalyticsProductAttributeCollection $attributes Product attributes, if exists.
     */
    protected function __construct(
        GoogleAnalyticsProductPropertyCollection $properties,
        GoogleAnalyticsProductAttributeCollection $attributes
    ) {
        $this->properties = $properties;
        $this->attributes = $attributes;
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsVariant.
     *
     * @param GoogleAnalyticsProductPropertyCollection  $properties Product properties, if exists.
     * @param GoogleAnalyticsProductAttributeCollection $attributes Product attributes, if exists.
     *
     * @return GoogleAnalyticsVariant New instance.
     */
    public static function collect(
        GoogleAnalyticsProductPropertyCollection $properties,
        GoogleAnalyticsProductAttributeCollection $attributes
    ) {
        return new static($properties, $attributes);
    }
    
    
    /**
     * Named constructor of GoogleAnalyticsVariant.
     *
     * @param array $properties Array with product properties, if exists.
     * @param array $attributes Array with product attributes, if exists.
     *
     * @return GoogleAnalyticsVariant New instance.
     */
    public static function collectFromArrays(array $properties, array $attributes)
    {
        return static::collect(GoogleAnalyticsProductPropertyCollection::collectFromArray($properties),
                               GoogleAnalyticsProductAttributeCollection::collectFromArray($attributes));
    }
    
    
    /**
     * Returns true if only attributes exists in variant.
     *
     * @return bool
     */
    public function attributesOnly()
    {
        return !$this->attributes()->isEmpty() && $this->properties()->isEmpty();
    }
    
    
    /**
     * Returns true if only properties exists in variant.
     *
     * @return bool
     */
    public function propertiesOnly()
    {
        return $this->attributes()->isEmpty() && !$this->properties()->isEmpty();
    }
    
    
    /**
     * Returns true if properties and attributes exists in variant.
     *
     * @return bool
     */
    public function both()
    {
        return !$this->attributes()->isEmpty() && !$this->properties()->isEmpty();
    }
    
    
    /**
     * Returns the attributes, if exists.
     *
     * @return GoogleAnalyticsProductAttributeCollection
     */
    public function attributes()
    {
        return $this->attributes;
    }
    
    
    /**
     * Returns the properties, if exists.
     *
     * @return GoogleAnalyticsProductPropertyCollection
     */
    public function properties()
    {
        return $this->properties;
    }
}