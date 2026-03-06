<?php
/* --------------------------------------------------------------
   GoogleAnalyticsProductCombinationInterface.inc.php 2018-04-23 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsProductCombinationInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsProductCombinationInterface
{
    /**
     * Returns the option id of the combination.
     *
     * @return int Option id.
     */
    public function optionId();
    
    
    /**
     * Returns the value id of the combination.
     *
     * @return int Value id.
     */
    public function valueId();
}