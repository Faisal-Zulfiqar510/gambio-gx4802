<?php
/* --------------------------------------------------------------
   GoogleAnalyticsCombinedProductIdInterface.inc.php 2018-04-24 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsCombinedProductIdInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsCombinedProductIdInterface
{
    /**
     * Returns the product id.
     *
     * @return int Product id.
     */
    public function productId();
    
    
    /**
     * Returns the property combination id.
     *
     * @return int Property combination id.
     */
    public function propertyId();
    
    
    /**
     * Returns the attribute ids.
     *
     * @return GoogleAnalyticsProductAttributeCollection Attribute ids.
     */
    public function attributeIds();
    
    
    /**
     * Checks if only product id is present.
     *
     * @return bool True if only product id is present.
     */
    public function containsOnlyProductId();
    
    
    /**
     * Checks if optional property combination id and attribute ids are present.
     *
     * @return bool True if optional property combination id and attribute ids are present.
     */
    public function containsBoth();
    
    
    /**
     * Checks if just property combination id is present.
     *
     * @return bool True if just property combination id is present.
     */
    public function containsPropertyId();
    
    
    /**
     * Checks if only attribute ids are present.
     *
     * @return bool True if only attribute ids are present.
     */
    public function containsAttributeIds();
}