<?php
/* --------------------------------------------------------------
   sessions.php 2019-02-22
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2016 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]

   IMPORTANT! THIS FILE IS DEPRECATED AND WILL BE REPLACED IN THE FUTURE. 
   MODIFY IT ONLY FOR FIXES. DO NOT APPEND IT WITH NEW FEATURES, USE THE
   NEW GX-ENGINE LIBRARIES INSTEAD.		
   --------------------------------------------------------------

   based on: 
   (c) 2000-2001 The Exchange Project  (earlier name of osCommerce)
   (c) 2002-2003 osCommerce(sessions.php,v 1.16 2003/04/02); www.oscommerce.com 
   (c) 2003	 nextcommerce (sessions.php,v 1.7 2003/08/18); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: sessions.php 950 2005-05-14 16:45:21Z mz $)

   Released under the GNU General Public License 
   --------------------------------------------------------------*/

defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');

require DIR_FS_CATALOG . 'includes/functions/gm_set_session_parameters.inc.php';

function xtc_session_start()
{
    return session_start();
}

function xtc_session_is_registered($p_variable)
{
    return isset($_SESSION[$p_variable]);
}

function xtc_session_unregister($p_variable)
{
    unset($_SESSION[$p_variable]);
}

function xtc_session_id($sessid = '')
{
    if (!empty($sessid)) {
        return session_id($sessid);
    } else {
        return session_id();
    }
}

function xtc_session_name($name = '')
{
    if (!empty($name)) {
        return session_name($name);
    } else {
        return session_name();
    }
}

function xtc_session_close()
{
    if (function_exists('session_close')) {
        return session_close();
    }
}

function xtc_session_destroy()
{
    return session_destroy();
}

function xtc_session_save_path($path = '')
{
    if (!empty($path)) {
        return session_save_path($path);
    } else {
        return session_save_path();
    }
}

function xtc_session_recreate()
{
    $session_backup = $_SESSION;
    unset($_COOKIE[xtc_session_name()]);
    xtc_session_destroy();
    xtc_session_start();
    $_SESSION = $session_backup;
    unset($session_backup);
}
