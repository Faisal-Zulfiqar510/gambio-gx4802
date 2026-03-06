<?php
/* --------------------------------------------------------------
   GoogleAnalyticsVariantsInterface.inc.php 2018-04-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the MIT License
   [https://opensource.org/licenses/MIT]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsVariantInterface
 */
interface GoogleAnalyticsVariantInterface
{
    /**
     * Returns true if only attributes exists in variant.
     *
     * @return bool
     */
    public function attributesOnly();
    
    
    /**
     * Returns true if only properties exists in variant.
     *
     * @return bool
     */
    public function propertiesOnly();
    
    
    /**
     * Returns true if properties and attributes exists in variant.
     *
     * @return bool
     */
    public function both();
    
    
    /**
     * Returns the attributes, if exists.
     *
     * @return GoogleAnalyticsProductAttributeCollection
     */
    public function attributes();
    
    
    /**
     * Returns the properties, if exists.
     *
     * @return GoogleAnalyticsProductPropertyCollection
     */
    public function properties();
}