<?php
/* --------------------------------------------------------------
   security_check.php 2022-08-23
   Gambio GmbH
   http://www.gambio.de
   Copyright (c) 2022 Gambio GmbH
   Released under the GNU General Public License (Version 2)
   [http://www.gnu.org/licenses/gpl-2.0.html]
   --------------------------------------------------------------

   based on:
   (c) 2003	 nextcommerce (security_check.php,v 1.2 2003/08/23); www.nextcommerce.org
   (c) 2003 XT-Commerce - community made shopping http://www.xt-commerce.com ($Id: security_check.php 1221 2005-09-20 16:44:09Z mz $)

   Released under the GNU General Public License
 --------------------------------------------------------------*/

defined('_VALID_XTC') or die('Direct Access to this location is not allowed.');

$securityCheckFile = new SecurityCheckCache($_SERVER['HTTP_USER_AGENT']);

try {
    $securityCheckNecessary = $securityCheckFile->validCacheFileExists() === false;
} catch (Exception $exception) {
    $securityCheckNecessary = true;
}

$file_warning     = '';
$obsolete_warning = '';

$configurationStorage = CronjobServiceFactory::createCronjobConfigurationStorage();
$shouldReadonlyList   = null;
$notWritableList      = null;

if($configurationStorage->get('CheckPermissions', 'active'))
{
	$dataCache          = DataCache::get_instance();
	$shouldReadonlyList = $dataCache->get_persistent_data('should-readonly-list');
	$notWritableList    = $dataCache->get_persistent_data('not-writable-list');
	
	// create cache, if not exits
	if($shouldReadonlyList === null)
	{
		$shouldReadonlyList = SecurityCheck::getInvalidPermissionsNonWritableList();
		$dataCache->write_persistent_data('should-readonly-list', $shouldReadonlyList);
	}
	
	// create cache, if not exits
	if($notWritableList === null)
	{
		$notWritableList = SecurityCheck::getInvalidPermissionsWritableList();
		$dataCache->write_persistent_data('not-writable-list', $notWritableList);
	}
}
else
{
    $dataCache = DataCache::get_instance();
    $lastPermissionsCheck = $dataCache->get_persistent_data('last-permissions-check');
    
    if($lastPermissionsCheck === null)
    {
        $lastPermissionsCheck = new DateTime();
        $dataCache->write_persistent_data('last-permissions-check', $lastPermissionsCheck);
    }
    
    $now = new DateTime();
    if($lastPermissionsCheck <= $now->modify('-12 hour'))
    {
        $shouldReadonlyList = $dataCache->get_persistent_data('should-readonly-list');
        $notWritableList    = $dataCache->get_persistent_data('not-writable-list');
    
        // create cache, if not exits
        if($shouldReadonlyList === null)
        {
            $shouldReadonlyList = SecurityCheck::getInvalidPermissionsNonWritableList();
            $dataCache->write_persistent_data('should-readonly-list', $shouldReadonlyList);
        }
    
        // create cache, if not exits
        if($notWritableList === null)
        {
            $notWritableList = SecurityCheck::getInvalidPermissionsWritableList();
            $dataCache->write_persistent_data('not-writable-list', $notWritableList);
        }
    }
}

SecurityCheck::checkNonWritableList($messageStack, $shouldReadonlyList);
SecurityCheck::checkHtaccessVersion($messageStack);

// if security_check cache is invalid, run not-writable permissions check & renew cache afterwards
if ($securityCheckNecessary === true) {
    SecurityCheck::checkWritableList($messageStack, $notWritableList);
    // generate new dated signature for security_check cache
    $securityCheckFile->storeCacheFile();
}

if(defined('TEXT_REGISTER_GLOBAL') && ini_get('register_globals'))
{
	$messageStack->add(TEXT_REGISTER_GLOBAL, 'error');
}

// check if robots.txt obsolete
require_once(DIR_FS_CATALOG . 'gm/inc/get_robots.php');
$check_robots_result = check_robots(DIR_WS_CATALOG);
if(!$check_robots_result)
{
	$obsolete_warning .= '<br>' . HTTP_SERVER . '/robots.txt - <a href="' . DIR_WS_ADMIN
	                     . 'robots_download.php">download robots.txt</a>';
}

// if any file obsolete
if($obsolete_warning !== '' && defined('TEXT_OBSOLETE_WARNING'))
{
	$messageStack->add(TEXT_OBSOLETE_WARNING . '<b>' . $obsolete_warning . '</b>', 'error');
}

if (!isset($t_memory_limit)) {
    $t_memory_limit = 128;
}
if (!isset($t_memory_limit_ok)) {
    $t_memory_limit_ok = set_memory_limit($t_memory_limit);
}
// memory_limit to low
if($t_memory_limit_ok === false && ini_get('memory_limit') !== '-1' && defined('TEXT_MEMORY_LIMIT_WARNING'))
{
	$messageStack->add(sprintf(TEXT_MEMORY_LIMIT_WARNING, $t_memory_limit), 'error');
}

PayPalDeprecatedCheck::ppDeprecatedCheck($messageStack);

$databaseWarning = SystemAnalyzer::getDatabaseRequirementsMesssage(new SystemRequirements(),
                                                                   MainFactory::create_object('LanguageTextManager',
                                                                                              [],
                                                                                              true));
if ($databaseWarning) {
    $messageStack->add($databaseWarning, 'error');
}
