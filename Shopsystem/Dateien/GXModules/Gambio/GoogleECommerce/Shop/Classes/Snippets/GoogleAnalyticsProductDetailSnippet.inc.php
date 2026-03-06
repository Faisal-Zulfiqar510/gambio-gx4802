<?php

/* --------------------------------------------------------------
   GoogleAnalyticsProductDetailSnippet.inc.php 2018-04-18
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Class representing the product detail snippet
 */
class GoogleAnalyticsProductDetailSnippet extends GoogleAnalyticsSnippet
{
    /**
     * Create instance
     *
     * @param string $data JSON encoded data
     *
     * @throws Exception Missing data argument
     */
    public function __construct($data)
    {
        if (!$data) {
            throw new Exception('Missing data argument');
        }
        
        parent::__construct('product_detail');
        $this->set_content_data('data', $data);
    }
}