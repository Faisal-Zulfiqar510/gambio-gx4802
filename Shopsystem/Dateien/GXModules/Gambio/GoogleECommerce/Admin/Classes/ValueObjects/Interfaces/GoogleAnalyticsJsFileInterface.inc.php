<?php
/* --------------------------------------------------------------
   GoogleAnalyticsJsFileInterface.inc.php 2018-06-15
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

/**
 * Interface GoogleAnalyticsJsFileInterface
 */
interface GoogleAnalyticsJsFileInterface
{
    /**
     * Returns the google analytics javascript file type (gtag, analytics, ec-plugin).
     *
     * @return string
     */
    public function type();
    
    
    /**
     * Returns the source url of the analytics file.
     *
     * @return string
     */
    public function sourceUrl();
}