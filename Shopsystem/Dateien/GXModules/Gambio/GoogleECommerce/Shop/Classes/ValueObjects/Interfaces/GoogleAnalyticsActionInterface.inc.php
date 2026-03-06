<?php
/* --------------------------------------------------------------
   GoogleAnalyticsActionInterface.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsActionInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsActionInterface
{
    /**
     * Returns the Unique ID for the transaction.
     *
     * @return string Unique ID for the transaction.
     */
    public function transactionId();
    
    
    /**
     * Returns the store or affiliation from which this transaction occurred.
     *
     * @return string The store or affiliation from which this transaction occurred.
     */
    public function affiliation();
    
    
    /**
     * Returns the value associated with the event.
     *
     * @return float Value (i.e. revenue) associated with the event.
     */
    public function value();
    
    
    /**
     * Returns the currency value.
     *
     * @return string Currency value (i.e. USD or EUR).
     */
    public function currency();
    
    
    /**
     * Returns the tax amount.
     *
     * @return float Tax amount.
     */
    public function tax();
    
    
    /**
     * Returns the shipping cost.
     *
     * @return float Shipping cost.
     */
    public function shippingCost();
    
    
    /**
     * Returns the associated products.
     *
     * @return GoogleAnalyticsProductCollection The associated products.
     */
    public function items();
}