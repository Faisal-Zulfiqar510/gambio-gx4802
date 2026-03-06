<?php

/* --------------------------------------------------------------
   GoogleAnalyticsProductDetailAddToCartSnippet.inc.php 2018-04-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the "add to cart" snippet
 */
class GoogleAnalyticsProductDetailAddToCartSnippet extends GoogleAnalyticsSnippet
{
    /**
     * Create instance
     */
    public function __construct()
    {
        parent::__construct('product_detail_add_to_cart');
    }
}