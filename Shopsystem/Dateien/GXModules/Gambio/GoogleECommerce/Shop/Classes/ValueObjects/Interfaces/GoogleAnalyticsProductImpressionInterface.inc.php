<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductImpressionInterface.inc.php 2018-04-10
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsProductImpressionInterface
 */
interface GoogleAnalyticsProductImpressionInterface
{
    /**
     * Returns unique ID/SKU for the item.
     *
     * @return string Unique ID/SKU for the item.
     */
    public function id();
    
    
    /**
     * Returns item name.
     *
     * @return string Item name.
     */
    public function name();
    
    
    /**
     * Returns the list in which the item was presented to the user.
     *
     * @return string The list in which the item was presented to the user.
     */
    public function listName();
    
    
    /**
     * Returns brand of the item.
     *
     * @return string Brand of the item.
     */
    public function brand();
    
    
    /**
     * Returns item category.
     *
     * @return string Item category.
     */
    public function category();
    
    
    /**
     * Returns item variant.
     *
     * @return string Item variant.
     */
    public function variant();
    
    
    /**
     * Returns the position of the item in the list.
     *
     * @return int The position of the item in the list.
     */
    public function listPosition();
    
    
    /**
     * Returns purchase price of the item.
     *
     * @return float Purchase price of the item.
     */
    public function price();
}