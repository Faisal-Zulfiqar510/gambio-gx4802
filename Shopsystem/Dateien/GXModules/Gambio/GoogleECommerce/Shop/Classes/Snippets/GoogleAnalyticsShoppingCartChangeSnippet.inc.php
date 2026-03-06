<?php

/* --------------------------------------------------------------
   GoogleAnalyticsShoppingCartChangeSnippet.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the shopping cart change snippet
 */
class GoogleAnalyticsShoppingCartChangeSnippet extends GoogleAnalyticsSnippet
{
    /**
     * Create instance
     * @throws Exception Missing data argument
     */
    public function __construct()
    {
        parent::__construct('shopping_cart_change');
    }
}