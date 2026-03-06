<?php
/* --------------------------------------------------------------
   localization.php 2022-10-10
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE.
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.
   --------------------------------------------------------------

   based on:
   (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
   (c) 2002-2003 osCommerce(localization.php,v 1.12 2003/06/25); www.oscommerce.com
   (c) 2003	 nextcommerce (localization.php,v 1.4 2003/08/14); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: localization.php 950 2005-05-14 16:45:21Z mz $)

   Released under the GNU General Public License
   --------------------------------------------------------------*/

defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');

function getCurrentRate($to, $base = DEFAULT_CURRENCY)
{
    return CurrencyRateApiClient::getCurrentRate($to, $base);
}
