<?php
/* --------------------------------------------------------------
   GoogleAnalyticsImpressionTypeInterface.inc.php 2018-04-25 
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsImpressionTypeInterface
 *
 * @package GoogleAnalytics
 */
interface GoogleAnalyticsImpressionTypeInterface
{
    /**
     * Returns the configuration field for the list name of the impression type.
     *
     * @return string Configuration field name.
     */
    public function listNameField();
}