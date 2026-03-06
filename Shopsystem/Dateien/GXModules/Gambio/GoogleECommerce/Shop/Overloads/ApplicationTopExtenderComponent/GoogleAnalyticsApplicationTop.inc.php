<?php
/* --------------------------------------------------------------
   GoogleAnalyticsApplicationTop.inc.php 2018-06-14
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2018 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------
*/

class GoogleAnalyticsApplicationTop extends GoogleAnalyticsApplicationTop_parent
{
    public function proceed()
    {
        parent::proceed();
        
        $webServer = ENABLE_SSL ? HTTPS_SERVER . DIR_WS_CATALOG : HTTP_SERVER . DIR_WS_CATALOG;
        $options   = GoogleAnalyticsRefreshServiceOptions::create(DIR_FS_CATALOG, $webServer, ENABLE_SSL);
        
        GoogleAnalyticsRefreshService::create($options)->updateAnalyticsIfNecessary();
    }
}