<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductInterface.inc.php 2018-04-09
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsProductInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsProductInterface
{
    /**
     * Returns the product items id.
     *
     * @return string|null Product items id.
     */
    public function id();
    
    
    /**
     * Returns the product items name.
     *
     * @return string|null Product items name.
     */
    public function name();
    
    
    /**
     * Returns the product items brand.
     *
     * @return string|null Product items brand.
     */
    public function brand();
    
    
    /**
     * Returns the product items category.
     *
     * @return string|null Product items category.
     */
    public function category();
    
    
    /**
     * Returns the product items variant.
     *
     * @return string|null Product items variant.
     */
    public function variant();
    
    
    /**
     * Returns the product items price.
     *
     * @return float|null Product items price.
     */
    public function price();
    
    
    /**
     * Returns the product items quantity.
     *
     * @return string|null Product items quantity.
     */
    public function quantity();
    
    
    /**
     * Returns the product items coupon.
     *
     * @return string|null Product items coupon.
     */
    public function coupon();
    
    
    /**
     * Returns the product items list position.
     *
     * @return string|null Product items list position.
     */
    public function listPosition();
}


