<?php

/* --------------------------------------------------------------
   GoogleAnalyticsGoToCheckoutSnippet.inc.php 2018-04-19
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the checkout button tracker snippet
 */
class GoogleAnalyticsGoToCheckoutSnippet extends GoogleAnalyticsSnippet
{
    /**
     * Create instance
     */
    public function __construct()
    {
        parent::__construct('go_to_checkout');
    }
}